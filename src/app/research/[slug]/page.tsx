import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TycheSigil } from "@/components/TycheSigil";
import {
  loadArticleBySlug,
  loadAllArticles,
  isPublished,
  estimateReadingTime,
} from "@/lib/articles";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateStaticParams() {
  return loadAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = loadArticleBySlug(slug);
  if (!article) return { title: "Not found" };
  return {
    title: `${article.title} — Kairos Lab`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.publishDate,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = loadArticleBySlug(slug);
  if (!article) notFound();

  const published = isPublished(article);

  if (!published) {
    const publishDate = new Date(article.publishDate + "T00:00:00Z");
    return (
      <>
        <Nav />
        <article className="max-w-2xl mx-auto px-6 py-24 text-center">
          <TycheSigil size={56} className="mx-auto mb-6 opacity-50" glow={false} />
          <div className="eyebrow eyebrow-muted mb-4">coming soon</div>
          <h1 className="font-display text-[40px] md:text-[54px] leading-[1.05] font-light text-balance mb-4">
            {article.title}
          </h1>
          <p className="text-[14px] text-[var(--text-muted)] mb-8 max-w-md mx-auto">
            {article.description}
          </p>
          <p className="font-mono text-[12px] text-[var(--gold)] tracking-wider">
            PUBLISHES {publishDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }).toUpperCase()}
          </p>
          <div className="mt-10">
            <Link href="/research" className="btn btn-ghost">
              Back to Research
            </Link>
          </div>
        </article>
        <Footer />
      </>
    );
  }

  const readingTime = article.readingTime || estimateReadingTime(article.content);
  const publishedDate = new Date(article.publishDate + "T00:00:00Z");

  return (
    <>
      <Nav />

      <article className="max-w-[680px] mx-auto px-6 py-16 md:py-24">
        {/* header */}
        <header className="mb-14">
          <div className="flex items-baseline justify-between gap-4 flex-wrap mb-4">
            <Link
              href="/research"
              className="font-mono text-[11px] text-[var(--gold)] tracking-wider hover:text-[var(--gold-bright)]"
            >
              ← RESEARCH
            </Link>
            <div className="font-mono text-[11px] text-[var(--text-subtle)] tracking-wider">
              {readingTime}
            </div>
          </div>
          <h1 className="font-display text-[clamp(38px,5vw,60px)] leading-[1.08] tracking-[-0.015em] font-light text-balance mb-5">
            {article.title}
          </h1>
          <p className="text-[17px] text-[var(--text-muted)] leading-relaxed text-pretty">
            {article.description}
          </p>
          <p className="font-mono text-[11px] text-[var(--text-subtle)] mt-6 tracking-wider">
            {publishedDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }).toUpperCase()}
            {" · "}
            KAIROS LAB
          </p>
        </header>

        <div className="hairline-gold mb-12" />

        {/* body — prose styled */}
        <div className="prose-kairos">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
        </div>

        <div className="hairline-gold mt-20 mb-12" />

        {/* closing CTA */}
        <div className="text-center py-8">
          <TycheSigil size={56} className="mx-auto mb-6 opacity-60" glow={false} />
          <p className="font-display text-[22px] text-[var(--text-muted)] italic text-balance max-w-md mx-auto mb-6">
            When you are ready &mdash; Tyche has been expecting you.
          </p>
          <Link href="/reading" className="btn btn-primary">
            Begin Your Reading · free
          </Link>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/research"
            className="font-mono text-[11px] text-[var(--text-muted)] hover:text-[var(--gold)] tracking-wider"
          >
            ← MORE ESSAYS
          </Link>
        </div>
      </article>

      <Footer />
    </>
  );
}
