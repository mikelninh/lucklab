import { redirect } from "next/navigation";
import Stripe from "stripe";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TycheSigil } from "@/components/TycheSigil";
import { decodeAnswers } from "@/lib/answer-codec";
import {
  computeScores,
  normalisedScores,
  archetypeFor,
  growthEdge,
  QUESTIONS,
} from "@/lib/diagnostic";
import { TRADITIONS, MECHANISMS } from "@/lib/traditions";
import { buildFullReadingPrompt } from "@/lib/tyche-prompt";
import OpenAI from "openai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type FullReading = {
  title: string;
  openingLetter: string;
  architectureAnalysis: string;
  traditionMap: {
    tradition: string;
    concept: string;
    whyYou: string;
    corePractice: string;
  }[];
  thirtyDayProtocol: {
    premise: string;
    weeks: { week: number; theme: string; focus: string; practices: string[] }[];
  };
  dailyRitual: string;
  warnings: string;
};

export default async function FullReadingPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const sp = await searchParams;
  const sessionId = sp.session_id;
  if (!sessionId) redirect("/diagnostic");

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return (
      <>
        <Nav />
        <div className="max-w-2xl mx-auto px-6 py-20">
          <h1 className="font-display text-3xl mb-4">Payments not configured</h1>
          <p className="text-[var(--text-muted)]">
            STRIPE_SECRET_KEY is not set on the server. Set it in <code className="kbd">.env.local</code> and
            restart the dev server.
          </p>
        </div>
        <Footer />
      </>
    );
  }

  const stripe = new Stripe(stripeKey);
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return (
      <>
        <Nav />
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <h1 className="font-display text-3xl mb-4">Payment not confirmed</h1>
          <p className="text-[var(--text-muted)] mb-6">
            Stripe has not yet confirmed this payment. Refresh in a moment, or start again.
          </p>
          <Link href="/diagnostic" className="btn btn-ghost">Back to the Diagnostic</Link>
        </div>
        <Footer />
      </>
    );
  }

  const answersRaw = (session.metadata?.answers as string) || "";
  const answers = decodeAnswers(answersRaw);
  if (answers.length < 8) {
    return (
      <>
        <Nav />
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <h1 className="font-display text-3xl mb-4">Session not found</h1>
          <p className="text-[var(--text-muted)]">
            We could not retrieve the diagnostic that was paid for. Please email{" "}
            <a href="mailto:hallo@kairos.lab" className="text-[var(--gold)]">hallo@kairos.lab</a>.
          </p>
        </div>
        <Footer />
      </>
    );
  }

  const scores = computeScores(answers);
  const norm = normalisedScores(scores);
  const archetype = archetypeFor(scores);
  const edge = growthEdge(scores);
  const edgeMechanism = MECHANISMS.find((m) => m.id === edge)!;
  const resonantTraditions = archetype.resonantTraditions
    .map((id) => TRADITIONS.find((t) => t.id === id)?.name)
    .filter(Boolean) as string[];

  const reading = await generateFullReading({
    archetypeName: archetype.name,
    archetypeTagline: archetype.tagline,
    archetypeDescription: archetype.description,
    scoreSummary: MECHANISMS.map((m) => `- ${m.name}: ${norm[m.id]}/100`).join("\n"),
    dominantTwo: archetype.dominant.map((d) => MECHANISMS.find((m) => m.id === d)?.name || d),
    growthEdge: edgeMechanism.name,
    resonantTraditions,
    answersNarrative: answers
      .map((a) => {
        const q = QUESTIONS.find((x) => x.id === a.questionId);
        const o = q?.options.find((x) => x.id === a.optionId);
        return q && o ? `Q${q.id}: ${o.kbd}` : "";
      })
      .filter(Boolean)
      .join("; "),
  });

  return (
    <>
      <Nav />
      <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* cover */}
        <div className="text-center mb-20">
          <TycheSigil size={96} className="mx-auto mb-8" />
          <div className="eyebrow eyebrow-tyche mb-4">tyche&rsquo;s reading</div>
          <p className="font-mono text-[11px] text-[var(--text-subtle)] tracking-wider">
            {archetype.greek}
          </p>
          <h1 className="font-display text-[clamp(40px,6vw,72px)] leading-[1] tracking-[-0.02em] font-light mt-4 text-balance">
            <em className="not-italic text-gold-gradient">{reading.title}</em>
          </h1>
          <p className="font-mono text-[11px] text-[var(--text-subtle)] mt-8 tracking-wider">
            PREPARED FOR YOU · {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }).toUpperCase()}
          </p>
        </div>

        <div className="hairline-gold mb-20" />

        {/* opening letter */}
        <section className="mb-20">
          <div className="eyebrow mb-4">a note from tyche</div>
          <div className="space-y-5 text-[17px] text-[var(--text)] leading-[1.8] font-display font-light">
            {reading.openingLetter.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        <div className="hairline mb-20" />

        {/* architecture */}
        <section className="mb-20">
          <div className="eyebrow mb-4">i &middot; your kairotic architecture</div>
          <h2 className="font-display text-[36px] md:text-[42px] font-light leading-tight mb-6 text-balance">
            How luck reaches <em className="text-[var(--gold)] not-italic">you</em>.
          </h2>
          <div className="space-y-5 text-[15px] text-[var(--text)] leading-[1.85]">
            {reading.architectureAnalysis.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        <div className="hairline mb-20" />

        {/* tradition map */}
        <section className="mb-20">
          <div className="eyebrow mb-4">ii &middot; tradition map</div>
          <h2 className="font-display text-[36px] md:text-[42px] font-light leading-tight mb-8 text-balance">
            Three traditions speak <em className="text-[var(--gold)] not-italic">directly</em> to your pattern.
          </h2>
          <div className="space-y-8">
            {reading.traditionMap.map((t, i) => (
              <div key={i} className="card card-gold">
                <div className="eyebrow mb-2 text-[10px]">
                  {String(i + 1).padStart(2, "0")} / tradition
                </div>
                <h3 className="font-display text-[28px] font-normal text-[var(--gold-bright)] mb-1">
                  {t.tradition}
                </h3>
                <div className="mb-4">
                  <span className="kbd kbd-tyche">{t.concept}</span>
                </div>
                <p className="text-[15px] text-[var(--text-muted)] leading-relaxed mb-5">
                  {t.whyYou}
                </p>
                <div className="pt-4 border-t border-[var(--border)]">
                  <div className="eyebrow mb-2 text-[10px]">core practice</div>
                  <p className="text-[15px] text-[var(--text)] leading-relaxed">
                    {t.corePractice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="hairline mb-20" />

        {/* 30-day protocol */}
        <section className="mb-20">
          <div className="eyebrow mb-4">iii &middot; thirty days</div>
          <h2 className="font-display text-[36px] md:text-[42px] font-light leading-tight mb-5 text-balance">
            Your <em className="text-[var(--gold)] not-italic">30-day protocol</em>.
          </h2>
          <p className="text-[15px] text-[var(--text-muted)] leading-relaxed mb-10">
            {reading.thirtyDayProtocol.premise}
          </p>
          <div className="space-y-5">
            {reading.thirtyDayProtocol.weeks.map((w) => (
              <div key={w.week} className="card">
                <div className="flex items-baseline justify-between mb-3">
                  <div className="eyebrow text-[10px]">week {w.week}</div>
                  <span className="font-mono text-[10px] text-[var(--text-subtle)] tracking-wider uppercase">
                    {w.focus}
                  </span>
                </div>
                <h3 className="font-display text-[22px] font-normal mb-4">{w.theme}</h3>
                <ul className="space-y-2 text-[14px] text-[var(--text-muted)]">
                  {w.practices.map((p, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[var(--gold)] mt-0.5">→</span>
                      <span className="leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className="hairline mb-20" />

        {/* daily ritual */}
        <section className="mb-20">
          <div className="eyebrow mb-4">iv &middot; daily ritual</div>
          <div className="card card-tyche">
            <p className="text-[17px] text-[var(--text)] leading-[1.85] font-display font-light">
              {reading.dailyRitual}
            </p>
          </div>
        </section>

        {/* warnings */}
        <section className="mb-20">
          <div className="eyebrow mb-4">v &middot; failure modes</div>
          <p className="text-[15px] text-[var(--text-muted)] leading-[1.85]">
            {reading.warnings}
          </p>
        </section>

        {/* closing */}
        <div className="text-center mt-24 pt-16 border-t border-[var(--border)]">
          <TycheSigil size={56} className="mx-auto mb-6 opacity-60" glow={false} />
          <p className="font-display text-[20px] text-[var(--text-muted)] italic">
            In your own time.
          </p>
          <p className="font-mono text-[11px] text-[var(--gold)] mt-6 tracking-wider">
            — TYCHE
          </p>
        </div>

        <div className="mt-16 text-center">
          <p className="text-[13px] text-[var(--text-muted)] mb-5">
            Want Tyche with you daily? Join the beta list for <span className="text-[var(--tyche)]">Tyche Pro</span>.
          </p>
          <Link href="/#pricing" className="btn btn-tyche">
            Learn about Tyche Pro
          </Link>
        </div>
      </article>
      <Footer />
    </>
  );
}

async function generateFullReading(context: {
  archetypeName: string;
  archetypeTagline: string;
  archetypeDescription: string;
  scoreSummary: string;
  dominantTwo: string[];
  growthEdge: string;
  resonantTraditions: string[];
  answersNarrative: string;
}): Promise<FullReading> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const client = new OpenAI({ apiKey });
      const completion = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: buildFullReadingPrompt(context) }],
        response_format: { type: "json_object" },
        temperature: 0.75,
      });
      const raw = completion.choices[0]?.message?.content;
      if (raw) return JSON.parse(raw) as FullReading;
    } catch (err) {
      console.error("[full-reading]", err);
    }
  }

  // Graceful placeholder (dev-only)
  return {
    title: `The ${context.archetypeName}: A Reading`,
    openingLetter: `You arrive here as the ${context.archetypeName}. Your dominant levers are ${context.dominantTwo.join(" and ")}; your growth edge is ${context.growthEdge}. This reading is placeholder content because OPENAI_API_KEY is not set — in production, Tyche writes this personally to your pattern.`,
    architectureAnalysis: context.scoreSummary,
    traditionMap: context.resonantTraditions.slice(0, 3).map((t) => ({
      tradition: t,
      concept: "…",
      whyYou: `${t} speaks to this archetype because it converges on the same core mechanism.`,
      corePractice: "…",
    })),
    thirtyDayProtocol: {
      premise: "Four weeks, one mechanism per week, recalibrating at mid-point.",
      weeks: [
        { week: 1, theme: "Orient", focus: context.dominantTwo[0] ?? "attention", practices: ["…", "…", "…"] },
        { week: 2, theme: "Deepen", focus: context.dominantTwo[1] ?? "openness", practices: ["…", "…", "…"] },
        { week: 3, theme: "Stretch", focus: context.growthEdge, practices: ["…", "…", "…"] },
        { week: 4, theme: "Integrate", focus: "all six", practices: ["…", "…", "…"] },
      ],
    },
    dailyRitual: "Five minutes each morning — a placeholder until OPENAI_API_KEY is configured.",
    warnings: "Placeholder.",
  };
}
