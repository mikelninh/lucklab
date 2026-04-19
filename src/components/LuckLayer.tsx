"use client";

import { useEffect, useState, useCallback } from "react";
import { TRADITIONS } from "@/lib/traditions";

/**
 * LuckLayer — ambient micro-interactions layered across the whole site.
 * Renders as a fixed overlay with pointer-events: none (except interactive elements).
 *
 * Features:
 * 1. Shooting stars (rare gold streaks — ~1 every 2-3 min)
 * 2. Jung's golden scarab (hidden beetle, different position each page)
 * 3. Lucky arrival toast (1 in ~8 visits: "Tyche noticed you")
 * 4. Kairotic number display (changes every page load)
 */

// ======================= SHOOTING STARS =======================

type Star = { id: number; x: number; y: number; angle: number; duration: number };

function ShootingStars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    let id = 0;
    function spawn() {
      const star: Star = {
        id: id++,
        x: Math.random() * 100,
        y: Math.random() * 40, // top 40% of viewport
        angle: 25 + Math.random() * 30, // 25-55 degrees
        duration: 0.6 + Math.random() * 0.4,
      };
      setStars((prev) => [...prev.slice(-3), star]); // max 4 at once
      setTimeout(() => {
        setStars((prev) => prev.filter((s) => s.id !== star.id));
      }, star.duration * 1000 + 500);
    }

    // First star after 30-90s, then every 90-200s
    const firstDelay = 30000 + Math.random() * 60000;
    const firstTimer = setTimeout(() => {
      spawn();
      const interval = setInterval(() => {
        spawn();
      }, 90000 + Math.random() * 110000);
      return () => clearInterval(interval);
    }, firstDelay);

    return () => clearTimeout(firstTimer);
  }, []);

  return (
    <>
      {stars.map((s) => (
        <div
          key={s.id}
          className="shooting-star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            transform: `rotate(${s.angle}deg)`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </>
  );
}

// ======================= GOLDEN SCARAB =======================

function GoldenScarab() {
  const [found, setFound] = useState(false);
  const [message, setMessage] = useState("");
  const [position] = useState(() => ({
    top: 20 + Math.random() * 60, // 20-80% from top
    left: 5 + Math.random() * 85, // 5-90% from left
  }));

  const messages = [
    "You noticed what others would walk past. That is the Seer's gift.",
    "Jung's patient dreamed of a golden scarab — and one flew through the window. You just found yours.",
    "Attention is the first lever of luck. Yours is sharp.",
    "Wiseman found that lucky people notice more. You just proved it.",
    "Most visitors never see this. You did. That is not nothing.",
  ];

  const onClick = useCallback(() => {
    if (found) return;
    setFound(true);
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, [found]);

  if (found && message) {
    return (
      <div
        className="fixed z-50 pointer-events-auto"
        style={{ top: `${position.top}%`, left: `min(${position.left}%, calc(100% - 320px))` }}
      >
        <div className="bg-[var(--surface)] border border-[var(--gold)] rounded-lg p-5 max-w-[300px] shadow-2xl animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[18px]">🪲</span>
            <span className="eyebrow eyebrow-tyche text-[10px]">the golden scarab</span>
          </div>
          <p className="font-display text-[14px] text-[var(--text)] leading-relaxed italic mb-3">
            &ldquo;{message}&rdquo;
          </p>
          <a
            href="/reading"
            className="font-mono text-[11px] text-[var(--gold)] tracking-wider hover:text-[var(--gold-bright)]"
          >
            BEGIN YOUR READING →
          </a>
          <button
            onClick={() => setMessage("")}
            className="absolute top-2 right-3 text-[var(--text-subtle)] hover:text-[var(--text)] text-[14px]"
          >
            &times;
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className="fixed z-40 pointer-events-auto opacity-[0.12] hover:opacity-40 transition-opacity duration-700 cursor-default"
      style={{ top: `${position.top}%`, left: `${position.left}%` }}
      aria-hidden="true"
      title=""
    >
      <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
        <ellipse cx="7" cy="10" rx="5.5" ry="6" fill="var(--gold)" opacity="0.7" />
        <ellipse cx="7" cy="10" rx="3.5" ry="4" fill="var(--gold-bright)" opacity="0.5" />
        <circle cx="7" cy="3.5" r="2.5" fill="var(--gold)" opacity="0.8" />
        <line x1="3" y1="6" x2="7" y2="4" stroke="var(--gold-dim)" strokeWidth="0.8" />
        <line x1="11" y1="6" x2="7" y2="4" stroke="var(--gold-dim)" strokeWidth="0.8" />
      </svg>
    </button>
  );
}

// ======================= LUCKY ARRIVAL TOAST =======================

function LuckyToast() {
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    // 1 in ~8 chance on each page load
    if (Math.random() > 0.125) return;

    const toasts = [
      "Tyche noticed you arrived.",
      "You came at the right moment.",
      "Something aligned just now.",
      "The odds of you being here, right now, are very low. And yet.",
      "Lucky visit #" + Math.floor(Math.random() * 900 + 100) + " today.",
    ];
    setText(toasts[Math.floor(Math.random() * toasts.length)]);

    const showTimer = setTimeout(() => setShow(true), 2000);
    const hideTimer = setTimeout(() => setShow(false), 6000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!show || !text) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto animate-slide-up">
      <div className="bg-[var(--surface)] border border-[var(--gold-dim)] rounded-lg px-5 py-3 shadow-xl max-w-[280px]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full" />
          <p className="font-display text-[13px] text-[var(--text-muted)] italic">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

// ======================= MAIN EXPORT =======================

export function LuckLayer() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // SSR-safe

  return (
    <div className="fixed inset-0 z-30 pointer-events-none overflow-hidden" aria-hidden="true">
      <ShootingStars />
      <GoldenScarab />
      <LuckyToast />
    </div>
  );
}
