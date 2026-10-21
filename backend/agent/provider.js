// Streaming chat client for OpenAI-compatible APIs. Groq and Google Gemini
// both expose this format, so one code path serves every free provider.
// Providers are tried in order; if one fails before replying (rate limit,
// outage, retired model, bad key) the next one with a configured key takes over.

const PROVIDERS = {
  groq: {
    label: "Groq",
    baseURL: () => process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1",
    apiKey: () => process.env.GROQ_API_KEY,
    model: () => process.env.GROQ_MODEL || "openai/gpt-oss-120b",
    // gpt-oss models reason before answering; keep it short and off the wire.
    params: (model) => (model.startsWith("openai/gpt-oss") ? { reasoning_effort: "low", include_reasoning: false } : {}),
  },
  gemini: {
    label: "Google Gemini",
    baseURL: () => process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta/openai",
    apiKey: () => process.env.GEMINI_API_KEY,
    model: () => process.env.GEMINI_MODEL || "gemini-3.8-flash",
    params: (model) => (/^gemini-(2\.5|[3-9])/.test(model) ? { reasoning_effort: "low" } : {}),
    // Gemini 3 attaches a thought signature to each tool call (in
    // `extra_content`) and rejects a follow-up request that drops it.
    keepsToolCallExtras: true,
  },
  // Any other OpenAI-compatible endpoint (OpenRouter, a local Ollama, ...).
  custom: {
    label: "Custom",
    baseURL: () => process.env.AGENT_BASE_URL,
    apiKey: () => process.env.AGENT_API_KEY || (process.env.AGENT_BASE_URL ? "none" : ""),
    model: () => process.env.AGENT_MODEL,
  },
};

const REQUEST_TIMEOUT_MS = 45000;

class ProviderError extends Error {
  constructor(message, { status, code, provider, retryable = false } = {}) {
    super(message);
    this.name = "ProviderError";
    this.status = status;
    this.code = code;
    this.provider = provider;
    this.retryable = retryable;
  }
}

// Configured providers, preferred one (AGENT_PROVIDER) first.
function availableProviders() {
  const preferred = (process.env.AGENT_PROVIDER || "groq").toLowerCase();
  const order = [preferred, ...Object.keys(PROVIDERS).filter((p) => p !== preferred)];
  return order
    .filter((name) => PROVIDERS[name])
    .map((name) => ({ name, ...PROVIDERS[name] }))
    .filter((p) => p.baseURL() && p.apiKey() && p.model());
}

// Reads an SSE response body and yields parsed `data:` payloads.
async function* readEvents(body) {
  const decoder = new TextDecoder();
  let buffer = "";
  for await (const chunk of body) {
    buffer += decoder.decode(chunk, { stream: true });
    let newline;
    while ((newline = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        yield JSON.parse(data);
      } catch {
        // Ignore keep-alive comments or partial frames.
      }
    }
  }
}

// Provider-specific fields on stored tool calls (Gemini's thought signatures)
// are only sent back to the provider that understands them; others reject them.
function messagesFor(provider, messages) {
  if (provider.keepsToolCallExtras) return messages;
  return messages.map((m) =>
    m.tool_calls?.some((call) => call.extra_content)
      ? { ...m, tool_calls: m.tool_calls.map(({ extra_content, ...call }) => call) }
      : m
  );
}

async function streamFromProvider(provider, { messages, tools, onText, signal, maxTokens }) {
  const model = provider.model();
  const response = await fetch(`${provider.baseURL()}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${provider.apiKey()}`,
    },
    body: JSON.stringify({
      model,
      messages: messagesFor(provider, messages),
      tools,
      tool_choice: "auto",
      temperature: 0.3,
      max_tokens: maxTokens,
      stream: true,
      ...provider.params?.(model),
    }),
    signal: AbortSignal.any([signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)].filter(Boolean)),
  });

  if (!response.ok) {
    let detail = {};
    try {
      detail = await response.json();
    } catch {
      // body was not JSON
    }
    const err = Array.isArray(detail) ? detail[0]?.error : detail.error;
    throw new ProviderError(err?.message || `${provider.label} returned ${response.status}`, {
      status: response.status,
      code: err?.code || err?.status,
      provider: provider.name,
      retryable: response.status === 429 || response.status >= 500,
    });
  }

  let content = "";
  let finishReason = null;
  const calls = [];

  for await (const event of readEvents(response.body)) {
    if (event.error) {
      throw new ProviderError(event.error.message || "Stream error", {
        code: event.error.code,
        provider: provider.name,
      });
    }
    const choice = event.choices?.[0];
    if (!choice) continue;
    const delta = choice.delta || {};

    if (typeof delta.content === "string" && delta.content) {
      content += delta.content;
      onText?.(delta.content);
    }

    (delta.tool_calls || []).forEach((part, position) => {
      const index = Number.isInteger(part.index) ? part.index : position;
      const call = (calls[index] ||= { id: "", type: "function", function: { name: "", arguments: "" } });
      if (part.id) call.id = part.id;
      if (part.function?.name) call.function.name += part.function.name;
      if (part.function?.arguments) call.function.arguments += part.function.arguments;
      if (part.extra_content) call.extra_content = { ...call.extra_content, ...part.extra_content };
    });

    if (choice.finish_reason) finishReason = choice.finish_reason;
  }

  const toolCalls = calls.filter(Boolean).map((call, i) => ({
    ...call,
    id: call.id || `call_${Date.now()}_${i}`,
  }));

  return { content, toolCalls, finishReason, provider: provider.name, model };
}

// Streams one completion. If a provider fails before any text has been
// streamed, the next configured provider gets the same request.
async function streamChat(options) {
  const providers = availableProviders();
  if (providers.length === 0) {
    throw new ProviderError("No AI provider is configured", { code: "not_configured" });
  }

  const errors = [];
  for (const provider of providers) {
    let streamed = false;
    try {
      return await streamFromProvider(provider, {
        ...options,
        onText: (text) => {
          streamed = true;
          options.onText?.(text);
        },
      });
    } catch (error) {
      if (options.signal?.aborted) throw error;
      const failure =
        error instanceof ProviderError
          ? error
          : new ProviderError(error.message, { provider: provider.name, retryable: true });
      console.error(`[agent] ${provider.name} (${provider.model()}) failed:`, failure.status || "", failure.message);
      // Half a reply can't be handed to another model.
      if (streamed) throw failure;
      errors.push(failure);
    }
  }
  // Report the most actionable failure: a rate limit, then a malformed tool
  // call (the agent loop retries those), then whatever happened last.
  throw (
    errors.find((e) => e.status === 429) ||
    errors.find((e) => e.code === "tool_use_failed") ||
    errors[errors.length - 1]
  );
}

module.exports = { streamChat, availableProviders, ProviderError };
