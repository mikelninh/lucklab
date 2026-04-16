import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { rateLimit, LIMITS } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email(),
  sessionId: z.string().min(1),
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://kairos-tau-inky.vercel.app";
const FROM = process.env.EMAIL_FROM || "Tyche · Kairos Lab <tyche@kairos.lab>";

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, LIMITS.subscribe);
  if (!rl.ok) return rl.response;

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid." }, { status: 400 });

  const { email, sessionId } = parsed.data;
  const readingUrl = `${APP_URL}/reading/full?session_id=${sessionId}`;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Email not configured." }, { status: 503 });

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Your Reading from Tyche — saved",
    html: `<!doctype html><html><body style="margin:0;padding:40px 20px;background:#0a0a0d;font-family:Georgia,serif;color:#ededee;">
<div style="max-width:560px;margin:0 auto;background:#16161d;border:1px solid #25252f;border-radius:6px;padding:40px;">
  <p style="font-family:monospace;letter-spacing:0.18em;text-transform:uppercase;color:#c9a961;font-size:11px;margin:0 0 24px;">TYCHE · KAIROS LAB</p>
  <h1 style="font-size:28px;font-weight:400;line-height:1.2;color:#ededee;margin:0 0 20px;">Your Reading is saved.</h1>
  <p style="font-size:15px;color:#c9d1d9;line-height:1.75;margin:0 0 16px;">Bookmark or revisit any time. The link below is yours permanently.</p>
  <p style="margin:24px 0;"><a href="${readingUrl}" style="display:inline-block;background:#c9a961;color:#1a1406;padding:14px 26px;text-decoration:none;border-radius:4px;font-weight:600;font-size:14px;">Open Your Reading →</a></p>
  <p style="font-size:13px;color:#9a9aa6;line-height:1.7;margin:16px 0 0;">You can also save it as a PDF from the page — click "Download as PDF" at the bottom.</p>
  <p style="font-family:monospace;font-size:11px;color:#c9a961;letter-spacing:0.1em;margin:24px 0 0;">— TYCHE</p>
</div></body></html>`,
  });

  return NextResponse.json({ ok: true });
}
