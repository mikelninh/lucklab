/**
 * LuckTest composition — interactive 3-option pick + dramatic reveal.
 * Uses per-slide audio + Whisper word-sync captions.
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

export const LuckTestVideo: React.FC<Props> = ({ script }) => {
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
  switch (slide.type) {
    case "hook":
      return <HookScene slide={slide} />;
    case "question":
      return <QuestionScene slide={slide} />;
    case "countdown":
      return <CountdownScene slide={slide} />;
    case "reveal":
      return <RevealScene slide={slide} />;
    case "cta":
      return <CTAScene slide={slide} />;
    default:
      return null;
  }
};

const HookScene: React.FC<{ slide: Slide }> = ({ slide }) => (
  <AbsoluteFill>
    <Mascot mood={slide.mascotMood} size={340} yPercent={32} />
    <SafeZone bottom>
      <WordSyncCaption
        words={slide.words ?? []}
        fallbackText={slide.text}
        style="pop"
        size={92}
        weight={900}
        serif
        maxWidth={960}
        lineHeight={1.08}
      />
    </SafeZone>
  </AbsoluteFill>
);

const QuestionScene: React.FC<{ slide: Slide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Mascot mood={slide.mascotMood} size={200} yPercent={14} />
      <div style={{ position: "absolute", top: "24%", left: 0, right: 0, textAlign: "center", padding: "0 60px" }}>
        <WordSyncCaption
          words={slide.words ?? []}
          fallbackText={slide.text}
          style="highlight"
          size={72}
          weight={800}
          serif
          maxWidth={940}
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "16%",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 32,
        }}
      >
        {slide.options?.map((opt, i) => {
          const enter = spring({ frame: frame - 10 - i * 8, fps, config: { damping: 12, stiffness: 140 } });
          return (
            <div
              key={i}
              style={{
                width: 230,
                height: 300,
                transform: `scale(${enter}) translateY(${(1 - enter) * 40}px)`,
                opacity: enter,
                background: `linear-gradient(180deg, ${COLORS.bgCard} 0%, ${COLORS.bg} 100%)`,
                border: `2px solid ${COLORS.gold}`,
                borderRadius: 28,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 40px rgba(201,169,97,0.25)",
              }}
            >
              <div style={{ fontSize: 130, lineHeight: 1 }}>{opt.emoji}</div>
              <div
                style={{
                  marginTop: 18,
                  color: COLORS.gold,
                  fontFamily: FONTS.display,
                  fontWeight: 800,
                  fontSize: 34,
                  letterSpacing: "0.08em",
                }}
              >
                {opt.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const CountdownScene: React.FC<{ slide: Slide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 9, stiffness: 220, mass: 0.4 } });
  const exit = interpolate(frame, [slide.durationFrames - 8, slide.durationFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Mascot mood={slide.mascotMood} size={420} />
      <div
        style={{
          position: "absolute",
          fontFamily: FONTS.display,
          fontSize: 380,
          color: COLORS.text,
          fontWeight: 900,
          transform: `scale(${enter})`,
          opacity: exit,
          textShadow: `0 0 50px ${COLORS.gold}`,
        }}
      >
        {slide.text}
      </div>
    </AbsoluteFill>
  );
};

const RevealScene: React.FC<{ slide: Slide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 11, stiffness: 120 } });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: "6%",
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 200,
          transform: `scale(${enter})`,
        }}
      >
        {slide.highlight}
      </div>
      <Mascot mood={slide.mascotMood} size={160} yPercent={32} />
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
            color: COLORS.gold,
            fontFamily: FONTS.display,
            fontWeight: 900,
            fontSize: 94,
            letterSpacing: "0.04em",
            marginBottom: 26,
            opacity: enter,
            transform: `translateY(${(1 - enter) * 20}px)`,
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          {slide.text}
        </div>
        <WordSyncCaption
          words={slide.words ?? []}
          fallbackText={slide.subtext}
          style="highlight"
          size={44}
          weight={600}
          serif
          maxWidth={920}
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
          size={70}
          weight={900}
          maxWidth={920}
        />
        {slide.subtext && (
          <div
            style={{
              marginTop: 30,
              display: "inline-block",
              padding: "18px 40px",
              background: COLORS.gold,
              color: COLORS.bg,
              fontFamily: FONTS.sans,
              fontWeight: 800,
              fontSize: 44,
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

const SafeZone: React.FC<{ children: React.ReactNode; bottom?: boolean }> = ({ children, bottom }) => (
  <div
    style={{
      position: "absolute",
      bottom: bottom ? "22%" : undefined,
      top: bottom ? undefined : "24%",
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      padding: "0 60px",
    }}
  >
    {children}
  </div>
);

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
