/**
 * Review-request cron — fires daily, asks 7-day-old buyers for a one-sentence reply.
 *
 * Full implementation requires Supabase (a `readings` table with stripe_session_id
 * + stripe_customer_email + tier + created_at + review_requested_at).
 *
 * Until Supabase is enabled, this route enumerates Stripe checkout sessions
 * created exactly 7 days ago, checks they were paid, and sends the email.
 * It does NOT track which addresses already received the request — risk of
 * duplicates if the cron runs twice. Acceptable for MVP volume; track in
 * Supabase later.
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { verifyCron } from "@/lib/cron-auth";
import { reviewRequestEmail } from "@/lib/email-templates";
import {
  computeScores,
  archetypeFor,
  type PersonalContext,
} from "@/lib/diagnostic";
import { decodeAnswers } from "@/lib/answer-codec";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const deny = verifyCron(req);
  if (deny) return deny;

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  if (!stripeKey || !resendKey) {
    return NextResponse.json({
      ok: true,
      skipped: "STRIPE_SECRET_KEY or RESEND_API_KEY missing",
    });
  }

  const stripe = new Stripe(stripeKey);
  const resend = new Resend(resendKey);
  const from = process.env.EMAIL_FROM || "Tyche · Kairos Lab <tyche@kairos.lab>";

  // Window: sessions created 7 days ago (24h slice)
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const eightDaysAgo = now - 8 * 24 * 60 * 60 * 1000;
  const gte = Math.floor(eightDaysAgo / 1000);
  const lt = Math.floor(sevenDaysAgo / 1000);

  const sessions = await stripe.checkout.sessions.list({
    limit: 100,
    created: { gte, lt },
  });
  const paid = sessions.data.filter((s) => s.payment_status === "paid");

  let sent = 0;
  for (const s of paid) {
    const email = s.customer_email ?? s.customer_details?.email;
    if (!email) continue;

    let name: string | undefined;
    let archetype: string | undefined;
    try {
      const personal = s.metadata?.personal
        ? (JSON.parse(s.metadata.personal) as PersonalContext)
        : null;
      if (personal?.name) name = personal.name.split(/\s+/)[0];

      // Recompute archetype from stored answers — same deterministic function
      // we use everywhere else, so the email matches their Reading.
      const answers = decodeAnswers(s.metadata?.answers || "");
      if (answers.length >= 8) {
        const scores = computeScores(answers);
        archetype = archetypeFor(scores).name;
      }
    } catch {
      // best-effort; fallback to generic greeting
    }

    const tpl = reviewRequestEmail(name, archetype);
    try {
      await resend.emails.send({
        from,
        to: email,
        subject: tpl.subject,
        html: tpl.html.replace(/\{\{email\}\}/g, encodeURIComponent(email)),
      });
      sent++;
    } catch (err) {
      console.error("[review-request:send]", err);
    }
  }

  return NextResponse.json({ ok: true, candidates: paid.length, sent });
}
