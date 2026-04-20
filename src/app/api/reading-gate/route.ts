/**
 * /api/reading-gate — Phase 1 email capture before /reading renders.
 *
 * Deliberately separate from /api/subscribe, which fires the full 5-step
 * drip. Phase 1 scope from the CEO is: capture, store, send welcome only.
 *
 * Contract:
 *   POST  { email, source?, archetype_hint?, lang? }
 *   200   { ok: true, alreadyKnown: boolean, emailSent: boolean, retryQueued: boolean }
 *   400   invalid email
 *   429   rate-limited
 *
 * The route NEVER blocks the user on Resend failures — if the send fails the
 * subscriber row is still written with retry_flag=true and the UI is told to
 * surface an honest inline message while letting them through.
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { rateLimit, LIMITS } from "@/lib/rate-limit";
import { welcomeEmail } from "@/lib/email-templates";
import {
  isValidEmail,
  upsertSubscriber,
  signUnsubToken,
} from "@/lib/subscribers";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().max(254),
  source: z.string().max(40).optional().default("reading-gate"),
  archetype_hint: z.string().max(40).optional(),
  lang: z.string().max(8).optional().default("en"),
  name: z.string().max(60).optional(), // optional; welcomeEmail accepts it
});

const FROM = process.env.EMAIL_FROM || "Tyche · Luck Lab <tyche@lucklab.app>";

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, LIMITS.subscribe);
  if (!rl.ok) return rl.response;

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { email, source, archetype_hint, lang, name } = parsed.data;

  // Server-side email validation (RFC-light) — mirrors the lib helper.
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
  }

  // Persist first, send second. If Resend is down we still have the lead.
  const apiKey = process.env.RESEND_API_KEY;
  let emailSent = false;
  let retryQueued = false;

  // Attempt the send. On any failure: set retry_flag on the row and report
  // retryQueued=true so the UI can surface the honest inline message.
  let sendError: string | null = null;
  if (!apiKey) {
    sendError = "resend-not-configured";
  } else {
    try {
      const resend = new Resend(apiKey);
      const tpl = welcomeEmail(name);
      const token = signUnsubToken(email);
      const html = tpl.html
        // Prefer the new signed token; fall back to email= for any template
        // that hasn't been updated yet. Both will resolve at /unsubscribe.
        .replace(/\{\{email\}\}/g, encodeURIComponent(email))
        .replace(/\?email=([^"&]+)/g, token ? `?token=${token}` : `?email=$1`);
      const res = await resend.emails.send({
        from: FROM,
        to: email,
        subject: tpl.subject,
        html,
      });
      // resend-js returns { data, error } on v6 — treat error presence as a failure.
      const anyRes = res as unknown as { error?: { message?: string } | null };
      if (anyRes && anyRes.error) {
        sendError = anyRes.error.message || "resend-error";
      } else {
        emailSent = true;
      }
    } catch (err) {
      sendError = err instanceof Error ? err.message : "send-threw";
    }
  }

  if (sendError) {
    retryQueued = true;
    console.warn("[reading-gate] send failed, queuing retry:", sendError);
  }

  const { created } = await upsertSubscriber({
    email,
    source,
    archetype_hint: archetype_hint ?? null,
    lang,
    retry_flag: retryQueued,
  });

  return NextResponse.json({
    ok: true,
    alreadyKnown: !created,
    emailSent,
    retryQueued,
  });
}
