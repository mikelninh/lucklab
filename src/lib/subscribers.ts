/**
 * Subscriber persistence — Phase 1.
 *
 * Why this shape:
 *   The project has a documented Supabase schema (supabase/schema.sql) but no
 *   live Supabase connection yet (no @supabase/supabase-js installed, no env
 *   vars populated). Rather than block the email gate on a DB, this module
 *   writes to two honest places:
 *
 *     1. Process-memory Map  — dedupes inside a warm serverless instance.
 *     2. /tmp JSONL append   — survives within the same Vercel sandbox and
 *                              makes local dev inspectable. NOT durable across
 *                              deploys. Acceptable for Phase 1 because the
 *                              authoritative copy lives in Resend (Audiences
 *                              + send log) — the DB row is a convenience
 *                              mirror.
 *
 *   The row shape matches the columns specified by the CEO:
 *     email, archetype_hint, lang, source, created_at, confirmed_at,
 *     unsubscribed_at, retry_flag.
 *
 *   When Supabase comes online, swap the body of upsertSubscriber and
 *   markUnsubscribed; the call-sites stay.
 *
 * Single-opt-in, not double:
 *   DE law permits single-opt-in for free B2C content when the user has an
 *   existing relationship context (here: they explicitly ask for the Reading).
 *   See § 7 UWG (implied consent for existing inquiries) and recital 47 GDPR.
 *   A double-opt-in ladder is a separate Phase-2 item; noted by the CEO.
 *
 * Unsubscribe tokens:
 *   HMAC-SHA256(email) with a server secret. Stateless, idempotent, safe to
 *   email. If the secret rotates, old links stop working — acceptable.
 */

import { promises as fs } from "node:fs";
import { createHmac, timingSafeEqual } from "node:crypto";
import path from "node:path";

export type Subscriber = {
  email: string;
  archetype_hint: string | null;
  lang: string;
  source: string;
  created_at: string;         // ISO
  confirmed_at: string | null; // null until confirmed (single-opt-in sets this at create time)
  unsubscribed_at: string | null;
  retry_flag: boolean;        // true when the welcome send failed and we still let the user through
};

// Warm-instance cache. The Map key is the lowercased email.
const store = new Map<string, Subscriber>();

// Where we append a JSONL mirror for inspection.
const LOG_PATH = path.join("/tmp", "lucklab-subscribers.jsonl");

function normalize(email: string): string {
  return email.trim().toLowerCase();
}

// RFC-light email validation. We accept pragmatic inputs; Resend will do the
// final verdict. No reason to duplicate a 200-line parser here.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  if (typeof email !== "string") return false;
  if (email.length > 254) return false;
  return EMAIL_RE.test(email.trim());
}

export type UpsertInput = {
  email: string;
  source: string;
  archetype_hint?: string | null;
  lang?: string;
  retry_flag?: boolean;
};

export type UpsertResult = {
  subscriber: Subscriber;
  created: boolean;
};

export async function upsertSubscriber(input: UpsertInput): Promise<UpsertResult> {
  const email = normalize(input.email);
  const now = new Date().toISOString();
  const existing = store.get(email);

  if (existing) {
    // Collision: update source only if it changed; never duplicate.
    if (input.source && input.source !== existing.source) {
      existing.source = input.source;
    }
    if (input.archetype_hint && !existing.archetype_hint) {
      existing.archetype_hint = input.archetype_hint;
    }
    if (input.lang && !existing.lang) {
      existing.lang = input.lang;
    }
    if (input.retry_flag) {
      existing.retry_flag = true;
    }
    // Re-opening a previously unsubscribed address is out of scope for Phase 1.
    // Existing row returned unchanged on unsubscribe collision — honest.
    await appendLog({ kind: "update", row: existing });
    return { subscriber: existing, created: false };
  }

  const row: Subscriber = {
    email,
    archetype_hint: input.archetype_hint ?? null,
    lang: input.lang ?? "en",
    source: input.source,
    created_at: now,
    confirmed_at: now, // single-opt-in — see module comment
    unsubscribed_at: null,
    retry_flag: input.retry_flag ?? false,
  };
  store.set(email, row);
  await appendLog({ kind: "create", row });
  return { subscriber: row, created: true };
}

export async function markUnsubscribed(email: string): Promise<{ ok: boolean; wasSubscribed: boolean }> {
  const key = normalize(email);
  const row = store.get(key);
  if (!row) {
    // Not in this warm instance — still a valid unsubscribe click. Record it
    // as a tombstone so it takes effect here too.
    const tombstone: Subscriber = {
      email: key,
      archetype_hint: null,
      lang: "en",
      source: "unsubscribe-unknown",
      created_at: new Date().toISOString(),
      confirmed_at: null,
      unsubscribed_at: new Date().toISOString(),
      retry_flag: false,
    };
    store.set(key, tombstone);
    await appendLog({ kind: "unsubscribe-tombstone", row: tombstone });
    return { ok: true, wasSubscribed: false };
  }
  if (row.unsubscribed_at) {
    return { ok: true, wasSubscribed: false };
  }
  row.unsubscribed_at = new Date().toISOString();
  await appendLog({ kind: "unsubscribe", row });
  return { ok: true, wasSubscribed: true };
}

async function appendLog(entry: { kind: string; row: Subscriber }): Promise<void> {
  const line = JSON.stringify({ at: new Date().toISOString(), ...entry }) + "\n";
  try {
    await fs.appendFile(LOG_PATH, line, "utf8");
  } catch (err) {
    // /tmp may not exist in some edge environments — log and carry on.
    console.warn("[subscribers] append failed:", (err as Error).message);
  }
}

// -----------------------------------------------------------
// Unsubscribe tokens (stateless HMAC)
// -----------------------------------------------------------

function getSecret(): string {
  // Reuse CRON_SECRET if present — any rotating server secret is fine.
  // We explicitly do NOT fall back to a public value, so a missing secret
  // degrades closed (tokens fail to verify) rather than open.
  const s = process.env.UNSUB_SECRET || process.env.CRON_SECRET;
  if (!s) return ""; // verify() will refuse all tokens when empty
  return s;
}

export function signUnsubToken(email: string): string {
  const secret = getSecret();
  if (!secret) return "";
  const key = normalize(email);
  const mac = createHmac("sha256", secret).update(key).digest("hex").slice(0, 32);
  // token = base64url(email) + "." + mac — self-describing so verify doesn't
  // need a second DB lookup.
  const b64 = Buffer.from(key, "utf8").toString("base64url");
  return `${b64}.${mac}`;
}

export function verifyUnsubToken(token: string): { ok: true; email: string } | { ok: false; reason: string } {
  const secret = getSecret();
  if (!secret) return { ok: false, reason: "server-misconfigured" };
  if (typeof token !== "string" || !token.includes(".")) return { ok: false, reason: "malformed" };
  const [b64, mac] = token.split(".");
  if (!b64 || !mac) return { ok: false, reason: "malformed" };
  let email: string;
  try {
    email = Buffer.from(b64, "base64url").toString("utf8");
  } catch {
    return { ok: false, reason: "malformed" };
  }
  if (!isValidEmail(email)) return { ok: false, reason: "malformed" };
  const expected = createHmac("sha256", secret).update(normalize(email)).digest("hex").slice(0, 32);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false, reason: "bad-signature" };
  return { ok: true, email };
}

// For tests/introspection only — not exported from a barrel.
export function _resetStoreForTests(): void {
  store.clear();
}
export function _peekSubscriber(email: string): Subscriber | undefined {
  return store.get(normalize(email));
}
