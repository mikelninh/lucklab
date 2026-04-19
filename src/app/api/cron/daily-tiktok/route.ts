/**
 * Daily TikTok script generator.
 * Runs at 06:00 UTC (08:00 Berlin) — generates today's script + caption.
 *
 * Vercel Cron config: see vercel.json
 * GET /api/cron/daily-tiktok
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyCron } from "@/lib/cron-auth";
import { generateForDate, generateAllFormatsForDate } from "@/lib/tiktok-scripts";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const denied = verifyCron(req);
  if (denied) return denied;

  const today = new Date();
  const all = req.nextUrl.searchParams.get("all") === "1";

  const scripts = all ? generateAllFormatsForDate(today) : [generateForDate(today)];

  // Scripts already carry their own caption (hook-first, CTA, hashtags)
  const results = scripts.map((script) => {
    const caption = script.caption;

    return {
      id: script.id,
      format: script.format,
      title: script.title,
      slideCount: script.slides.length,
      durationSeconds: Math.round(script.totalDurationFrames / 30),
      caption,
      slides: script.slides.map((s) => ({
        type: s.type,
        text: s.text,
        subtext: s.subtext,
        highlight: s.highlight,
        durationSeconds: +(s.durationFrames / 30).toFixed(1),
      })),
    };
  });

  // Optionally email the script to admin
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const scriptSummary = results
        .map(
          (r) =>
            `**${r.format}** — ${r.title}\n${r.slideCount} slides, ${r.durationSeconds}s\n\nCaption:\n${r.caption}\n\nSlides:\n${r.slides.map((s, i) => `${i + 1}. [${s.type}] ${s.text}`).join("\n")}`,
        )
        .join("\n\n---\n\n");

      await resend.emails.send({
        from: process.env.EMAIL_FROM || "Luck Lab <noreply@lucklab.app>",
        to: adminEmail,
        subject: `TikTok script for ${today.toISOString().slice(0, 10)}`,
        html: `<pre style="font-family:monospace;white-space:pre-wrap;max-width:600px;">${scriptSummary}</pre>
<p style="margin-top:24px;color:#999;">Render with: <code>npm run video:render</code></p>`,
      });
    } catch {
      // Non-critical — script generation still succeeds
    }
  }

  return NextResponse.json({
    date: today.toISOString().slice(0, 10),
    count: results.length,
    scripts: results,
    renderCommand: all ? "npm run video:render-all" : "npm run video:render",
  });
}
