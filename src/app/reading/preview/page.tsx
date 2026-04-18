"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TycheSigil } from "@/components/TycheSigil";
// Reviews on preview page would require an /api/reviews endpoint since this is a
// client component (uses sessionStorage). For now the landing-page rail covers it.

type FreeTeaser = {
  greeting: string;
  archetypeGlimpse: string;
  traditionTease: { name: string; hook: string };
  unlockPrompt: string;
};

type ReadingData = {
  archetype: { id: string; name: string; greek: string; tagline: string };
  tyche: FreeTeaser;
  answers: { questionId: number; optionId: string }[];
  personal: { name: string; birthdate: string; currentQuestion: string };
};

export default function ReadingPreviewPage() {
  const router = useRouter();
  const [reading, setReading] = useState<ReadingData | null>(null);
  const [loadingTier, setLoadingTier] = useState<"primer" | "full" | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("kairos:reading");
    if (!raw) {
      router.push("/reading");
      return;
    }
    try {
      setReading(JSON.parse(raw));
    } catch {
      router.push("/reading");
    }
  }, [router]);

  async function unlock(tier: "primer" | "full") {
    if (!reading) return;
    setLoadingTier(tier);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: reading.answers,
          personal: reading.personal,
          archetypeId: reading.archetype.id,
          tier,
        }),
      });
      const text = await res.text();
      let data: { url?: string; error?: string };
      try { data = JSON.parse(text); } catch { throw new Error(text || `HTTP ${res.status}`); }
      if (!res.ok) throw new Error(data.error || `Checkout failed (${res.status})`);
      if (data.url) window.location.href = data.url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Checkout failed";
      console.error("[kairos:checkout]", msg);
      alert(msg.slice(0, 150));
      setLoadingTier(null);
    }
  }

  if (!reading) {
    return (
      <>
        <Nav />
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <p className="text-[var(--text-muted)]">Loading your reading…</p>
        </div>
      </>
    );
  }

  const { archetype, tyche, personal } = reading;
  const firstName = personal.name.trim().split(/\s+/)[0];

  return (
    <>
      <Nav />

      <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <TycheSigil size={88} />
          </div>
          <div className="eyebrow eyebrow-tyche mb-4">
            your reading &middot; free glimpse
          </div>
          <h1 className="font-display text-[56px] md:text-[80px] leading-[0.95] tracking-[-0.02em] font-light mt-3">
            <em className="not-italic text-gold-gradient">{archetype.name}</em>
          </h1>
          <p className="text-[17px] md:text-[19px] text-[var(--text-muted)] mt-6 max-w-lg mx-auto">
            {archetype.tagline}
          </p>
        </div>

        {/* GREETING */}
        <div className="mb-12">
          <p className="font-display text-[22px] md:text-[28px] leading-[1.4] text-[var(--text)] text-balance">
            {tyche.greeting}
          </p>
        </div>

        {/* ARCHETYPE GLIMPSE */}
        <div className="mb-12">
          <div className="eyebrow mb-4">what tyche sees</div>
          <p className="text-[16px] md:text-[17px] text-[var(--text)] leading-[1.8] text-pretty">
            {tyche.archetypeGlimpse}
          </p>
        </div>

        {/* TRADITION TEASE */}
        <div className="mb-12 card card-gold">
          <div className="eyebrow mb-3">your resonant tradition</div>
          <h3 className="font-display text-[28px] font-normal mb-3 text-[var(--gold-bright)]">
            {tyche.traditionTease.name}
          </h3>
          <p className="text-[15px] text-[var(--text-muted)] leading-relaxed">
            {tyche.traditionTease.hook}
          </p>
        </div>

        {/* WHAT YOU'RE NOT SEEING YET — desire builder */}
        <div className="mb-12">
          <div className="eyebrow eyebrow-muted mb-4 text-center">what tyche has not yet told you</div>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              "Your six-lever scores — where you are strong, where you are silent",
              "The contradiction between two of your answers that defines your pattern",
              "A 30-day protocol calibrated week-by-week to your specific profile",
              "The one practice that would shift the most — written so you could start tomorrow",
              "Three tradition-specific teachings with verified primary-source quotes",
              "Your daily ritual — seven minutes, before your phone, drawn from your resonant tradition",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded border border-[var(--border)] bg-[var(--surface)]">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 mt-0.5" aria-hidden="true">
                  <path d="M2 6V4a5 5 0 1110 0v2M2 6h10v6H2V6z" stroke="var(--gold-dim)" strokeWidth="1" />
                </svg>
                <span className="text-[13px] text-[var(--text-muted)] leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SAVE YOUR READING — email capture at highest-intent moment */}
        <div className="mb-12 card card-gold text-center">
          <div className="eyebrow mb-3">yours free · 40-page research paper</div>
          <h3 className="font-display text-[20px] text-[var(--text)] mb-3">
            The Luck Convergence Index
          </h3>
          <p className="text-[14px] text-[var(--text-muted)] mb-2 leading-relaxed max-w-md mx-auto">
            The full research behind your archetype — 12 traditions cross-referenced,
            36 citations, a 7-day starter protocol. The kind of document people
            print and keep on their desk.
          </p>
          <p className="font-mono text-[11px] text-[var(--gold)] tracking-wider mb-4">
            40 PAGES · FREE · INSTANT DELIVERY
          </p>
          <form
            className="flex gap-2 max-w-sm mx-auto"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const input = form.querySelector("input") as HTMLInputElement;
              const btn = form.querySelector("button") as HTMLButtonElement;
              if (!input.value) return;
              btn.textContent = "Sending…";
              btn.disabled = true;
              try {
                await fetch("/api/subscribe", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email: input.value,
                    name: firstName,
                    source: "post-quiz-preview",
                    archetype: archetype.name,
                  }),
                });
                btn.textContent = "✓ Sent!";
              } catch {
                btn.textContent = "Try again";
                btn.disabled = false;
              }
            }}
          >
            <input
              type="email"
              required
              placeholder="your@email.com"
              className="flex-1 px-3 py-2 bg-[var(--bg)] border border-[var(--border-bright)] rounded focus:border-[var(--gold)] outline-none text-[13px]"
            />
            <button type="submit" className="btn btn-primary !py-2 !px-4 text-[12px]">
              Save + get Index
            </button>
          </form>
          <p className="font-mono text-[10px] text-[var(--text-subtle)] mt-3 tracking-wider">
            NO SPAM · UNSUBSCRIBE ANY TIME
          </p>
        </div>

        {/* THE LOCKED CONTENT VISUAL */}
        <LockedPreview firstName={firstName} />

        {/* UNLOCK — two CTAs */}
        <section className="mt-4">
          <div className="text-center mb-8">
            <div className="eyebrow eyebrow-tyche mb-3">unlock your reading</div>
            <h2 className="font-display text-[32px] md:text-[44px] leading-[1.08] font-light text-balance">
              Your map is <em className="not-italic text-[var(--tyche)]">ready</em>, {firstName}.<br />
              Choose the door.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Primer — €9 */}
            <button
              onClick={() => unlock("primer")}
              disabled={loadingTier !== null}
              className="card card-gold text-left flex flex-col hover:scale-[1.01] transition-transform disabled:opacity-60 disabled:hover:scale-100"
            >
              <div className="flex items-baseline justify-between mb-3">
                <span className="kbd text-[11px]">tier 1 · primer</span>
                <span className="font-mono text-[10px] text-[var(--gold)] tracking-wider">
                  INSTANT
                </span>
              </div>
              <h3 className="font-display text-[26px] font-normal text-[var(--text)] mb-1">
                Archetype Primer
              </h3>
              <p className="text-[13px] text-[var(--text-subtle)] mb-4">
                The full six-lever profile + tradition deep-dive + a 7-day practice.
              </p>
              <ul className="space-y-2 text-[13px] text-[var(--text-muted)] mb-6 flex-1">
                <li className="flex items-start gap-2"><span className="text-[var(--gold)]">+</span>Your six-lever scores (all 100 points)</li>
                <li className="flex items-start gap-2"><span className="text-[var(--gold)]">+</span>A deep read of your dominant & quietest levers</li>
                <li className="flex items-start gap-2"><span className="text-[var(--gold)]">+</span>Tradition essay &mdash; with a real primary-source quote</li>
                <li className="flex items-start gap-2"><span className="text-[var(--gold)]">+</span>A seven-day practice you start today</li>
                <li className="flex items-start gap-2"><span className="text-[var(--gold)]">+</span>Delivered instantly &middot; yours forever</li>
              </ul>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-display text-[44px] text-[var(--text)]">€9</span>
                <span className="font-mono text-[11px] text-[var(--gold)] tracking-wider">
                  LOW-RISK UNLOCK
                </span>
              </div>
              <span className="btn btn-ghost justify-center w-full">
                {loadingTier === "primer" ? "Redirecting…" : "Unlock for €9 →"}
              </span>
            </button>

            {/* Full Reading — €29 featured */}
            <button
              onClick={() => unlock("full")}
              disabled={loadingTier !== null}
              className="card card-tyche text-left flex flex-col relative overflow-hidden hover:scale-[1.01] transition-transform disabled:opacity-60 disabled:hover:scale-100"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--tyche)] opacity-10 blur-3xl rounded-full pointer-events-none" />
              <div className="relative flex flex-col flex-1">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="kbd kbd-tyche text-[11px]">7 items · one price</span>
                  <span className="font-mono text-[10px] text-[var(--tyche)] tracking-wider">
                    MOST CHOSEN
                  </span>
                </div>
                <h3 className="font-display text-[26px] font-normal text-[var(--text)] mb-1">
                  Tyche&rsquo;s Complete Reading
                </h3>
                <p className="text-[13px] text-[var(--text-subtle)] mb-4">
                  7 items worth €115. Yours for €29.
                </p>
                <ul className="space-y-2 text-[13px] text-[var(--text-muted)] mb-6 flex-1">
                  <li className="flex items-start gap-2"><span className="text-[var(--tyche)]">1.</span><strong className="text-[var(--text)] font-medium">Personalised Reading</strong> — by name, to your question</li>
                  <li className="flex items-start gap-2"><span className="text-[var(--tyche)]">2.</span><strong className="text-[var(--text)] font-medium">30-day protocol</strong> — week-by-week for your archetype</li>
                  <li className="flex items-start gap-2"><span className="text-[var(--tyche)]">3.</span><strong className="text-[var(--text)] font-medium">3 tradition deep-dives</strong> — with source quotes + practices</li>
                  <li className="flex items-start gap-2"><span className="text-[var(--tyche)]">4.</span><strong className="text-[var(--text)] font-medium">Convergence Index</strong> — 40-page research paper</li>
                  <li className="flex items-start gap-2"><span className="text-[var(--tyche)]">5.</span><strong className="text-[var(--tyche-bright)] font-medium">90-day Return</strong> — free recalibration</li>
                  <li className="flex items-start gap-2"><span className="text-[var(--tyche)]">6.</span><strong className="text-[var(--tyche-bright)] font-medium">Archetype Reveal Card</strong> — 4 styles, shareable</li>
                  <li className="flex items-start gap-2"><span className="text-[var(--tyche)]">7.</span><strong className="text-[var(--tyche-bright)] font-medium">Synchronicity Journal</strong> — 30-day tracking template</li>
                </ul>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-display text-[44px] text-[var(--text)]">€29</span>
                  <span className="font-mono text-[11px] text-[var(--text-subtle)] line-through">€115</span>
                  <span className="font-mono text-[11px] text-[var(--tyche)] tracking-wider">LAUNCH · 75% OFF</span>
                </div>
                <span className="btn btn-primary justify-center w-full">
                  {loadingTier === "full" ? "Redirecting…" : "Unlock all 7 for €29 →"}
                </span>
              </div>
            </button>
          </div>

          <div className="text-center mt-8 space-y-2">
            <p className="text-[12px] text-[var(--text-subtle)] font-mono tracking-wider">
              STRIPE SECURE · INSTANT DELIVERY
            </p>
            <p className="text-[13px] text-[var(--gold)] font-mono tracking-wider flex items-center justify-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
                <path d="M4.5 7l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              100% REFUND GUARANTEE — IF IT DOESN&rsquo;T LAND, EMAIL US
            </p>
          </div>
        </section>

        {/* Share your archetype — even the FREE tier gets this viral mechanic */}
        <div className="mt-12 mb-8 card card-gold text-center">
          <div className="eyebrow mb-3">share your result</div>
          <p className="font-display text-[20px] text-[var(--text)] mb-2">
            {firstName}, you are <em className="not-italic text-[var(--gold)]">{archetype.name}</em>.
          </p>
          <p className="text-[13px] text-[var(--text-muted)] italic mb-5">{archetype.tagline}</p>
          <button
            onClick={() => {
              const text = `I just took the Kairos Reading. Tyche called me ${archetype.name} — "${archetype.tagline}". What archetype are you?\n\n${window.location.origin}/reading`;
              if (navigator.share) {
                navigator.share({ title: `I am ${archetype.name}`, text, url: `${window.location.origin}/reading` }).catch(() => {});
              } else {
                navigator.clipboard?.writeText(text);
              }
            }}
            className="btn btn-primary"
          >
            Challenge a friend — what are they?
          </button>
          <p className="font-mono text-[10px] text-[var(--text-subtle)] mt-4 tracking-wider">
            6 ARCHETYPES · WHICH ONE ARE YOUR FRIENDS?
          </p>
        </div>

        <p className="text-center text-[13px] text-[var(--text-subtle)] font-mono tracking-wider">
          <Link href="/" className="hover:text-[var(--gold)]">← back to kairos lab</Link>
        </p>
      </article>

      <Footer />
    </>
  );
}

function LockedPreview({ firstName }: { firstName: string }) {
  return (
    <div className="relative my-12">
      <div className="card opacity-60 pointer-events-none select-none">
        <div className="eyebrow mb-4">your kairotic profile &middot; locked</div>
        <div className="space-y-3">
          {["Attention", "Openness", "Aligned action", "Surrender", "Connection", "Meaning-making"].map((name, i) => (
            <div key={name}>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-[13px] text-[var(--text-muted)]">{name}</span>
                <span className="font-mono text-[11px] text-[var(--text-subtle)]">?? / 100</span>
              </div>
              <div className="h-[3px] bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--gold-dim)] to-[var(--gold-bright)] transition-all"
                  style={{ width: `${40 + ((i * 13) % 50)}%`, filter: "blur(4px)" }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 space-y-3">
          <div className="h-3 bg-[var(--border)] rounded w-full" style={{ filter: "blur(3px)" }} />
          <div className="h-3 bg-[var(--border)] rounded w-[85%]" style={{ filter: "blur(3px)" }} />
          <div className="h-3 bg-[var(--border)] rounded w-[92%]" style={{ filter: "blur(3px)" }} />
          <div className="h-3 bg-[var(--border)] rounded w-[70%]" style={{ filter: "blur(3px)" }} />
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-[var(--bg)] border border-[var(--gold-dim)] rounded-full px-5 py-2 flex items-center gap-2 shadow-lg">
          <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
            <path d="M2 6V4a4 4 0 118 0v2M2 6h8v6H2V6z" stroke="var(--gold)" strokeWidth="1.2" />
          </svg>
          <span className="font-mono text-[11px] text-[var(--gold)] tracking-wider">
            LOCKED · {firstName.toUpperCase()}&rsquo;S FULL READING WAITS BELOW
          </span>
        </div>
      </div>
    </div>
  );
}
