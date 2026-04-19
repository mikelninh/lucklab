/**
 * Seasonal cron — fires 4× a year (solstices + equinoxes) + New Year.
 * Sends a themed campaign email to the audience.
 *
 * Dates (UTC): 2026-03-20, 2026-06-21, 2026-09-23, 2026-12-21, 2027-01-01.
 * Vercel Cron runs daily; the handler checks if today matches one of the
 * seasonal dates and acts only then.
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { verifyCron } from "@/lib/cron-auth";

export const runtime = "nodejs";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://lucklab.app";
const FROM = process.env.EMAIL_FROM || "Tyche · Luck Lab <tyche@lucklab.app>";

const CAMPAIGNS = [
  { md: "03-20", slug: "vernal-equinox", theme: "the renewing season" },
  { md: "06-21", slug: "summer-solstice", theme: "kairos — the ripe moment" },
  { md: "09-23", slug: "autumnal-equinox", theme: "amor fati — the harvest mind" },
  { md: "12-21", slug: "winter-solstice", theme: "wu wei — the yielding season" },
  { md: "01-01", slug: "new-year", theme: "luck in the year ahead" },
];

export async function GET(req: NextRequest) {
  const deny = verifyCron(req);
  if (deny) return deny;

  const today = new Date().toISOString().slice(5, 10); // "MM-DD"
  const campaign = CAMPAIGNS.find((c) => c.md === today);
  if (!campaign) return NextResponse.json({ ok: true, skipped: "not-a-seasonal-date" });

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !audienceId) {
    return NextResponse.json({ ok: true, dryRun: true, campaign: campaign.slug });
  }

  const resend = new Resend(apiKey);
  const html = seasonalHtml(campaign);

  const result = await resend.broadcasts.create({
    audienceId,
    from: FROM,
    subject: `${campaign.theme} — a note from Tyche`,
    html,
  });
  if (result.data?.id) await resend.broadcasts.send(result.data.id);

  return NextResponse.json({ ok: true, campaign: campaign.slug });
}

function seasonalHtml(c: { theme: string }): string {
  return `<!doctype html><html><body style="margin:0;padding:40px 20px;background:#0a0a0d;font-family:'Fraunces',Georgia,serif;color:#ededee;">
<div style="max-width:560px;margin:0 auto;background:#16161d;border:1px solid #25252f;border-radius:6px;padding:40px;">
  <p style="font-family:monospace;letter-spacing:0.18em;text-transform:uppercase;color:#c9a961;font-size:11px;margin:0 0 24px;">LUCK LAB · SEASONAL</p>
  <h1 style="font-size:28px;font-weight:400;color:#ededee;margin:0 0 20px;line-height:1.2;">${c.theme.charAt(0).toUpperCase()}${c.theme.slice(1)}.</h1>
  <p style="font-size:15px;color:#c9d1d9;line-height:1.75;margin:0 0 16px;">[Insert thematic body per campaign — this is a stub. Edit CAMPAIGNS array or swap in Resend template id.]</p>
  <p style="margin:24px 0;"><a href="${APP_URL}/reading" style="display:inline-block;background:#c9a961;color:#1a1406;padding:14px 26px;text-decoration:none;border-radius:4px;font-weight:600;font-size:14px;">Begin a seasonal Reading →</a></p>
  <p style="font-family:monospace;font-size:11px;color:#c9a961;letter-spacing:0.1em;margin:24px 0 0;">— TYCHE</p>
</div>
</body></html>`;
}
