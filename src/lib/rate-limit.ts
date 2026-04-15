/**
 * Simple in-memory rate limiter.
 * Good enough for single-instance deployments (Vercel serverless may spread
 * buckets across instances, but the ceiling stays roughly bounded).
 *
 * Upgrade path: swap the `buckets` Map for @upstash/ratelimit once Redis exists.
 */

import { NextRequest, NextResponse } from "next/server";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

// Light janitor — evict stale buckets every ~5 min
let lastSweep = Date.now();
function sweep(now: number) {
  if (now - lastSweep < 5 * 60 * 1000) return;
  lastSweep = now;
  for (const [k, b] of buckets) if (b.resetAt < now) buckets.delete(k);
}

export type RateLimitOptions = {
  key: string;        // bucket prefix, e.g. "tyche" or "checkout"
  limit: number;      // requests per window
  windowMs: number;   // window size in ms
};

export function rateLimit(req: NextRequest, opts: RateLimitOptions):
  | { ok: true }
  | { ok: false; response: NextResponse; retryAfterSec: number } {

  // Resolve client IP — Vercel forwards it, localhost doesn't.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local";

  const now = Date.now();
  sweep(now);

  const bucketKey = `${opts.key}:${ip}`;
  const b = buckets.get(bucketKey);
  if (!b || b.resetAt < now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true };
  }
  if (b.count < opts.limit) {
    b.count++;
    return { ok: true };
  }
  const retryAfterSec = Math.ceil((b.resetAt - now) / 1000);
  return {
    ok: false,
    retryAfterSec,
    response: NextResponse.json(
      { error: "Too many requests. Please slow down.", retryAfter: retryAfterSec },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSec),
          "X-RateLimit-Limit": String(opts.limit),
          "X-RateLimit-Remaining": "0",
        },
      },
    ),
  };
}

// Preset profiles for the routes we protect
export const LIMITS = {
  // Free Reading — protect OpenAI spend. 5/min/ip is plenty for a real user.
  tyche: { key: "tyche", limit: 5, windowMs: 60_000 },
  // Checkout — low-volume per user, higher ceiling to avoid friction
  checkout: { key: "checkout", limit: 10, windowMs: 60_000 },
  // Subscribe — anti-spam on the email capture
  subscribe: { key: "subscribe", limit: 3, windowMs: 60_000 },
} as const;
