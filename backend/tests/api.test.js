// End-to-end API test: runs the real Express app against an in-memory
// MongoDB and a mock LLM, so it needs no database server or API key.
//
//   npm test
const path = require("path");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mock = require("./mockLlm");

const req = (p) => require(path.join(__dirname, "..", p));

let passed = 0;
let failed = 0;
const check = (name, cond, extra) => {
  if (cond) {
    passed++;
    console.log("  ok  ", name);
  } else {
    failed++;
    console.log("  FAIL", name, extra !== undefined ? JSON.stringify(extra).slice(0, 400) : "");
  }
};

(async () => {
  const mongo = await MongoMemoryServer.create();
  const llmPort = await mock.start();
  Object.assign(process.env, {
    MONGODB_URI: mongo.getUri(),
    JWT_SECRET: "test-secret",
    AGENT_PROVIDER: "custom",
    AGENT_BASE_URL: `http://127.0.0.1:${llmPort}/v1`,
    AGENT_MODEL: "mock",
    AGENT_API_KEY: "x",
    GROQ_API_KEY: "",
    GEMINI_API_KEY: "",
    EMAIL_USER: "test@example.com",
    CLIENT_URL: "",
  });

  // Capture emails instead of sending them.
  const mailer = req("utils/mailer");
  const sent = [];
  mailer.transporter.sendMail = async (msg) => {
    sent.push(msg);
    return { messageId: "test" };
  };

  const mongoose = require("mongoose");
  await mongoose.connect(process.env.MONGODB_URI);
  const Product = req("models/Product");
  const Review = req("models/Review");
  const User = req("models/User");
  const Order = req("models/Order");
  const products = req("data/products");
  const { buildSampleReviews } = req("data/reviews");

  const admin = await User.create({ name: "Admin", email: "admin@test.pk", password: "secret123", role: "admin", isVerified: true });
  const created = await Product.insertMany(products.map((p) => ({ ...p, user: admin._id })));
  for (const [i, p] of created.entries()) {
    await Review.insertMany(buildSampleReviews(p, i).map((r) => ({ ...r, product: p._id })));
    await Review.syncProductRating(p._id);
  }

  const app = req("server.js");
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const BASE = `http://127.0.0.1:${server.address().port}/api`;

  const api = async (method, url, body, token) => {
    const res = await fetch(BASE + url, {
      method,
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    let data = null;
    try {
      data = await res.json();
    } catch {}
    return { status: res.status, data };
  };

  const chat = async (body, token) => {
    const res = await fetch(BASE + "/agent/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    const events = text
      .split("\n\n")
      .filter(Boolean)
      .map((block) => {
        const event = block.match(/^event: (.*)$/m)?.[1];
        const data = block.match(/^data: (.*)$/m)?.[1];
        return { event, data: data ? JSON.parse(data) : null };
      });
    const reply = events.filter((e) => e.event === "delta").map((e) => e.data.text).join("");
    return { status: res.status, events, reply, types: events.map((e) => e.event) };
  };

  console.log("\nCatalogue");
  let r = await api("GET", "/products");
  check("list returns paginated shape", r.status === 200 && r.data.total === 40 && r.data.products.length === 24, r.data?.total);
  r = await api("GET", "/products?search=white%20shirt&gender=Men");
  check("search 'white shirt' men", r.data.products.length > 0 && r.data.products.every((p) => p.gender === "Men"), r.data.products.map((p) => p.name));
  r = await api("GET", "/products?collection=sale&limit=48");
  check("sale collection only discounted", r.data.products.length === 18 && r.data.products.every((p) => p.discountPrice < p.price), r.data.products.length);
  r = await api("GET", "/products?collection=summer");
  check("collection slug match", r.data.products.length > 0 && r.data.products.every((p) => p.collections === "Summer"), r.data.products.length);
  r = await api("GET", "/products?sortBy=priceAsc&limit=5");
  const prices = r.data.products.map((p) => p.effectivePrice);
  check("sort by effective price asc", prices.every((v, i) => i === 0 || v >= prices[i - 1]), prices);
  r = await api("GET", "/products?maxPrice=2500&limit=48");
  check("max price on effective price", r.data.products.every((p) => p.effectivePrice <= 2500), r.data.products.map((p) => p.effectivePrice));
  r = await api("GET", "/products?search=(((a");
  check("regex chars in search don't crash", r.status === 200);
  r = await api("GET", "/products/facets");
  check("facets", r.data.colors.length > 5 && r.data.sizes[0] === "XS" && r.data.priceRange.max > 0, r.data);
  r = await api("GET", "/products/suggest?q=jea");
  check("suggest", r.data.length > 0 && r.data[0].name, r.data);
  const shirt = created.find((p) => p.sku === "OX-SH-001");
  r = await api("GET", `/products/${shirt._id}`);
  check("product detail has enriched fields", r.data.highlights?.length === 3 && r.data.fit && r.data.numReviews > 0, r.data);
  r = await api("GET", `/products/${shirt._id}/reviews`);
  check("reviews + summary", r.data.summary.count === r.data.total && r.data.reviews.length > 0 && !r.data.reviews[0].user, r.data.summary);
  r = await api("GET", "/products/not-an-id");
  check("invalid id -> 404", r.status === 404);
  r = await api("GET", "/products/best-sellers?limit=4");
  check("best sellers", r.data.length === 4);
  r = await api("GET", "/products/sitemap");
  check("sitemap data lists published products and collections", r.data.products.length === 40 && r.data.collections.includes("Summer") && r.data.products[0].name, r.data.products?.length);
  r = await api("GET", "/store/config");
  check("store config hides coupons", r.data.shipping && !r.data.coupons);

  console.log("\nGuest cart + checkout");
  const guestId = "guest_test123456";
  r = await api("POST", "/cart", { guestId, productId: shirt._id, size: "m", color: "light blue", quantity: 2 });
  check("add normalises size/colour", r.status === 200 && r.data.products[0].size === "M" && r.data.products[0].color === "Light Blue", r.data);
  check("cart uses discount price", r.data.products[0].price === 3499 && r.data.totalPrice === 6998, r.data.products?.[0]);
  r = await api("POST", "/cart", { guestId, productId: shirt._id, size: "XS", color: "White" });
  check("invalid size rejected", r.status === 400, r.data);
  r = await api("POST", "/cart", { guestId, productId: shirt._id, size: "M", color: "White", quantity: 99 });
  check("over-stock rejected", r.status === 409 || r.status === 400, r.data);
  const oos = created.find((p) => p.countInStock === 0);
  r = await api("POST", "/cart", { guestId, productId: oos._id, size: oos.sizes[0], color: oos.colors[0] });
  check("out of stock rejected", r.status === 409, r.data);
  r = await api("POST", "/cart", { productId: shirt._id, size: "M", color: "White" });
  check("missing guest id rejected", r.status === 400);
  r = await api("POST", "/checkout/quote", { guestId, couponCode: "WELCOME10" });
  check("quote with coupon", r.data.itemsPrice === 6998 && r.data.discount === 700 && r.data.shippingPrice === 0 && r.data.totalPrice === 6298, r.data);
  r = await api("POST", "/checkout/quote", { guestId, couponCode: "BOGUS" });
  check("bad coupon reported", r.data.couponError && r.data.discount === 0, r.data);
  const address = { fullName: "Guest Buyer", address: "House 5, Block B", city: "Lahore", postalCode: "54000", phone: "03001234567" };
  r = await api("POST", "/checkout", { guestId, shippingAddress: address });
  check("guest checkout needs email", r.status === 400, r.data);
  r = await api("POST", "/checkout", { guestId, email: "Guest@Example.com", shippingAddress: address, couponCode: "WELCOME10" });
  check("guest order placed", r.status === 201 && /^NW-[A-Z0-9]{8}$/.test(r.data.orderNumber) && r.data.totalPrice === 6298 && !r.data.isPaid, r.data);
  const guestOrder = r.data;
  check("order confirmation emailed", sent.some((m) => m.to === "guest@example.com" && m.subject.includes(guestOrder.orderNumber)));
  const shirtAfter = await Product.findById(shirt._id);
  check("stock decremented", shirtAfter.countInStock === shirt.countInStock - 2, shirtAfter.countInStock);
  r = await api("GET", `/cart?guestId=${guestId}`);
  check("cart cleared after order", r.data.products.length === 0, r.data);
  r = await api("POST", "/orders/track", { orderNumber: guestOrder.orderNumber.toLowerCase(), email: "guest@example.com" });
  check("track order by number+email", r.status === 200 && r.data.status === "Processing" && !r.data.guestId, r.data);
  r = await api("POST", "/orders/track", { orderNumber: guestOrder.orderNumber, email: "other@example.com" });
  check("track with wrong email -> 404", r.status === 404);
  r = await api("POST", "/checkout", { guestId, email: "guest@example.com", shippingAddress: address, couponCode: "WELCOME10" });
  check("empty cart checkout rejected", r.status === 400, r.data);

  console.log("\nAuth + users");
  r = await api("POST", "/users/register", { name: "Sara", email: "Sara@Test.pk", password: "secret123" });
  check("register sends otp", r.status === 200 && sent.at(-1).to === "sara@test.pk", r.data);
  const otp = sent.at(-1).html.match(/letter-spacing: 8px; font-weight: bold;">(\d{6})</)?.[1];
  r = await api("POST", "/users/verify-otp", { email: "sara@test.pk", otp: "000000" });
  check("wrong otp rejected", r.status === 400);
  r = await api("POST", "/users/verify-otp", { email: "sara@test.pk", otp });
  check("verify otp returns token", r.status === 200 && r.data.token, r.data);
  const stored = await User.findOne({ email: "sara@test.pk" }).select("+otp");
  check("otp cleared after verify", !stored.otp);
  r = await api("POST", "/users/login", { email: "SARA@test.pk", password: "secret123" });
  check("login is case-insensitive", r.status === 200 && r.data.token, r.data);
  const sara = r.data.token;
  r = await api("GET", "/users/profile", null, sara);
  check("profile has no password", r.status === 200 && !("password" in r.data.user), r.data);
  r = await api("POST", "/users/login", { email: "admin@test.pk", password: "secret123" });
  const adminToken = r.data.token;
  r = await api("GET", "/admin/users", null, adminToken);
  check("admin users list hides passwords", r.status === 200 && r.data.every((u) => !u.password), r.data?.[0]);
  r = await api("GET", "/admin/users", null, sara);
  check("non-admin blocked from admin", r.status === 403);
  r = await api("POST", "/admin/users", { name: "Made", email: "made@test.pk", password: "secret123" }, adminToken);
  r = await api("POST", "/users/login", { email: "made@test.pk", password: "secret123" });
  check("admin-created user can log in", r.status === 200, r.data);
  r = await api("DELETE", `/admin/users/${admin._id}`, null, adminToken);
  check("admin can't delete self", r.status === 400);

  console.log("\nUser orders");
  const jeans = created.find((p) => p.sku === "BW-004") || created.find((p) => /Jeans/.test(p.name));
  r = await api("POST", "/cart", { userId: admin._id, productId: jeans._id, size: jeans.sizes[0], color: jeans.colors[0] }, sara);
  check("client userId ignored, cart is Sara's", r.status === 200 && String(r.data.user) !== String(admin._id), r.data.user);
  r = await api("POST", "/checkout", { shippingAddress: address }, sara);
  check("user order placed", r.status === 201 && r.data.email === "sara@test.pk", r.data);
  const saraOrder = r.data;
  r = await api("GET", "/users/profile", null, sara);
  check("address saved to profile", r.data.user.shippingAddress?.city === "Lahore", r.data.user);
  r = await api("GET", "/orders/my-orders", null, sara);
  check("my orders", r.data.length === 1);
  r = await api("POST", "/users/register", { name: "Eve", email: "eve@test.pk", password: "secret123" });
  const eveOtp = sent.at(-1).html.match(/letter-spacing: 8px; font-weight: bold;">(\d{6})</)?.[1];
  const eve = (await api("POST", "/users/verify-otp", { email: "eve@test.pk", otp: eveOtp })).data.token;
  r = await api("GET", `/orders/${saraOrder._id}`, null, eve);
  check("other user can't read order (IDOR)", r.status === 404);
  r = await api("GET", `/orders/${saraOrder._id}`, null, adminToken);
  check("admin can read order", r.status === 200);
  const jeansBefore = (await Product.findById(jeans._id)).countInStock;
  r = await api("PUT", `/orders/${saraOrder._id}/cancel`, {}, sara);
  check("cancel order", r.status === 200 && r.data.status === "Cancelled");
  check("stock restored on cancel", (await Product.findById(jeans._id)).countInStock === jeansBefore + 1);
  r = await api("PUT", `/orders/${saraOrder._id}/cancel`, {}, sara);
  check("can't cancel twice", r.status === 409);
  r = await api("POST", "/cart/reorder", { orderId: saraOrder._id }, sara);
  check("reorder adds items back", r.status === 200 && r.data.added.length === 1, r.data);
  r = await api("PUT", `/admin/orders/${guestOrder._id}`, { status: "Delivered" }, adminToken);
  check("admin delivers COD order -> paid", r.data.status === "Delivered" && r.data.isPaid && r.data.statusHistory.length === 2, r.data);
  r = await api("GET", "/admin/orders/stats", null, adminToken);
  check("admin stats", r.status === 200 && r.data.revenue === 6298 && r.data.lowStock.length > 0, r.data);
  r = await fetch(BASE + "/upload", { method: "POST" });
  check("upload requires auth", r.status === 401);

  console.log("\nReviews");
  r = await api("POST", `/products/${jeans._id}/reviews`, { rating: 5, comment: "Great jeans, fits well." }, sara);
  check("review created (verified purchase false for cancelled)", r.status === 201 && r.data.verifiedPurchase === false, r.data);
  r = await api("POST", `/products/${jeans._id}/reviews`, { rating: 4, comment: "Second review attempt" }, sara);
  check("duplicate review rejected", r.status === 409);
  r = await api("POST", `/products/${jeans._id}/reviews`, { rating: 9, comment: "Bad rating value here" }, eve);
  check("invalid rating rejected", r.status === 400);

  console.log("\nAdmin products");
  r = await api("POST", "/products", { name: "Test Tee", description: "A test tee", price: 1999, discountPrice: 2999, countInStock: 3, sku: "TST-1", category: "Top Wear", sizes: "S, M", colors: ["Black"], collections: "Essentials", gender: "Men" }, adminToken);
  check("discount >= price rejected", r.status === 400, r.data);
  r = await api("POST", "/products", { name: "Test Tee", description: "A test tee", price: 1999, countInStock: 3, sku: "TST-1", category: "Top Wear", sizes: "S, M", colors: ["Black"], collections: "Essentials", gender: "Men", user: eve }, adminToken);
  check("admin creates product (comma sizes parsed)", r.status === 201 && r.data.sizes.length === 2 && r.data.isPublished, r.data);
  const tee = r.data;
  r = await api("PUT", `/products/${tee._id}`, { discountPrice: 1499 }, adminToken);
  check("admin sets discount", r.data.discountPrice === 1499, r.data);
  r = await api("PUT", `/products/${tee._id}`, { discountPrice: "" }, adminToken);
  check("admin clears discount", r.data.discountPrice === undefined, r.data);
  r = await api("POST", "/products", { name: "Dup", description: "d", price: 1, countInStock: 1, sku: "TST-1", category: "Top Wear", sizes: ["S"], colors: ["Black"], collections: "Essentials" }, adminToken);
  check("duplicate sku -> 409", r.status === 409, r.data);

  console.log("\nContact");
  r = await api("POST", "/contact", { name: "Ali", email: "ali@test.pk", subject: "Order", message: "Where is my order please?" });
  check("contact form emails the store", r.status === 200 && sent.at(-1).replyTo === "ali@test.pk", r.data);
  r = await api("POST", "/contact", { name: "Ali", email: "bad", message: "short" });
  check("contact form validates input", r.status === 400);

  console.log("\nAgent");
  r = await api("GET", "/agent/status");
  check("agent status enabled", r.data.enabled === true, r.data);
  const agentGuest = "guest_agent123456";
  let c = await chat({ guestId: agentGuest, message: "Show me a white shirt" });
  check("chat streams session/tool/products/delta/done", ["session", "tool", "products", "delta", "done"].every((t) => c.types.includes(t)), c.types);
  check("reply joins pre-tool text and final text", c.reply.startsWith("Let me look.") && c.reply.includes("I found"), c.reply);
  const sessionId = c.events.find((e) => e.event === "session").data.sessionId;
  const firstCard = c.events.find((e) => e.event === "products").data.cards[0];
  check("product cards have image and an SEO-friendly url", firstCard.image && /^\/product\/[a-z0-9-]+-[a-f0-9]{24}$/.test(firstCard.url), firstCard.url);
  c = await chat({ guestId: agentGuest, sessionId, message: "add the first one" });
  check("agent adds to cart", c.types.includes("cart") && c.reply.includes("Added"), c);
  r = await api("GET", `/cart?guestId=${agentGuest}`);
  check("cart really updated", r.data.products.length === 1 && r.data.products[0].quantity === 2, r.data);
  c = await chat({ guestId: "guest_intruder1234", sessionId, message: "add the first one" });
  r = await api("GET", `/cart?guestId=guest_intruder1234`);
  check("another guest can't reuse the session", r.status === 200 && r.data.products.length <= 1 && c.events.find((e) => e.event === "session").data.sessionId !== sessionId, c.events[0]);
  c = await chat({ guestId: agentGuest, sessionId, message: "sneaky place it now" });
  check("same-turn confirm is refused", (await Order.countDocuments({ guestId: agentGuest })) === 0 && c.types.includes("confirm"), c.reply);
  c = await chat({ guestId: agentGuest, sessionId, message: "checkout please" });
  check("checkout prepares confirmation", c.types.includes("confirm") && c.events.find((e) => e.event === "done").data.pendingAction?.type === "place_order", c.types);
  r = await api("POST", "/agent/action", { guestId: "guest_wrong12345", sessionId, decision: "confirm" });
  check("action needs session owner", r.status === 404);
  r = await api("POST", "/agent/action", { guestId: agentGuest, sessionId, decision: "confirm" });
  check("confirm button places order", r.status === 200 && /NW-/.test(r.data.reply) && r.data.cards.some((x) => x.type === "order"), r.data);
  const agentOrder = await Order.findOne({ guestId: agentGuest });
  check("assistant order saved with source", agentOrder && agentOrder.source === "assistant" && agentOrder.email === "guest@example.com", agentOrder);
  r = await api("POST", "/agent/action", { guestId: agentGuest, sessionId, decision: "confirm" });
  check("double confirm rejected", r.status === 409);
  c = await chat({ guestId: agentGuest, sessionId, message: "my orders" });
  check("agent lists guest orders", c.reply.includes("1 recent"), c.reply);
  c = await chat({ guestId: agentGuest, sessionId, message: "jeans please" });
  c = await chat({ guestId: agentGuest, sessionId, message: "add it" });
  c = await chat({ guestId: agentGuest, sessionId, message: "checkout" });
  c = await chat({ guestId: agentGuest, sessionId, message: "yes" });
  check("typed yes confirms via tool", c.reply.includes("placed"), c.reply);
  c = await chat({ guestId: agentGuest, sessionId, message: "tool-fail test" });
  check("malformed tool call handled", c.status === 200 && c.types.includes("done"), c.types);
  c = await chat({ guestId: agentGuest, sessionId, message: "rate limit test" });
  check("rate limit -> friendly error", c.types.includes("error") && /a lot of questions/.test(c.reply), c.reply);
  // Provider fallback: the first provider's model is retired, Gemini answers.
  // Gemini's thought signatures must survive the tool loop, and be stripped
  // before the history goes to any other provider.
  const llmUrl = process.env.AGENT_BASE_URL;
  Object.assign(process.env, { AGENT_MODEL: "retired-model", GEMINI_API_KEY: "x", GEMINI_BASE_URL: llmUrl, GEMINI_MODEL: "mock-gemini" });
  c = await chat({ guestId: agentGuest, message: "hi" });
  const fbSession = c.events.find((e) => e.event === "session")?.data.sessionId;
  check("retired model falls back to the next provider", /How can I help/.test(c.reply) && mock.log().at(-1).model === "mock-gemini", c.reply);
  c = await chat({ guestId: agentGuest, sessionId: fbSession, message: "white shirt please" });
  const sentCall = mock.log().at(-1).messages.findLast((m) => m.tool_calls)?.tool_calls[0];
  check("Gemini thought signature is sent back with its tool call", c.reply.includes("I found") && sentCall?.extra_content?.google?.thought_signature === "sig_0", c.reply);
  Object.assign(process.env, { AGENT_MODEL: "mock", GEMINI_API_KEY: "" });
  c = await chat({ guestId: agentGuest, sessionId: fbSession, message: "show me jeans" });
  check("signatures are stripped for other providers", c.reply.includes("I found") && !JSON.stringify(mock.log().at(-1).messages).includes("extra_content"), c.reply);
  r = await api("GET", `/agent/session/${sessionId}?guestId=${agentGuest}`);
  check("transcript stored", r.status === 200 && r.data.transcript.length >= 10, r.data?.transcript?.length);
  r = await api("GET", `/agent/session/${sessionId}?guestId=guest_other123456`);
  check("transcript private", r.status === 404);
  // Registered user via agent with saved address.
  c = await chat({ message: "hi" }, sara);
  check("signed-in chat works without guest id", c.status === 200 && c.types.includes("done"), c.types);
  const lastCall = mock.log().at(-1);
  check("system prompt names signed-in shopper", lastCall.messages[0].content.includes("Signed in as Sara"), lastCall.messages[0].content.slice(-200));
  check("tools sent in OpenAI format", lastCall.tools.length === 13 && lastCall.tools[0].type === "function");
  r = await api("POST", "/agent/chat", { guestId: agentGuest, message: "x".repeat(1200) });
  check("long message rejected", r.status === 400);

  console.log(`\n${passed} passed, ${failed} failed`);
  server.close();
  mock.stop();
  await mongoose.disconnect();
  await mongo.stop();
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
