"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/**
 * HeroCelestial — cinematic hero section.
 *
 * Upgrades the original text-first hero with:
 *  - animated canvas starfield (replaces the static CSS .starfield)
 *  - rotating concentric rings around a Tyche rudder glyph
 *  - mask-reveal on the title
 *  - staggered fade-ins for sub + CTAs + counter
 *
 * All copy, CTAs, and trust signals from the original hero are preserved.
 */
export function HeroCelestial() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Star = { x: number; y: number; r: number; a: number; tw: number };
    let stars: Star[] = [];
    let w = 0,
      h = 0;
    let raf = 0;

    function resize() {
      const rect = c!.getBoundingClientRect();
      w = c!.width = Math.floor(rect.width * dpr);
      h = c!.height = Math.floor(rect.height * dpr);
      const density = Math.floor((rect.width * rect.height) / 6000);
      stars = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (Math.random() * 1.3 + 0.3) * dpr,
        a: 0.25 + Math.random() * 0.75,
        tw: Math.random() * Math.PI * 2,
      }));
    }

    function frame(t: number) {
      ctx!.clearRect(0, 0, w, h);
      for (const s of stars) {
        const flicker = 0.5 + Math.sin(t * 0.0012 + s.tw) * 0.5;
        ctx!.beginPath();
        ctx!.globalAlpha = s.a * (0.35 + flicker * 0.65);
        ctx!.fillStyle = flicker > 0.88 ? "#f2e4b4" : "#dce4ff";
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    resize();
    raf = requestAnimationFrame(frame);
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] isolate">
      {/* Layer 1: animated starfield */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
        aria-hidden="true"
      />
      {/* Layer 2: atmospheric gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 28%, rgba(167,139,250,0.14), transparent 55%)," +
            "radial-gradient(ellipse at 50% 100%, var(--bg), transparent 50%)," +
            "linear-gradient(180deg, transparent 55%, var(--bg) 100%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-36 text-center">
        {/* Rotating Tyche sigil rings */}
        <div className="relative mx-auto mb-10 w-[180px] h-[180px] md:w-[220px] md:h-[220px]">
          <div
            className="absolute inset-[-12%] pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(201,169,97,0.32), transparent 55%)",
              filter: "blur(18px)",
              animation: "breathe 6s ease-in-out infinite",
            }}
          />
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 200 200"
            fill="none"
            aria-hidden="true"
            style={{ animation: "spin-slow 90s linear infinite" }}
          >
            <circle cx="100" cy="100" r="98" stroke="rgba(201,169,97,0.32)" strokeWidth="1" />
            <circle cx="100" cy="100" r="82" stroke="rgba(201,169,97,0.18)" strokeWidth="1" />
            <g stroke="rgba(201,169,97,0.48)" strokeWidth="1">
              <line x1="100" y1="2" x2="100" y2="20" />
              <line x1="100" y1="180" x2="100" y2="198" />
              <line x1="2" y1="100" x2="20" y2="100" />
              <line x1="180" y1="100" x2="198" y2="100" />
            </g>
          </svg>
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 200 200"
            fill="none"
            aria-hidden="true"
            style={{ animation: "spin-slow-reverse 60s linear infinite" }}
          >
            <circle cx="100" cy="100" r="60" stroke="rgba(201,169,97,0.28)" strokeWidth="1" />
            <g stroke="rgba(201,169,97,0.4)" strokeLinecap="round">
              <line x1="100" y1="40" x2="100" y2="160" strokeWidth="1.2" />
              <line x1="40" y1="100" x2="160" y2="100" strokeWidth="1.2" />
              <line x1="58" y1="58" x2="142" y2="142" strokeWidth="1" />
              <line x1="142" y1="58" x2="58" y2="142" strokeWidth="1" />
            </g>
            <circle cx="100" cy="100" r="8" fill="#e6c87a" fillOpacity="0.9" />
            <circle cx="100" cy="100" r="3" fill="#ffffff" />
          </svg>
        </div>

        {/* v1.0 live badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 border border-[var(--border-bright)] rounded-full bg-[var(--surface)] mb-8 hero-fade"
          style={{ animationDelay: "300ms" }}
        >
          <span className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full pulse-slow" />
          <span className="eyebrow text-[10px]">v1.0 · live · tyche awaits</span>
        </div>

        {/* Title with mask reveal */}
        <h1 className="font-display font-light tracking-[-0.02em] leading-[1.02] text-balance mx-auto max-w-4xl text-[clamp(44px,7.5vw,96px)]">
          <span className="hero-line-mask">
            <span className="hero-line-inner" style={{ animationDelay: "500ms" }}>
              Luck is not random.
            </span>
          </span>
          <br />
          <span className="hero-line-mask">
            <span className="hero-line-inner" style={{ animationDelay: "800ms" }}>
              <em className="not-italic text-gold-gradient">It converges.</em>
            </span>
          </span>
        </h1>

        <p
          className="text-[17px] md:text-[19px] text-[var(--text-muted)] max-w-2xl mx-auto mt-8 leading-relaxed text-pretty hero-fade"
          style={{ animationDelay: "1400ms" }}
        >
          Twelve wisdom traditions — from Jungian psychology to Taoism, Kabbalah,
          Vedanta, the I Ching — cross-reference a single conclusion:{" "}
          <span className="text-[var(--text)]">luck responds to trainable inner states.</span>{" "}
          Luck Lab studies the mechanism. Modern research confirms it.
        </p>

        <div
          className="flex flex-wrap gap-3 justify-center mt-10 hero-fade"
          style={{ animationDelay: "1700ms" }}
        >
          <Link href="/reading" className="btn btn-primary">
            Begin Your Reading
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M3 2l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <Link href="#archetypes" className="btn btn-ghost">
            Meet the six archetypes
          </Link>
          <Link href="#convergence" className="btn btn-ghost">
            Read the research
          </Link>
        </div>

        <p
          className="font-mono text-[11px] text-[var(--text-subtle)] mt-6 tracking-wider inline-flex flex-wrap items-center justify-center gap-3 hero-fade"
          style={{ animationDelay: "2000ms" }}
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full pulse-slow" />
            Tyche is listening
          </span>
          <span>·</span>
          <span>3 minutes · no account · no charge</span>
        </p>
      </div>

      {/* Scroll hint */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-8 text-center pointer-events-none hero-fade"
        style={{ animationDelay: "2300ms" }}
        aria-hidden="true"
      >
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--text-faint)]">
          Scroll
        </div>
        <div className="hero-drop-line mx-auto mt-3" />
      </div>

      {/* Component-local keyframes */}
      <style jsx>{`
        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          to { transform: rotate(-360deg); }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 0.9;  transform: scale(1.08); }
        }
        .hero-line-mask {
          display: inline-block;
          overflow: hidden;
          vertical-align: baseline;
          line-height: 1.08;
        }
        .hero-line-inner {
          display: inline-block;
          transform: translateY(110%);
          animation: riseIn 1.2s cubic-bezier(0.16, 0.84, 0.28, 1) forwards;
        }
        @keyframes riseIn {
          to { transform: translateY(0); }
        }
        .hero-fade {
          opacity: 0;
          animation: heroFade 1s cubic-bezier(0.16, 0.84, 0.28, 1) forwards;
        }
        @keyframes heroFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-drop-line {
          width: 1px;
          height: 36px;
          background: linear-gradient(180deg, var(--gold), transparent);
          transform-origin: top;
          animation: drop 2.4s ease-in-out infinite;
        }
        @keyframes drop {
          0%, 100% { transform: scaleY(0.3); opacity: 0.35; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
