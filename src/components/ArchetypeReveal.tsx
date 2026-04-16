"use client";

import { useState, useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Animated Archetype Reveal — the "Co-Star screenshot but better" moment.
 *
 * Two modes:
 * 1. Static card — downloadable PNG via /api/share-card
 * 2. Animated reveal — CSS keyframe animation, screen-recordable
 *
 * This component IS the future Remotion video template.
 * Same layout, same aesthetic, same timing → easy to port to MP4 later.
 */

type RevealProps = {
  name: string;
  archetype: string;
  greek: string;
  tagline: string;
  scores: Record<string, number>;
};

const SCORE_ORDER = ["attention", "openness", "action", "surrender", "connection", "meaning"];
const SCORE_LABELS: Record<string, string> = {
  attention: "Attention",
  openness: "Openness",
  action: "Action",
  surrender: "Surrender",
  connection: "Connection",
  meaning: "Meaning",
};

const CARD_STYLES = [
  { id: "midnight", label: "Midnight", preview: "bg-gradient-to-b from-[#0a0a0d] to-[#16161d] text-[#e6c87a]" },
  { id: "light", label: "Light", preview: "bg-gradient-to-b from-[#faf8f3] to-[#ede6d6] text-[#6b5a30]" },
  { id: "minimal", label: "Minimal", preview: "bg-black text-white" },
  { id: "aurora", label: "Aurora", preview: "bg-gradient-to-br from-[#1a0e2e] to-[#0e1a2e] text-[#c4b0ff]" },
] as const;

export function ArchetypeReveal({ name, archetype, greek, tagline, scores }: RevealProps) {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [downloading, setDownloading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("midnight");
  const firstName = name.split(/\s+/)[0];
  const archetypeShort = archetype.replace(/^The\s+/i, "");

  // Auto-play on mount
  useEffect(() => {
    const t = setTimeout(() => setPhase("playing"), 500);
    const t2 = setTimeout(() => setPhase("done"), 5000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  const scoreValues = SCORE_ORDER.map((k) => scores[k] ?? 0);
  const shareCardUrl = `/api/share-card?name=${encodeURIComponent(name)}&archetype=${encodeURIComponent(archetype)}&greek=${encodeURIComponent(greek)}&tagline=${encodeURIComponent(tagline)}&scores=${scoreValues.join(",")}&style=${selectedStyle}`;

  async function downloadCard() {
    setDownloading(true);
    track("cta_click", { action: "download_share_card", props: { style: selectedStyle } });
    try {
      const res = await fetch(shareCardUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      if (blob.size < 100) throw new Error("Empty image");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kairos-${archetypeShort.toLowerCase()}-${firstName.toLowerCase()}-${selectedStyle}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[download]", err);
      // Fallback: open in new tab so they can long-press/right-click save
      window.open(shareCardUrl, "_blank");
    }
    setDownloading(false);
  }

  const shareText = `Tyche called me ${archetype} — "${tagline}"\n\nWhich archetype are you?\nkairos.lab/reading`;

  return (
    <div className="card text-center no-print overflow-hidden">
      <div className="eyebrow eyebrow-tyche mb-4">your reveal · share this</div>

      {/* The animated reveal card */}
      <div className="relative mx-auto max-w-[360px] aspect-[9/16] rounded-xl overflow-hidden bg-gradient-to-b from-[#0a0a0d] via-[#12121a] to-[#16161d] border border-[var(--border)]">
        <div className="absolute inset-0 flex flex-col items-center justify-between p-8">
          {/* Top */}
          <div className="flex items-center gap-2 opacity-60">
            <div className="w-2 h-2 bg-[var(--gold)] rounded-full" />
            <span className="font-mono text-[8px] text-[var(--gold)] tracking-[0.2em]">KAIROS LAB</span>
          </div>

          {/* Middle — the reveal */}
          <div className="flex flex-col items-center gap-2 flex-1 justify-center">
            <div className={`font-mono text-[9px] text-[var(--text-subtle)] tracking-[0.15em] transition-opacity duration-700 ${phase !== "idle" ? "opacity-100" : "opacity-0"}`}>
              TYCHE READ FOR {firstName.toUpperCase()}
            </div>

            <div className={`h-px w-16 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent my-2 transition-opacity duration-1000 delay-500 ${phase === "playing" || phase === "done" ? "opacity-100" : "opacity-0"}`} />

            <div className={`font-display text-[32px] md:text-[36px] leading-[1] tracking-tight text-gold-gradient transition-all duration-1000 delay-700 ${phase === "playing" || phase === "done" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              {archetypeShort}
            </div>

            {greek && (
              <div className={`font-mono text-[9px] text-[var(--text-subtle)] tracking-wider mt-1 transition-opacity duration-700 delay-1000 ${phase === "done" ? "opacity-100" : "opacity-0"}`}>
                {greek}
              </div>
            )}

            {tagline && (
              <div className={`font-display text-[11px] text-[var(--text-muted)] italic text-center max-w-[240px] mt-2 transition-opacity duration-700 delay-1200 ${phase === "done" ? "opacity-100" : "opacity-0"}`}>
                &ldquo;{tagline}&rdquo;
              </div>
            )}

            {/* Score bars */}
            <div className={`w-full max-w-[260px] space-y-1.5 mt-5 transition-opacity duration-700 delay-1500 ${phase === "done" ? "opacity-100" : "opacity-0"}`}>
              {SCORE_ORDER.map((key, i) => {
                const val = scores[key] ?? 0;
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span className="font-mono text-[7px] text-[var(--text-subtle)] tracking-wider w-16 text-right uppercase">
                      {SCORE_LABELS[key]}
                    </span>
                    <div className="flex-1 h-[3px] bg-[var(--border)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--gold-dim)] to-[var(--gold-bright)] rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: phase === "done" ? `${val}%` : "0%",
                          transitionDelay: `${1800 + i * 150}ms`,
                        }}
                      />
                    </div>
                    <span className="font-mono text-[8px] text-[var(--gold)] w-5 text-right">{val}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className={`text-center transition-opacity duration-700 delay-[2800ms] ${phase === "done" ? "opacity-100" : "opacity-0"}`}>
            <p className="text-[10px] text-[var(--text)]">Which archetype are you?</p>
            <p className="font-mono text-[8px] text-[var(--gold)] tracking-[0.15em] mt-1">KAIROS.LAB/READING · FREE</p>
          </div>
        </div>
      </div>

      {/* Style picker */}
      <div className="mt-6 mb-4">
        <div className="eyebrow eyebrow-muted text-center mb-3 text-[9px]">choose your style</div>
        <div className="flex gap-3 justify-center">
          {CARD_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`w-16 h-24 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                selectedStyle === style.id
                  ? "border-[var(--gold)] scale-105"
                  : "border-[var(--border)] opacity-60 hover:opacity-100"
              } ${style.preview}`}
            >
              <span className="text-[10px] font-bold">{archetypeShort.charAt(0)}</span>
              <span className="text-[7px] font-mono opacity-70">{style.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        <button
          onClick={downloadCard}
          disabled={downloading}
          className="btn btn-primary !py-2 !px-4 text-[12px]"
        >
          {downloading ? "Generating…" : "Download card"}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 1v8m0 0l-3-3m3 3l3-3M1 10.5h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost !py-2 !px-4 text-[12px]"
          onClick={() => track("cta_click", { action: "reveal_whatsapp" })}
        >
          WhatsApp
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost !py-2 !px-4 text-[12px]"
          onClick={() => track("cta_click", { action: "reveal_x" })}
        >
          Post on X
        </a>
        <a
          href={`https://www.instagram.com/`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost !py-2 !px-4 text-[12px]"
          onClick={() => {
            track("cta_click", { action: "reveal_instagram" });
            downloadCard(); // download first, then they upload to Stories
          }}
        >
          Instagram Stories
        </a>
      </div>

      <p className="font-mono text-[10px] text-[var(--text-subtle)] mt-4 tracking-wider">
        DOWNLOAD THE CARD → POST IT → CHALLENGE YOUR FRIENDS
      </p>
    </div>
  );
}
