import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TycheSigil } from "@/components/TycheSigil";
import {
  loadPublishedArticles,
  loadUpcomingArticles,
  estimateReadingTime,
} from "@/lib/articles";

export const metadata = {
  title: "Research — Luck Lab",
  description:
    "Long-form essays on luck, synchronicity, and the twelve traditions. Published weekly.",
};

export const revalidate = 3600; // regenerate hourly so weekly unlocks happen automatically

export default function ResearchIndex() {
  const published = loadPublishedArticles();
  const upcoming = loadUpcomingArticles();

  return (
    <>
      <Nav />
      <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <div className="mb-14">
          <TycheSigil size={64} className="mb-6" />
          <div className="eyebrow mb-3">research</div>
          <h1 className="font-display text-[clamp(44px,6vw,68px)] leading-[1.02] tracking-[-0.02em] font-light text-balance">
            Long essays on <em className="not-italic text-gold-gradient">luck, trained</em>.
          </h1>
          <p className="text-[16px] text-[var(--text-muted)] mt-6 max-w-xl leading-relaxed">
            One essay a week. Twelve wisdom traditions and two decades of empirical
            research, translated into prose you can act on. Cite-worthy. No woo.
          </p>
        </div>

        <div className="hairline-gold my-12" />

        {/* Published */}
        <section>
          <div className="eyebrow mb-6">published</div>
          {published.length === 0 ? (
            <p className="text-[14px] text-[var(--text-muted)] italic">
              The first essay unlocks today. Check back shortly.
            </p>
          ) : (
            <div className="space-y-10">
              {published.map((a) => (
                <Link
                  key={a.slug}
                  href={`/research/${a.slug}`}
                  className="block group"
                >
                  <div className="flex items-baseline justify-between gap-4 flex-wrap mb-2">
                    <div className="font-mono text-[10px] text-[var(--gold)] tracking-wider">
                      {new Date(a.publishDate + "T00:00:00Z")
                        .toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
                        .toUpperCase()}
                    </div>
                    <div className="font-mono text-[10px] text-[var(--text-subtle)] tracking-wider">
                      {a.readingTime || estimateReadingTime(a.content)}
                    </div>
                  </div>
                  <h2 className="font-display text-[26px] md:text-[32px] font-light leading-[1.15] group-hover:text-[var(--gold-bright)] transition-colors">
                    {a.title}
                  </h2>
                  <p className="text-[15px] text-[var(--text-muted)] mt-3 leading-relaxed text-pretty">
                    {a.description}
                  </p>
                  <p className="text-[12px] text-[var(--gold)] mt-3 font-mono tracking-wider">
                    READ →
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section className="mt-20">
            <div className="eyebrow mb-6">upcoming · one per week</div>
            <div className="space-y-5 opacity-60">
              {upcoming.map((a) => (
                <div key={a.slug} className="border-l-2 border-[var(--border)] pl-5 py-2">
                  <div className="flex items-baseline justify-between gap-4 flex-wrap">
                    <h3 className="font-display text-[18px] font-normal text-[var(--text-muted)]">
                      {a.title}
                    </h3>
                    <div className="font-mono text-[10px] text-[var(--text-subtle)] tracking-wider">
                      {new Date(a.publishDate + "T00:00:00Z")
                        .toLocaleDateString("en-GB", { day: "numeric", month: "long" })
                        .toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="hairline my-16" />

        {/* CTA */}
        <div className="text-center">
          <p className="text-[13px] text-[var(--text-muted)] mb-4">
            Want the full research paper instead?
          </p>
          <Link href="/#pricing" className="btn btn-ghost">
            Get the Convergence Index (free)
          </Link>
        </div>
      </article>
      <Footer />
    </>
  );
}
