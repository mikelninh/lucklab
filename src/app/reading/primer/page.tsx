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
import { UpgradeToFull } from "@/components/UpgradeToFull";
import { ArchetypeReveal } from "@/components/ArchetypeReveal";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";
export const maxDuration = 45;

type Primer = {
  greeting: string;
  archetypeInsight: string;
  contradiction?: string;
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
  sevenDayPlan?: string[];
  onePractice?: string; // fallback if sevenDayPlan not present
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
            <a href="mailto:hallo@lucklab.app" className="text-[var(--gold)]">hallo@lucklab.app</a>.
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
        return q && o
          ? `Q${q.id} (${q.axis}): "${q.prompt}" → chose [${o.kbd}] "${o.label}"`
          : "";
      })
      .filter(Boolean)
      .join("\n"),
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
          <div className="eyebrow mb-3">the six levers</div>
          <p className="text-[13px] text-[var(--text-muted)] mb-5 leading-relaxed">
            Six trainable mechanisms that determine how luck reaches you.
            Higher = this lever is active in your life. Lower = untrained potential.
          </p>
          <div className="card">
            {(
              [
                ["attention", "Attention", "How widely you notice"],
                ["openness", "Openness", "How much you deviate from routine"],
                ["action", "Aligned action", "How well you time your moves"],
                ["surrender", "Surrender", "How easily you release control"],
                ["connection", "Connection", "How dense your social web is"],
                ["meaning", "Meaning-making", "How you interpret what happens"],
              ] as [keyof typeof norm, string, string][]
            ).map(([id, label, hint]) => (
              <div key={id} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[14px] text-[var(--text)]">{label}</span>
                  <span className="font-mono text-[12px] text-[var(--gold)]">
                    {norm[id]} / 100
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-subtle)] mb-1.5">{hint}</p>
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
            <div className="eyebrow mb-3">dominant lever</div>
            <p className="text-[15px] text-[var(--text)] leading-relaxed">
              {primer.sixLevers.dominant}
            </p>
          </div>
          <div className="card">
            <div className="eyebrow mb-3">quiet lever</div>
            <p className="text-[15px] text-[var(--text)] leading-relaxed">
              {primer.sixLevers.quiet}
            </p>
          </div>
        </section>

        {/* contradiction — the screenshot moment */}
        {primer.contradiction && (
          <section className="mb-14">
            <div className="card card-gold">
              <div className="eyebrow mb-3">what tyche noticed</div>
              <p className="font-display text-[18px] md:text-[20px] text-[var(--text)] leading-[1.6] italic">
                {primer.contradiction}
              </p>
            </div>
          </section>
        )}

        <div className="hairline mb-14" />

        {/* tradition deep dive */}
        <section className="mb-14">
          <div className="eyebrow mb-4">the tradition</div>
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

        {/* 7-day plan OR single practice */}
        <section className="mb-14">
          <div className="eyebrow mb-4">seven-day practice</div>
          {primer.sevenDayPlan && primer.sevenDayPlan.length > 0 ? (
            <div className="space-y-3">
              {primer.sevenDayPlan.map((day, i) => (
                <div key={i} className="card flex gap-4">
                  <div className="font-mono text-[12px] text-[var(--gold)] tracking-wider flex-shrink-0 pt-1">
                    DAY {i + 1}
                  </div>
                  <p className="text-[14px] text-[var(--text)] leading-relaxed">
                    {day.replace(/^Day \d+:\s*/i, "")}
                  </p>
                </div>
              ))}
            </div>
          ) : primer.onePractice ? (
            <div className="card card-tyche">
              <p className="text-[17px] text-[var(--text)] leading-[1.8] font-display font-light">
                {primer.onePractice}
              </p>
            </div>
          ) : null}
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

        {/* Share your archetype */}
        <ArchetypeReveal
          name={firstName || "friend"}
          archetype={archetype.name}
          greek=""
          tagline={archetype.tagline}
          scores={norm}
        />

        {/* upgrade path — one-click, no re-quiz */}
        <UpgradeToFull
          answers={answersRaw}
          personal={personalRaw || ""}
          archetypeId={archetype.id}
        />
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
  const prompt = buildPrimerPrompt(context);

  // Try Claude Sonnet first (better quality), fall back to OpenAI
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey) {
    try {
      const claude = new Anthropic({ apiKey: anthropicKey });
      const msg = await claude.messages.create({
        model: process.env.CLAUDE_MODEL || "claude-sonnet-4-6",
        max_tokens: 3000,
        messages: [{ role: "user", content: prompt + "\n\nReturn ONLY JSON. No markdown fences." }],
      });
      const text = msg.content[0].type === "text" ? msg.content[0].text : "";
      const clean = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
      if (clean) return JSON.parse(clean) as Primer;
    } catch (err) {
      console.error("[primer:claude]", err);
    }
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    try {
      const client = new OpenAI({ apiKey: openaiKey });
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.75,
      });
      const raw = completion.choices[0]?.message?.content;
      if (raw) return JSON.parse(raw) as Primer;
    } catch (err) {
      console.error("[primer:openai]", err);
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
