/**
 * Ambient vignette + slow drifting dust for every composition.
 * Keeps the mascot visually centered without busy background noise.
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

const DUST_SEED = [
  { x: 8,  y: 15, r: 1.8, s: 0.12 },
  { x: 22, y: 74, r: 1.2, s: 0.08 },
  { x: 38, y: 30, r: 2.4, s: 0.15 },
  { x: 54, y: 88, r: 1.0, s: 0.10 },
  { x: 68, y: 22, r: 2.0, s: 0.09 },
  { x: 82, y: 60, r: 1.6, s: 0.13 },
  { x: 92, y: 40, r: 1.4, s: 0.07 },
  { x: 12, y: 92, r: 2.2, s: 0.11 },
  { x: 44, y: 56, r: 0.9, s: 0.16 },
  { x: 76, y: 82, r: 1.7, s: 0.09 },
  { x: 28, y: 42, r: 1.3, s: 0.14 },
  { x: 60, y: 10, r: 2.0, s: 0.10 },
  { x: 4,  y: 50, r: 1.1, s: 0.12 },
  { x: 98, y: 78, r: 1.8, s: 0.08 },
  { x: 50, y: 68, r: 1.4, s: 0.13 },
];

export const StageBackground: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 42%, ${COLORS.bgCard} 0%, ${COLORS.bg} 78%)`,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {DUST_SEED.map((d, i) => {
          const drift = Math.sin(frame * d.s * 0.02 + i) * 2;
          const pulse = 0.25 + Math.sin(frame * 0.04 + i * 0.7) * 0.15;
          return (
            <circle
              key={i}
              cx={d.x + drift}
              cy={d.y}
              r={d.r / 10}
              fill={COLORS.gold}
              opacity={pulse}
            />
          );
        })}
      </svg>
      {/* Top + bottom vignette for readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0) 82%, rgba(0,0,0,0.4) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
