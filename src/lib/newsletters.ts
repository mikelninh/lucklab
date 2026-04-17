/**
 * Newsletter loader — reads /content/newsletters/week-XX.md
 * Same pattern as articles: YAML frontmatter + markdown body.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Newsletter = {
  week: number;
  subject: string;
  publishDate: string;
  article?: string; // slug of the linked article
  body: string;     // markdown content
};

const DIR = path.join(process.cwd(), "content", "newsletters");

export function loadAllNewsletters(): Newsletter[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(DIR, f), "utf8");
      const { data, content } = matter(raw);
      return { ...(data as Omit<Newsletter, "body">), body: content.trim() };
    })
    .sort((a, b) => a.week - b.week);
}

export function getThisWeeksNewsletter(now: Date = new Date()): Newsletter | null {
  const all = loadAllNewsletters();
  // Find the newsletter whose publishDate falls within the last 7 days
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return all.find((n) => {
    const pub = new Date(n.publishDate + "T00:00:00Z");
    return pub >= weekAgo && pub <= now;
  }) || null;
}
