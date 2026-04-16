"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import { decodeAnswers } from "@/lib/answer-codec";

/**
 * One-click upsell from Primer → Full Reading.
 * Uses the SAME answers stored in Stripe metadata — no re-quiz.
 * Creates a new checkout session for the €29 Reading using the existing data.
 */

export function UpgradeToFull({
  answers: answersEncoded,
  personal: personalJson,
  archetypeId,
}: {
  answers: string;
  personal: string;
  archetypeId: string;
}) {
  const [loading, setLoading] = useState(false);

  async function upgrade() {
    setLoading(true);
    track("cta_click", { action: "primer_upgrade_to_full" });
    try {
      const answers = decodeAnswers(answersEncoded);
      let personal = { name: "friend", birthdate: "", currentQuestion: "" };
      try { personal = JSON.parse(personalJson); } catch {}

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, personal, archetypeId, tier: "full" }),
      });
      const text = await res.text();
      let data: { url?: string; error?: string };
      try { data = JSON.parse(text); } catch { throw new Error(text); }
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("[upgrade]", err);
      alert(err instanceof Error ? err.message : "Upgrade failed");
      setLoading(false);
    }
  }

  return (
    <div className="mt-16 card card-tyche text-center">
      <div className="eyebrow eyebrow-tyche mb-3">go deeper</div>
      <h3 className="font-display text-[28px] md:text-[32px] font-light mb-4 text-balance">
        Ready for the Full Reading?
      </h3>
      <p className="text-[14px] text-[var(--text-muted)] mb-4 max-w-md mx-auto leading-relaxed">
        The Primer shows you where you stand. The Full Reading gives you a
        30-day map, three tradition-specific practices, a daily ritual, and a
        90-day Return — all written to you by name.
      </p>
      <p className="text-[13px] text-[var(--gold)] font-mono tracking-wider mb-6 flex items-center justify-center gap-2">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
          <path d="M4.5 7l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        NO RE-QUIZ NEEDED · YOUR ANSWERS ARE SAVED
      </p>
      <button
        onClick={upgrade}
        disabled={loading}
        className="btn btn-primary disabled:opacity-50"
      >
        {loading ? "Redirecting to checkout…" : "Unlock the Full Reading · €29"}
      </button>
      <p className="font-mono text-[10px] text-[var(--text-subtle)] mt-4 tracking-wider">
        100% REFUND GUARANTEE · INSTANT DELIVERY
      </p>
    </div>
  );
}
