/**
 * DayStreak composition — "Day X/30" ritual series.
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

export const DayStreakVideo: React.FC<Props> = ({ script }) => {
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
  if (slide.type === "daycounter") return <DayCounterScene slide={slide} />;
  if (slide.type === "ritual") return <RitualScene slide={slide} index={index} />;
  if (slide.type === "why") return <WhyScene slide={slide} />;
  if (slide.type === "cta") return <CTAScene slide={slide} />;
  return null;
};

const DayCounterScene: React.FC<{ slide: Slide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 10, stiffness: 140 } });
  return (
    <AbsoluteFill>
      <Mascot mood={slide.mascotMood} size={260} yPercent={20} />
      <div style={{ position: "absolute", top: "44%", left: 0, right: 0, textAlign: "center" }}>
        <div
          style={{
            color: COLORS.gold,
            fontFamily: FONTS.display,
            fontWeight: 900,
            fontSize: 200,
            letterSpacing: "-0.02em",
            lineHeight: 0.95,
            transform: `scale(${enter})`,
            textShadow: "0 2px 18px rgba(0,0,0,0.5)",
          }}
        >
          {slide.text}
        </div>
        {slide.subtext && (
          <div
            style={{
              marginTop: 28,
              color: COLORS.text,
              fontFamily: FONTS.serif,
              fontStyle: "italic",
              fontSize: 42,
              opacity: enter,
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            {slide.subtext}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

const RitualScene: React.FC<{ slide: Slide; index: number }> = ({ slide }) => {
  const isName = slide.text.length < 40;
  if (isName) {
    return (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Mascot mood={slide.mascotMood} size={240} yPercent={26} />
        <div
          style={{
            position: "absolute",
            bottom: "24%",
            left: 0,
            right: 0,
            textAlign: "center",
            padding: "0 60px",
          }}
        >
          <WordSyncCaption
            words={slide.words ?? []}
            fallbackText={slide.text}
            style="pop"
            size={96}
            weight={900}
            maxWidth={960}
            lineHeight={1.06}
            uppercase
          />
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Mascot mood={slide.mascotMood} size={200} yPercent={16} />
      <div style={{ position: "absolute", top: "36%", left: 0, right: 0, textAlign: "center", padding: "0 70px" }}>
        <WordSyncCaption
          words={slide.words ?? []}
          fallbackText={slide.text}
          style="highlight"
          size={54}
          weight={700}
          serif
          maxWidth={940}
          lineHeight={1.3}
        />
      </div>
    </AbsoluteFill>
  );
};

const WhyScene: React.FC<{ slide: Slide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });
  return (
    <AbsoluteFill>
      <Mascot mood={slide.mascotMood} size={200} yPercent={14} />
      <div style={{ position: "absolute", top: "28%", left: 0, right: 0, display: "flex", justifyContent: "center", padding: "0 60px" }}>
        <div
          style={{
            maxWidth: 940,
            background: COLORS.bgCard,
            border: `2px solid ${COLORS.gold}`,
            borderRadius: 22,
            padding: "40px 48px",
            transform: `scale(${enter})`,
            opacity: enter,
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
              marginBottom: 18,
            }}
          >
            {slide.text}
          </div>
          <WordSyncCaption
            words={slide.words ?? []}
            fallbackText={slide.subtext}
            style="highlight"
            size={38}
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

const CTAScene: React.FC<{ slide: Slide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 8) * 0.03;
  return (
    <AbsoluteFill>
      <Mascot mood={slide.mascotMood} size={240} yPercent={26} />
      <div style={{ position: "absolute", bottom: "22%", left: 0, right: 0, textAlign: "center", padding: "0 50px" }}>
        <WordSyncCaption
          words={slide.words ?? []}
          fallbackText={slide.text}
          style="pop"
          size={62}
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
