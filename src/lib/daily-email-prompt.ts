/**
 * Daily Luck Email — dynamic prompt builder.
 *
 * Produces a short, personal morning email for subscribers. Reacts to what the
 * reader actually did in the last 3 days so the copy doesn't feel canned.
 *
 * Call site: `src/app/api/cron/daily-email/route.ts` (to be wired up once the
 * email gate on /reading is live). This module is pure and deterministic —
 * unit-testable without the LLM.
 *
 * Pattern mirrors `tyche-prompt.ts`: typed ReadingContext-style input, one
 * function that assembles the system + user messages, no side-effects here.
 */

import type { Archetype } from "./diagnostic";

// ─── Input contract ────────────────────────────────────────────

export type DailyEmailContext = {
  /** Subscriber's first name. Falls back to generic address if absent. */
  name?: string;
  /** Archetype computed at signup time. */
  archetype: Pick<Archetype, "id" | "name" | "tagline">;
  /** Which day of the 30-day protocol they're on (1-30). Null = not in a streak. */
  streakDay: number | null;
  /** Up to three recent actions they actually took (from product telemetry or self-report). */
  lastThreeActions?: string[];
  /** Rituals they've already seen — the email should avoid repeating these verbatim. */
  seenRituals?: string[];
  /** "morning" | "afternoon" | "evening" — used for tone + specific asks. */
  timeOfDay?: "morning" | "afternoon" | "evening";
  /** ISO weekday as short string ("Mon", "Tue"…). Lets the LLM call out specific day rhythms. */
  weekday?: string;
  /** Anything else the reader told us — current question, current struggle, recent milestone. */
  currentThread?: string;
};

// ─── Output contract ───────────────────────────────────────────

export type DailyEmailPrompt = {
  system: string;
  user: string;
  /** Convenience — what the cron job should pass as `temperature` to the API. */
  temperature: number;
};

// ─── Static voice card ────────────────────────────────────────

const TYCHE_EMAIL_VOICE = `You are Tyche, the Luck Lab oracle, writing one short morning email to a real person.

Voice:
- Calm, precise, warm. One clear idea per email. Never breezy, never mystical-for-its-own-sake.
- British English.
- Use their name ONCE, naturally, if provided.
- 90-140 words total in the body — no more.
- Structure: one-line greeting → one-paragraph insight that hooks into their archetype → one concrete action for today → one closing line.
- Never reference the Reading product by its page name. Refer to their archetype by title.
- Never claim to predict. You name patterns and suggest small practices.
- Never repeat a ritual they've already seen verbatim.`;

// ─── Builder ───────────────────────────────────────────────────

export function buildDailyLuckEmail(ctx: DailyEmailContext): DailyEmailPrompt {
  const personal = buildPersonalBlock(ctx);
  const recent = buildRecentBlock(ctx);
  const rhythm = buildRhythmBlock(ctx);

  const system = TYCHE_EMAIL_VOICE;

  const user = [
    `Write today's email for a subscriber whose archetype is ${ctx.archetype.name} — "${ctx.archetype.tagline}".`,
    personal,
    rhythm,
    recent,
    ctx.currentThread ? `Current thread they told us about: ${sanitizeLine(ctx.currentThread)}` : null,
    ``,
    `Return a JSON object with exactly these fields:`,
    `{`,
    `  "subject": "One short subject line — under 55 chars. No emoji. Specific, not clickbait.",`,
    `  "preheader": "One sentence under 90 chars — extends the subject, not a duplicate.",`,
    `  "body": "The email body. 90-140 words. Plain text (\\n\\n between paragraphs). One concrete action to try today."`,
    `}`,
    ``,
    `Output ONLY the JSON. No preamble, no code fences.`,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  return { system, user, temperature: 0.6 };
}

// ─── Context-block helpers ─────────────────────────────────────

function buildPersonalBlock(ctx: DailyEmailContext): string {
  if (!ctx.name) {
    return `Reader: name not provided — open with an archetype-led line instead of a name.`;
  }
  return `Reader's first name: ${ctx.name}. Use it once, early, naturally.`;
}

function buildRhythmBlock(ctx: DailyEmailContext): string {
  const parts: string[] = [];
  if (ctx.streakDay && ctx.streakDay >= 1 && ctx.streakDay <= 30) {
    parts.push(`They are on day ${ctx.streakDay} of the 30-day protocol.`);
  }
  if (ctx.timeOfDay) {
    parts.push(`Time of day this email is opened: ${ctx.timeOfDay}.`);
  }
  if (ctx.weekday) {
    parts.push(`Weekday: ${ctx.weekday}.`);
  }
  return parts.length ? parts.join(" ") : `No rhythm context available — keep it tempo-neutral.`;
}

function buildRecentBlock(ctx: DailyEmailContext): string {
  const parts: string[] = [];
  if (ctx.lastThreeActions && ctx.lastThreeActions.length > 0) {
    const actions = ctx.lastThreeActions.map(sanitizeLine).slice(0, 3).join(" · ");
    parts.push(`Recent actions they took: ${actions}.`);
  }
  if (ctx.seenRituals && ctx.seenRituals.length > 0) {
    const seen = ctx.seenRituals.map(sanitizeLine).slice(0, 6).join(" · ");
    parts.push(`Rituals already seen (do NOT reuse verbatim): ${seen}.`);
  }
  return parts.length
    ? parts.join(" ")
    : `No recent-action signal — speak to archetype patterns generally.`;
}

/** Prompt-injection hygiene: strip newlines, collapse whitespace, cap length. */
function sanitizeLine(s: string): string {
  return s.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 240);
}
