/**
 * HypeCaption — word-by-word caption animation, TikTok style.
 *
 * Words snap in sequentially, scale-spring on arrival. A highlighted word gets
 * gold colour and a stronger pop. Designed to sit over the mascot.
 *
 * Props:
 *   text        — caption text
 *   highlight   — word or phrase to pop in gold (case-sensitive substring match)
 *   durationFrames — how long the caption is on screen
 *   size        — base font size
 *   maxWidth    — px width to wrap inside
 *   mode        — "hype" per-word or "solid" whole-block
 */

import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../theme";

type Props = {
  text: string;
  highlight?: string;
  durationFrames: number;
  size?: number;
  maxWidth?: number;
  mode?: "hype" | "solid";
  weight?: number;
  lineHeight?: number;
  serif?: boolean;
  color?: string;
};

export const HypeCaption: React.FC<Props> = ({
  text,
  highlight,
  durationFrames,
  size = 78,
  maxWidth = 880,
  mode = "hype",
  weight = 800,
  lineHeight = 1.12,
  serif = false,
  color = COLORS.text,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(" ");

  const fadeOut = interpolate(
    frame,
    [durationFrames - 10, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (mode === "solid") {
    const opacity = interpolate(frame, [0, 8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * fadeOut;
    return (
      <div
        style={{
          fontFamily: serif ? FONTS.serif : FONTS.display,
          fontWeight: weight,
          fontSize: size,
          color,
          textAlign: "center",
          lineHeight,
          maxWidth,
          opacity,
          letterSpacing: "-0.01em",
          textWrap: "balance",
        }}
      >
        {highlightText(text, highlight)}
      </div>
    );
  }

  // Hype mode: word-by-word entry
  const perWordFrames = Math.max(3, Math.floor((durationFrames - 20) / Math.max(words.length, 1)));

  return (
    <div
      style={{
        fontFamily: serif ? FONTS.serif : FONTS.display,
        fontWeight: weight,
        fontSize: size,
        color,
        textAlign: "center",
        lineHeight,
        maxWidth,
        letterSpacing: "-0.01em",
        textWrap: "balance",
        opacity: fadeOut,
      }}
    >
      {words.map((word, i) => {
        const wordStart = i * perWordFrames;
        const progress = spring({
          frame: frame - wordStart,
          fps,
          config: { damping: 11, stiffness: 180, mass: 0.5 },
        });
        const isHighlight = highlight && word.toLowerCase().replace(/[.,!?]/g, "").includes(highlight.toLowerCase().replace(/[.,!?]/g, ""));
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `scale(${progress}) translateY(${(1 - progress) * 14}px)`,
              opacity: progress,
              marginRight: "0.28em",
              color: isHighlight ? COLORS.gold : color,
              fontWeight: isHighlight ? 900 : weight,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

function highlightText(text: string, highlight?: string): React.ReactNode {
  if (!highlight) return text;
  const idx = text.toLowerCase().indexOf(highlight.toLowerCase());
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color: COLORS.gold, fontWeight: 900 }}>
        {text.slice(idx, idx + highlight.length)}
      </span>
      {text.slice(idx + highlight.length)}
    </>
  );
}
