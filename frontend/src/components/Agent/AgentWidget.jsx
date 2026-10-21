import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiSparkles, HiPaperAirplane, HiArrowPath, HiStop } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import AgentMarkdown from "./AgentMarkdown";
import { ConfirmCard, OrderPlacedCard, ProductCardsRow } from "./AgentCards";
import {
  closeAgent,
  loadAgentSession,
  resetAgentChat,
  sendAgentMessage,
  stopAgentReply,
  toggleAgent,
} from "../../redux/slices/agentSlice";

const SUGGESTIONS = [
  "Find me a white shirt for the office",
  "Women's jeans under Rs. 5,000",
  "What's in my cart?",
  "Track my order",
  "What's your return policy?",
  "Summer ke liye kuch dikhao",
];

const TypingDots = () => (
  <span className="inline-flex gap-1" aria-label="Nora is typing">
    {[0, 1, 2].map((i) => (
      <span key={i} className="h-1.5 w-1.5 animate-dot-pulse rounded-full bg-ink-muted" style={{ animationDelay: `${i * 0.15}s` }} />
    ))}
  </span>
);

const Avatar = () => (
  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-ink text-white">
    <HiSparkles className="h-4 w-4" />
  </span>
);

const AgentWidget = () => {
  const dispatch = useDispatch();
  const { open, enabled, messages, streaming, toolLabel, sessionId, sessionLoaded } = useSelector((state) => state.agent);
  const { user } = useSelector((state) => state.auth);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && sessionId && !sessionLoaded) dispatch(loadAgentSession());
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open, sessionId, sessionLoaded, dispatch]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, toolLabel, open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && dispatch(closeAgent());
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, dispatch]);

  const send = (text) => {
    const message = text.trim();
    if (!message || streaming) return;
    dispatch(sendAgentMessage(message));
    setInput("");
  };

  // Close the panel when following a link on small screens.
  const onNavigate = () => {
    if (window.innerWidth < 640) dispatch(closeAgent());
  };

  const lastConfirmIndex = messages.reduce(
    (found, msg, i) => (msg.cards?.some((c) => c.type === "confirm") ? i : found),
    -1
  );

  return (
    <>
      <button
        onClick={() => dispatch(toggleAgent())}
        className={`fixed bottom-5 right-5 z-[45] flex items-center gap-2 rounded-full bg-ink py-3 pl-4 pr-5 text-sm font-semibold text-white shadow-lift transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink-soft ${
          open ? "pointer-events-none translate-y-4 opacity-0" : "opacity-100"
        }`}
        aria-label="Open shopping assistant"
      >
        <HiSparkles className="h-5 w-5" />
        Ask Nora
      </button>

      <section
        className={`fixed inset-0 z-[55] flex flex-col bg-white transition-all duration-300 sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[min(680px,calc(100vh-2.5rem))] sm:w-[400px] sm:rounded-3xl sm:border sm:border-stone-200 sm:shadow-lift ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        }`}
        aria-label="Nora shopping assistant"
        aria-hidden={!open}
      >
        <header className="flex items-center gap-3 border-b border-stone-200 px-4 py-3">
          <Avatar />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Nora</p>
            <p className="text-[11px] text-ink-muted">
              {enabled === false ? "Offline" : streaming ? "Typing..." : "AI shopping assistant"}
            </p>
          </div>
          {messages.length > 0 && (
            <button onClick={() => dispatch(resetAgentChat())} className="rounded-full p-2 text-ink-muted hover:bg-stone-100 hover:text-ink" aria-label="Start a new chat" title="New chat">
              <HiArrowPath className="h-4 w-4" />
            </button>
          )}
          <button onClick={() => dispatch(closeAgent())} className="rounded-full p-2 text-ink-muted hover:bg-stone-100 hover:text-ink" aria-label="Close assistant">
            <IoMdClose className="h-5 w-5" />
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5" aria-live="polite">
          {messages.length === 0 && (
            <div className="animate-fade-up">
              <div className="flex gap-3">
                <Avatar />
                <div className="rounded-2xl rounded-tl-md bg-stone-100 px-4 py-3 text-sm leading-relaxed">
                  <p>
                    Hi{user ? ` ${user.name.split(" ")[0]}` : ""}! I'm Nora. I can find pieces for you, check sizes and stock,
                    add things to your bag, place a cash-on-delivery order and track it, all from this chat.
                  </p>
                </div>
              </div>
              {enabled === false ? (
                <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-xs text-amber-900">
                  The assistant isn't available right now, but you can keep browsing and checking out as usual.
                </p>
              ) : (
                <div className="mt-5 flex flex-wrap gap-2 pl-11">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => send(s)} className="chip text-left">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {messages.map((msg, index) =>
            msg.role === "user" ? (
              <div key={msg.id} className="flex justify-end">
                <p className={`max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-md px-4 py-2.5 text-sm ${msg.action ? "border border-stone-300 bg-white italic text-ink-soft" : "bg-ink text-white"}`}>
                  {msg.text}
                </p>
              </div>
            ) : (
              <div key={msg.id} className="flex gap-3">
                <Avatar />
                <div className="min-w-0 flex-1 space-y-3">
                  {(msg.text || msg.status === "streaming") && (
                    <div className={`w-fit max-w-full rounded-2xl rounded-tl-md px-4 py-3 ${msg.error ? "bg-red-50 text-red-900" : "bg-stone-100 text-ink-soft"}`}>
                      {msg.text ? <AgentMarkdown text={msg.text} onNavigate={onNavigate} /> : <TypingDots />}
                    </div>
                  )}
                  {msg.cards?.map((card, i) => {
                    if (card.type === "products") return <ProductCardsRow key={i} cards={card.cards} onNavigate={onNavigate} />;
                    if (card.type === "confirm") return <ConfirmCard key={i} card={card} isLatest={index === lastConfirmIndex} />;
                    if (card.type === "order") return <OrderPlacedCard key={i} card={card} onNavigate={onNavigate} />;
                    return null;
                  })}
                  {msg.status === "streaming" && toolLabel && (
                    <p className="flex items-center gap-2 text-xs text-ink-muted">
                      <TypingDots /> {toolLabel}...
                    </p>
                  )}
                </div>
              </div>
            )
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-stone-200 p-3"
        >
          <div className="flex items-end gap-2 rounded-2xl border border-stone-300 bg-white p-1.5 focus-within:border-ink">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={1000}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder={enabled === false ? "Assistant offline" : "Ask about sizes, styles, orders..."}
              disabled={enabled === false}
              className="max-h-28 min-h-[40px] flex-1 resize-none bg-transparent px-3 py-2.5 text-sm focus:outline-none disabled:cursor-not-allowed"
              aria-label="Message Nora"
            />
            {streaming ? (
              <button type="button" onClick={stopAgentReply} className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-200 text-ink" aria-label="Stop reply">
                <HiStop className="h-4 w-4" />
              </button>
            ) : (
              <button type="submit" disabled={!input.trim() || enabled === false} className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white transition disabled:opacity-30" aria-label="Send message">
                <HiPaperAirplane className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="mt-2 text-center text-[10px] text-ink-muted">Nora can make mistakes. Orders are only placed after you confirm.</p>
        </form>
      </section>
    </>
  );
};

export default AgentWidget;
