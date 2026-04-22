#!/usr/bin/env tsx
/**
 * Luck Lab — TikTok Renderer
 *
 *   npm run video:render                    # today's video (rotation)
 *   npm run video:render -- --week          # next 7 days (rotation)
 *   npm run video:render -- --all           # all 4 formats for today
 *   npm run video:render -- --day-streak-all # all 30 DayStreak days
 *   npm run video:render -- --format luck-test
 *   npm run video:render -- --no-vo         # skip ElevenLabs VO generation
 *   npm run video:render -- --date 2026-04-19
 *
 * Per run:
 *   1. Generate script(s) (deterministic per date)
 *   2. Generate ElevenLabs VO mp3 → public/vo/{id}.mp3 (cached)
 *   3. Render MP4 with embedded VO → out/tiktok/{date}-{format}.mp4
 *   4. Write captions/hashtags JSON alongside
 */

import { config as loadEnv } from "dotenv";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
loadEnv({ path: path.resolve(__dirname, "..", ".env.local") });
loadEnv();

import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import {
  generate,
  generateForDate,
  generateAllFormatsForDate,
  generateWeek,
  generateAllDayStreakVariants,
  type TikTokFormat,
  type TikTokScript,
} from "../src/lib/tiktok-scripts";
import { addVoiceoverTimings } from "../src/lib/voiceover";

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "out", "tiktok");
fs.mkdirSync(OUT_DIR, { recursive: true });

const FORMAT_TO_COMP: Record<TikTokFormat, string> = {
  "luck-test": "LuckTest",
  "luck-type": "LuckType",
  "contrarian-bomb": "ContrarianBomb",
  "day-streak": "DayStreak",
};

const args = process.argv.slice(2);
const isWeek = args.includes("--week");
const isAll = args.includes("--all");
const isStreakAll = args.includes("--day-streak-all");
const noVo = args.includes("--no-vo");
const formatFlag = args.find((_, i) => args[i - 1] === "--format") as TikTokFormat | undefined;
const dateFlag = args.find((_, i) => args[i - 1] === "--date");

const targetDate = dateFlag ? new Date(dateFlag) : new Date();

function dateLabel(d: Date): string {
  return d.toISOString().slice(0, 10);
}

type Job = { script: TikTokScript; date: Date; compId: string };

function buildJobs(): Job[] {
  if (isStreakAll) {
    // 30 DayStreak videos, one per day, same render date on all.
    return generateAllDayStreakVariants().map((script) => ({
      script,
      date: targetDate,
      compId: FORMAT_TO_COMP["day-streak"],
    }));
  }
  if (isWeek) {
    return generateWeek(targetDate).map((script, i) => {
      const d = new Date(targetDate);
      d.setDate(d.getDate() + i);
      return { script, date: d, compId: FORMAT_TO_COMP[script.format] };
    });
  }
  if (isAll) {
    return generateAllFormatsForDate(targetDate).map((script) => ({
      script,
      date: targetDate,
      compId: FORMAT_TO_COMP[script.format],
    }));
  }
  if (formatFlag && formatFlag in FORMAT_TO_COMP) {
    const seed = targetDate.getFullYear() * 10000 + (targetDate.getMonth() + 1) * 100 + targetDate.getDate();
    const script = generate(formatFlag, seed);
    return [{ script, date: targetDate, compId: FORMAT_TO_COMP[formatFlag] }];
  }
  const script = generateForDate(targetDate);
  return [{ script, date: targetDate, compId: FORMAT_TO_COMP[script.format] }];
}

async function main() {
  console.log("\n🎬  Luck Lab TikTok Renderer\n");

  const jobs = buildJobs();
  console.log(`Planning ${jobs.length} video(s) for ${dateLabel(targetDate)}${isWeek ? " + next 6 days" : ""}${noVo ? " (no VO)" : ""}\n`);

  // 1. Enrich each script with per-slide audio + word timings BEFORE bundling,
  //    so the webpack bundler copies public/vo/* into the render bundle.
  if (!noVo) {
    console.log("🎙️  Generating per-slide VO + Whisper word timings…");
    for (let i = 0; i < jobs.length; i++) {
      try {
        jobs[i].script = await addVoiceoverTimings(jobs[i].script);
        console.log(`    ✓ ${jobs[i].script.id} (${jobs[i].script.slides.length} slides, ${(jobs[i].script.totalDurationFrames / 30).toFixed(1)}s)`);
      } catch (err) {
        console.error(`    ❌ ${jobs[i].script.id}:`, (err as Error).message);
      }
      await new Promise((r) => setTimeout(r, 200));
    }
    console.log("");
  }

  // 2. Bundle AFTER VOs exist — the webpack bundler copies public/ at bundle time.
  console.log("📦  Bundling Remotion project…");
  const bundled = await bundle({
    entryPoint: path.join(ROOT, "src", "video", "index.ts"),
    webpackOverride: (config) => config,
  });
  console.log("");

  const captionsDir = path.join(OUT_DIR, "captions");
  fs.mkdirSync(captionsDir, { recursive: true });

  // 3. Render each video.
  for (const { script, date, compId } of jobs) {
    // DayStreak videos in the 30-day series share a date, so disambiguate by
    // extracting the day number from `title` (format: "Day N/30 — Ritual name").
    let label = `${dateLabel(date)}-${script.format}`;
    if (script.format === "day-streak") {
      const m = script.title.match(/Day (\d+)\/30/);
      if (m) label = `${dateLabel(date)}-day-streak-${m[1].padStart(2, "0")}`;
    }
    const outputPath = path.join(OUT_DIR, `${label}.mp4`);
    const captionPath = path.join(captionsDir, `${label}.txt`);
    const hasVo = script.slides.some((s) => s.audioPath);

    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

    console.log(`  ▶  Rendering ${label}${hasVo ? " (word-synced VO)" : " (silent)"}…`);
    const composition = await selectComposition({
      serveUrl: bundled,
      id: compId,
      inputProps: { script },
    });

    await renderMedia({
      composition: { ...composition, durationInFrames: script.totalDurationFrames },
      serveUrl: bundled,
      codec: "h264",
      outputLocation: outputPath,
      inputProps: { script },
    });

    fs.writeFileSync(captionPath, script.caption, "utf8");
    console.log(`  ✓ ${label}.mp4  ·  caption → ${label}.txt\n`);
  }

  // 4. Summary JSON
  const summary = jobs.map(({ script, date }) => ({
    date: dateLabel(date),
    format: script.format,
    id: script.id,
    title: script.title,
    durationSec: script.totalDurationFrames / 30,
    slides: script.slides.length,
    hashtags: script.hashtags,
  }));
  const summaryPath = path.join(OUT_DIR, `summary-${dateLabel(targetDate)}.json`);
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), "utf8");
  console.log(`📋  Summary → ${summaryPath}\n`);
  console.log(`✅ Done. ${jobs.length} video(s) in ${OUT_DIR}\n`);
  console.log("Next: upload to TikTok + drop a trending audio on top.\n");
}

main().catch((err) => {
  console.error("❌ Render failed:", err);
  process.exit(1);
});
