/**
 * Langfuse-instrumented OpenAI client factory.
 *
 * Drop-in replacement for `new OpenAI(...)` that auto-traces every chat
 * completion to Langfuse — full prompt, response, tokens, latency, cost,
 * plus any metadata we attach.
 *
 * Falls back to a plain OpenAI client when Langfuse env vars aren't set, so
 * production code stays observability-agnostic and works on every dev's
 * machine without forcing them to sign up.
 *
 * Usage:
 *   const client = tracedOpenAI({
 *     apiKey: process.env.OPENAI_API_KEY!,
 *     traceName: "tyche-read",
 *     sessionId: maybeUserId,
 *     tags: ["paid", `archetype:${archetype.id}`],
 *     metadata: { archetypeName: archetype.name },
 *   });
 *   const completion = await client.chat.completions.create({...});
 *
 * Setup (one-time, ~5 min):
 *   1. Sign up at https://eu.cloud.langfuse.com (EU region for DSGVO)
 *   2. Project Settings → API Keys → New API Key
 *   3. Add to .env.local:
 *        LANGFUSE_PUBLIC_KEY=pk-lf-...
 *        LANGFUSE_SECRET_KEY=sk-lf-...
 *        LANGFUSE_HOST=https://eu.cloud.langfuse.com
 *   4. npm install langfuse
 */

import OpenAI from "openai";

interface TracedOpenAIOpts {
  apiKey: string;
  /** Human-readable trace name shown in the Langfuse Traces tab. */
  traceName?: string;
  /** Group multiple calls under a single session in Langfuse. */
  sessionId?: string;
  /** Optional user ID for per-user analytics in the dashboard. */
  userId?: string;
  /** Filterable tags. Use kebab-case. */
  tags?: string[];
  /** Arbitrary searchable metadata: archetype, prompt version, feature flag, etc. */
  metadata?: Record<string, unknown>;
}

/**
 * Returns an OpenAI client that auto-traces to Langfuse if credentials are
 * present, otherwise a plain OpenAI client. Type signature is identical so
 * callers don't care which path they got.
 */
export function tracedOpenAI(opts: TracedOpenAIOpts): OpenAI {
  const plain = new OpenAI({ apiKey: opts.apiKey });

  const lfPublic = process.env.LANGFUSE_PUBLIC_KEY;
  const lfSecret = process.env.LANGFUSE_SECRET_KEY;
  if (!lfPublic || !lfSecret) return plain;

  // SDK reads LANGFUSE_HOST. Some docs use LANGFUSE_BASE_URL — normalise.
  if (!process.env.LANGFUSE_HOST && process.env.LANGFUSE_BASE_URL) {
    process.env.LANGFUSE_HOST = process.env.LANGFUSE_BASE_URL;
  }

  // Lazy require so the langfuse package is only loaded when actually needed.
  // Keeps cold start fast in environments that don't use Langfuse.
  let observeOpenAI: undefined | ((c: OpenAI, opts: unknown) => OpenAI);
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ({ observeOpenAI } = require("langfuse"));
  } catch {
    // langfuse package not installed yet — silently fall back to plain.
    return plain;
  }

  if (!observeOpenAI) return plain;

  return observeOpenAI(plain, {
    generationName: opts.traceName,
    sessionId: opts.sessionId,
    userId: opts.userId,
    tags: opts.tags,
    metadata: opts.metadata,
  });
}
