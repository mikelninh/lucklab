/**
 * Weekly digest — fires every Friday 10:00 UTC.
 * Emails subscribers the week's new essay.
 *
 * Full implementation requires:
 *   - Resend Audiences (RESEND_AUDIENCE_ID) OR a Supabase `subscribers` table
 *
 * Today the stub fires once per Friday, picks the latest article, and if
 * RESEND_AUDIENCE_ID is set, sends a broadcast to that audience.
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { verifyCron } from "@/lib/cron-auth";
import { loadPublishedArticles } from "@/lib/articles";

export const runtime = "nodejs";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://kairos.lab";
const FROM = process.env.EMAIL_FROM || "Tyche · Kairos Lab <tyche@kairos.lab>";

export async function GET(req: NextRequest) {
  const deny = verifyCron(req);
  if (deny) return deny;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const recent = loadPublishedArticles().filter(
    (a) => new Date(a.publishDate + "T00:00:00Z") >= cutoff,
  );
  const article = recent[0];
  if (!article) {
    return NextResponse.json({ ok: true, skipped: "no-new-article" });
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !audienceId) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      reason: "RESEND_API_KEY or RESEND_AUDIENCE_ID missing — would have sent",
      article: article.slug,
    });
  }

  const resend = new Resend(apiKey);
  const html = digestHtml(article);

  try {
    const result = await resend.broadcasts.create({
      audienceId,
      from: FROM,
      subject: `New essay: ${article.title}`,
      html,
    });
    if (result.data?.id) {
      await resend.broadcasts.send(result.data.id);
    }
    return NextResponse.json({ ok: true, article: article.slug, broadcast: result.data?.id });
  } catch (err) {
    console.error("[weekly-digest]", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

function digestHtml(a: { title: string; description: string; slug: string }): string {
  return `<!doctype html><html><body style="margin:0;padding:40px 20px;background:#0a0a0d;font-family:Georgia,serif;color:#ededee;">
<div style="max-width:560px;margin:0 auto;background:#16161d;border:1px solid #25252f;border-radius:6px;padding:40px;">
  <p style="font-family:monospace;letter-spacing:0.18em;text-transform:uppercase;color:#c9a961;font-size:11px;margin:0 0 24px;">KAIROS LAB · THIS WEEK</p>
  <h1 style="font-size:28px;font-weight:400;line-height:1.2;color:#ededee;margin:0 0 20px;">${a.title}</h1>
  <p style="font-size:15px;color:#c9d1d9;line-height:1.75;margin:0 0 20px;">${a.description}</p>
  <p style="margin:24px 0;"><a href="${APP_URL}/research/${a.slug}" style="display:inline-block;background:#c9a961;color:#1a1406;padding:14px 26px;text-decoration:none;border-radius:4px;font-weight:600;font-size:14px;">Read the essay →</a></p>
  <hr style="border:none;border-top:1px solid #25252f;margin:28px 0;">
  <p style="font-size:13px;color:#9a9aa6;line-height:1.7;margin:0;">The full Reading remains free at <a href="${APP_URL}/reading" style="color:#c9a961;">${APP_URL}/reading</a>.</p>
  <p style="font-family:monospace;font-size:11px;color:#c9a961;letter-spacing:0.1em;margin:24px 0 0;">— TYCHE</p>
</div>
</body></html>`;
}
