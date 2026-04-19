/**
 * LuckType composition — 3 birth-month archetypes per video.
 * Per-slide audio + Whisper word-sync captions.
 */

import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
  staticFile,
} from "remotion";
import type { TikTokScript, Slide } from "../../lib/tiktok-scripts";
import { Mascot } from "../components/Mascot";
import { WordSyncCaption } from "../components/WordSyncCaption";
import { StageBackground } from "../components/StageBackground";
import { COLORS, FONTS } from "../theme";

type Props = { script: TikTokScript };

export const LuckTypeVideo: React.FC<Props> = ({ script }) => {
  let offset = 0;
  const sequences: React.ReactNode[] = [];
  for (let i = 0; i < script.slides.length; i++) {
    const s = script.slides[i];
    sequences.push(
      <Sequence key={i} from={offset} durationInFrames={s.durationFrames}>
        <Scene slide={s} />
        {s.audioPath && <Audio src={staticFile(s.audioPath)} />}
      </Sequence>
    );
    offset += s.durationFrames;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <StageBackground />
      {sequences}
      <BrandHeader />
    </AbsoluteFill>
  );
};

const Scene: React.FC<{ slide: Slide }> = ({ slide }) => {
  if (slide.type === "hook") return <HookScene slide={slide} />;
  if (slide.type === "pause") return <PauseScene slide={slide} />;
  if (slide.type === "reveal") return <MonthReveal slide={slide} />;
  if (slide.type === "cta") return <CTAScene slide={slide} />;
  return null;
};

const HookScene: React.FC<{ slide: Slide }> = ({ slide }) => (
  <AbsoluteFill>
    <Mascot mood={slide.mascotMood} size={320} yPercent={30} />
    <div style={{ position: "absolute", bottom: "18%", left: 0, right: 0, textAlign: "center", padding: "0 60px" }}>
      <WordSyncCaption
        words={slide.words ?? []}
        fallbackText={slide.text}
        style="pop"
        size={90}
        weight={900}
        serif
        maxWidth={960}
        lineHeight={1.08}
      />
      {slide.subtext && (
        <div
          style={{
            marginTop: 28,
            color: COLORS.gold,
            fontFamily: FONTS.sans,
            fontWeight: 800,
            fontSize: 36,
            letterSpacing: "0.02em",
          }}
        >
          {slide.subtext}
        </div>
      )}
    </div>
  </AbsoluteFill>
);

const PauseScene: React.FC<{ slide: Slide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8, slide.durationFrames - 6, slide.durationFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Mascot mood={slide.mascotMood} size={280} />
      <div
        style={{
          position: "absolute",
          bottom: "24%",
          color: COLORS.textMuted,
          fontFamily: FONTS.serif,
          fontStyle: "italic",
          fontSize: 56,
          opacity,
          textShadow: "0 2px 10px rgba(0,0,0,0.5)",
        }}
      >
        {slide.text}
      </div>
    </AbsoluteFill>
  );
};

const MonthReveal: React.FC<{ slide: Slide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12, stiffness: 110 } });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: enter,
          transform: `translateY(${(1 - enter) * 30}px)`,
        }}
      >
        <div
          style={{
            color: COLORS.gold,
            fontFamily: FONTS.display,
            fontWeight: 900,
            fontSize: 70,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          {slide.highlight}
        </div>
      </div>
      <Mascot mood={slide.mascotMood} size={200} yPercent={28} />
      <div
        style={{
          position: "absolute",
          top: "42%",
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 60px",
        }}
      >
        <div
          style={{
            color: COLORS.text,
            fontFamily: FONTS.display,
            fontWeight: 900,
            fontSize: 108,
            lineHeight: 1.02,
            marginBottom: 30,
            opacity: enter,
            textShadow: "0 2px 10px rgba(0,0,0,0.55)",
          }}
        >
          {slide.text}
        </div>
        <WordSyncCaption
          words={slide.words ?? []}
          fallbackText={slide.subtext}
          style="highlight"
          size={42}
          weight={500}
          serif
          maxWidth={900}
          lineHeight={1.3}
        />
      </div>
    </AbsoluteFill>
  );
};

const CTAScene: React.FC<{ slide: Slide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 8) * 0.03;
  return (
    <AbsoluteFill>
      <Mascot mood={slide.mascotMood} size={260} yPercent={28} />
      <div style={{ position: "absolute", bottom: "22%", left: 0, right: 0, textAlign: "center", padding: "0 50px" }}>
        <WordSyncCaption
          words={slide.words ?? []}
          fallbackText={slide.text}
          style="pop"
          size={66}
          weight={900}
          maxWidth={940}
        />
        {slide.subtext && (
          <div
            style={{
              marginTop: 28,
              display: "inline-block",
              padding: "18px 40px",
              background: COLORS.gold,
              color: COLORS.bg,
              fontFamily: FONTS.sans,
              fontWeight: 800,
              fontSize: 42,
              borderRadius: 999,
              letterSpacing: "0.02em",
              transform: `scale(${pulse})`,
            }}
          >
            {slide.subtext}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

const BrandHeader: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 50,
      left: 0,
      right: 0,
      textAlign: "center",
      fontFamily: FONTS.display,
      fontWeight: 900,
      fontSize: 26,
      color: COLORS.gold,
      letterSpacing: "0.4em",
      opacity: 0.65,
    }}
  >
    LUCK · LAB
  </div>
);
