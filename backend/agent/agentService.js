const { streamChat } = require("./provider");
const { buildSystemPrompt } = require("./prompt");
const { toolSchemas, handlers, LABELS, executePendingAction } = require("./tools");
const HttpError = require("../utils/httpError");

const MAX_STEPS = 6; // model calls per shopper message
const HISTORY_WINDOW = 24; // messages sent to the model each call
const MAX_STORED_MESSAGES = 120;
const MAX_TRANSCRIPT = 100;
const CARD_EVENTS = ["products", "confirm", "order"];


// Keeps the most recent messages, starting at a user message so a tool
// result is never sent without the assistant call that produced it.
function recentHistory(messages, limit = HISTORY_WINDOW) {
  let start = 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role !== "user") continue;
    start = i;
    if (messages.length - i >= limit) break;
  }
  return messages.slice(start);
}

function trimStored(session) {
  if (session.messages.length > MAX_STORED_MESSAGES) {
    session.messages = recentHistory(session.messages, MAX_STORED_MESSAGES / 2);
  }
  if (session.transcript.length > MAX_TRANSCRIPT) {
    session.transcript = session.transcript.slice(-MAX_TRANSCRIPT);
  }
}

async function runTool(call, ctx) {
  const handler = handlers[call.function?.name];
  if (!handler) return { error: `Unknown tool ${call.function?.name}` };

  let args = {};
  try {
    args = call.function.arguments ? JSON.parse(call.function.arguments) : {};
    if (!args || typeof args !== "object") args = {};
  } catch {
    return { error: "Tool arguments were not valid JSON. Try again." };
  }

  try {
    return await handler(args, ctx);
  } catch (error) {
    if (error instanceof HttpError) return { error: error.message };
    console.error(`[agent] tool ${call.function.name} failed:`, error);
    return { error: "That didn't work because of a technical problem. Apologise and suggest trying again." };
  }
}

function friendlyError(error) {
  if (error?.code === "not_configured") {
    return "The shopping assistant isn't set up yet. You can still browse and check out normally.";
  }
  if (error?.status === 429) {
    return "I'm getting a lot of questions right now. Please try again in a minute.";
  }
  return "Sorry, I'm having trouble answering right now. Please try again shortly.";
}

// Handles one shopper message: calls the model, runs any tools it asks for,
// and loops until it produces a final reply. `emit(event, data)` streams
// progress to the client.
async function runTurn({ session, text, ctx, emit, signal }) {
  session.turn += 1;
  session.lastActiveAt = new Date();
  session.messages.push({ role: "user", content: text });
  session.transcript.push({ role: "user", text, at: Date.now() });

  const cards = [];
  const toolCtx = {
    ...ctx,
    session,
    emit: (event, data) => {
      if (CARD_EVENTS.includes(event)) cards.push({ type: event, ...data });
      emit(event, data);
    },
  };

  let reply = "";
  let needsBreak = false;
  let failure = null;
  let malformedRetries = 0;

  const onText = (chunk) => {
    if (needsBreak && reply.trim()) {
      reply += "\n\n";
      emit("delta", { text: "\n\n" });
    }
    needsBreak = false;
    reply += chunk;
    emit("delta", { text: chunk });
  };

  for (let step = 0; step < MAX_STEPS; step++) {
    let result;
    try {
      result = await streamChat({
        messages: [
          { role: "system", content: buildSystemPrompt({ user: ctx.user, pendingAction: session.pendingAction }) },
          ...recentHistory(session.messages),
        ],
        tools: toolSchemas,
        onText,
        signal,
        maxTokens: 900,
      });
    } catch (error) {
      // Groq rejects malformed tool calls with `tool_use_failed`; a retry usually works.
      if (error.code === "tool_use_failed" && malformedRetries < 2) {
        malformedRetries += 1;
        continue;
      }
      failure = error;
      break;
    }

    const assistant = { role: "assistant", content: result.content || null };
    if (result.toolCalls.length) assistant.tool_calls = result.toolCalls;
    session.messages.push(assistant);

    if (result.toolCalls.length === 0) break;

    for (const call of result.toolCalls) {
      emit("tool", { name: call.function.name, label: LABELS[call.function.name] || "Working on it" });
      const output = await runTool(call, toolCtx);
      session.messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(output).slice(0, 6000),
      });
    }
    needsBreak = true;

    if (step === MAX_STEPS - 1) failure = new Error("step limit");
  }

  if (failure && signal?.aborted) {
    reply = reply || "(stopped)";
  } else if (failure && !reply.trim()) {
    reply = cards.length ? "Here's what I found." : friendlyError(failure);
    emit("delta", { text: reply });
    if (!cards.length && failure.message !== "step limit") emit("error", { message: reply });
  } else if (!reply.trim()) {
    reply = cards.length ? "Here's what I found." : "Could you tell me a little more about what you're looking for?";
    emit("delta", { text: reply });
  }

  session.transcript.push({ role: "assistant", text: reply, cards, at: Date.now() });
  trimStored(session);
  session.markModified("messages");
  session.markModified("transcript");
  session.markModified("pendingAction");
  return { reply, cards };
}

// Confirm / Cancel buttons on a prepared order or cancellation. Runs the
// action directly, so it works even when the AI provider is rate limited.
async function runAction({ session, decision, ctx }) {
  const pending = session.pendingAction;
  if (!pending) throw new HttpError(409, "There is nothing waiting for confirmation");

  session.turn += 1;
  session.lastActiveAt = new Date();
  const what = pending.type === "place_order" ? "order summary" : "cancellation request";
  const confirmed = decision === "confirm";

  session.messages.push({ role: "user", content: `[Shopper clicked ${confirmed ? "Confirm" : "Cancel"} on the ${what}]` });
  session.transcript.push({ role: "user", text: confirmed ? "Confirm" : "Cancel", action: true, at: Date.now() });

  const cards = [];
  const events = [];
  const toolCtx = {
    ...ctx,
    session,
    emit: (event, data) => {
      events.push({ event, data });
      if (CARD_EVENTS.includes(event)) cards.push({ type: event, ...data });
    },
  };

  let reply;
  if (!confirmed) {
    session.pendingAction = null;
    reply =
      pending.type === "place_order"
        ? "No problem, I haven't placed the order. Want to change anything?"
        : "Okay, your order stays as it is.";
  } else {
    let result;
    try {
      result = await executePendingAction(toolCtx);
    } catch (error) {
      result = { error: error instanceof HttpError ? error.message : "Something went wrong, please try again." };
      if (!(error instanceof HttpError)) console.error("[agent] action failed:", error);
    }
    if (result.placed) {
      reply = `Your order **${result.orderNumber}** is confirmed! Total ${result.total}, payable on delivery. A confirmation has been sent to ${result.email}. Estimated delivery: ${result.estimatedDelivery}.`;
    } else if (result.cancelled) {
      reply = `Order **${result.orderNumber}** has been cancelled. If you change your mind, I can help you order again.`;
    } else {
      reply = result.error || "I couldn't complete that.";
    }
  }

  session.messages.push({ role: "assistant", content: reply });
  session.transcript.push({ role: "assistant", text: reply, cards, at: Date.now() });
  trimStored(session);
  session.markModified("messages");
  session.markModified("transcript");
  session.markModified("pendingAction");
  return { reply, cards, events };
}

module.exports = { runTurn, runAction, recentHistory };
