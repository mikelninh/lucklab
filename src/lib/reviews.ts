/**
 * Reviews loader — same pattern as articles.
 *
 * Each review is a markdown file in /content/reviews/*.md with YAML frontmatter.
 * Drop one in and it appears on the landing page + /reading/preview + /reviews.
 *
 * No admin UI. No CMS. When a reader emails us a quote we like, we paste it
 * into a new file and commit. Twenty-second workflow.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Review = {
  /** First name only — preserves privacy, increases trust over a full surname */
  name: string;
  /** "The Steerer", "The Reader", etc. — establishes legitimacy ("they actually took it") */
  archetype?:
    | "The Seer"
    | "The Wanderer"
    | "The Steerer"
    | "The Yielder"
    | "The Weaver"
    | "The Reader";
  /** Which tier they bought (or "free" if just the Reading) */
  tier: "free" | "primer" | "full";
  /** Country / city — adds texture, optional */
  location?: string;
  /** Date received, ISO string */
  date: string;
  /** The quote itself, plain text. Keep it short — long quotes hurt scan. */
  quote: string;
  /** If they consented to being a public name, true. Otherwise default false → first name only. */
  publicName?: boolean;
  /** Whether to show on the landing-page hero rail (we curate the strongest 3-5 there) */
  featured?: boolean;
};

const REVIEWS_DIR = path.join(process.cwd(), "content", "reviews");

export function loadAllReviews(): Review[] {
  if (!fs.existsSync(REVIEWS_DIR)) return [];
  return fs
    .readdirSync(REVIEWS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(REVIEWS_DIR, f), "utf8");
      const { data } = matter(raw);
      return data as Review;
    })
    .filter((r): r is Review => !!r?.quote && !!r?.name)
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first
}

export function loadFeaturedReviews(): Review[] {
  return loadAllReviews().filter((r) => r.featured);
}

export function reviewCount(): number {
  return loadAllReviews().length;
}
