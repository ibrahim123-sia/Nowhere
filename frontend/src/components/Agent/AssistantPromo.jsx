import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiSparkles } from "react-icons/hi2";
import { openAgent, sendAgentMessage } from "../../redux/slices/agentSlice";

const PROMPTS = [
  "Find me linen trousers for a summer wedding",
  "Which jeans run true to size?",
  "Put together an office look under Rs. 8,000",
];

// Home page section introducing the shopping assistant.
const AssistantPromo = () => {
  const dispatch = useDispatch();
  const { enabled, streaming } = useSelector((state) => state.agent);

  if (enabled === false) return null;

  const ask = (prompt) => {
    dispatch(openAgent());
    if (!streaming) dispatch(sendAgentMessage(prompt));
  };

  return (
    <section className="container-page mt-24">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink px-8 py-14 text-white md:px-16">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-24 right-40 h-56 w-56 rounded-full bg-white/5" />
        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
              <HiSparkles className="h-4 w-4" /> Meet Iris
            </span>
            <h2 className="mt-5 font-display text-4xl font-medium leading-tight md:text-5xl">Your personal stylist, in chat.</h2>
            <p className="mt-4 max-w-md text-white/75">
              Describe what you need and Iris finds it, checks your size and stock, fills your bag and places a cash-on-delivery order
              when you say so. Works in English, Urdu and Roman Urdu.
            </p>
            <button onClick={() => dispatch(openAgent())} className="btn-light mt-8">
              Start a chat
            </button>
          </div>
          <div className="space-y-3">
            {PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => ask(prompt)}
                className="flex w-full items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-left text-sm transition hover:border-white/40 hover:bg-white/10"
              >
                <span>"{prompt}"</span>
                <span className="text-white/50">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssistantPromo;
