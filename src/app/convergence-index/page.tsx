import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TycheSigil } from "@/components/TycheSigil";
import { DownloadPdfButton } from "@/components/DownloadPdfButton";

export const metadata = {
  title: "The Luck Convergence Index — Luck Lab",
  description:
    "Twelve wisdom traditions and two decades of empirical research converge on a single conclusion: luck is a trainable disposition.",
};

export const revalidate = 3600;

export default function ConvergenceIndexPage() {
  const filePath = path.join(
    process.cwd(),
    "content",
    "luck-convergence-index.md",
  );
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return (
    <>
      <Nav />

      {/* COVER — only visible on screen, becomes first PDF page */}
      <section className="max-w-[680px] mx-auto px-6 pt-16 md:pt-24 pb-8 text-center break-after-page">
        <TycheSigil size={96} className="mx-auto mb-8" />
        <div className="eyebrow mb-4">
          {String(data.version || "v1.0 · April 2026")}
        </div>
        <h1 className="font-display text-[clamp(42px,6vw,72px)] leading-[1.05] tracking-[-0.02em] font-light text-balance">
          <em className="not-italic text-gold-gradient">
            {String(data.title || "The Luck Convergence Index")}
          </em>
        </h1>
        <p className="text-[17px] text-[var(--text-muted)] mt-6 max-w-lg mx-auto leading-relaxed italic">
          {String(data.subtitle || "Twelve wisdom traditions, one trainable disposition.")}
        </p>
        <p className="font-mono text-[11px] text-[var(--text-subtle)] mt-10 tracking-wider">
          LUCK LAB &middot; {String(data.word_count || "~12,000")} WORDS
        </p>

        <div className="mt-12 flex flex-wrap gap-3 justify-center no-print">
          <DownloadPdfButton label="Save as PDF" />
          <Link href="/reading" className="btn btn-primary">
            Begin Your Reading →
          </Link>
        </div>

        <div className="hairline-gold mt-16" />
      </section>

      {/* BODY */}
      <article className="max-w-[680px] mx-auto px-6 pb-24">
        <div className="prose-kairos">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>

        {/* Closing CTA — hidden on print */}
        <div className="mt-24 pt-16 border-t border-[var(--border)] text-center no-print">
          <TycheSigil size={56} className="mx-auto mb-6 opacity-60" glow={false} />
          <p className="font-display text-[22px] text-[var(--text-muted)] italic text-balance max-w-md mx-auto mb-6">
            You have read the map. Now take three minutes for the specific one.
          </p>
          <Link href="/reading" className="btn btn-primary">
            Begin Your Reading · free
          </Link>
          <div className="mt-8">
            <DownloadPdfButton label="Save this Index as PDF" />
          </div>
        </div>
      </article>

      <Footer />
    </>
  );
}
