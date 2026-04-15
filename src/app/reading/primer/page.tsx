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
  type PersonalContext,
} from "@/lib/diagnostic";
import { TRADITIONS, MECHANISMS } from "@/lib/traditions";
import { buildPrimerPrompt } from "@/lib/tyche-prompt";
import OpenAI from "openai";

export const dynamic = "force-dynamic";
export const maxDuration = 45;

type Primer = {
  greeting: string;
  archetypeInsight: string;
  sixLevers: {
    summary: string;
    dominant: string;
    quiet: string;
  };
  traditionDeepDive: {
    tradition: string;
    concept: string;
    essay: string;
  };
  onePractice: string;
  closing: string;
};

export default async function PrimerPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const sp = await searchParams;
  const sessionId = sp.session_id;
  if (!sessionId) redirect("/reading");

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return (
      <>
        <Nav />
        <div className="max-w-2xl mx-auto px-6 py-20">
          <h1 className="font-display text-3xl mb-4">Payments not configured</h1>
          <p className="text-[var(--text-muted)]">
            STRIPE_SECRET_KEY is not set. Add it to <code className="kbd">.env.local</code>.
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
          <h1 className="font-display text-3xl mb-4">Payment not yet confirmed</h1>
          <p className="text-[var(--text-muted)] mb-6">
            Refresh in a moment or start again.
          </p>
          <Link href="/reading" className="btn btn-ghost">Back to the Reading</Link>
        </div>
        <Footer />
      </>
    );
  }

  const answersRaw = (session.metadata?.answers as string) || "";
  const answers = decodeAnswers(answersRaw);
  const personalRaw = session.metadata?.personal;
  let personal: PersonalContext | undefined;
  try {
    if (personalRaw) personal = JSON.parse(personalRaw) as PersonalContext;
  } catch {}

  if (answers.length < 8) {
    return (
      <>
        <Nav />
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <h1 className="font-display text-3xl mb-4">Session not found</h1>
          <p className="text-[var(--text-muted)]">
            Please email{" "}
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
  const firstName = personal?.name.trim().split(/\s+/)[0];

  const primer = await generatePrimer({
    archetypeName: archetype.name,
    archetypeTagline: archetype.tagline,
    archetypeDescription: archetype.description,
    scoreSummary: MECHANISMS.map((m) => `- ${m.name}: ${norm[m.id]}/100`).join("\n"),
    dominantTwo: archetype.dominant.map(
      (d) => MECHANISMS.find((m) => m.id === d)?.name || d,
    ),
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
    personal,
  });

  return (
    <>
      <Nav />
      <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* cover */}
        <div className="text-center mb-16">
          <TycheSigil size={80} className="mx-auto mb-6" />
          <div className="eyebrow mb-3">the archetype primer</div>
          {firstName && (
            <p className="font-mono text-[11px] text-[var(--gold)] tracking-wider mb-1">
              PREPARED FOR {firstName.toUpperCase()}
            </p>
          )}
          <p className="font-mono text-[11px] text-[var(--text-subtle)] tracking-wider">
            {archetype.greek}
          </p>
          <h1 className="font-display text-[clamp(42px,6vw,68px)] leading-[1] tracking-[-0.02em] font-light mt-3 text-balance">
            <em className="not-italic text-gold-gradient">{archetype.name}</em>
          </h1>
          <p className="text-[16px] text-[var(--text-muted)] mt-4 italic max-w-md mx-auto">
            {archetype.tagline}
          </p>
        </div>

        {/* greeting */}
        <section className="mb-14">
          <p className="font-display text-[20px] md:text-[24px] leading-[1.55] text-[var(--text)] text-balance">
            {primer.greeting}
          </p>
        </section>

        <div className="hairline mb-14" />

        {/* scores */}
        <section className="mb-14">
          <div className="eyebrow mb-5">your six levers</div>
          <div className="card">
            {(
              [
                ["attention", "Attention"],
                ["openness", "Openness"],
                ["action", "Aligned action"],
                ["surrender", "Surrender"],
                ["connection", "Connection"],
                ["meaning", "Meaning-making"],
              ] as [keyof typeof norm, string][]
            ).map(([id, label]) => (
              <div key={id} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-[14px] text-[var(--text)]">{label}</span>
                  <span className="font-mono text-[12px] text-[var(--gold)]">
                    {norm[id]} / 100
                  </span>
                </div>
                <div className="h-[4px] bg-[var(--border)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--gold-dim)] to-[var(--gold-bright)]"
                    style={{ width: `${norm[id]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* archetype */}
        <section className="mb-14">
          <div className="eyebrow mb-4">why you are the {archetype.name.toLowerCase()}</div>
          <div className="space-y-5 text-[16px] text-[var(--text)] leading-[1.8]">
            {primer.archetypeInsight.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        <div className="hairline mb-14" />

        {/* six levers deep */}
        <section className="mb-14 grid md:grid-cols-2 gap-6">
          <div className="card card-gold">
            <div className="eyebrow mb-3">your dominant lever</div>
            <p className="text-[15px] text-[var(--text)] leading-relaxed">
              {primer.sixLevers.dominant}
            </p>
          </div>
          <div className="card">
            <div className="eyebrow mb-3">your quiet lever</div>
            <p className="text-[15px] text-[var(--text)] leading-relaxed">
              {primer.sixLevers.quiet}
            </p>
          </div>
        </section>

        <div className="hairline mb-14" />

        {/* tradition deep dive */}
        <section className="mb-14">
          <div className="eyebrow mb-4">your tradition</div>
          <h2 className="font-display text-[34px] md:text-[44px] font-light leading-tight mb-2 text-[var(--gold-bright)]">
            {primer.traditionDeepDive.tradition}
          </h2>
          <div className="mb-6">
            <span className="kbd kbd-tyche">{primer.traditionDeepDive.concept}</span>
          </div>
          <div className="space-y-5 text-[15px] text-[var(--text)] leading-[1.85]">
            {primer.traditionDeepDive.essay.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        <div className="hairline mb-14" />

        {/* practice */}
        <section className="mb-14">
          <div className="eyebrow mb-4">your seven-day practice</div>
          <div className="card card-tyche">
            <p className="text-[17px] text-[var(--text)] leading-[1.8] font-display font-light">
              {primer.onePractice}
            </p>
          </div>
        </section>

        {/* closing */}
        <div className="text-center mt-24 pt-16 border-t border-[var(--border)]">
          <TycheSigil size={48} className="mx-auto mb-5 opacity-60" glow={false} />
          <p className="font-display text-[18px] text-[var(--text-muted)] italic max-w-md mx-auto text-balance">
            {primer.closing}
          </p>
          <p className="font-mono text-[11px] text-[var(--gold)] mt-6 tracking-wider">
            — TYCHE
          </p>
        </div>

        {/* upgrade path */}
        <div className="mt-16 card card-tyche text-center">
          <div className="eyebrow eyebrow-tyche mb-3">go deeper</div>
          <h3 className="font-display text-[28px] md:text-[32px] font-light mb-4 text-balance">
            Ready for the Full Reading?
          </h3>
          <p className="text-[14px] text-[var(--text-muted)] mb-6 max-w-md mx-auto leading-relaxed">
            The Primer shows you where you stand. The Full Reading gives you a
            30-day map, three tradition-specific practices, and a daily ritual written to you.
          </p>
          <Link href="/reading" className="btn btn-primary">
            Upgrade to the Full Reading · €20 extra
          </Link>
        </div>
      </article>
      <Footer />
    </>
  );
}

async function generatePrimer(context: {
  archetypeName: string;
  archetypeTagline: string;
  archetypeDescription: string;
  scoreSummary: string;
  dominantTwo: string[];
  growthEdge: string;
  resonantTraditions: string[];
  answersNarrative: string;
  personal?: PersonalContext;
}): Promise<Primer> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const client = new OpenAI({ apiKey });
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: buildPrimerPrompt(context) }],
        response_format: { type: "json_object" },
        temperature: 0.75,
      });
      const raw = completion.choices[0]?.message?.content;
      if (raw) return JSON.parse(raw) as Primer;
    } catch (err) {
      console.error("[primer]", err);
    }
  }

  const name = context.personal?.name ?? "friend";
  return {
    greeting: `${name}, welcome to your Primer. This document is a keepsake placeholder until OPENAI_API_KEY is configured.`,
    archetypeInsight: context.archetypeDescription,
    sixLevers: {
      summary: "The six levers describe the mechanisms by which luck reaches you.",
      dominant: `Your dominant lever is ${context.dominantTwo[0]}. (Configure OPENAI_API_KEY for real commentary.)`,
      quiet: `Your quietest lever is ${context.growthEdge}.`,
    },
    traditionDeepDive: {
      tradition: context.resonantTraditions[0] ?? "Taoism",
      concept: "…",
      essay: "Configure OPENAI_API_KEY for the real essay.",
    },
    onePractice:
      "Spend seven minutes each morning for seven days with the question: what am I not noticing?",
    closing: "In your own time.",
  };
}
