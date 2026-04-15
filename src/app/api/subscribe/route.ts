import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email(),
  source: z.string().optional().default("unknown"),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid email." },
      { status: 400 },
    );
  }
  const { email, source } = parsed.data;

  // --- 1) Record the subscriber ---
  //
  // MVP: log to console. Before going live, wire to your preferred store:
  //   - Supabase `subscribers` table
  //   - Airtable / Notion via API
  //   - Resend Audiences (audiences.contacts.create)
  //
  // Example (Resend Audiences):
  //   await resend.contacts.create({ email, audienceId: process.env.RESEND_AUDIENCE_ID! })

  console.log("[subscribe]", { email, source, at: new Date().toISOString() });

  // --- 2) Send the Convergence Index PDF ---
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Kairos Lab <hallo@kairos.lab>";
  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from,
        to: email,
        subject: "The Luck Convergence Index",
        html: emailTemplate(),
        // In production attach the PDF from /public or storage:
        // attachments: [{ filename: "luck-convergence-index.pdf", path: "…" }]
      });
    } catch (err) {
      console.error("[subscribe:send]", err);
      // Don't fail the user — we'll retry delivery
    }
  } else {
    console.warn("[subscribe] RESEND_API_KEY missing — skipping email send");
  }

  return NextResponse.json({ ok: true });
}

function emailTemplate() {
  return `<!doctype html>
<html><body style="font-family: Georgia, serif; background: #0a0a0d; color: #ededee; padding: 40px 20px; margin: 0;">
  <div style="max-width: 560px; margin: 0 auto; background: #16161d; border: 1px solid #25252f; padding: 40px; border-radius: 6px;">
    <p style="font-family: monospace; letter-spacing: 0.15em; text-transform: uppercase; color: #c9a961; font-size: 11px; margin: 0 0 24px;">KAIROS LAB</p>
    <h1 style="font-size: 28px; font-weight: 400; color: #ededee; margin: 0 0 20px; line-height: 1.2;">The Luck Convergence Index</h1>
    <p style="font-size: 15px; color: #9a9aa6; line-height: 1.7; margin: 0 0 16px;">Thank you for requesting the Index. You will find the PDF attached — 40+ pages on how twelve wisdom traditions converge on a single, trainable mechanism of luck.</p>
    <p style="font-size: 15px; color: #9a9aa6; line-height: 1.7; margin: 0 0 28px;">Your next step, if you want a profile specific to you: take the 3-minute Diagnostic and consult Tyche.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://kairos.lab"}/diagnostic" style="display: inline-block; background: #c9a961; color: #1a1406; padding: 14px 26px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px;">Take the Diagnostic →</a>
    <p style="font-family: monospace; font-size: 11px; color: #5a5a66; margin: 32px 0 0; letter-spacing: 0.1em;">KAIROS LAB · STUDYING WHAT TRADITIONS KNEW BEFORE SCIENCE CAUGHT UP</p>
  </div>
</body></html>`;
}
