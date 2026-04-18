import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { rateLimit, LIMITS } from "@/lib/rate-limit";
import {
  welcomeEmail,
  nudgeReadingEmail,
  contentEmail,
  primerEmail,
  lastTouchEmail,
} from "@/lib/email-templates";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email(),
  name: z.string().max(60).optional(),
  source: z.string().optional().default("unknown"),
  archetype: z.string().max(30).optional(), // for archetype-specific drip
});

const FROM = process.env.EMAIL_FROM || "Tyche · Luck Lab <tyche@lucklab.app>";

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, LIMITS.subscribe);
  if (!rl.ok) return rl.response;

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }
  const { email, name, source, archetype } = parsed.data;

  console.log("[subscribe]", { email, name, source, archetype, at: new Date().toISOString() });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[subscribe] RESEND_API_KEY missing — skipping email send");
    return NextResponse.json({ ok: true, warning: "no_email_configured" });
  }

  const resend = new Resend(apiKey);

  // Schedule the full drip sequence using Resend's scheduledAt.
  // T+0  welcome (immediate)
  // T+1h nudge
  // T+24h content
  // T+3d  primer upsell
  // T+7d  last touch
  const now = Date.now();
  const drip: { at: Date | null; template: ReturnType<typeof welcomeEmail> }[] = [
    { at: null, template: welcomeEmail(name) },
    { at: new Date(now + 1 * 60 * 60 * 1000), template: nudgeReadingEmail(name) },
    { at: new Date(now + 24 * 60 * 60 * 1000), template: contentEmail(name, archetype) },
    { at: new Date(now + 3 * 24 * 60 * 60 * 1000), template: primerEmail(name) },
    { at: new Date(now + 7 * 24 * 60 * 60 * 1000), template: lastTouchEmail(name) },
  ];

  // Resend best-effort — log failures, don't block the subscriber
  for (const step of drip) {
    try {
      await resend.emails.send({
        from: FROM,
        to: email,
        subject: step.template.subject,
        html: step.template.html.replace(/\{\{email\}\}/g, encodeURIComponent(email)),
        scheduledAt: step.at ? step.at.toISOString() : undefined,
      });
    } catch (err) {
      console.error("[subscribe:send]", err);
    }
  }

  // If you want lifecycle persistence (unsubscribes, open tracking, etc),
  // also add to Resend Audiences — requires RESEND_AUDIENCE_ID env var.
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (audienceId) {
    try {
      await resend.contacts.create({
        email,
        firstName: name,
        unsubscribed: false,
        audienceId,
      });
    } catch (err) {
      console.error("[subscribe:audience]", err);
    }
  }

  return NextResponse.json({ ok: true });
}
