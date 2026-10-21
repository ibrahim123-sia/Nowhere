const mongoose = require("mongoose");

// One shopping-assistant conversation. `messages` stores the raw
// chat-completions history (user, assistant, tool) so the model can be
// given its own earlier tool calls and results on the next turn.
const agentSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    guestId: {
      type: String,
      index: true,
    },
    messages: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    // Simplified transcript for re-rendering the chat window.
    transcript: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    // Number of user messages so far. Sensitive actions must be confirmed
    // in a later turn than the one that prepared them.
    turn: {
      type: Number,
      default: 0,
    },
    pendingAction: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, minimize: false }
);

// Conversations expire after 7 days of inactivity.
agentSessionSchema.index({ lastActiveAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

module.exports = mongoose.model("AgentSession", agentSessionSchema);
