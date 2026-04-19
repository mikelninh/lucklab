"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

/**
 * ShareCard — generates a personalised social sharing card.
 * The user shares THEIR archetype, not a generic link.
 * This is the single highest-leverage viral mechanic in the product.
 */

type ShareProps = {
  name: string;
  archetype: string;
  greek?: string;
  tagline?: string;
  variant?: "compact" | "full";
};

export function ShareCard({ name, archetype, greek, tagline, variant = "compact" }: ShareProps) {
  const [copied, setCopied] = useState(false);
  const firstName = name.split(/\s+/)[0];
  const url = typeof window !== "undefined" ? window.location.origin : "https://lucklab.app";

  const shareText = `I just took the Luck Lab Reading. Tyche called me ${archetype}${tagline ? ` — "${tagline}"` : ""}. What archetype are you?\n\n${url}/reading`;

  async function shareNative() {
    track("cta_click", { action: "share_archetype" });
    if (navigator.share) {
      try {
        await navigator.share({
          title: `I am ${archetype} — Luck Lab`,
          text: shareText,
          url: `${url}/reading`,
        });
        return;
      } catch { /* user cancelled or not supported */ }
    }
    // Fallback: copy to clipboard
    copyToClipboard();
  }

  function copyToClipboard() {
    navigator.clipboard?.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  if (variant === "compact") {
    return (
      <button
        onClick={shareNative}
        className="btn btn-ghost text-[12px] !py-2 !px-4 no-print"
      >
        {copied ? "Copied!" : "Share your archetype"}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M4 4.5L8 2M4 7.5L8 10M3 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM9 2.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM9 12a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" stroke="currentColor" strokeWidth="1" />
        </svg>
      </button>
    );
  }

  return (
    <div className="card card-gold text-center no-print">
      <div className="eyebrow mb-3">share the result</div>
      <p className="font-display text-[22px] text-[var(--text)] mb-2">
        {firstName}, you are <em className="not-italic text-[var(--gold)]">{archetype}</em>.
      </p>
      {greek && (
        <p className="font-mono text-[11px] text-[var(--text-subtle)] tracking-wider mb-1">
          {greek}
        </p>
      )}
      {tagline && (
        <p className="text-[14px] text-[var(--text-muted)] italic mb-6">{tagline}</p>
      )}
      <div className="flex gap-3 justify-center flex-wrap">
        <button onClick={shareNative} className="btn btn-primary">
          {copied ? "Copied!" : "Share your archetype"}
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost"
          onClick={() => track("cta_click", { action: "share_whatsapp" })}
        >
          WhatsApp
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost"
          onClick={() => track("cta_click", { action: "share_x" })}
        >
          Post on X
        </a>
      </div>
      <p className="font-mono text-[10px] text-[var(--text-subtle)] mt-4 tracking-wider">
        CHALLENGE A FRIEND: WHAT ARCHETYPE ARE THEY?
      </p>
    </div>
  );
}
