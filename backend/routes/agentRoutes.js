const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const AgentSession = require("../models/AgentSession");
const { optionalAuth } = require("../middleware/authMiddleware");
const cartService = require("../services/cartService");
const { runTurn, runAction } = require("../agent/agentService");
const { availableProviders } = require("../agent/provider");

const router = express.Router();

const MAX_MESSAGE_LENGTH = 1000;
const MAX_TURNS_PER_SESSION = 80;
const busySessions = new Set();

const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 40,
  message: { message: "You're sending messages very quickly. Please wait a moment." },
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

// Loads a conversation the shopper owns. A guest conversation moves to the
// user's account when they sign in mid-conversation.
async function loadSession(sessionId, user, guestId) {
  if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) return null;
  const session = await AgentSession.findById(sessionId);
  if (!session) return null;
  if (session.user) return user && session.user.equals(user._id) ? session : null;
  if (session.guestId !== guestId) return null;
  if (user) session.user = user._id;
  return session;
}

const publicPending = (pending) =>
  pending ? { type: pending.type, summary: pending.summary } : null;

//@route GET /api/agent/status
//@desc whether the assistant is configured
//@access public
router.get("/status", (req, res) => {
  const providers = availableProviders();
  res.json({ enabled: providers.length > 0, providers: providers.map((p) => p.label) });
});

//@route GET /api/agent/session/:id
//@desc chat transcript for re-opening the assistant
//@access public (owner only)
router.get("/session/:id", optionalAuth, async (req, res, next) => {
  try {
    const session = await loadSession(req.params.id, req.user, req.query.guestId);
    if (!session) return res.status(404).json({ message: "Conversation not found" });
    res.json({
      sessionId: session._id,
      transcript: session.transcript,
      pendingAction: publicPending(session.pendingAction),
    });
  } catch (error) {
    next(error);
  }
});

//@route DELETE /api/agent/session/:id
//@desc delete a conversation ("New chat")
//@access public (owner only)
router.delete("/session/:id", optionalAuth, async (req, res, next) => {
  try {
    const session = await loadSession(req.params.id, req.user, req.query.guestId);
    if (session) await session.deleteOne();
    res.json({ message: "Conversation cleared" });
  } catch (error) {
    next(error);
  }
});

//@route POST /api/agent/chat
//@desc send a message to the shopping assistant; streams the reply as SSE
//@access public (guests and logged-in users)
router.post("/chat", chatLimiter, optionalAuth, async (req, res, next) => {
  const text = String(req.body.message || "").trim();
  const { guestId, sessionId } = req.body;

  if (!text) return res.status(400).json({ message: "Message is required" });
  if (text.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ message: `Please keep messages under ${MAX_MESSAGE_LENGTH} characters` });
  }

  let owner;
  let session;
  try {
    owner = cartService.resolveOwner(req.user, guestId);
    session =
      (await loadSession(sessionId, req.user, guestId)) ||
      new AgentSession({ user: req.user?._id, guestId: req.user ? undefined : owner.guestId });
  } catch (error) {
    return next(error);
  }

  if (session.turn >= MAX_TURNS_PER_SESSION) {
    return res.status(409).json({ message: "This conversation is full. Start a new chat to continue." });
  }
  const lockKey = String(session._id);
  if (busySessions.has(lockKey)) {
    return res.status(409).json({ message: "Still working on your last message" });
  }
  busySessions.add(lockKey);

  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  const send = (event, data) => {
    if (!res.writableEnded) res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  const abort = new AbortController();
  // Stop calling the model if the shopper closes the chat mid-reply.
  res.on("close", () => {
    if (!res.writableEnded) abort.abort();
  });

  try {
    send("session", { sessionId: session._id });
    const { reply } = await runTurn({
      session,
      text,
      ctx: { user: req.user, guestId: owner.guestId, owner },
      emit: send,
      signal: abort.signal,
    });
    await session.save();
    send("done", { reply, pendingAction: publicPending(session.pendingAction) });
  } catch (error) {
    console.error("[agent] chat failed:", error);
    send("error", { message: "Something went wrong. Please try again." });
  } finally {
    busySessions.delete(lockKey);
    res.end();
  }
});

//@route POST /api/agent/action
//@desc confirm or cancel a prepared order / cancellation from the chat buttons
//@access public (session owner only)
router.post("/action", chatLimiter, optionalAuth, async (req, res, next) => {
  const { guestId, sessionId, decision } = req.body;
  if (!["confirm", "cancel"].includes(decision)) {
    return res.status(400).json({ message: "Decision must be confirm or cancel" });
  }

  try {
    const owner = cartService.resolveOwner(req.user, guestId);
    const session = await loadSession(sessionId, req.user, guestId);
    if (!session) return res.status(404).json({ message: "Conversation not found" });

    const lockKey = String(session._id);
    if (busySessions.has(lockKey)) {
      return res.status(409).json({ message: "Still working on your last message" });
    }
    busySessions.add(lockKey);
    try {
      const result = await runAction({
        session,
        decision,
        ctx: { user: req.user, guestId: owner.guestId, owner },
      });
      await session.save();
      res.json({ ...result, pendingAction: publicPending(session.pendingAction) });
    } finally {
      busySessions.delete(lockKey);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
