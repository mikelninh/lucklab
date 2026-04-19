/**
 * Fortuna — the Luck Lab oracle mascot.
 *
 * A glowing gold orb with an inner eye, wrapped in luck-particles.
 * Pure SVG + Remotion interpolation, no external assets.
 *
 * Moods change behaviour:
 *   curious → head-tilt, particles cluster toward viewer
 *   wise    → slow steady breath, balanced particles in an arc
 *   sharp   → flicker / strobe, particles spike outward
 *   warm    → amber-shifted glow, particles drift gently
 *   hidden  → off-screen (used during full-screen reveals)
 *   flash   → single bright pulse (used on countdown hits)
 */

import React from "react";
import { useCurrentFrame, interpolate, useVideoConfig, spring } from "remotion";
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

  // Entry animation
  const entryProgress = spring({
    frame: local,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Breathing pulse (mood-specific)
  const breathSpeed =
    mood === "sharp" ? 8 : mood === "curious" ? 30 : mood === "warm" ? 45 : mood === "flash" ? 4 : 60;
  const breath = Math.sin((local / breathSpeed) * Math.PI * 2);
  const baseScale = mood === "sharp" ? 1 + breath * 0.06 : 1 + breath * 0.03;

  // Flash mood = strong bright pulse
  const flashPulse = mood === "flash" ? Math.max(0, 1 - local / 20) : 0;

  // Colour shift for warm vs sharp
  const orbCore = mood === "warm" ? "#ffd98a" : mood === "sharp" ? "#fff3b8" : "#ffe8a0";
  const orbMid = mood === "warm" ? "#e0b972" : COLORS.gold;
  const orbRim = mood === "warm" ? "#8a6d2f" : COLORS.goldDim;

  // Tilt for curious mood
  const tilt = mood === "curious" ? Math.sin(local / 40) * 6 : 0;

  const totalScale = entryProgress * baseScale;
  const glowOpacity = 0.35 + breath * 0.1 + flashPulse * 0.4;

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
      <svg
        viewBox="0 0 400 400"
        width={size}
        height={size}
        style={{ overflow: "visible" }}
      >
        <defs>
          <radialGradient id="orbGrad" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor={orbCore} stopOpacity="1" />
            <stop offset="55%" stopColor={orbMid} stopOpacity="1" />
            <stop offset="100%" stopColor={orbRim} stopOpacity="1" />
          </radialGradient>
          <radialGradient id="haloGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COLORS.gold} stopOpacity={glowOpacity} />
            <stop offset="100%" stopColor={COLORS.gold} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="innerShine" cx="40%" cy="35%" r="25%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer halo */}
        <circle cx="200" cy="200" r="190" fill="url(#haloGrad)" />

        {/* Orb */}
        <circle
          cx="200"
          cy="200"
          r="120"
          fill="url(#orbGrad)"
          stroke={COLORS.goldDim}
          strokeWidth="1.5"
          opacity="0.98"
        />

        {/* Inner almond eye */}
        <g transform="translate(200,205)">
          <ellipse cx="0" cy="0" rx="52" ry="28" fill={COLORS.bg} opacity="0.9" />
          <circle cx="0" cy="0" r="14" fill={COLORS.gold} />
          <circle cx="0" cy="0" r="6" fill={COLORS.bg} />
          {/* Mood-specific eye detail */}
          {mood === "sharp" && (
            <path d="M -52 0 L 52 0" stroke={COLORS.gold} strokeWidth="1.2" opacity="0.6" />
          )}
          {mood === "wise" && (
            <>
              <circle cx="0" cy="0" r="20" fill="none" stroke={COLORS.gold} strokeWidth="0.8" opacity="0.5" />
              <circle cx="0" cy="0" r="28" fill="none" stroke={COLORS.gold} strokeWidth="0.5" opacity="0.3" />
            </>
          )}
        </g>

        {/* Specular highlight */}
        <circle cx="160" cy="160" r="35" fill="url(#innerShine)" />

        {/* Flash overlay */}
        {flashPulse > 0 && (
          <circle cx="200" cy="200" r="200" fill="#fff" opacity={flashPulse * 0.6} />
        )}
      </svg>

      {/* Orbit particles */}
      <ParticleRing mood={mood} frame={local} size={size} />
    </div>
  );
};

const ParticleRing: React.FC<{ mood: MascotMood; frame: number; size: number }> = ({
  mood,
  frame,
  size,
}) => {
  const count = mood === "sharp" ? 18 : mood === "curious" ? 14 : 12;
  const speed = mood === "sharp" ? 0.06 : mood === "warm" ? 0.015 : 0.025;
  const radius = size * (mood === "sharp" ? 0.7 : 0.55);

  const particles = Array.from({ length: count }, (_, i) => {
    const baseAngle = (i / count) * Math.PI * 2;
    const angle = baseAngle + frame * speed;

    // Curious: cluster toward bottom (viewer)
    const clusterBias =
      mood === "curious" ? Math.cos(angle - Math.PI / 2) * 30 : 0;

    // Sharp: explosive outward pulse
    const sharpKick = mood === "sharp" ? (frame % 30) * 1.5 : 0;

    const r = radius + clusterBias + sharpKick + Math.sin(frame / 30 + i) * 8;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;

    const opacity = 0.35 + Math.sin(frame / 20 + i * 0.7) * 0.25;
    const dotSize = mood === "sharp" ? 5 : 3 + (i % 3);

    return (
      <circle
        key={i}
        cx={size / 2 + x}
        cy={size / 2 + y}
        r={dotSize}
        fill={COLORS.gold}
        opacity={opacity}
      />
    );
  });

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}
    >
      {particles}
    </svg>
  );
};
