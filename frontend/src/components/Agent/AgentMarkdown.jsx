import React from "react";
import { Link } from "react-router-dom";

// Renders the small subset of Markdown the assistant uses (bold, inline
// code, links, bullet / numbered lists) as React elements. No raw HTML is
// ever injected.
const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;

function renderInline(text, onNavigate) {
  return text.split(INLINE).map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={i} className="font-semibold text-ink">{part.slice(2, -2)}</strong>;
    }
    if (/^`[^`]+`$/.test(part)) {
      return <code key={i} className="rounded bg-stone-100 px-1 py-0.5 text-[0.85em]">{part.slice(1, -1)}</code>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const [, label, href] = link;
      if (href.startsWith("/")) {
        return <Link key={i} to={href} onClick={onNavigate} className="font-medium underline underline-offset-2">{label}</Link>;
      }
      if (/^https?:\/\//.test(href)) {
        return <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-2">{label}</a>;
      }
      return label;
    }
    return part;
  });
}

const AgentMarkdown = ({ text, onNavigate }) => {
  const blocks = [];
  let list = null;

  text.split("\n").forEach((rawLine) => {
    const line = rawLine.trimEnd();
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    const numbered = line.match(/^\s*(\d+)[.)]\s+(.*)$/);

    if (bullet || numbered) {
      const type = bullet ? "ul" : "ol";
      if (!list || list.type !== type) {
        list = { type, items: [] };
        blocks.push(list);
      }
      list.items.push(bullet ? bullet[1] : numbered[2]);
      return;
    }
    list = null;
    if (!line.trim()) {
      blocks.push({ type: "gap" });
      return;
    }
    const heading = line.match(/^#{1,6}\s+(.*)$/);
    blocks.push({ type: heading ? "h" : "p", text: heading ? heading[1] : line });
  });

  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {blocks.map((block, i) => {
        if (block.type === "gap") return null;
        if (block.type === "ul" || block.type === "ol") {
          const Tag = block.type;
          return (
            <Tag key={i} className={`space-y-1 pl-5 ${block.type === "ul" ? "list-disc" : "list-decimal"}`}>
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item, onNavigate)}</li>
              ))}
            </Tag>
          );
        }
        if (block.type === "h") {
          return <p key={i} className="font-semibold text-ink">{renderInline(block.text, onNavigate)}</p>;
        }
        return <p key={i}>{renderInline(block.text, onNavigate)}</p>;
      })}
    </div>
  );
};

export default AgentMarkdown;
