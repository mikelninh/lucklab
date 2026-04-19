"use client";

import { useState } from "react";
import { TRADITIONS } from "@/lib/traditions";

/**
 * Daily Kairotic Moment — a practice from the 12 traditions, changes daily.
 * Seeded by today's date so everyone sees the same one on the same day.
 * Placed on the homepage between sections.
 */

function seededIndex(seed: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % max;
}

export function DailyMoment() {
  const [expanded, setExpanded] = useState(false);
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const tradition = TRADITIONS[seededIndex(today, TRADITIONS.length)];

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left group"
      >
        <div className="flex items-center gap-3 justify-center">
          <div className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full" />
          <span className="font-mono text-[11px] text-[var(--gold)] tracking-wider">
            TODAY&rsquo;S KAIROTIC MOMENT
          </span>
          <div className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full" />
        </div>

        {!expanded && (
          <p className="text-center font-display text-[16px] text-[var(--text-muted)] italic mt-3 group-hover:text-[var(--text)] transition-colors">
            Tap to receive today&rsquo;s practice from{" "}
            <span className="text-[var(--gold)]">{tradition.name}</span>.
          </p>
        )}
      </button>

      {expanded && (
        <div className="mt-6 card card-gold text-center animate-fade-in">
          <div className="eyebrow mb-2 text-[10px]">
            {today} &middot; {tradition.name}
          </div>
          <h3 className="font-display text-[22px] text-[var(--gold-bright)] mb-1">
            {tradition.concept}
          </h3>
          <p className="text-[12px] text-[var(--text-subtle)] italic mb-4">
            {tradition.conceptOrigin}
          </p>
          <p className="font-display text-[17px] text-[var(--text)] leading-relaxed mb-4 italic">
            &ldquo;{tradition.practice}&rdquo;
          </p>
          <p className="text-[13px] text-[var(--text-muted)] leading-relaxed max-w-md mx-auto">
            {tradition.mechanism}
          </p>
          <p className="font-mono text-[10px] text-[var(--text-subtle)] mt-6 tracking-wider">
            THIS PRACTICE TARGETS THE <span className="text-[var(--gold)]">{tradition.convergesOn.toUpperCase()}</span> LEVER
          </p>
        </div>
      )}
    </section>
  );
}
