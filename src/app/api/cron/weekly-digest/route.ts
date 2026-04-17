/**
 * Weekly digest — fires every Friday 10:00 UTC.
 * Loads this week's newsletter from /content/newsletters/,
 * converts to styled HTML, sends to Resend Audience as broadcast.
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { verifyCron } from "@/lib/cron-auth";
import { getThisWeeksNewsletter } from "@/lib/newsletters";

export const runtime = "nodejs";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://kairos-tau-inky.vercel.app";
const FROM = process.env.EMAIL_FROM || "Mikel from Kairos <mikel_ninh@yahoo.de>";

export async function GET(req: NextRequest) {
  const deny = verifyCron(req);
  if (deny) return deny;

  const newsletter = getThisWeeksNewsletter();
  if (!newsletter) {
    return NextResponse.json({ ok: true, skipped: "no-newsletter-this-week" });
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !audienceId) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      newsletter: newsletter.subject,
      reason: "RESEND_API_KEY or RESEND_AUDIENCE_ID missing",
    });
  }

  const resend = new Resend(apiKey);
  const html = renderNewsletter(newsletter);

  try {
    const result = await resend.broadcasts.create({
      audienceId,
      from: FROM,
      subject: newsletter.subject,
      html,
    });
    if (result.data?.id) {
      await resend.broadcasts.send(result.data.id);
    }
    return NextResponse.json({
      ok: true,
      week: newsletter.week,
      subject: newsletter.subject,
      broadcast: result.data?.id,
    });
  } catch (err) {
    console.error("[weekly-digest]", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

function renderNewsletter(n: { subject: string; body: string; article?: string; week: number }): string {
  // Convert markdown-ish body to HTML (simple: paragraphs, bold, links, blockquotes)
  const bodyHtml = n.body
    .split("\n\n")
    .map((para) => {
      para = para.trim();
      if (!para) return "";
      // Headers
      if (para.startsWith("**") && para.endsWith("**")) {
        return `<h3 style="font-size:16px;font-weight:600;color:#c9a961;margin:28px 0 8px;font-family:monospace;letter-spacing:0.08em;text-transform:uppercase;">${para.replace(/\*\*/g, "")}</h3>`;
      }
      // Convert [text →] to links
      para = para.replace(
        /\[([^\]]+)\s*→\]/g,
        `<a href="${APP_URL}/research/${n.article || ""}" style="color:#c9a961;text-decoration:underline;">$1 →</a>`,
      );
      // Convert [Begin Your Reading →] to CTA
      para = para.replace(
        /\[Begin Your Reading[^\]]*\]/g,
        `<a href="${APP_URL}/reading" style="display:inline-block;background:#c9a961;color:#1a1406;padding:12px 24px;text-decoration:none;border-radius:4px;font-weight:600;font-size:14px;margin:8px 0;">Begin Your Reading →</a>`,
      );
      // Bold
      para = para.replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#ededee;">$1</strong>');
      // Italic
      para = para.replace(/\"([^"]+)\"/g, '<em>"$1"</em>');
      return `<p style="font-size:15px;color:#c9d1d9;line-height:1.75;margin:0 0 16px;">${para}</p>`;
    })
    .join("\n");

  return `<!doctype html><html><body style="margin:0;padding:40px 20px;background:#0a0a0d;font-family:Georgia,serif;color:#ededee;">
<div style="max-width:560px;margin:0 auto;background:#16161d;border:1px solid #25252f;border-radius:6px;padding:40px;">
  <p style="font-family:monospace;letter-spacing:0.18em;text-transform:uppercase;color:#c9a961;font-size:11px;margin:0 0 8px;">KAIROS DISPATCH</p>
  <p style="font-family:monospace;font-size:10px;color:#5a5a66;letter-spacing:0.1em;margin:0 0 28px;">WEEK ${n.week}</p>
  <h1 style="font-size:26px;font-weight:400;line-height:1.3;color:#ededee;margin:0 0 24px;">${n.subject}</h1>
  <hr style="border:none;border-top:1px solid #25252f;margin:0 0 24px;">
  ${bodyHtml}
  <hr style="border:none;border-top:1px solid #25252f;margin:28px 0;">
  <p style="font-family:monospace;font-size:11px;color:#c9a961;letter-spacing:0.1em;margin:0;">— TYCHE</p>
  <p style="font-family:monospace;font-size:10px;color:#5a5a66;margin:16px 0 0;">
    <a href="${APP_URL}/unsubscribe?email={{email}}" style="color:#5a5a66;text-decoration:underline;">unsubscribe</a>
    · <a href="${APP_URL}" style="color:#5a5a66;text-decoration:underline;">kairos.lab</a>
  </p>
</div></body></html>`;
}
