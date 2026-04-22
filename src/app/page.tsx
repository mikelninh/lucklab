import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TycheSigil } from "@/components/TycheSigil";
import { TRADITIONS } from "@/lib/traditions";
import { EmailCapture } from "@/components/EmailCapture";
import { HeroCelestial } from "@/components/HeroCelestial";
import { TypewriterReading } from "@/components/TypewriterReading";
import { loadPublishedArticles } from "@/lib/articles";

export const revalidate = 3600;

export default function Home() {
  const latestArticles = loadPublishedArticles().slice(0, 3);

  return (
    <>
      <Nav />

      {/* ============================== HERO ============================== */}
      <HeroCelestial />

      {/* ============================== CONVERGENCE ============================== */}
      <section id="convergence" className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
          <div className="md:sticky md:top-28 self-start">
            <div className="eyebrow mb-4">01 / the convergence</div>
            <h2 className="font-display text-[40px] md:text-[52px] leading-[1.05] tracking-[-0.015em] font-light text-balance">
              Twelve traditions.
              <br />
              <em className="not-italic text-[var(--gold)]">One mechanism.</em>
            </h2>
            <p className="text-[15px] text-[var(--text-muted)] mt-6 leading-relaxed">
              Jung called it <span className="kbd kbd-tyche">synchronicity</span>.{" "}
              Taoists call it <span className="kbd kbd-tyche">wu wei</span>.{" "}
              Kabbalists call it <span className="kbd kbd-tyche">mazal</span>.{" "}
              They describe the same phenomenon in different languages &mdash;
              a specific quality of <em className="text-[var(--gold)] not-italic">attention</em>,{" "}
              <em className="text-[var(--gold)] not-italic">openness</em>, and{" "}
              <em className="text-[var(--gold)] not-italic">aligned action</em> that raises the
              probability of meaningful coincidence.
            </p>
          </div>

          <div className="space-y-4">
            {TRADITIONS.slice(0, 8).map((t) => (
              <div
                key={t.id}
                className="group border-l-2 border-[var(--border)] hover:border-[var(--gold)] pl-5 py-2 transition-colors"
              >
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <h3 className="font-display text-[19px] font-normal text-[var(--text)]">
                    {t.name}
                  </h3>
                  <span className="font-mono text-[10px] text-[var(--text-subtle)] tracking-wider">
                    {t.era}
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-3 flex-wrap">
                  <span className="kbd kbd-tyche text-[12px]">{t.concept}</span>
                  <span className="text-[12px] text-[var(--text-subtle)] italic">
                    {t.conceptOrigin}
                  </span>
                </div>
                <p className="text-[14px] text-[var(--text-muted)] mt-2 leading-relaxed">
                  {t.mechanism}
                </p>
              </div>
            ))}
            <details className="group">
              <summary className="cursor-pointer text-[13px] text-[var(--gold)] hover:text-[var(--gold-bright)] font-mono tracking-wider py-3 list-none">
                <span className="inline-block group-open:hidden">+ show 4 more traditions</span>
                <span className="hidden group-open:inline">&minus; collapse</span>
              </summary>
              <div className="space-y-4 mt-2">
                {TRADITIONS.slice(8).map((t) => (
                  <div
                    key={t.id}
                    className="border-l-2 border-[var(--border)] hover:border-[var(--gold)] pl-5 py-2 transition-colors"
                  >
                    <div className="flex items-baseline justify-between gap-4 flex-wrap">
                      <h3 className="font-display text-[19px] font-normal text-[var(--text)]">
                        {t.name}
                      </h3>
                      <span className="font-mono text-[10px] text-[var(--text-subtle)] tracking-wider">
                        {t.era}
                      </span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-3 flex-wrap">
                      <span className="kbd kbd-tyche text-[12px]">{t.concept}</span>
                      <span className="text-[12px] text-[var(--text-subtle)] italic">
                        {t.conceptOrigin}
                      </span>
                    </div>
                    <p className="text-[14px] text-[var(--text-muted)] mt-2 leading-relaxed">
                      {t.mechanism}
                    </p>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>

        <div className="mt-20 card card-gold max-w-3xl mx-auto">
          <div className="eyebrow mb-3">the synthesis</div>
          <p className="font-display text-[22px] md:text-[26px] leading-[1.35] text-[var(--text)] text-balance">
            Every tradition, independently, identifies{" "}
            <em className="not-italic text-[var(--gold)]">the same six levers</em> &mdash;
            and Richard Wiseman&rsquo;s ten-year study at the University of
            Hertfordshire confirmed four of them empirically.
          </p>
          <p className="text-[14px] text-[var(--text-muted)] mt-5 leading-relaxed">
            Lucky people are not born. They exhibit measurable, trainable behaviours.
            We call these behaviours the <span className="text-[var(--gold)]">kairotic profile</span>.
            Your Reading maps yours.
          </p>
        </div>
      </section>

      <div className="hairline-gold max-w-4xl mx-auto" />

      {/* ============================== SAMPLE READING ============================== */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-[1fr_1fr] gap-12 items-start">
          <div>
            <div className="eyebrow eyebrow-tyche mb-4">what you get</div>
            <h2 className="font-display text-[36px] md:text-[44px] leading-[1.08] tracking-[-0.015em] font-light text-balance">
              See what a Reading <em className="not-italic text-[var(--tyche)]">actually looks like</em>.
            </h2>
            <p className="text-[15px] text-[var(--text-muted)] mt-5 leading-relaxed">
              This is a real excerpt from a Reading for a Yielder named Lena.
              Every Reading is unique — Tyche quotes your actual answers back to
              you and finds patterns you hadn&rsquo;t seen.
            </p>
            <Link href="/reading" className="btn btn-primary mt-8">
              Take the Reading
            </Link>
          </div>
          <TypewriterReading />
        </div>
      </section>

      <div className="hairline-gold max-w-4xl mx-auto" />

      {/* ============================== FREE PDF ============================== */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-[1fr_1fr] gap-12 items-center">
          <div>
            <div className="eyebrow mb-4">05 / open access</div>
            <h2 className="font-display text-[36px] md:text-[44px] leading-[1.08] tracking-[-0.015em] font-light text-balance">
              The Luck Convergence Index.
            </h2>
            <p className="text-[15px] text-[var(--text-muted)] mt-5 leading-relaxed">
              Our founding research paper. 40+ pages cross-referencing 12 traditions
              against the modern empirical literature on luck, chance, and serendipity.
              Free to read. 36 citations.
            </p>
            <ul className="mt-6 space-y-2 text-[14px] text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--gold)]">&bull;</span>
                <span>The full convergence table &mdash; every tradition, every mechanism, every source</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--gold)]">&bull;</span>
                <span>Wiseman&rsquo;s Luck Factor framework mapped onto ancient practice</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--gold)]">&bull;</span>
                <span>The six-lever model and why it works</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--gold)]">&bull;</span>
                <span>A starter protocol you can begin tomorrow</span>
              </li>
            </ul>
          </div>

          <EmailCapture />
        </div>
      </section>

      <div className="hairline-gold max-w-4xl mx-auto" />

      {/* ============================== LIBRARY TEASER ============================== */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex items-baseline justify-between gap-6 flex-wrap mb-10">
          <div>
            <div className="eyebrow mb-3">from the library</div>
            <h2 className="font-display text-[32px] md:text-[40px] leading-[1.08] tracking-[-0.015em] font-light text-balance max-w-2xl">
              <em className="not-italic text-[var(--gold)]">New this week.</em> Read one, take the Reading.
            </h2>
          </div>
          <Link
            href="/research"
            className="text-[13px] text-[var(--text-muted)] hover:text-[var(--gold)] transition whitespace-nowrap"
          >
            See all essays &rarr;
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {latestArticles.map((a) => (
            <Link
              key={a.slug}
              href={`/research/${a.slug}`}
              className="group block p-6 rounded-2xl border border-[var(--border)] hover:border-[var(--gold)]/40 bg-[var(--surface)] transition"
            >
              <div className="flex items-baseline justify-between gap-3 mb-4">
                <div className="font-mono text-[10px] text-[var(--gold)] tracking-wider">
                  {new Date(a.publishDate + "T00:00:00Z")
                    .toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                    .toUpperCase()}
                </div>
                <div className="font-mono text-[10px] text-[var(--text-subtle)] tracking-wider">
                  {a.readingTime || "—"}
                </div>
              </div>
              <h3 className="font-display text-[20px] leading-[1.2] tracking-[-0.01em] font-normal mb-3 text-balance group-hover:text-[var(--gold)] transition">
                {a.title}
              </h3>
              <p className="text-[13.5px] text-[var(--text-muted)] leading-relaxed line-clamp-4">
                {a.description}
              </p>
              <div className="mt-5 text-[12px] text-[var(--gold)] opacity-0 group-hover:opacity-100 transition">
                Read &rarr;
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="hairline-gold max-w-4xl mx-auto" />

      {/* ============================== PRE-LAUNCH ============================== */}
      <section id="pre-launch" className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
        <div className="eyebrow mb-4">pre-launch · early access</div>
        <h2 className="font-display text-[32px] md:text-[42px] leading-[1.1] tracking-[-0.015em] font-light mb-5 text-balance">
          A personalised one-to-one <em className="not-italic text-[var(--gold)]">reading with Tyche</em>&nbsp;&mdash; coming soon.
        </h2>
        <p className="text-[15px] text-[var(--text-muted)] max-w-xl mx-auto mb-8 leading-relaxed">
          A 30-day practice tuned to your profile. Built slowly, by hand, in dialogue
          with early readers. Join the list and you&rsquo;ll be among the first to
          try it.
        </p>
        <div className="max-w-md mx-auto">
          <EmailCapture />
        </div>
        <p className="font-mono text-[10px] text-[var(--text-subtle)] tracking-wider mt-6">
          NO SPAM &middot; ONE EMAIL A WEEK &middot; UNSUBSCRIBE ANY TIME
        </p>
      </section>


      {/* ============================== CLOSING ============================== */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <TycheSigil size={64} className="mx-auto mb-8 opacity-60" glow={false} />
        <p className="font-display text-[28px] md:text-[34px] leading-[1.3] text-balance text-[var(--text-muted)]">
          &ldquo;Chance favours the prepared mind.&rdquo;
        </p>
        <p className="font-mono text-[11px] text-[var(--text-subtle)] mt-4 tracking-wider">
          &mdash; Louis Pasteur, 1854
        </p>
        <div className="mt-10">
          <Link href="/reading" className="btn btn-primary">
            Take the Reading · 3 minutes
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M3 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
