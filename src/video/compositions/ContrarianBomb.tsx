/**
 * ContrarianBomb composition — hot-take myth-buster with study proof.
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

export const ContrarianBombVideo: React.FC<Props> = ({ script }) => {
  let offset = 0;
  const sequences: React.ReactNode[] = [];
  for (let i = 0; i < script.slides.length; i++) {
    const s = script.slides[i];
    sequences.push(
      <Sequence key={i} from={offset} durationInFrames={s.durationFrames}>
        <Scene slide={s} index={i} />
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

const Scene: React.FC<{ slide: Slide; index: number }> = ({ slide, index }) => {
  if (slide.type === "bomb") return <BombScene slide={slide} />;
  if (slide.type === "proof") return <ProofScene slide={slide} />;
  if (slide.type === "pause") return <PauseScene slide={slide} />;
  if (slide.type === "whatworks") return <WhatWorksScene slide={slide} index={index} />;
  if (slide.type === "cta") return <CTAScene slide={slide} />;
  return null;
};

const BombScene: React.FC<{ slide: Slide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const shake = frame < 10 ? Math.sin(frame) * 8 : 0;
  return (
    <AbsoluteFill>
      <Mascot mood={slide.mascotMood} size={260} yPercent={16} />
      <div
        style={{
          position: "absolute",
          top: "34%",
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 50px",
          transform: `translateX(${shake}px)`,
        }}
      >
        <WordSyncCaption
          words={slide.words ?? []}
          fallbackText={slide.text}
          style="pop"
          size={110}
          weight={900}
          maxWidth={980}
          lineHeight={1.05}
        />
      </div>
    </AbsoluteFill>
  );
};

const ProofScene: React.FC<{ slide: Slide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 13, stiffness: 120 } });
  return (
    <AbsoluteFill>
      <Mascot mood={slide.mascotMood} size={200} yPercent={14} />
      <div style={{ position: "absolute", top: "26%", left: 0, right: 0, display: "flex", justifyContent: "center", padding: "0 60px" }}>
        <div
          style={{
            maxWidth: 940,
            background: COLORS.bgCard,
            border: `2px solid ${COLORS.gold}`,
            borderRadius: 22,
            padding: "36px 44px",
            transform: `scale(${enter}) translateY(${(1 - enter) * 30}px)`,
            opacity: enter,
            boxShadow: "0 0 60px rgba(201,169,97,0.18)",
          }}
        >
          <div
            style={{
              color: COLORS.gold,
              fontFamily: FONTS.sans,
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            STUDY
          </div>
          <div
            style={{
              color: COLORS.text,
              fontFamily: FONTS.display,
              fontSize: 48,
              fontWeight: 900,
              lineHeight: 1.12,
              marginBottom: 20,
            }}
          >
            {slide.text}
          </div>
          <WordSyncCaption
            words={slide.words ?? []}
            fallbackText={slide.subtext}
            style="highlight"
            size={36}
            weight={500}
            serif
            maxWidth={840}
            lineHeight={1.32}
            outline={false}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

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
          color: COLORS.gold,
          fontFamily: FONTS.display,
          fontWeight: 900,
          fontSize: 70,
          opacity,
          textShadow: "0 2px 10px rgba(0,0,0,0.5)",
        }}
      >
        {slide.text}
      </div>
    </AbsoluteFill>
  );
};

const WhatWorksScene: React.FC<{ slide: Slide; index: number }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 11, stiffness: 140 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Mascot mood={slide.mascotMood} size={180} yPercent={20} />
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "0 60px",
          gap: 36,
          transform: `translateY(${(1 - enter) * 40}px)`,
          opacity: enter,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.display,
            fontWeight: 900,
            fontSize: 180,
            color: COLORS.gold,
            lineHeight: 1,
            marginTop: -20,
            textShadow: "0 2px 16px rgba(0,0,0,0.5)",
          }}
        >
          {slide.highlight}
        </div>
        <div style={{ maxWidth: 720 }}>
          <WordSyncCaption
            words={slide.words ?? []}
            fallbackText={slide.text}
            style="highlight"
            size={60}
            weight={800}
            lineHeight={1.18}
            maxWidth={720}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CTAScene: React.FC<{ slide: Slide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 8) * 0.03;
  return (
    <AbsoluteFill>
      <Mascot mood={slide.mascotMood} size={240} yPercent={28} />
      <div style={{ position: "absolute", bottom: "22%", left: 0, right: 0, textAlign: "center", padding: "0 50px" }}>
        <WordSyncCaption
          words={slide.words ?? []}
          fallbackText={slide.text}
          style="pop"
          size={72}
          weight={900}
          maxWidth={940}
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
