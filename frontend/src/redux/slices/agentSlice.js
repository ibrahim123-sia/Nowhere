import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { API_URL, authHeaders, errorPayload } from "../../utils/api";
import { fetchCart } from "./cartSlice";

const SESSION_KEY = "agentSessionId";
let activeController = null;
let nextId = 1;
const uid = () => `m${Date.now()}_${nextId++}`;

const toMessage = (entry) => ({
  id: uid(),
  role: entry.role,
  text: entry.text || "",
  cards: entry.cards || [],
  action: Boolean(entry.action),
  status: "done",
});

export const fetchAgentStatus = createAsyncThunk("agent/status", async () => {
  const { data } = await api.get("/agent/status");
  return data;
});

// Restores the conversation saved on the server for this shopper.
export const loadAgentSession = createAsyncThunk(
  "agent/loadSession",
  async (_, { getState, rejectWithValue }) => {
    const { agent, auth } = getState();
    if (!agent.sessionId) return null;
    try {
      const { data } = await api.get(`/agent/session/${agent.sessionId}`, {
        params: { guestId: auth.guestId },
      });
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);

// Handles one server-sent event from the assistant stream.
function handleEvent(event, data, dispatch) {
  const a = agentSlice.actions;
  switch (event) {
    case "session":
      dispatch(a.setSessionId(data.sessionId));
      break;
    case "delta":
      dispatch(a.appendDelta(data.text));
      break;
    case "tool":
      dispatch(a.setToolLabel(data.label));
      break;
    case "products":
    case "order":
      dispatch(a.addCard({ type: event, ...data }));
      if (event === "order") dispatch(a.setPendingAction(null));
      break;
    case "confirm":
      dispatch(a.addCard({ type: event, ...data }));
      dispatch(a.setPendingAction({ type: data.kind === "order" ? "place_order" : "cancel_order", summary: data.summary }));
      break;
    case "confirm_cleared":
      dispatch(a.setPendingAction(null));
      break;
    case "cart":
      dispatch(fetchCart());
      break;
    case "done":
      dispatch(a.setPendingAction(data.pendingAction));
      break;
    case "error":
      dispatch(a.markError());
      break;
    default:
      break;
  }
}

// Sends a message and streams the reply (SSE over fetch so we can POST with auth).
export const sendAgentMessage = createAsyncThunk(
  "agent/sendMessage",
  async (text, { dispatch, getState, rejectWithValue }) => {
    const { auth, agent } = getState();
    activeController = new AbortController();

    try {
      const response = await fetch(`${API_URL}/agent/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ message: text, sessionId: agent.sessionId, guestId: auth.guestId }),
        signal: activeController.signal,
      });

      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => ({}));
        return rejectWithValue({ message: data.message || "The assistant is unavailable right now." });
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let boundary;
        while ((boundary = buffer.indexOf("\n\n")) !== -1) {
          const block = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 2);
          const event = block.match(/^event: (.*)$/m)?.[1];
          const data = block.match(/^data: (.*)$/m)?.[1];
          if (event && data) handleEvent(event, JSON.parse(data), dispatch);
        }
      }
      return true;
    } catch (error) {
      if (error.name === "AbortError") return true;
      return rejectWithValue({ message: "Connection lost. Please try again." });
    } finally {
      activeController = null;
    }
  }
);

// Confirm / Cancel buttons on an order summary or cancellation card.
export const respondToAction = createAsyncThunk(
  "agent/respondToAction",
  async (decision, { dispatch, getState, rejectWithValue }) => {
    const { auth, agent } = getState();
    try {
      const { data } = await api.post("/agent/action", {
        decision,
        sessionId: agent.sessionId,
        guestId: auth.guestId,
      });
      if (data.events?.some((e) => e.event === "cart")) dispatch(fetchCart());
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Could not complete that"));
    }
  }
);

export const resetAgentChat = createAsyncThunk("agent/reset", async (_, { getState }) => {
  const { auth, agent } = getState();
  activeController?.abort();
  if (agent.sessionId) {
    api.delete(`/agent/session/${agent.sessionId}`, { params: { guestId: auth.guestId } }).catch(() => {});
  }
});

export const stopAgentReply = () => activeController?.abort();

const currentAssistant = (state) => {
  const last = state.messages[state.messages.length - 1];
  return last && last.role === "assistant" && last.status === "streaming" ? last : null;
};

const agentSlice = createSlice({
  name: "agent",
  initialState: {
    open: false,
    enabled: null,
    providers: [],
    sessionId: localStorage.getItem(SESSION_KEY),
    messages: [],
    streaming: false,
    toolLabel: null,
    pendingAction: null,
    actionLoading: false,
    sessionLoaded: false,
  },
  reducers: {
    openAgent: (state) => {
      state.open = true;
    },
    closeAgent: (state) => {
      state.open = false;
    },
    toggleAgent: (state) => {
      state.open = !state.open;
    },
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
      // A session created in this tab is already in memory; don't re-fetch it.
      state.sessionLoaded = true;
      localStorage.setItem(SESSION_KEY, action.payload);
    },
    appendDelta: (state, action) => {
      const msg = currentAssistant(state);
      if (msg) msg.text += action.payload;
      state.toolLabel = null;
    },
    setToolLabel: (state, action) => {
      state.toolLabel = action.payload;
    },
    addCard: (state, action) => {
      const msg = currentAssistant(state);
      if (msg) msg.cards.push(action.payload);
    },
    setPendingAction: (state, action) => {
      state.pendingAction = action.payload || null;
    },
    markError: (state) => {
      const msg = currentAssistant(state);
      if (msg) msg.error = true;
    },
    // A signed-in conversation belongs to that account, so drop it locally on logout.
    clearAgentLocal: (state) => {
      state.messages = [];
      state.sessionId = null;
      state.pendingAction = null;
      state.sessionLoaded = false;
      localStorage.removeItem(SESSION_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgentStatus.fulfilled, (state, action) => {
        state.enabled = action.payload.enabled;
        state.providers = action.payload.providers;
      })
      .addCase(fetchAgentStatus.rejected, (state) => {
        state.enabled = false;
      })
      .addCase(loadAgentSession.fulfilled, (state, action) => {
        state.sessionLoaded = true;
        if (!action.payload) return;
        state.messages = action.payload.transcript.map(toMessage);
        state.pendingAction = action.payload.pendingAction;
      })
      .addCase(loadAgentSession.rejected, (state, action) => {
        state.sessionLoaded = true;
        // Only forget the session if the server no longer has it.
        if (action.payload?.status === 404) {
          state.sessionId = null;
          localStorage.removeItem(SESSION_KEY);
        }
      })
      .addCase(sendAgentMessage.pending, (state, action) => {
        state.sessionLoaded = true;
        state.streaming = true;
        state.toolLabel = null;
        state.messages.push({ id: uid(), role: "user", text: action.meta.arg, cards: [], status: "done" });
        state.messages.push({ id: uid(), role: "assistant", text: "", cards: [], status: "streaming" });
      })
      .addCase(sendAgentMessage.fulfilled, (state) => {
        const msg = currentAssistant(state);
        if (msg) msg.status = "done";
        state.streaming = false;
        state.toolLabel = null;
      })
      .addCase(sendAgentMessage.rejected, (state, action) => {
        const msg = currentAssistant(state);
        if (msg) {
          msg.status = "done";
          msg.error = true;
          msg.text = msg.text || action.payload?.message || "Something went wrong.";
        }
        state.streaming = false;
        state.toolLabel = null;
      })
      .addCase(respondToAction.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(respondToAction.fulfilled, (state, action) => {
        const decision = action.meta.arg;
        state.actionLoading = false;
        state.pendingAction = action.payload.pendingAction;
        state.messages.push({ id: uid(), role: "user", text: decision === "confirm" ? "Confirm" : "Cancel", cards: [], action: true, status: "done" });
        state.messages.push({ id: uid(), role: "assistant", text: action.payload.reply, cards: action.payload.cards || [], status: "done" });
      })
      .addCase(respondToAction.rejected, (state, action) => {
        state.actionLoading = false;
        if (action.payload?.status === 409) state.pendingAction = null;
        state.messages.push({ id: uid(), role: "assistant", text: action.payload?.message || "Could not complete that.", cards: [], status: "done", error: true });
      })
      .addCase(resetAgentChat.fulfilled, (state) => {
        state.messages = [];
        state.sessionId = null;
        state.pendingAction = null;
        state.streaming = false;
        state.toolLabel = null;
        localStorage.removeItem(SESSION_KEY);
      });
  },
});

export const { openAgent, closeAgent, toggleAgent, clearAgentLocal } = agentSlice.actions;
export default agentSlice.reducer;
