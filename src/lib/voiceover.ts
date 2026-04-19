/**
 * Per-slide ElevenLabs VO + OpenAI Whisper word-level timing.
 *
 * Pipeline per slide:
 *   1. ElevenLabs TTS → public/vo/{scriptId}/{idx}.mp3
 *   2. ffprobe        → audio duration in seconds
 *   3. OpenAI Whisper → word-level timestamps (["hello", 0.12, 0.48], ...)
 *   4. Write durations + words back into script.slides[i]
 *
 * Remotion's <Audio> plays the per-slide mp3 inside each <Sequence>; the
 * compositions render a WordSyncCaption that highlights the currently-spoken
 * word based on the stored timings. That's what gives the viral-tier sync.
 *
 * Caching: mp3 and transcript .json are reused if present and non-empty.
 * Delete `public/vo/{scriptId}/` to force regeneration.
 */

import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { TikTokScript, Slide, WordTiming } from "./tiktok-scripts";

const execFileP = promisify(execFile);

const API_URL = "https://api.elevenlabs.io/v1/text-to-speech";
const STT_URL = "https://api.elevenlabs.io/v1/speech-to-text";

// Brian — deep, resonant, comforting — fits Luck Lab's oracle tone.
const DEFAULT_VOICE_ID = "nPczCjzI2devNBz1zQrb";
const DEFAULT_MODEL = "eleven_multilingual_v2";

const FPS = 30;
const TRAILING_PAD_FRAMES = 10; // 0.33s breath after each slide's audio
const MIN_SLIDE_FRAMES = 30;    // never under 1s even for micro-slides

// ─── Public API ──────────────────────────────────────────────

export async function addVoiceoverTimings(
  script: TikTokScript,
  opts?: { publicDir?: string; voiceId?: string; skipSTT?: boolean }
): Promise<TikTokScript> {
  const elevenKey = process.env.ELEVENLABS_API_KEY;

  if (!elevenKey) {
    console.warn("[voiceover] ELEVENLABS_API_KEY missing — returning script unchanged.");
    return script;
  }

  const voiceId = opts?.voiceId || process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;
  const modelId = process.env.ELEVENLABS_MODEL_ID || DEFAULT_MODEL;
  const publicDir = opts?.publicDir ?? path.join(process.cwd(), "public", "vo");
  const scriptDir = path.join(publicDir, script.id);
  await fs.mkdir(scriptDir, { recursive: true });

  const timedSlides: Slide[] = [];
  let totalFrames = 0;

  for (let i = 0; i < script.slides.length; i++) {
    const slide = script.slides[i];
    const mp3FsPath = path.join(scriptDir, `${i}.mp3`);
    const mp3PublicPath = `/vo/${script.id}/${i}.mp3`;
    const transcriptPath = path.join(scriptDir, `${i}.json`);

    // 1. Generate MP3 (cached)
    if (!(await existsNonEmpty(mp3FsPath))) {
      await generateMp3(slide.voText, mp3FsPath, { apiKey: elevenKey, voiceId, modelId });
    }

    // 2. Get duration
    const audioSeconds = await probeDuration(mp3FsPath);
    const audioFrames = Math.max(MIN_SLIDE_FRAMES, Math.ceil(audioSeconds * FPS) + TRAILING_PAD_FRAMES);

    // 3. Word timings (cached)
    let words: WordTiming[] | undefined;
    if (await existsNonEmpty(transcriptPath)) {
      words = JSON.parse(await fs.readFile(transcriptPath, "utf8"));
    } else if (!opts?.skipSTT) {
      try {
        words = await scribeWords(mp3FsPath, elevenKey);
        await fs.writeFile(transcriptPath, JSON.stringify(words), "utf8");
      } catch (err) {
        console.warn(`[voiceover] STT failed for slide ${i}:`, (err as Error).message);
      }
    }

    // 4. Fall back to even distribution if STT unavailable
    if (!words || words.length === 0) {
      words = evenDistribution(slide.voText, audioSeconds * FPS);
      await fs.writeFile(transcriptPath, JSON.stringify(words), "utf8");
    }

    timedSlides.push({
      ...slide,
      audioPath: mp3PublicPath,
      words,
      durationFrames: audioFrames,
    });
    totalFrames += audioFrames;
  }

  return {
    ...script,
    slides: timedSlides,
    totalDurationFrames: totalFrames,
  };
}

// ─── ElevenLabs ──────────────────────────────────────────────

async function generateMp3(
  text: string,
  fsPath: string,
  { apiKey, voiceId, modelId }: { apiKey: string; voiceId: string; modelId: string }
): Promise<void> {
  const res = await fetch(`${API_URL}/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      "Accept": "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.75,
        style: 0.35,
        use_speaker_boost: true,
      },
      output_format: "mp3_44100_192",
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ElevenLabs ${res.status}: ${body.slice(0, 200)}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(fsPath, buf);
}

// ─── ElevenLabs Scribe (word-level STT) ──────────────────────

async function scribeWords(mp3Path: string, apiKey: string): Promise<WordTiming[]> {
  const form = new FormData();
  const fileBuf = await fs.readFile(mp3Path);
  const blob = new Blob([new Uint8Array(fileBuf)], { type: "audio/mpeg" });
  form.append("file", blob, path.basename(mp3Path));
  form.append("model_id", "scribe_v1");
  form.append("timestamps_granularity", "word");
  form.append("language_code", "en");

  const res = await fetch(STT_URL, {
    method: "POST",
    headers: { "xi-api-key": apiKey },
    body: form,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Scribe ${res.status}: ${body.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    words?: { text: string; start: number; end: number; type?: string }[];
  };
  if (!data.words) return [];

  // Scribe returns punctuation/spacing as separate entries; keep only words.
  return data.words
    .filter((w) => (w.type ?? "word") === "word" && w.text.trim().length > 0)
    .map((w) => ({
      text: w.text,
      startFrame: Math.round(w.start * FPS),
      endFrame: Math.round(w.end * FPS),
    }));
}

// ─── Fallback: even distribution when Whisper unavailable ────

function evenDistribution(text: string, totalFrames: number): WordTiming[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const per = Math.max(6, Math.floor(totalFrames / words.length));
  return words.map((w, i) => ({
    text: w,
    startFrame: i * per,
    endFrame: (i + 1) * per - 1,
  }));
}

// ─── ffprobe ─────────────────────────────────────────────────

async function probeDuration(mp3Path: string): Promise<number> {
  const { stdout } = await execFileP("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    mp3Path,
  ]);
  const d = parseFloat(stdout.trim());
  if (!Number.isFinite(d) || d <= 0) {
    throw new Error(`ffprobe returned invalid duration for ${mp3Path}: "${stdout}"`);
  }
  return d;
}

// ─── utils ───────────────────────────────────────────────────

async function existsNonEmpty(p: string): Promise<boolean> {
  try {
    const s = await fs.stat(p);
    return s.isFile() && s.size > 0;
  } catch {
    return false;
  }
}

// Backwards-compat for any existing callers expecting the old API.
// Synthesizes a joined "script mp3" path for renderers that haven't migrated.
export type LegacyVoiceoverResult = {
  publicPath: string;
  fsPath: string;
  cached: boolean;
};

export async function ensureVoiceover(): Promise<LegacyVoiceoverResult | null> {
  console.warn("[voiceover] ensureVoiceover() is deprecated — use addVoiceoverTimings(script).");
  return null;
}

export { FPS as VO_FPS };
