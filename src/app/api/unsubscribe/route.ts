/**
 * /api/unsubscribe — accepts either:
 *   - token  (new, HMAC-signed, preferred)
 *   - email  (legacy fallback — see note below)
 *
 * Legacy email= support exists because welcomeEmail's unsubscribe link was
 * historically `?email={{email}}`. Drip emails already in flight will still
 * resolve. New sends use `?token=…` so we don't trust raw email params.
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit } from "@/lib/rate-limit";
import { markUnsubscribed, verifyUnsubToken, isValidEmail } from "@/lib/subscribers";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, { key: "unsubscribe", limit: 10, windowMs: 60_000 });
  if (!rl.ok) return rl.response;

  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  const emailParam = url.searchParams.get("email") || "";

  let email = "";
  if (token) {
    const v = verifyUnsubToken(token);
    if (!v.ok) {
      return NextResponse.json({ error: "Invalid or expired unsubscribe link." }, { status: 400 });
    }
    email = v.email;
  } else if (emailParam && isValidEmail(decodeURIComponent(emailParam))) {
    email = decodeURIComponent(emailParam);
  } else {
    return NextResponse.json({ error: "Missing token." }, { status: 400 });
  }

  const { wasSubscribed } = await markUnsubscribed(email);

  // Also remove from Resend Audience if configured, so they stop receiving
  // anything from our sender — not just the Luck Lab drip.
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (apiKey && audienceId) {
    try {
      const resend = new Resend(apiKey);
      await resend.contacts.update({
        audienceId,
        email,
        unsubscribed: true,
      });
    } catch (err) {
      console.warn("[unsubscribe] audience update failed:", (err as Error).message);
    }
  }

  return NextResponse.json({ ok: true, wasSubscribed });
}
