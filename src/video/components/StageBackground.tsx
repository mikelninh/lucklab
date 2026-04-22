/**
 * StageBackground — matches the website's HeroCelestial atmosphere.
 *
 * Three layers, bottom to top:
 *   1. Near-black base with radial purple + bottom-gold atmospheric gradients
 *   2. Animated starfield (deterministic — same seed every render, twinkle
 *      per frame like the website's canvas)
 *   3. Top + bottom vignette for caption readability
 *
 * Mirrors the feel of lucklab.app's hero so video + site read as one brand.
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

// Deterministic pseudo-random (seeded) — stars don't move across renders.
function rng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Pre-compute ~130 stars at module load — covers a 1080x1920 frame well.
type Star = { x: number; y: number; r: number; a: number; tw: number; warm: boolean };
const STARS: Star[] = (() => {
  const r = rng(4242);
  const count = 130;
  const out: Star[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      x: r() * 100,
      y: r() * 100,
      r: (r() * 1.4 + 0.3) * 0.12,  // in viewBox units (0-100 wide)
      a: 0.25 + r() * 0.75,
      tw: r() * Math.PI * 2,
      warm: r() > 0.88,             // 12% of stars lean gold, rest pale blue-white
    });
  }
  return out;
})();

export const StageBackground: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Atmospheric gradients — same palette as website's hero layer 2 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: [
            "radial-gradient(ellipse at 50% 28%, rgba(167,139,250,0.14), transparent 55%)",
            "radial-gradient(ellipse at 50% 100%, " + COLORS.bg + ", transparent 50%)",
            "linear-gradient(180deg, transparent 55%, " + COLORS.bg + " 100%)",
          ].join(","),
        }}
      />

      {/* Starfield — deterministic positions, per-frame twinkle */}
      <svg
        viewBox="0 0 100 177.778"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.8,
        }}
        aria-hidden="true"
      >
        {STARS.map((s, i) => {
          // Twinkle: sin wave per star, phase offset by star's seed.
          const flicker = 0.5 + Math.sin(frame * 0.04 + s.tw) * 0.5;
          const alpha = s.a * (0.35 + flicker * 0.65);
          const fill = flicker > 0.88 || s.warm ? "#f2e4b4" : "#dce4ff";
          return (
            <circle
              key={i}
              cx={s.x}
              cy={s.y * 1.77778}  // stretch vertical to 1080x1920 aspect
              r={s.r}
              fill={fill}
              opacity={alpha}
            />
          );
        })}
      </svg>

      {/* Soft gold dust near centre — carried over, subtler than before */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.5,
        }}
        aria-hidden="true"
      >
        {GOLD_DUST.map((d, i) => {
          const drift = Math.sin(frame * d.s * 0.02 + i) * 1.2;
          const pulse = 0.18 + Math.sin(frame * 0.03 + i * 0.7) * 0.1;
          return (
            <circle
              key={i}
              cx={d.x + drift}
              cy={d.y}
              r={d.r / 14}
              fill={COLORS.gold}
              opacity={pulse}
            />
          );
        })}
      </svg>

      {/* Top + bottom vignette for caption readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0) 78%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

const GOLD_DUST = [
  { x: 18, y: 22, r: 1.6, s: 0.1 },
  { x: 42, y: 68, r: 1.2, s: 0.08 },
  { x: 72, y: 30, r: 2.0, s: 0.13 },
  { x: 88, y: 82, r: 1.0, s: 0.09 },
  { x: 28, y: 88, r: 1.4, s: 0.11 },
  { x: 62, y: 16, r: 1.8, s: 0.07 },
  { x: 8,  y: 60, r: 1.1, s: 0.12 },
  { x: 94, y: 48, r: 1.3, s: 0.14 },
  { x: 50, y: 50, r: 0.8, s: 0.16 },
  { x: 34, y: 36, r: 1.2, s: 0.1 },
];
