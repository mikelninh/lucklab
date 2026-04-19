"use client";

import { useEffect, useRef, useState } from "react";

/**
 * TypewriterReading — scroll-triggered typewriter for Lena's Yielder excerpt.
 *
 * Copy is identical to the prior Sample Reading block in page.tsx so we don't
 * regress on the proof-of-value that converts. The effect:
 *  - IntersectionObserver starts the typing when the card is 40% on screen
 *  - Variable delay: pauses longer on punctuation so it reads like a person
 *    is speaking, not a teletype
 *  - Blinking caret while typing; fades out when done
 *  - prefers-reduced-motion: falls back to instant reveal
 */

type Block = { kind: "lead" | "follow"; text: string };

const SCRIPT: Block[] = [
  {
    kind: "lead",
    text:
      "Lena, you know something most people spend decades unlearning: that gripping constricts. You chose \u201CI want to let go but find myself gripping anyway.\u201D That sentence is the entire Reading in miniature. You already know the answer. You do not yet trust it with your full weight.",
  },
  {
    kind: "follow",
    text:
      "Surrender: 44. You said \u201CI had just stopped trying to control the outcome\u201D when asked what preceded luck. Yet you chose \u201CI want to let go but find myself gripping anyway\u201D about uncertainty. That is not a contradiction. It is a portrait.",
  },
];

// Base milliseconds per character; punctuation pauses longer.
const BASE_MS = 18;
function delayFor(ch: string): number {
  if (ch === "." || ch === "?" || ch === "!") return 320;
  if (ch === "," || ch === ";" || ch === ":") return 140;
  if (ch === "\u2014" || ch === "-") return 180;
  if (ch === "\u201C" || ch === "\u201D" || ch === '"') return 80;
  if (ch === " ") return BASE_MS + 8;
  return BASE_MS;
}

export function TypewriterReading() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [typed, setTyped] = useState<string[]>(["", ""]); // one string per block

  // Respect reduced motion
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Reveal-on-scroll
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setStarted(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Typewriter engine
  useEffect(() => {
    if (!started) return;
    let cancelled = false;

    if (reducedMotion) {
      setTyped(SCRIPT.map((b) => b.text));
      setDone(true);
      return;
    }

    async function run() {
      for (let bi = 0; bi < SCRIPT.length; bi++) {
        const full = SCRIPT[bi].text;
        for (let ci = 0; ci < full.length; ci++) {
          if (cancelled) return;
          const ch = full[ci];
          setTyped((prev) => {
            const next = [...prev];
            next[bi] = full.slice(0, ci + 1);
            return next;
          });
          await new Promise((r) => setTimeout(r, delayFor(ch)));
        }
        // Pause between blocks
        if (!cancelled && bi < SCRIPT.length - 1) {
          await new Promise((r) => setTimeout(r, 600));
        }
      }
      if (!cancelled) setDone(true);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [started, reducedMotion]);

  // Which block is currently being typed?
  let activeBlock = -1;
  for (let i = 0; i < SCRIPT.length; i++) {
    if (typed[i].length < SCRIPT[i].text.length) {
      activeBlock = i;
      break;
    }
  }

  return (
    <div ref={rootRef} className="card card-tyche relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--tyche)] opacity-10 blur-2xl rounded-full pointer-events-none" />
      <div className="relative">
        <div className="eyebrow eyebrow-tyche mb-2 text-[10px] flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[var(--tyche)] rounded-full pulse-slow" />
          sample · the yielder · tyche.read()
        </div>

        {SCRIPT.map((block, i) => {
          const isActive = i === activeBlock;
          const isLead = block.kind === "lead";
          const shown = typed[i] || "";
          return (
            <div key={i} className={isLead ? "mb-5" : "mb-5"}>
              {!isLead && i === 1 && <div className="hairline mb-5" aria-hidden="true" />}
              <p
                className={
                  isLead
                    ? "font-display text-[16px] md:text-[17px] text-[var(--text)] leading-[1.65] italic"
                    : "font-display text-[15px] text-[var(--text-muted)] leading-[1.65] italic"
                }
              >
                {/* Leading and following quote marks — rendered when typing begins */}
                {shown.length > 0 && <span aria-hidden="true">&ldquo;</span>}
                {shown}
                {isActive && !reducedMotion && (
                  <span className="tw-caret" aria-hidden="true" />
                )}
                {shown.length > 0 && !isActive && shown === block.text && (
                  <span aria-hidden="true">&rdquo;</span>
                )}
              </p>
            </div>
          );
        })}

        <div className="h-12 bg-gradient-to-b from-transparent to-[var(--surface)] pointer-events-none" />
        <div className="text-center">
          <span
            className={`font-mono text-[10px] tracking-wider transition-opacity duration-700 ${
              done ? "text-[var(--tyche)] opacity-100" : "text-[var(--text-subtle)] opacity-60"
            }`}
          >
            {done
              ? "THIS CONTINUES FOR 1,800+ WORDS · PERSONALISED TO YOU"
              : "TYCHE IS READING · PERSONALISED TO YOU"}
          </span>
        </div>
      </div>

      <style jsx>{`
        .tw-caret {
          display: inline-block;
          width: 2px;
          height: 1em;
          margin-left: 2px;
          vertical-align: text-bottom;
          background: var(--tyche);
          animation: tw-blink 0.9s steps(1, end) infinite;
        }
        @keyframes tw-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
