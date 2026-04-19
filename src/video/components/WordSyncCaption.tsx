/**
 * WordSyncCaption — renders VO text word-by-word with active-word highlight,
 * synced to frame-level timestamps produced by Whisper.
 *
 * Two styles (prop: style):
 *   "highlight" — all words visible, currently-spoken word pops to gold.
 *                 Best for long-form content (instructions, why, subtext).
 *   "pop"       — words invisible until their startFrame, then spring-in.
 *                 Best for punchy hooks, bombs, and short-line reveals.
 *
 * Timings are in *frames relative to the Sequence start* (the enclosing
 * Sequence is per-slide, so frame 0 = slide start). Matches Remotion's
 * useCurrentFrame() inside a Sequence.
 */

import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import type { WordTiming } from "../../lib/tiktok-scripts";
import { COLORS, FONTS } from "../theme";

type Props = {
  words: WordTiming[];
  fallbackText?: string;        // shown if words[] is empty
  style?: "highlight" | "pop";
  size?: number;
  maxWidth?: number;
  color?: string;
  highlightColor?: string;
  weight?: number;
  serif?: boolean;
  lineHeight?: number;
  uppercase?: boolean;
  outline?: boolean;            // black text-outline for silent-watch legibility
};

export const WordSyncCaption: React.FC<Props> = ({
  words,
  fallbackText,
  style = "highlight",
  size = 72,
  maxWidth = 920,
  color = COLORS.text,
  highlightColor = COLORS.gold,
  weight = 800,
  serif = false,
  lineHeight = 1.14,
  uppercase = false,
  outline = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!words || words.length === 0) {
    return fallbackText ? (
      <div
        style={baseStyle({ size, maxWidth, color, weight, serif, lineHeight, uppercase, outline })}
      >
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
          const progress = spring({
            frame: frame - w.startFrame,
            fps,
            config: { damping: 11, stiffness: 180, mass: 0.5 },
          });
          if (!hasStarted) {
            return (
              <span key={i} style={{ display: "inline-block", opacity: 0, marginRight: "0.28em" }}>
                {cleanWord(w.text)}
              </span>
            );
          }
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                transform: `scale(${progress}) translateY(${(1 - progress) * 14}px)`,
                opacity: progress,
                marginRight: "0.28em",
                color: isActive ? highlightColor : color,
                fontWeight: isActive ? 900 : weight,
              }}
            >
              {cleanWord(w.text)}
            </span>
          );
        }

        // "highlight" style — all words visible, active pops
        const activePulse = isActive ? 1 + Math.min(1, (frame - w.startFrame) / 6) * 0.08 : 1;
        const dimOpacity = hasStarted ? 1 : 0.38;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.28em",
              color: isActive ? highlightColor : color,
              fontWeight: isActive ? 900 : weight,
              opacity: dimOpacity,
              transform: `scale(${activePulse})`,
              transition: "color 0.05s",
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
    letterSpacing: "-0.01em",
    textTransform: p.uppercase ? "uppercase" : "none",
    textWrap: "balance" as unknown as React.CSSProperties["whiteSpace"],
    ...(p.outline
      ? {
          WebkitTextStroke: "1px rgba(0,0,0,0.6)",
          textShadow:
            "0 2px 8px rgba(0,0,0,0.45), 0 0 2px rgba(0,0,0,0.6)",
        }
      : {}),
  };
}
