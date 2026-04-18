import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TycheSigil } from "@/components/TycheSigil";
import { TRADITIONS } from "@/lib/traditions";

/**
 * 404 page — but make it lucky.
 *
 * Instead of feeling like an error, landing here feels like a sign.
 * A random tradition + concept greets you each time, plus a "lucky number"
 * and a reframe that turns the wrong page into a doorway.
 */

// Pick a random tradition + a lucky number at build time (changes per deploy)
const tradition = TRADITIONS[Math.floor(Math.random() * TRADITIONS.length)];
const luckyNumber = Math.floor(Math.random() * 99) + 1;

export default function NotFound() {
  return (
    <>
      <Nav />
      <div className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
        {/* Ambient background — scattered gold dots like stars / luck particles */}
        <div className="absolute inset-0 starfield opacity-50 pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-[var(--gold)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-[var(--tyche)] opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />

        <div className="relative text-center max-w-2xl mx-auto">
          {/* The big number */}
          <div className="font-display text-[160px] md:text-[220px] leading-[0.85] tracking-[-0.04em] font-light text-gold-gradient select-none opacity-20 mb-[-40px] md:mb-[-60px]">
            404
          </div>

          <TycheSigil size={64} className="mx-auto mb-6" />

          <div className="eyebrow eyebrow-tyche mb-5">a detour, not a dead end</div>

          <h1 className="font-display text-[36px] md:text-[52px] leading-[1.1] font-light mb-6 text-balance">
            You were not meant to find <em className="not-italic text-[var(--gold)]">this</em> page.
            <br />
            <span className="text-[var(--text-muted)]">You were meant to find the next one.</span>
          </h1>

          <p className="text-[16px] text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed mb-4">
            Richard Wiseman found that lucky people notice opportunities in
            unexpected places &mdash; even dead ends. You just proved his point
            by being here.
          </p>

          {/* Random tradition card — changes per deploy, feels personalised */}
          <div className="card card-gold max-w-md mx-auto my-10 text-left">
            <div className="eyebrow mb-2 text-[10px]">while you&rsquo;re here &mdash; a gift</div>
            <h3 className="font-display text-[20px] font-normal text-[var(--gold-bright)] mb-1">
              {tradition.name}
            </h3>
            <span className="kbd kbd-tyche text-[12px]">{tradition.concept}</span>
            <p className="text-[14px] text-[var(--text-muted)] mt-3 leading-relaxed">
              {tradition.practice}
            </p>
            <p className="font-mono text-[10px] text-[var(--text-subtle)] mt-4 tracking-wider">
              FROM THE CONVERGENCE INDEX &middot; {tradition.era.toUpperCase()}
            </p>
          </div>

          {/* Lucky number */}
          <p className="font-mono text-[12px] text-[var(--text-subtle)] tracking-wider mb-10">
            YOUR LUCKY NUMBER TODAY: <span className="text-[var(--gold)]">{luckyNumber}</span>
            {" "}&middot; DO WITH IT WHAT YOU WILL
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/reading" className="btn btn-primary">
              Begin Your Reading &middot; free
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M3 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href="/" className="btn btn-ghost">
              Return to Luck Lab
            </Link>
          </div>

          <p className="font-display text-[14px] text-[var(--text-subtle)] italic mt-12 max-w-sm mx-auto">
            &ldquo;In the middle of difficulty lies opportunity.&rdquo;
            <span className="not-italic font-mono text-[10px] block mt-1 tracking-wider text-[var(--gold-dim)]">
              &mdash; ALBERT EINSTEIN
            </span>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
