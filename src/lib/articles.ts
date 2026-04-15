/**
 * Article loader — reads /content/articles/*.md, parses frontmatter,
 * filters by publish date. Server-only utility.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type ArticleFrontmatter = {
  title: string;
  slug: string;
  description: string;
  targetKeyword?: string;
  publishDate: string; // ISO date YYYY-MM-DD
  wordCount?: number;
  author?: string;
  readingTime?: string;
  internalLinks?: string[];
};

export type Article = ArticleFrontmatter & {
  content: string; // markdown body
};

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

export function getAllArticleFiles(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));
}

export function loadArticleBySlug(slug: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    ...(data as ArticleFrontmatter),
    content,
    slug: data.slug || slug,
  };
}

export function loadAllArticles(): Article[] {
  const files = getAllArticleFiles();
  return files
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      return loadArticleBySlug(slug);
    })
    .filter((a): a is Article => !!a);
}

// An article is "published" if its publishDate is on or before today.
// Unpublished articles are hidden from the index and return 404 on direct visit.
export function isPublished(article: ArticleFrontmatter, now: Date = new Date()): boolean {
  const pub = new Date(article.publishDate + "T00:00:00Z");
  return pub.getTime() <= now.getTime();
}

export function loadPublishedArticles(now?: Date): Article[] {
  return loadAllArticles()
    .filter((a) => isPublished(a, now))
    .sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1)); // newest first
}

export function loadUpcomingArticles(now?: Date): Article[] {
  return loadAllArticles()
    .filter((a) => !isPublished(a, now))
    .sort((a, b) => (a.publishDate < b.publishDate ? -1 : 1)); // soonest first
}

export function estimateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 220));
  return `${mins} min read`;
}
