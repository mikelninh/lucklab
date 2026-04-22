/**
 * Tyche sigil — ported from `src/components/HeroCelestial.tsx`.
 *
 * The videos now share the website's visual identity: two concentric rings
 * counter-rotating, cardinal tick marks on the outer ring, cross + diagonals
 * on the inner ring, a soft gold breathing halo, and a small white centre
 * inside a gold dot. Mood still modulates — speed, glow, subtle tilt — but
 * the silhouette is consistent with the landing page.
 *
 * Props retained for compatibility with existing composition callers.
 */

import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import type { MascotMood } from "../../lib/tiktok-scripts";
import { COLORS } from "../theme";

type Props = {
  mood: MascotMood;
  size?: number;
  xPercent?: number;
  yPercent?: number;
  entryFrame?: number;
};

export const Mascot: React.FC<Props> = ({
  mood,
  size = 380,
  xPercent = 50,
  yPercent = 50,
  entryFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - entryFrame;

  if (mood === "hidden") return null;

  // Entry with a spring — same shape as website's fade-in.
  const entryProgress = spring({
    frame: local,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Rotation rates (frames per full turn). Website uses 90s + 60s reverse.
  // At 30fps: 90s = 2700 frames, 60s = 1800 frames.
  const rotationBaseMultiplier =
    mood === "sharp" ? 2.6 : mood === "curious" ? 1.4 : mood === "flash" ? 3 : mood === "warm" ? 0.7 : 1;
  const outerDeg = ((local * 0.133) * rotationBaseMultiplier) % 360;      // ~90s / rev
  const innerDeg = ((local * -0.2) * rotationBaseMultiplier) % 360;       // ~60s / rev (reverse)

  // Breath — drives the glow radius (mirrors the website `breathe` keyframe).
  const breathPhase = Math.sin((local / 90) * Math.PI * 2);               // 6s period @ 30fps
  const breathAmt = 0.5 + breathPhase * 0.5;

  // Mood-specific glow intensity
  const baseGlowOpacity =
    mood === "sharp"
      ? 0.55
      : mood === "warm"
      ? 0.45
      : mood === "flash"
      ? 0.8
      : mood === "wise"
      ? 0.3
      : 0.38;
  const glowOpacity = baseGlowOpacity * (0.65 + breathAmt * 0.35);

  // Flash mood = instantaneous additive pulse in the first ~20 frames
  const flashPulse = mood === "flash" ? Math.max(0, 1 - local / 20) : 0;

  // Subtle tilt on "curious"
  const tilt = mood === "curious" ? Math.sin(local / 40) * 4 : 0;

  // Colour shift for warm vs sharp
  const dotCore = mood === "warm" ? "#ffd98a" : mood === "sharp" ? "#fff3b8" : "#e6c87a";

  const totalScale = entryProgress;

  // Tick & ring opacities (website uses 0.32 / 0.18 / 0.48 / 0.28 / 0.4).
  const outerRingOpacity = mood === "sharp" ? 0.48 : 0.32;
  const innerRingOpacity = 0.18;
  const tickOpacity = mood === "sharp" ? 0.7 : 0.48;
  const midRingOpacity = 0.28;
  const crossOpacity = mood === "sharp" ? 0.6 : 0.4;

  return (
    <div
      style={{
        position: "absolute",
        left: `${xPercent}%`,
        top: `${yPercent}%`,
        transform: `translate(-50%, -50%) rotate(${tilt}deg) scale(${totalScale})`,
        width: size,
        height: size,
        pointerEvents: "none",
      }}
    >
      {/* Breathing gold glow behind the sigil */}
      <div
        style={{
          position: "absolute",
          inset: "-12%",
          background: `radial-gradient(circle, rgba(201,169,97,${(0.32 + flashPulse * 0.5).toFixed(
            3
          )}), transparent 55%)`,
          filter: "blur(18px)",
          opacity: glowOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Outer ring + cardinal ticks (rotates slowly, same direction as website) */}
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        style={{
          position: "absolute",
          inset: 0,
          transform: `rotate(${outerDeg}deg)`,
          overflow: "visible",
        }}
        aria-hidden="true"
      >
        <circle
          cx="100"
          cy="100"
          r="98"
          fill="none"
          stroke={`rgba(201,169,97,${outerRingOpacity})`}
          strokeWidth="1"
        />
        <circle
          cx="100"
          cy="100"
          r="82"
          fill="none"
          stroke={`rgba(201,169,97,${innerRingOpacity})`}
          strokeWidth="1"
        />
        <g stroke={`rgba(201,169,97,${tickOpacity})`} strokeWidth="1">
          <line x1="100" y1="2" x2="100" y2="20" />
          <line x1="100" y1="180" x2="100" y2="198" />
          <line x1="2" y1="100" x2="20" y2="100" />
          <line x1="180" y1="100" x2="198" y2="100" />
        </g>
      </svg>

      {/* Inner cross + diagonals (counter-rotates) */}
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        style={{
          position: "absolute",
          inset: 0,
          transform: `rotate(${innerDeg}deg)`,
          overflow: "visible",
        }}
        aria-hidden="true"
      >
        <circle
          cx="100"
          cy="100"
          r="60"
          fill="none"
          stroke={`rgba(201,169,97,${midRingOpacity})`}
          strokeWidth="1"
        />
        <g stroke={`rgba(201,169,97,${crossOpacity})`} strokeLinecap="round">
          <line x1="100" y1="40" x2="100" y2="160" strokeWidth="1.2" />
          <line x1="40" y1="100" x2="160" y2="100" strokeWidth="1.2" />
          <line x1="58" y1="58" x2="142" y2="142" strokeWidth="1" />
          <line x1="142" y1="58" x2="58" y2="142" strokeWidth="1" />
        </g>
      </svg>

      {/* Static centre dot — not rotating, the calm axis of the sigil */}
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
        aria-hidden="true"
      >
        <circle cx="100" cy="100" r="8" fill={dotCore} fillOpacity="0.9" />
        <circle cx="100" cy="100" r="3" fill="#ffffff" />
        {/* Flash overlay — briefly washes the sigil white on countdown hits */}
        {flashPulse > 0 && (
          <circle
            cx="100"
            cy="100"
            r="100"
            fill="#ffffff"
            opacity={flashPulse * 0.5}
          />
        )}
      </svg>
    </div>
  );
};
