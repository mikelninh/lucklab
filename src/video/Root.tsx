import React from "react";
import { Composition } from "remotion";
import { LuckTestVideo } from "./compositions/LuckTest";
import { LuckTypeVideo } from "./compositions/LuckType";
import { ContrarianBombVideo } from "./compositions/ContrarianBomb";
import { DayStreakVideo } from "./compositions/DayStreak";
import { VIDEO } from "./theme";
import { generate, type TikTokScript } from "../lib/tiktok-scripts";

const PREVIEW_DATE = new Date();

function dateSeed(d: Date): number {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

const seed = dateSeed(PREVIEW_DATE);
const previewLuckTest = generate("luck-test", seed);
const previewLuckType = generate("luck-type", seed);
const previewBomb = generate("contrarian-bomb", seed);
const previewDayStreak = generate("day-streak", seed);

type CalcProps = { script: TikTokScript; voPath?: string };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="LuckTest"
      component={LuckTestVideo as React.ComponentType<Record<string, unknown>>}
      durationInFrames={previewLuckTest.totalDurationFrames}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
      defaultProps={{ script: previewLuckTest } as CalcProps}
      calculateMetadata={({ props }) => ({
        durationInFrames: (props as CalcProps).script.totalDurationFrames,
      })}
    />
    <Composition
      id="LuckType"
      component={LuckTypeVideo as React.ComponentType<Record<string, unknown>>}
      durationInFrames={previewLuckType.totalDurationFrames}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
      defaultProps={{ script: previewLuckType } as CalcProps}
      calculateMetadata={({ props }) => ({
        durationInFrames: (props as CalcProps).script.totalDurationFrames,
      })}
    />
    <Composition
      id="ContrarianBomb"
      component={ContrarianBombVideo as React.ComponentType<Record<string, unknown>>}
      durationInFrames={previewBomb.totalDurationFrames}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
      defaultProps={{ script: previewBomb } as CalcProps}
      calculateMetadata={({ props }) => ({
        durationInFrames: (props as CalcProps).script.totalDurationFrames,
      })}
    />
    <Composition
      id="DayStreak"
      component={DayStreakVideo as React.ComponentType<Record<string, unknown>>}
      durationInFrames={previewDayStreak.totalDurationFrames}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
      defaultProps={{ script: previewDayStreak } as CalcProps}
      calculateMetadata={({ props }) => ({
        durationInFrames: (props as CalcProps).script.totalDurationFrames,
      })}
    />
  </>
);
