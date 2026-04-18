import Link from "next/link";
import { TycheSigil } from "./TycheSigil";
import { loadFeaturedReviews, loadAllReviews, type Review } from "@/lib/reviews";

/**
 * The reviews rail — drops onto the landing page.
 * If we have 3+ featured reviews, show them.
 * Otherwise show the empty state, which is *itself* a conversion device.
 */

export function ReviewsRail() {
  const featured = loadFeaturedReviews();
  const total = loadAllReviews().length;

  if (featured.length < 3) {
    return <EmptyState total={total} />;
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <div className="eyebrow mb-4">06 / from readers</div>
      <h2 className="font-display text-[36px] md:text-[46px] leading-[1.08] tracking-[-0.015em] font-light mb-4 text-balance max-w-3xl">
        What Tyche has heard back.
      </h2>
      <p className="text-[14px] text-[var(--text-muted)] max-w-2xl mb-12 leading-relaxed">
        Quotes from {total} {total === 1 ? "reader" : "readers"} who took the
        Reading and wrote back. First names only unless they asked otherwise.
      </p>

      <div className="grid md:grid-cols-3 gap-5">
        {featured.slice(0, 3).map((r, i) => (
          <ReviewCard key={i} review={r} />
        ))}
      </div>

      {total > 3 && (
        <div className="text-center mt-10">
          <Link
            href="/reviews"
            className="text-[13px] font-mono tracking-wider text-[var(--gold)] hover:text-[var(--gold-bright)]"
          >
            READ ALL {total} →
          </Link>
        </div>
      )}
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const display = review.publicName ? review.name : review.name.split(" ")[0];
  return (
    <figure className="card flex flex-col">
      <blockquote className="font-display text-[16px] md:text-[17px] text-[var(--text)] leading-[1.6] flex-1 mb-5 italic">
        &ldquo;{review.quote}&rdquo;
      </blockquote>
      <figcaption className="border-t border-[var(--border)] pt-4">
        <div className="text-[14px] text-[var(--text)] font-medium">
          {display}
          {review.location && (
            <span className="text-[var(--text-subtle)] font-normal">, {review.location}</span>
          )}
        </div>
        <div className="font-mono text-[10px] text-[var(--gold)] tracking-wider mt-1 uppercase">
          {review.archetype || "—"} &middot; {review.tier === "full" ? "Full Reading" : review.tier === "primer" ? "Primer" : "Reading"}
        </div>
      </figcaption>
    </figure>
  );
}

/**
 * Empty state — visible until 3 featured reviews exist.
 *
 * We do NOT fake reviews. We do not write "5 stars from over 1,000 customers".
 * Instead we lean *into* being early. "Be among the first" is itself a hook —
 * for the right audience it's more compelling than a stale review wall.
 */
function EmptyState({ total }: { total: number }) {
  return (
    <section className="max-w-3xl mx-auto px-6 py-24 text-center">
      <TycheSigil size={56} className="mx-auto mb-6 opacity-60" glow={false} />
      <div className="eyebrow eyebrow-tyche mb-3">early days</div>
      <h2 className="font-display text-[32px] md:text-[40px] leading-[1.1] tracking-[-0.015em] font-light text-balance mb-5">
        Luck Lab is <em className="not-italic text-[var(--gold)]">new</em>.
      </h2>
      <p className="text-[15px] text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed mb-3">
        We launched in April 2026. {total > 0 ? (
          <>So far <span className="text-[var(--text)]">{total}</span> {total === 1 ? "reader has" : "readers have"} written back. We&rsquo;ll publish a quote rail here once we have three we&rsquo;re proud of &mdash; not before.</>
        ) : (
          <>No reader has written back yet. We&rsquo;ll publish a quote rail here once we have three we&rsquo;re proud of &mdash; not before.</>
        )}
      </p>
      <p className="text-[15px] text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed mb-8">
        If the Reading lands for you, you may be the first quote on this page.
      </p>
      <Link href="/reading" className="btn btn-ghost">
        Begin Your Reading &middot; free
      </Link>
    </section>
  );
}

/* Inline mini-rail (3 quotes max) for use on /reading/preview */
export function ReviewsInline() {
  const featured = loadFeaturedReviews().slice(0, 3);
  if (featured.length < 1) return null;

  return (
    <div className="my-12 py-8 border-y border-[var(--border)]">
      <div className="eyebrow eyebrow-muted mb-5 text-[10px] text-center">
        from other readers
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {featured.map((r, i) => (
          <blockquote key={i} className="text-center">
            <p className="font-display text-[14px] italic text-[var(--text-muted)] leading-relaxed mb-3">
              &ldquo;{r.quote.length > 140 ? r.quote.slice(0, 137) + "…" : r.quote}&rdquo;
            </p>
            <div className="font-mono text-[10px] text-[var(--gold)] tracking-wider uppercase">
              {r.publicName ? r.name : r.name.split(" ")[0]} &middot; {r.archetype || "Reader"}
            </div>
          </blockquote>
        ))}
      </div>
    </div>
  );
}
