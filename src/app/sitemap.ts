import type { MetadataRoute } from "next";
import { loadPublishedArticles } from "@/lib/articles";

/**
 * Sitemap — tells Google + Bing about every public URL.
 * Regenerates at build time and (via ISR on article routes) weekly.
 */

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://lucklab.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,                 changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/reading`,          changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/about`,            changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/research`,         changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/reviews`,          changeFrequency: "weekly",  priority: 0.5 },
    { url: `${BASE}/convergence-index`,changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`,          changeFrequency: "yearly",  priority: 0.5 },
    { url: `${BASE}/impressum`,        changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/privacy`,          changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/terms`,            changeFrequency: "yearly",  priority: 0.3 },
  ];

  const articles = loadPublishedArticles().map((a) => ({
    url: `${BASE}/research/${a.slug}`,
    lastModified: new Date(a.publishDate + "T00:00:00Z"),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...articles];
}
