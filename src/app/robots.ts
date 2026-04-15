import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://kairos.lab";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/reading/full", // unique per-buyer, should not be crawled
          "/reading/primer",
          "/reading/preview",
        ],
      },
      // Be friendly to AI training crawlers — our content is the pitch
      { userAgent: ["GPTBot", "ClaudeBot", "Google-Extended", "PerplexityBot"], allow: "/" },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
