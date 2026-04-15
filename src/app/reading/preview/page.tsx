"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TycheSigil } from "@/components/TycheSigil";

type Reading = {
  archetype: { id: string; name: string; greek: string; tagline: string };
  scores: Record<string, number>;
  growthEdge: string;
  resonantTraditions: string[];
  tyche: {
    greeting: string;
    archetypeInsight: string;
    traditionMatch: { primary: string; why: string };
    growthEdge: string;
    teaser: string;
  };
};

export default function ReadingPreviewPage() {
  const router = useRouter();
  const [reading, setReading] = useState<Reading | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("kairos:reading");
    if (!raw) {
      router.push("/diagnostic");
      return;
    }
    try {
      setReading(JSON.parse(raw));
    } catch {
      router.push("/diagnostic");
    }
  }, [router]);

  async function startCheckout() {
    if (!reading) return;
    setCheckoutLoading(true);
    try {
      const raw = sessionStorage.getItem("kairos:reading");
      if (!raw) throw new Error("Reading not found");
      const parsed = JSON.parse(raw);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: parsed.answers, archetypeId: reading.archetype.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Checkout failed");
      setCheckoutLoading(false);
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

  const scoreOrder: [string, string][] = [
    ["attention", "Attention"],
    ["openness", "Openness"],
    ["action", "Aligned action"],
    ["surrender", "Surrender"],
    ["connection", "Connection"],
    ["meaning", "Meaning-making"],
  ];

  return (
    <>
      <Nav />

      <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <TycheSigil size={80} />
          </div>
          <div className="eyebrow eyebrow-tyche mb-4">
            tyche&rsquo;s reading &middot; free preview
          </div>
          <p className="font-mono text-[11px] text-[var(--text-subtle)] tracking-wider">
            {reading.archetype.greek}
          </p>
          <h1 className="font-display text-[56px] md:text-[80px] leading-[0.95] tracking-[-0.02em] font-light mt-3">
            <em className="not-italic text-gold-gradient">{reading.archetype.name}</em>
          </h1>
          <p className="text-[17px] md:text-[19px] text-[var(--text-muted)] mt-6 max-w-lg mx-auto">
            {reading.archetype.tagline}
          </p>
        </div>

        {/* GREETING */}
        <div className="mb-16">
          <p className="font-display text-[22px] md:text-[26px] leading-[1.5] text-[var(--text)] text-balance">
            {reading.tyche.greeting}
          </p>
        </div>

        {/* SCORES */}
        <div className="mb-16 card">
          <div className="eyebrow mb-5">your kairotic profile</div>
          <div className="space-y-4">
            {scoreOrder.map(([id, label]) => {
              const value = reading.scores[id] ?? 0;
              return (
                <div key={id}>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-[14px] text-[var(--text)]">{label}</span>
                    <span className="font-mono text-[12px] text-[var(--gold)]">{value}/100</span>
                  </div>
                  <div className="h-[4px] bg-[var(--border)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--gold-dim)] to-[var(--gold-bright)] transition-all"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ARCHETYPE INSIGHT */}
        <div className="mb-16">
          <div className="eyebrow mb-4">why you are the {reading.archetype.name.toLowerCase()}</div>
          <div className="space-y-4 text-[16px] text-[var(--text)] leading-[1.75]">
            {reading.tyche.archetypeInsight.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        {/* TRADITION MATCH */}
        <div className="mb-16 card card-gold">
          <div className="eyebrow mb-3">resonant tradition</div>
          <h3 className="font-display text-[32px] font-normal mb-3 text-[var(--gold-bright)]">
            {reading.tyche.traditionMatch.primary}
          </h3>
          <p className="text-[15px] text-[var(--text-muted)] leading-relaxed">
            {reading.tyche.traditionMatch.why}
          </p>
        </div>

        {/* GROWTH EDGE */}
        <div className="mb-16">
          <div className="eyebrow mb-3">growth edge &middot; {reading.growthEdge.toLowerCase()}</div>
          <p className="text-[16px] text-[var(--text)] leading-[1.75]">
            {reading.tyche.growthEdge}
          </p>
        </div>

        {/* UPSELL */}
        <div className="card card-tyche relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--tyche)] opacity-10 blur-3xl rounded-full pointer-events-none" />
          <div className="relative">
            <div className="eyebrow eyebrow-tyche mb-4">the full reading</div>
            <h2 className="font-display text-[32px] md:text-[42px] leading-[1.1] font-light mb-4 text-balance">
              Tyche has more to say.
            </h2>
            <p className="text-[15px] text-[var(--text-muted)] mb-6 leading-relaxed">
              {reading.tyche.teaser}
            </p>

            <ul className="space-y-2.5 text-[13px] text-[var(--text-muted)] mb-8">
              <li className="flex items-start gap-2">
                <span className="text-[var(--tyche)]">+</span>
                <span>A full 20-page reading, written for your specific pattern</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--tyche)]">+</span>
                <span>Architecture analysis across all six mechanisms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--tyche)]">+</span>
                <span>Three tradition-specific practices matched to your profile</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--tyche)]">+</span>
                <span>A personalised 30-day protocol &mdash; one week per mechanism</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--tyche)]">+</span>
                <span>Your daily ritual and the failure modes to watch for</span>
              </li>
            </ul>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-[48px] text-[var(--text)]">€29</span>
              <span className="font-mono text-[13px] text-[var(--text-subtle)] line-through">€49</span>
              <span className="font-mono text-[11px] text-[var(--tyche)] tracking-wider ml-2">
                · launch pricing
              </span>
            </div>

            <button
              onClick={startCheckout}
              disabled={checkoutLoading}
              className="btn btn-primary w-full md:w-auto justify-center"
            >
              {checkoutLoading ? "Preparing checkout…" : "Consult Tyche · €29"}
              {!checkoutLoading && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M3 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <p className="font-mono text-[11px] text-[var(--text-subtle)] mt-4 tracking-wider">
              SECURE CHECKOUT · DELIVERED IN UNDER 60 SECONDS · PDF + WEB
            </p>
          </div>
        </div>

        <p className="text-center mt-12 text-[13px] text-[var(--text-subtle)] font-mono tracking-wider">
          <Link href="/" className="hover:text-[var(--gold)]">← back to kairos lab</Link>
        </p>
      </article>

      <Footer />
    </>
  );
}
