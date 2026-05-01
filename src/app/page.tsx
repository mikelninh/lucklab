import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TycheSigil } from "@/components/TycheSigil";
import { EmailCapture } from "@/components/EmailCapture";
import { HeroCelestial } from "@/components/HeroCelestial";
import { TypewriterReading } from "@/components/TypewriterReading";
import { ReviewsRail } from "@/components/Reviews";

export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Nav />

      {/* ============================== HERO ============================== */}
      <HeroCelestial />

      {/* ============================== CONVERGENCE ============================== */}
      <section id="convergence" className="max-w-5xl mx-auto px-6 py-24 md:py-28">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              title: "Measure your luck",
              body: "Ten questions map the habits that shape whether luck finds you, misses you, or repeats.",
            },
            {
              title: "See the proof",
              body: "The Reading quotes your answers back and shows one tradition that actually fits your luck pattern.",
            },
            {
              title: "Start the practice",
              body: "The Primer turns the result into a seven-day practice you can use immediately.",
            },
          ].map((item) => (
            <div key={item.title} className="card">
              <div className="eyebrow mb-3">{item.title}</div>
              <p className="text-[15px] text-[var(--text-muted)] leading-relaxed">
                {item.body}
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
              See what a real Reading <em className="not-italic text-[var(--tyche)]">feels like</em>.
            </h2>
            <p className="text-[15px] text-[var(--text-muted)] mt-5 leading-relaxed">
              This is a real excerpt from a full Reading. It quotes your own
              answers back to you, then shows the exact tension shaping the
              rest of the document.
            </p>
            <Link href="/reading" className="btn btn-primary mt-8">
              Take the Reading
            </Link>
          </div>
          <TypewriterReading />
        </div>
      </section>

      <div className="hairline-gold max-w-4xl mx-auto" />

      <ReviewsRail />

      <div className="hairline-gold max-w-4xl mx-auto" />

      {/* ============================== PRICING ============================== */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-14">
          <div className="eyebrow mb-3">how to begin</div>
          <h2 className="font-display text-[32px] md:text-[42px] leading-[1.1] tracking-[-0.015em] font-light text-balance">
            Start here. <em className="not-italic text-[var(--gold)]">One paid step.</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5 items-stretch max-w-4xl mx-auto">

          {/* Free Reading */}
          <div className="card flex flex-col">
            <div className="font-mono text-[10px] text-[var(--text-subtle)] tracking-wider mb-3">FREE · 3 MINUTES</div>
            <h3 className="font-display text-[26px] font-normal mb-1">The Reading</h3>
            <p className="text-[14px] text-[var(--text-subtle)] italic mb-5">Who am I?</p>
            <ul className="space-y-2.5 text-[14px] text-[var(--text-muted)] mb-7 flex-1">
              <li className="flex items-start gap-3"><span className="text-[var(--gold)]">+</span>Archetype + clear verdict</li>
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

        </div>

        <div className="mt-12 max-w-xl mx-auto text-center">
          <p className="text-[14px] text-[var(--text-muted)] leading-relaxed mb-6">
            If the Primer resonates, there is a deeper reading later. For now the goal is simple: make the first paid step easy to say yes to.
          </p>
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
