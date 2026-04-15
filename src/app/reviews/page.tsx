import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TycheSigil } from "@/components/TycheSigil";
import { loadAllReviews } from "@/lib/reviews";

export const metadata = {
  title: "Readers — Kairos Lab",
  description: "What readers have written back after taking the Reading.",
};

export default function ReviewsPage() {
  const reviews = loadAllReviews();

  return (
    <>
      <Nav />
      <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <div className="mb-14">
          <TycheSigil size={64} className="mb-6" />
          <div className="eyebrow mb-3">readers</div>
          <h1 className="font-display text-[clamp(40px,6vw,64px)] leading-[1.05] tracking-[-0.02em] font-light text-balance">
            What readers have <em className="not-italic text-gold-gradient">written back</em>.
          </h1>
          <p className="text-[15px] text-[var(--text-muted)] mt-6 max-w-xl leading-relaxed">
            We don&rsquo;t collect star ratings. We don&rsquo;t solicit
            five-paragraph endorsements. We ask each Reading buyer one question a
            week after they receive it: <em>did Tyche get it right?</em> When
            someone writes back with a sentence we&rsquo;re proud of, we ask if
            we may publish it. These are those replies.
          </p>
        </div>

        <div className="hairline-gold mb-12" />

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="eyebrow eyebrow-tyche mb-4">early days</div>
            <p className="font-display text-[24px] md:text-[28px] leading-[1.4] text-[var(--text-muted)] italic max-w-md mx-auto text-balance mb-8">
              No readers have written back yet. Kairos Lab launched in April 2026.
            </p>
            <Link href="/reading" className="btn btn-primary">
              Begin Your Reading · free
            </Link>
            <p className="text-[12px] text-[var(--text-subtle)] font-mono tracking-wider mt-4">
              YOU MAY BE THE FIRST QUOTE ON THIS PAGE
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {reviews.map((r, i) => {
              const display = r.publicName ? r.name : r.name.split(" ")[0];
              return (
                <figure key={i} className="border-l-2 border-[var(--gold-dim)] pl-6 py-2">
                  <blockquote className="font-display text-[18px] md:text-[20px] leading-[1.55] text-[var(--text)] italic mb-4">
                    &ldquo;{r.quote}&rdquo;
                  </blockquote>
                  <figcaption className="text-[13px] text-[var(--text-muted)] flex items-baseline justify-between gap-4 flex-wrap">
                    <span>
                      <strong className="text-[var(--text)] font-medium">{display}</strong>
                      {r.location && <span className="text-[var(--text-subtle)]">, {r.location}</span>}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--gold)] tracking-wider uppercase">
                      {r.archetype || "Reader"} · {r.tier === "full" ? "Full Reading" : r.tier === "primer" ? "Primer" : "Free Reading"}
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        )}

        <div className="mt-20 pt-12 border-t border-[var(--border)] text-center">
          <p className="text-[14px] text-[var(--text-muted)] mb-4 italic">
            Took your Reading and want to write back? We read everything.
          </p>
          <a href="mailto:hallo@kairos.lab" className="btn btn-ghost">
            Write to Tyche
          </a>
        </div>
      </article>
      <Footer />
    </>
  );
}
