// Minimal OpenAI-compatible chat completions server that returns scripted
// tool calls, so the real agent loop and SSE parsing run without an API key.
const http = require("http");

let callLog = [];

function lastUser(messages) {
  for (let i = messages.length - 1; i >= 0; i--) if (messages[i].role === "user") return messages[i].content;
  return "";
}

function findProductId(messages) {
  for (const m of messages) {
    if (m.role !== "tool") continue;
    try {
      const data = JSON.parse(m.content);
      if (data.products && data.products[0]) return data.products[0];
    } catch {}
  }
  return null;
}

function decide(body) {
  const msgs = body.messages;
  const last = msgs[msgs.length - 1];
  const user = String(lastUser(msgs)).toLowerCase();

  // After tool results, answer in text.
  if (last.role === "tool") {
    let parsed = {};
    try { parsed = JSON.parse(last.content); } catch {}
    if (parsed.error) return { text: `Sorry: ${parsed.error}` };
    if (parsed.placed) return { text: `Order ${parsed.orderNumber} placed. Total ${parsed.total}.` };
    if (parsed.status === "awaiting_confirmation") return { text: `Please confirm the order of Rs. ${parsed.total}.` };
    if (parsed.products) return { text: `I found ${parsed.total} options. The **${parsed.products[0]?.name}** is popular.` };
    if (parsed.added) return { text: `Added ${parsed.added} to your cart.` };
    if (parsed.recentOrders) return { text: `You have ${parsed.recentOrders.length} recent orders.` };
    if (parsed.signedIn !== undefined) {
      return { tool: "prepare_checkout", args: { fullName: "Test Buyer", address: "House 1, Street 2, DHA", city: "Karachi", postalCode: "75500", phone: "03001234567", email: "guest@example.com" } };
    }
    return { text: "Done." };
  }

  if (user.includes("tool-fail")) return { status: 400, error: { message: "Failed to call a function", code: "tool_use_failed" } };
  if (user.includes("rate")) return { status: 429, error: { message: "Rate limit reached", code: "rate_limit_exceeded" } };
  if (user.includes("white shirt")) return { tool: "search_products", args: { query: "shirt", gender: "Men", color: "White" }, pretext: "Let me look. " };
  if (user.includes("jeans")) return { tool: "search_products", args: { query: "jeans" } };
  if (user.includes("add")) {
    const p = findProductId(msgs);
    if (!p) return { text: "Which product would you like?" };
    return { tool: "add_to_cart", args: { productId: p.id, size: p.sizes[1], color: p.colors[0], quantity: 2 } };
  }
  if (user.includes("checkout")) return { tool: "get_checkout_details", args: {} };
  if (user.includes("sneaky")) {
    // Tries to prepare AND confirm in the same turn: the server must refuse.
    return {
      tools: [
        { name: "prepare_checkout", args: { fullName: "Test Buyer", address: "House 1, Street 2", city: "Lahore", postalCode: "54000", phone: "03001234567", email: "guest@example.com" } },
        { name: "confirm_pending_action", args: {} },
      ],
    };
  }
  if (user.includes("yes")) return { tool: "confirm_pending_action", args: {} };
  if (user.includes("my orders")) return { tool: "track_order", args: {} };
  return { text: "Hello! How can I help you shop today?" };
}

// Mimics provider-specific strictness: "mock-gemini" behaves like Gemini 3
// (tool calls in the current turn must carry their thought signature) and
// every other model behaves like Groq (unknown tool call fields are rejected).
function validate(body) {
  if (body.model === "retired-model") {
    return { status: 400, error: { message: "The model `retired-model` has been decommissioned", code: "model_decommissioned" } };
  }
  const msgs = body.messages || [];
  let lastUserIndex = -1;
  msgs.forEach((m, i) => m.role === "user" && (lastUserIndex = i));
  for (const [i, m] of msgs.entries()) {
    for (const call of m.tool_calls || []) {
      if (body.model !== "mock-gemini" && call.extra_content) {
        return { status: 400, error: { message: "property 'extra_content' is unsupported", code: "invalid_request_error" } };
      }
      if (body.model === "mock-gemini" && i > lastUserIndex && !call.extra_content?.google?.thought_signature) {
        return { status: 400, error: { message: "Function call is missing a thought_signature", code: 400 } };
      }
    }
  }
  return null;
}

function sse(res, obj) {
  res.write(`data: ${JSON.stringify(obj)}\n\n`);
}

const server = http.createServer((req, res) => {
  let raw = "";
  req.on("data", (c) => (raw += c));
  req.on("end", () => {
    const body = JSON.parse(raw || "{}");
    callLog.push(body);
    const plan = validate(body) || decide(body);
    if (plan.status) {
      res.writeHead(plan.status, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: plan.error }));
    }
    res.writeHead(200, { "Content-Type": "text/event-stream" });
    const base = { id: "x", object: "chat.completion.chunk", choices: [] };
    if (plan.text) {
      for (const word of plan.text.split(/(?<= )/)) sse(res, { ...base, choices: [{ index: 0, delta: { content: word } }] });
      sse(res, { ...base, choices: [{ index: 0, delta: {}, finish_reason: "stop" }] });
    } else {
      if (plan.pretext) sse(res, { ...base, choices: [{ index: 0, delta: { content: plan.pretext } }] });
      const tools = plan.tools || [{ name: plan.tool, args: plan.args }];
      tools.forEach((t, i) => {
        const args = JSON.stringify(t.args);
        const half = Math.floor(args.length / 2);
        const signature = body.model === "mock-gemini" ? { extra_content: { google: { thought_signature: `sig_${i}` } } } : {};
        sse(res, { ...base, choices: [{ index: 0, delta: { tool_calls: [{ index: i, id: `call_${i}_${Date.now()}`, type: "function", function: { name: t.name, arguments: args.slice(0, half) }, ...signature }] } }] });
        sse(res, { ...base, choices: [{ index: 0, delta: { tool_calls: [{ index: i, function: { arguments: args.slice(half) } }] } }] });
      });
      sse(res, { ...base, choices: [{ index: 0, delta: {}, finish_reason: "tool_calls" }] });
    }
    res.write("data: [DONE]\n\n");
    res.end();
  });
});

module.exports = {
  start: () => new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server.address().port))),
  stop: () => server.close(),
  log: () => callLog,
};
