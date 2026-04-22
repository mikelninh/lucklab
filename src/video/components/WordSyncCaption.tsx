/**
 * WordSyncCaption — word-by-word text reveal synced to Whisper timestamps.
 *
 * v2 — bigger defaults, stronger pop animation, gold glow on active word.
 *
 * Two styles:
 *   "pop"       — words invisible until their startFrame, then slam-in with
 *                 overshoot (scale 0.35 → 1.12 → 1.0). Best for hooks, bombs,
 *                 short reveals. Reads as "actively unfolding".
 *   "highlight" — all words visible; currently-spoken word scales up and
 *                 glows gold. Unstarted words dimmed. Best for long
 *                 instructions, explanations, subtext.
 *
 * Timings are in frames relative to the Sequence start. Each enclosing
 * <Sequence> resets useCurrentFrame() to 0 for its slide.
 */

import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import type { WordTiming } from "../../lib/tiktok-scripts";
import { COLORS, FONTS } from "../theme";

type Props = {
  words: WordTiming[];
  fallbackText?: string;
  style?: "highlight" | "pop";
  size?: number;
  maxWidth?: number;
  color?: string;
  highlightColor?: string;
  weight?: number;
  serif?: boolean;
  lineHeight?: number;
  uppercase?: boolean;
  outline?: boolean;
};

export const WordSyncCaption: React.FC<Props> = ({
  words,
  fallbackText,
  style = "highlight",
  size = 78,
  maxWidth = 960,
  color = COLORS.text,
  highlightColor = COLORS.gold,
  weight = 800,
  serif = false,
  lineHeight = 1.1,
  uppercase = false,
  outline = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!words || words.length === 0) {
    return fallbackText ? (
      <div style={baseStyle({ size, maxWidth, color, weight, serif, lineHeight, uppercase, outline })}>
        {fallbackText}
      </div>
    ) : null;
  }

  return (
    <div style={baseStyle({ size, maxWidth, color, weight, serif, lineHeight, uppercase, outline })}>
      {words.map((w, i) => {
        const isActive = frame >= w.startFrame && frame <= w.endFrame;
        const hasStarted = frame >= w.startFrame;

        if (style === "pop") {
          const sinceStart = frame - w.startFrame;
          // Overshoot: large scale at apex, settles near 1.0
          const popSpring = spring({
            frame: sinceStart,
            fps,
            config: { damping: 9, stiffness: 220, mass: 0.6 },
          });
          // Map [0..1+overshoot] → 0.35 → 1.12 → 1.0
          const scale = 0.35 + popSpring * 0.77;

          if (!hasStarted) {
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: 0,
                  marginRight: "0.26em",
                  // reserve space — prevent layout shift when we slam in
                  visibility: "hidden",
                }}
              >
                {cleanWord(w.text)}
              </span>
            );
          }
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                transform: `scale(${scale}) translateY(${(1 - popSpring) * 18}px)`,
                opacity: Math.min(1, popSpring * 1.4),
                marginRight: "0.26em",
                color: isActive ? highlightColor : color,
                fontWeight: isActive ? 900 : weight,
                textShadow: isActive ? GOLD_GLOW + ", " + (outline ? BLACK_OUTLINE : "") : outline ? BLACK_OUTLINE : "none",
              }}
            >
              {cleanWord(w.text)}
            </span>
          );
        }

        // "highlight" style — all words visible, active pops
        const activeScale = isActive ? 1 + Math.min(1, (frame - w.startFrame) / 5) * 0.12 : 1;
        const dimOpacity = hasStarted ? 1 : 0.32;
        const activeGlow = isActive ? GOLD_GLOW : "";
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.26em",
              color: isActive ? highlightColor : color,
              fontWeight: isActive ? 900 : weight,
              opacity: dimOpacity,
              transform: `scale(${activeScale})`,
              transition: "color 60ms linear, opacity 120ms linear",
              textShadow: [activeGlow, outline ? BLACK_OUTLINE : ""].filter(Boolean).join(", "),
            }}
          >
            {cleanWord(w.text)}
          </span>
        );
      })}
    </div>
  );
};

function cleanWord(w: string): string {
  return w.trim();
}

const GOLD_GLOW =
  "0 0 16px rgba(201,169,97,0.55), 0 0 42px rgba(201,169,97,0.28)";

const BLACK_OUTLINE =
  "0 2px 10px rgba(0,0,0,0.55), 0 0 3px rgba(0,0,0,0.9)";

function baseStyle(p: {
  size: number;
  maxWidth: number;
  color: string;
  weight: number;
  serif: boolean;
  lineHeight: number;
  uppercase: boolean;
  outline: boolean;
}): React.CSSProperties {
  return {
    fontFamily: p.serif ? FONTS.serif : FONTS.display,
    fontWeight: p.weight,
    fontSize: p.size,
    color: p.color,
    textAlign: "center",
    lineHeight: p.lineHeight,
    maxWidth: p.maxWidth,
    margin: "0 auto",
    letterSpacing: "-0.012em",
    textTransform: p.uppercase ? "uppercase" : "none",
    textWrap: "balance" as unknown as React.CSSProperties["whiteSpace"],
    ...(p.outline
      ? {
          WebkitTextStroke: "1.2px rgba(0,0,0,0.72)",
          textShadow: BLACK_OUTLINE,
        }
      : {}),
  };
}
