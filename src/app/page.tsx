import Link from "next/link";
import Image from "next/image";
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
  const featuredPosters = [
    "01-train-your-luck.svg",
    "03-fortune-favors-the-curious.svg",
    "07-kairos-over-chronos.svg",
    "10-become-a-luck-magnet.svg",
  ];

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

      {/* ============================== POSTERS ============================== */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
          <div>
            <div className="eyebrow mb-3">new / print shop</div>
            <h2 className="font-display text-[32px] md:text-[40px] leading-[1.08] tracking-[-0.015em] font-light text-balance max-w-2xl">
              Top 10 bestseller posters,
              <em className="not-italic text-[var(--gold)]"> now live in the app.</em>
            </h2>
            <p className="mt-4 text-[14px] text-[var(--text-muted)] leading-relaxed max-w-2xl">
              Browse, preview, and open the original print-ready SVG files directly.
            </p>
          </div>
          <Link href="/posters" className="btn btn-primary">
            View all posters
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredPosters.map((file) => {
            const href = `/posters/top-10-bestsellers/${file}`;
            return (
              <Link
                key={file}
                href="/posters"
                className="panel overflow-hidden hover:border-[var(--gold)]/40 transition"
              >
                <Image
                  src={href}
                  alt={`Luck Lab featured poster ${file}`}
                  width={800}
                  height={1000}
                  className="w-full h-auto aspect-[4/5] object-cover"
                  unoptimized
                />
              </Link>
            );
          })}
        </div>
      </section>

      <div className="hairline-gold max-w-4xl mx-auto" />

      {/* ============================== PRICING ============================== */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-14">
          <div className="eyebrow mb-3">how to begin</div>
          <h2 className="font-display text-[32px] md:text-[42px] leading-[1.1] tracking-[-0.015em] font-light text-balance">
            Three doors. <em className="not-italic text-[var(--gold)]">Choose what fits.</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5 items-stretch">

          {/* Free Reading */}
          <div className="card flex flex-col">
            <div className="font-mono text-[10px] text-[var(--text-subtle)] tracking-wider mb-3">FREE · 3 MINUTES</div>
            <h3 className="font-display text-[26px] font-normal mb-1">The Reading</h3>
            <p className="text-[14px] text-[var(--text-subtle)] italic mb-5">Who am I?</p>
            <ul className="space-y-2.5 text-[14px] text-[var(--text-muted)] mb-7 flex-1">
              <li className="flex items-start gap-3"><span className="text-[var(--gold)]">+</span>Archetype + Greek name</li>
              <li className="flex items-start gap-3"><span className="text-[var(--gold)]">+</span>One resonant tradition</li>
              <li className="flex items-start gap-3"><span className="text-[var(--gold)]">+</span>Convergence Index (long read)</li>
            </ul>
            <Link href="/reading" className="btn btn-ghost justify-center">
              Take the Reading &rarr;
            </Link>
          </div>

          {/* Primer €9 */}
          <div className="card card-gold flex flex-col">
            <div className="font-mono text-[10px] text-[var(--gold)] tracking-wider mb-3">€9 · ONE-TIME · INSTANT</div>
            <h3 className="font-display text-[26px] font-normal mb-1">Archetype Primer</h3>
            <p className="text-[14px] text-[var(--text-subtle)] italic mb-5">Show me my pattern.</p>
            <ul className="space-y-2.5 text-[14px] text-[var(--text-muted)] mb-7 flex-1">
              <li className="flex items-start gap-3"><span className="text-[var(--gold)]">+</span>Full six-lever profile</li>
              <li className="flex items-start gap-3"><span className="text-[var(--gold)]">+</span>Dominant + quiet lever analysis</li>
              <li className="flex items-start gap-3"><span className="text-[var(--gold)]">+</span>Tradition essay with source quote</li>
              <li className="flex items-start gap-3"><span className="text-[var(--gold)]">+</span>Seven-day practice</li>
            </ul>
            <Link href="/reading" className="btn btn-primary justify-center">
              Open the Primer &rarr;
            </Link>
          </div>

          {/* Tyche — pay what you want */}
          <div className="card card-tyche flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--tyche)] opacity-[0.05] blur-3xl rounded-full pointer-events-none" />
            <div className="relative flex flex-col flex-1">
              <div className="font-mono text-[10px] text-[var(--tyche)] tracking-wider mb-3">BETA · PAY WHAT YOU WANT</div>
              <h3 className="font-display text-[26px] font-normal mb-1">Tyche Reading</h3>
              <p className="text-[14px] text-[var(--text-subtle)] italic mb-5">What&rsquo;s my plan?</p>
              <ul className="space-y-2.5 text-[14px] text-[var(--text-muted)] mb-7 flex-1">
                <li className="flex items-start gap-3"><span className="text-[var(--tyche)]">+</span>Personalised reading addressed by name</li>
                <li className="flex items-start gap-3"><span className="text-[var(--tyche)]">+</span>30-day practice tuned to your profile</li>
                <li className="flex items-start gap-3"><span className="text-[var(--tyche)]">+</span>3 tradition deep-dives</li>
                <li className="flex items-start gap-3"><span className="text-[var(--tyche)]">+</span>Synchronicity Journal template</li>
              </ul>
              <Link href="/reading" className="btn btn-tyche justify-center">
                Beta access &rarr;
              </Link>
              <p className="font-mono text-[10px] text-[var(--text-subtle)] text-center mt-3 tracking-wider">
                €5 MIN &middot; PAY WHAT IT&apos;S WORTH
              </p>
            </div>
          </div>

        </div>

        {/* Pre-launch list (smaller, secondary) */}
        <div className="mt-16 max-w-xl mx-auto text-center">
          <div className="eyebrow mb-3">not ready yet?</div>
          <p className="text-[14px] text-[var(--text-muted)] mb-5 leading-relaxed">
            Join the list — one quiet email a week, an essay or a field note. Unsubscribe any time.
          </p>
          <EmailCapture />
        </div>
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
