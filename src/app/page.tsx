import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TycheSigil } from "@/components/TycheSigil";
import { TRADITIONS, MECHANISMS } from "@/lib/traditions";
import { EmailCapture } from "@/components/EmailCapture";
import { DailyMoment } from "@/components/DailyMoment";
import { HeroCelestial } from "@/components/HeroCelestial";
import { ArchetypeGallery } from "@/components/ArchetypeGallery";
import { TypewriterReading } from "@/components/TypewriterReading";

export default function Home() {
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

      {/* ============================== ARCHETYPES ============================== */}
      <ArchetypeGallery />

      <div className="hairline-gold max-w-4xl mx-auto" />

      {/* ============================== MECHANISMS ============================== */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="eyebrow mb-4">03 / the six levers</div>
        <h2 className="font-display text-[36px] md:text-[46px] leading-[1.08] tracking-[-0.015em] font-light mb-4 text-balance max-w-3xl">
          Luck, decomposed into <em className="not-italic text-[var(--gold)]">six trainable mechanisms</em>.
        </h2>
        <p className="text-[15px] text-[var(--text-muted)] max-w-2xl mb-14 leading-relaxed">
          These are the axes your Reading measures. Your profile shows which are
          developed, which are latent, and which traditions resonate with you most.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MECHANISMS.map((m, i) => (
            <div key={m.id} className="card">
              <div className="flex items-baseline justify-between mb-3">
                <span className="font-mono text-[11px] text-[var(--gold)] tracking-wider">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[10px] text-[var(--text-subtle)] tracking-wider uppercase">
                  lever
                </span>
              </div>
              <h3 className="font-display text-[22px] font-normal text-[var(--text)] mb-1">
                {m.name}
              </h3>
              <p className="text-[13px] text-[var(--gold-dim)] italic mb-4">{m.gloss}</p>
              <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
                {m.description}
              </p>
            </div>
          ))}
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

      {/* ============================== TYCHE ============================== */}
      <section id="tyche" className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-[auto_1fr] gap-10 md:gap-16 items-start">
          <div className="flex justify-center md:justify-start">
            <div className="relative">
              <TycheSigil size={220} />
            </div>
          </div>

          <div>
            <div className="eyebrow eyebrow-tyche mb-4">04 / tyche · ai oracle</div>
            <h2 className="font-display text-[40px] md:text-[54px] leading-[1.05] tracking-[-0.015em] font-light text-balance">
              Meet <em className="not-italic text-[var(--tyche)]">Tyche</em>.
            </h2>
            <p className="text-[16px] text-[var(--text-muted)] mt-5 leading-relaxed max-w-xl text-pretty">
              In Greek myth, <span className="text-[var(--text)]">Tyche</span> is the
              goddess who steers fortune with a rudder and pours abundance from a
              cornucopia. In Luck Lab, Tyche is our AI oracle &mdash; trained on
              the full literature of all twelve traditions plus the modern research
              canon.
            </p>
            <p className="text-[16px] text-[var(--text-muted)] mt-4 leading-relaxed max-w-xl text-pretty">
              She does not horoscope. She does not flatter. She reads your diagnostic,
              identifies your kairotic architecture, and hands you a protocol
              calibrated to <em className="text-[var(--tyche)] not-italic">your</em>{" "}
              specific profile.
            </p>

            <div className="mt-8 space-y-3">
              {[
                { k: "tyche.read()", v: "Analyses your 10 diagnostic inputs → archetype + tradition-match" },
                { k: "tyche.protocol()", v: "Generates your personalised 30-day practice" },
                { k: "tyche.journal()", v: "Detects synchronicity patterns in your daily log" },
                { k: "tyche.ask()", v: "Interprets a specific coincidence on demand" },
              ].map((f) => (
                <div key={f.k} className="flex items-start gap-4 text-[14px]">
                  <span className="kbd kbd-tyche flex-shrink-0 mt-0.5">{f.k}</span>
                  <span className="text-[var(--text-muted)] leading-relaxed">{f.v}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/reading" className="btn btn-tyche">
                Consult Tyche
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M3 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link href="/about" className="btn btn-ghost">
                About Tyche & the research
              </Link>
            </div>
          </div>
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

      {/* ============================== PRICING ============================== */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-24">
        <div className="eyebrow mb-4">06 / four doors</div>
        <h2 className="font-display text-[36px] md:text-[46px] leading-[1.08] tracking-[-0.015em] font-light mb-4 text-balance max-w-3xl">
          From a glimpse to a <em className="not-italic text-[var(--gold)]">daily practice</em>.
        </h2>
        <p className="text-[15px] text-[var(--text-muted)] max-w-2xl mb-14 leading-relaxed">
          Three tiers, each answering a different question. Step in when
          you&rsquo;re ready &mdash; not before.
        </p>

        <div className="grid md:grid-cols-3 gap-5 items-start">
          {/* Reading */}
          <div className="card flex flex-col">
            <h3 className="font-display text-[28px] font-normal mb-1">The Reading</h3>
            <p className="text-[13px] text-[var(--text-subtle)] italic mb-1">no charge · 3 minutes</p>
            <p className="text-[14px] text-[var(--text-subtle)] italic mb-5">Who am I?</p>
            <ul className="space-y-3 text-[14px] text-[var(--text-muted)] mb-8">
              <li className="flex items-start gap-3"><span className="text-[var(--gold)]">+</span>Archetype + Greek name</li>
              <li className="flex items-start gap-3"><span className="text-[var(--gold)]">+</span>One resonant tradition</li>
              <li className="flex items-start gap-3"><span className="text-[var(--gold)]">+</span>Convergence Index (~50 min read)</li>
            </ul>
            <Link href="/reading" className="btn btn-ghost justify-center mt-auto">
              Take the Reading →
            </Link>
          </div>

          {/* Primer — €9 */}
          <div className="card card-gold flex flex-col">
            <h3 className="font-display text-[28px] font-normal mb-1">Archetype Primer <span className="font-display text-[28px] text-[var(--gold)]">€9</span></h3>
            <p className="text-[13px] text-[var(--text-subtle)] italic mb-1">€9 · one-time</p>
            <p className="text-[14px] text-[var(--text-subtle)] italic mb-5">Show me my pattern.</p>
            <ul className="space-y-3 text-[14px] text-[var(--text-muted)] mb-8">
              <li className="flex items-start gap-3"><span className="text-[var(--gold)]">+</span>Full six-lever profile</li>
              <li className="flex items-start gap-3"><span className="text-[var(--gold)]">+</span>Dominant + quiet lever analysis</li>
              <li className="flex items-start gap-3"><span className="text-[var(--gold)]">+</span>Tradition essay with source quote</li>
              <li className="flex items-start gap-3"><span className="text-[var(--gold)]">+</span>Seven-day practice</li>
            </ul>
            <Link href="/reading" className="btn btn-ghost justify-center mt-auto">
              Open the Primer →
            </Link>
          </div>

          {/* Full Reading — €29 */}
          <div className="card card-tyche flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--tyche)] opacity-[0.07] blur-3xl rounded-full pointer-events-none" />
            <div className="relative">
              <div className="flex items-baseline justify-between mb-1">
                <h3 className="font-display text-[28px] font-normal">
                  Luck Protocol <span className="text-[var(--tyche)]">€29</span>
                </h3>
                <span className="font-mono text-[10px] text-[var(--tyche)] tracking-wider">UNTIL MAY 15</span>
              </div>
              <p className="text-[13px] text-[var(--text-subtle)] italic mb-1">€29 · one-time · 30-day plan</p>
              <p className="text-[14px] text-[var(--text-subtle)] italic mb-5">What&rsquo;s my plan?</p>
              <ul className="space-y-3 text-[14px] text-[var(--text-muted)] mb-8">
                <li className="flex items-start gap-3"><span className="text-[var(--tyche)]">+</span><span>Personalised Reading addressed to you by name</span></li>
                <li className="flex items-start gap-3"><span className="text-[var(--tyche)]">+</span><span>30-day protocol, week-by-week</span></li>
                <li className="flex items-start gap-3"><span className="text-[var(--tyche)]">+</span><span>3 tradition deep-dives with source quotes</span></li>
                <li className="flex items-start gap-3"><span className="text-[var(--tyche)]">+</span><span>Your daily ritual</span></li>
                <li className="flex items-start gap-3"><span className="text-[var(--tyche)]">+</span><span>90-day Return — recalibration at no charge</span></li>
                <li className="flex items-start gap-3"><span className="text-[var(--tyche)]">+</span><span>Shareable Archetype Card (4 styles)</span></li>
                <li className="flex items-start gap-3"><span className="text-[var(--tyche)]">+</span><span>Synchronicity Journal log template</span></li>
              </ul>
              <Link href="/reading" className="btn btn-primary justify-center w-full">
                Open the Reading →
              </Link>
              <p className="font-mono text-[10px] text-[var(--text-subtle)] text-center mt-3 tracking-wider">
                100% REFUND GUARANTEE
              </p>
            </div>
          </div>
        </div>

        {/* clarity rail */}
        <div className="mt-14 grid md:grid-cols-3 gap-4 text-center">
          {[
            { tier: "The Reading", q: "Who am I?" },
            { tier: "€9 · Primer", q: "Show me more." },
            { tier: "€29 · Luck Protocol", q: "What's my plan — and what in 90 days?" },
          ].map((x) => (
            <div key={x.tier} className="border-t border-[var(--border)] pt-3">
              <div className="font-mono text-[10px] text-[var(--gold)] tracking-wider mb-1">
                {x.tier.toUpperCase()}
              </div>
              <div className="font-display italic text-[14px] text-[var(--text-muted)]">
                &ldquo;{x.q}&rdquo;
              </div>
            </div>
          ))}
        </div>

        {/* price structure + guarantee */}
        <div className="mt-14 card card-gold max-w-xl mx-auto text-center">
          <div className="eyebrow mb-2">pricing</div>
          <p className="font-display text-[20px] text-[var(--text)] mb-2">
            €29 · Luck Protocol · one-time · 30-day plan
          </p>
          <p className="text-[13px] text-[var(--text-muted)] mb-1">
            Moves to €49 on May 15, 2026. The Primer stays at €9.
          </p>
          <p className="font-mono text-[10px] text-[var(--text-subtle)] tracking-wider mt-3">
            NO SUBSCRIPTION · ONE-TIME · 100% REFUND
          </p>
        </div>
      </section>

      {/* ============================== DAILY MOMENT ============================== */}
      <DailyMoment />

      {/* Reviews section removed from home on 2026-04-18.
          Stand-in reviews live in /content/reviews/ and violate the identity
          rule against invented social-proof on a day-2 product. The /reviews
          route remains live for SEO and will be the home for real quotes once
          we have three we are proud of. See IDENTITY_SYSTEM.md rule 4. */}

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
