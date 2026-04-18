/**
 * Weekly-social cron — fires every Wednesday 09:00 UTC.
 * Picks up the freshly-unlocked article and drafts social post copy for
 * X and LinkedIn, posting them to a Slack/Discord webhook (not auto-posting to
 * X — too risky reputationally; you approve and post manually).
 *
 * Vercel Cron config: see /vercel.json.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyCron } from "@/lib/cron-auth";
import { loadPublishedArticles } from "@/lib/articles";

export const runtime = "nodejs";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://lucklab.app";

export async function GET(req: NextRequest) {
  const deny = verifyCron(req);
  if (deny) return deny;

  // Find the article that unlocked in the last 7 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const recent = loadPublishedArticles().filter(
    (a) => new Date(a.publishDate + "T00:00:00Z") >= cutoff,
  );
  const article = recent[0];
  if (!article) {
    return NextResponse.json({ ok: true, skipped: "no-new-article" });
  }

  const threadDraft = draftXThread(article);
  const liDraft = draftLinkedIn(article);

  const webhook = process.env.SOCIAL_DRAFTS_WEBHOOK; // Slack or Discord
  if (webhook) {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `🧵 Weekly social drafts ready — *${article.title}*`,
        attachments: [
          { title: "X thread", text: threadDraft },
          { title: "LinkedIn post", text: liDraft },
          { title: "URL", text: `${APP_URL}/research/${article.slug}` },
        ],
      }),
    });
  }

  return NextResponse.json({
    ok: true,
    article: article.slug,
    xThread: threadDraft,
    linkedIn: liDraft,
  });
}

function draftXThread(a: {
  title: string;
  description: string;
  slug: string;
}): string {
  return `🧵 This week's Kairos essay: "${a.title}"

${a.description}

[thread incoming — excerpt the article's 5 strongest beats as tweets 2-6]

Full essay + free Reading: ${APP_URL}/research/${a.slug}`;
}

function draftLinkedIn(a: {
  title: string;
  description: string;
  slug: string;
}): string {
  return `New long-form essay on Luck Lab: "${a.title}"

${a.description}

If you work in [adjacent domain], the thesis lands differently than typical self-help writing does — it's grounded in primary sources and empirical research.

${APP_URL}/research/${a.slug}`;
}
