/**
 * JSON-LD structured data helpers.
 * Embeds Schema.org markup that tells Google what each page is about,
 * unlocks rich snippets in search results.
 */

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://lucklab.app";

export const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Luck Lab",
  url: BASE,
  logo: `${BASE}/logo.png`,
  sameAs: [] as string[], // fill with social URLs once they exist
  description:
    "A research platform on luck, synchronicity, and serendipity. Twelve wisdom traditions and two decades of empirical research converge on a single conclusion: luck is a trainable disposition.",
};

export const WEBSITE = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Luck Lab",
  url: BASE,
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE}/research?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export function articleLD(args: {
  title: string;
  description: string;
  slug: string;
  publishDate: string;
  author?: string;
  wordCount?: number;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    url: `${BASE}/research/${args.slug}`,
    image: args.image || `${BASE}/og/${args.slug}.png`,
    datePublished: args.publishDate,
    author: { "@type": "Organization", name: args.author || "Luck Lab", url: BASE },
    publisher: {
      "@type": "Organization",
      name: "Luck Lab",
      logo: { "@type": "ImageObject", url: `${BASE}/logo.png` },
    },
    wordCount: args.wordCount,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE}/research/${args.slug}`,
    },
  };
}

export function productLD(args: {
  name: string;
  description: string;
  price: number; // in EUR
  sku: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: args.name,
    description: args.description,
    sku: args.sku,
    brand: { "@type": "Brand", name: "Luck Lab" },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: args.price,
      availability: "https://schema.org/InStock",
      url: `${BASE}${args.path}`,
    },
  };
}

export function faqLD(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c"); // XSS-safe for <script>
}
