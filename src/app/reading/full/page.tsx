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
import { buildFullReadingPrompt } from "@/lib/tyche-prompt";
import { buildEditorPrompt } from "@/lib/tyche-editor";
import { DownloadPdfButton } from "@/components/DownloadPdfButton";
import { ShareCard } from "@/components/ShareCard";
import { EmailReading } from "@/components/EmailReading";
import { ArchetypeReveal } from "@/components/ArchetypeReveal";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

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
    sourceQuote?: string;
    corePractice: string;
  }[];
  thirtyDayProtocol: {
    premise: string;
    weeks: {
      week: number;
      theme: string;
      focus: string;
      intent?: string;
      practices: string[];
    }[];
  };
  dailyRitual: string;
  synchronicityLog?: string;
  warnings: string;
  closingBenediction?: string;
};

export default async function FullReadingPage({
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
            STRIPE_SECRET_KEY is not set on the server. Set it in{" "}
            <code className="kbd">.env.local</code> and restart the dev server.
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
            Stripe has not yet confirmed this payment. Refresh in a moment or start again.
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
  } catch {
    personal = undefined;
  }

  if (answers.length < 8) {
    return (
      <>
        <Nav />
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <h1 className="font-display text-3xl mb-4">Session not found</h1>
          <p className="text-[var(--text-muted)]">
            We could not retrieve the inputs that were paid for. Please email{" "}
            <a href="mailto:hallo@lucklab.app" className="text-[var(--gold)]">
              hallo@lucklab.app
            </a>
            .
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
    dominantTwo: archetype.dominant.map(
      (d) => MECHANISMS.find((m) => m.id === d)?.name || d,
    ),
    growthEdge: edgeMechanism.name,
    resonantTraditions,
    // Full answer text — not just codes. The prompt needs to quote their words back.
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

  const firstName = personal?.name.trim().split(/\s+/)[0];

  return (
    <>
      <Nav />
      <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* cover */}
        <div className="text-center mb-20">
          <TycheSigil size={96} className="mx-auto mb-8" />
          <div className="eyebrow eyebrow-tyche mb-4">tyche&rsquo;s reading</div>
          {firstName && (
            <p className="font-mono text-[11px] text-[var(--gold)] tracking-wider mb-1">
              PREPARED FOR {firstName.toUpperCase()}
            </p>
          )}
          <p className="font-mono text-[11px] text-[var(--text-subtle)] tracking-wider">
            {archetype.greek}
          </p>
          <h1 className="font-display text-[clamp(40px,6vw,72px)] leading-[1] tracking-[-0.02em] font-light mt-4 text-balance">
            <em className="not-italic text-gold-gradient">{reading.title}</em>
          </h1>
          <p className="font-mono text-[11px] text-[var(--text-subtle)] mt-8 tracking-wider">
            {new Date()
              .toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
              .toUpperCase()}
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
            Three traditions speak{" "}
            <em className="text-[var(--gold)] not-italic">directly</em> to your pattern.
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
                <p className="text-[15px] text-[var(--text-muted)] leading-relaxed mb-4">
                  {t.whyYou}
                </p>
                {t.sourceQuote && (
                  <blockquote className="border-l-2 border-[var(--gold-dim)] pl-5 my-5 italic font-display text-[16px] text-[var(--text)] leading-relaxed">
                    {t.sourceQuote}
                  </blockquote>
                )}
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
                <h3 className="font-display text-[22px] font-normal mb-2">{w.theme}</h3>
                {w.intent && (
                  <p className="text-[13px] text-[var(--gold-dim)] italic mb-4">
                    {w.intent}
                  </p>
                )}
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

        {/* synchronicity log */}
        {reading.synchronicityLog && (
          <section className="mb-20">
            <div className="eyebrow mb-4">v &middot; the synchronicity log</div>
            <p className="text-[15px] text-[var(--text-muted)] leading-[1.85]">
              {reading.synchronicityLog}
            </p>
          </section>
        )}

        {/* warnings */}
        <section className="mb-20">
          <div className="eyebrow mb-4">
            {reading.synchronicityLog ? "vi" : "v"} &middot; failure modes
          </div>
          <p className="text-[15px] text-[var(--text-muted)] leading-[1.85]">
            {reading.warnings}
          </p>
        </section>

        {/* closing */}
        <div className="text-center mt-24 pt-16 border-t border-[var(--border)]">
          <TycheSigil size={56} className="mx-auto mb-6 opacity-60" glow={false} />
          {reading.closingBenediction ? (
            <p className="font-display text-[20px] text-[var(--text-muted)] italic text-balance max-w-md mx-auto">
              {reading.closingBenediction}
            </p>
          ) : (
            <p className="font-display text-[20px] text-[var(--text-muted)] italic">
              In your own time{firstName ? `, ${firstName}` : ""}.
            </p>
          )}
          <p className="font-mono text-[11px] text-[var(--gold)] mt-6 tracking-wider">
            — TYCHE
          </p>
        </div>

        {/* ===== THE REVEAL — shareable card + animated + download ===== */}
        <ArchetypeReveal
          name={firstName || "friend"}
          archetype={archetype.name}
          greek={archetype.greek}
          tagline={archetype.tagline}
          scores={norm}
        />

        {/* ===== KEEP YOUR READING ===== */}
        <div className="mt-8 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <EmailReading sessionId={sessionId || ""} />
            <div className="flex justify-center items-start">
              <DownloadPdfButton label="Download Reading as PDF" />
            </div>
          </div>
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
  personal?: PersonalContext;
}): Promise<FullReading> {
  const prompt = buildFullReadingPrompt(context);
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const useTwoPass = process.env.ENABLE_EDITOR_PASS === "true";

  // ===== OPTION 1: Claude API (best quality, recommended) =====
  if (anthropicKey) {
    try {
      const claude = new Anthropic({ apiKey: anthropicKey });
      const msg = await claude.messages.create({
        model: process.env.CLAUDE_MODEL || "claude-sonnet-4-6",
        max_tokens: 4096,
        messages: [{
          role: "user",
          content: prompt + "\n\nIMPORTANT: Return ONLY a JSON object. No markdown, no preamble, no ```json fences. Pure JSON.",
        }],
      });
      const text = msg.content[0].type === "text" ? msg.content[0].text : "";
      // Strip any markdown fences the model might add
      const clean = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
      if (clean) return JSON.parse(clean) as FullReading;
    } catch (err) {
      console.error("[full-reading:claude]", err);
      // Fall through to OpenAI
    }
  }

  // ===== OPTION 2: OpenAI (fallback, or primary if no Anthropic key) =====
  if (openaiKey) {
    try {
      const client = new OpenAI({ apiKey: openaiKey });

      if (useTwoPass) {
        // Two-pass mode (requires Vercel Pro for 60s timeout)
        const pass1 = await client.chat.completions.create({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.75,
        });
        const rawJson = pass1.choices[0]?.message?.content;
        if (!rawJson) throw new Error("Pass 1 empty");

        const archetypeId = context.archetypeName.toLowerCase().replace(/^the\s+/, "");
        const pass2 = await client.chat.completions.create({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          messages: [{
            role: "user",
            content: buildEditorPrompt({
              rawReading: rawJson,
              answersNarrative: context.answersNarrative,
              archetypeId,
              archetypeName: context.archetypeName,
              personalName: context.personal?.name ?? "friend",
              currentQuestion: context.personal?.currentQuestion ?? "",
              scoreSummary: context.scoreSummary,
            }),
          }],
          response_format: { type: "json_object" },
          temperature: 0.6,
        });
        const polished = pass2.choices[0]?.message?.content;
        if (polished) return JSON.parse(polished) as FullReading;
        return JSON.parse(rawJson) as FullReading;
      }

      // Single pass (default)
      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.72,
      });
      const raw = completion.choices[0]?.message?.content;
      if (raw) return JSON.parse(raw) as FullReading;
    } catch (err) {
      console.error("[full-reading:openai]", err);
    }
  }

  // Substantive fallback — not placeholder, actually useful. Generated from deterministic
  // data if OpenAI is unavailable. A paid customer should NEVER see "..." or "Placeholder".
  const name = context.personal?.name ?? "friend";
  const question = context.personal?.currentQuestion;
  const dom1 = context.dominantTwo[0] ?? "attention";
  const dom2 = context.dominantTwo[1] ?? "openness";
  const edge = context.growthEdge;

  return {
    title: `${context.archetypeName}: A Reading for ${name}`,
    openingLetter: `${name}, you arrive here as ${context.archetypeName}. ${context.archetypeTagline}\n\nYour dominant levers are ${dom1.toLowerCase()} and ${dom2.toLowerCase()}. Your growth edge — the lever that, if strengthened, would change the most — is ${edge.toLowerCase()}. ${question ? `You asked Tyche: "${question}" The answer threads through every section of this Reading.` : "What follows is your map."}\n\nThis Reading draws on twelve wisdom traditions and two decades of empirical luck research to map your specific pattern. Each section is calibrated to your answers. Read slowly. Act on what resonates. Discard what does not.`,
    architectureAnalysis: `Your ${dom1.toLowerCase()} lever scored highest. This means you naturally ${dom1 === "Attention" ? "notice what others walk past — weak signals, subtle shifts, the message on page two that everyone else missed" : dom1 === "Openness" ? "expose yourself to novelty, new people, and deviation from routine" : dom1 === "Aligned action" ? "sense when a moment is ripe and move on it before certainty arrives" : dom1 === "Surrender" ? "release the grip where others force — yielding where resistance would constrict the outcome" : dom1 === "Connection" ? "draw luck through your social graph — weak ties, unexpected introductions, the conversation you almost didn't have" : "read events for meaning where others see randomness — reframing setbacks as redirections"}.\n\nYour ${edge.toLowerCase()} lever is quietest. Richard Wiseman's Luck Factor research at the University of Hertfordshire showed that each of the four behaviours he isolated is independently trainable. The traditions add two more. Your ${edge.toLowerCase()} is the one most worth training — not because it is weak, but because it is the lever whose improvement would shift the most in your pattern.\n\n${context.scoreSummary.split("\n").map(l => l.replace("- ", "")).join(". ")}.`,
    traditionMap: context.resonantTraditions.slice(0, 3).map((t, i) => ({
      tradition: t,
      concept: t === "Taoism" ? "wu wei" : t === "Jungian Psychology" ? "synchronicity" : t === "Kabbalah" ? "mazal" : t === "Vedanta" ? "karma + dharma" : t === "Stoicism" ? "amor fati" : t === "Buddhism" ? "pratītyasamutpāda" : t === "Sufism" ? "barakah" : t === "Hermeticism" ? "as above, so below" : t === "I Ching" ? "timeliness" : t === "Yorùbá / Ifá" ? "orí & àṣẹ" : t === "Quantum Physics" ? "observer effect" : t === "Positive Psychology" ? "the luck factor" : "convergence",
      whyYou: `${t} speaks to your pattern because its central mechanism — ${i === 0 ? dom1.toLowerCase() : i === 1 ? dom2.toLowerCase() : edge.toLowerCase()} — maps directly onto ${i < 2 ? "one of your dominant levers" : "your growth edge"}. The tradition has practised what the research has measured.`,
      corePractice: `For the next seven days, spend five minutes each morning with this question from ${t}: "What am I not yet ${i === 0 ? "noticing" : i === 1 ? "allowing" : "opening to"}?" Write the first answer that comes. Do not edit. Review the seven answers on day eight.`,
    })),
    thirtyDayProtocol: {
      premise: `Four weeks. Week 1 orients you in your dominant lever (${dom1.toLowerCase()}). Week 2 deepens the second (${dom2.toLowerCase()}). Week 3 stretches your growth edge (${edge.toLowerCase()}). Week 4 integrates all six. The arc moves from strength to edge to synthesis.`,
      weeks: [
        { week: 1, theme: "Orient in strength", focus: dom1, practices: [`Days 1–2: Notice three moments daily where your ${dom1.toLowerCase()} activates. Write them down.`, `Days 3–5: Deliberately extend that lever — hold it for 30 seconds longer than feels natural.`, `Days 6–7: Review your notes. Which moments surprised you?`] },
        { week: 2, theme: "Deepen the second lever", focus: dom2, practices: [`Days 8–9: Identify when your ${dom2.toLowerCase()} naturally appears in your routine.`, `Days 10–12: Introduce one novel element per day that exercises it.`, `Days 13–14: Journal the contrast between week 1 and week 2.`] },
        { week: 3, theme: "Stretch the growth edge", focus: edge, practices: [`Days 15–17: Your ${edge.toLowerCase()} is quietest. Spend 10 minutes daily practising it deliberately.`, `Days 18–20: Notice the discomfort. That is the signal you are growing.`, `Days 21: Rest. Let the practice integrate without forcing.`] },
        { week: 4, theme: "Integrate all six", focus: "all six", practices: [`Days 22–24: Each day, rotate through two mechanisms. Notice how they interact.`, `Days 25–27: Live a normal day and count the kairotic moments that appear without forcing.`, `Days 28–30: Write a one-page letter to yourself about what changed.`] },
      ],
    },
    dailyRitual: `Each morning for the next thirty days, before your first obligation, sit for seven minutes. For the first three minutes, widen your attention — notice sounds, light, temperature, the quality of the air. For the next two minutes, ask yourself one question: "What am I being invited to notice today?" For the final two minutes, do nothing. This ritual is calibrated to ${context.archetypeName}; it begins with your strength (attention) and ends with your edge (surrender).`,
    synchronicityLog: `Keep a three-column log over the thirty days. Column 1: the event (what happened). Column 2: the inner state (what you were feeling or thinking just before). Column 3: the interpretation (what it might mean, if anything). Review the log weekly. Patterns will emerge that surprise you — they always do for ${context.archetypeName}.`,
    warnings: `${context.archetypeName} tends to over-rely on ${dom1.toLowerCase()} and under-invest in ${edge.toLowerCase()}. The specific failure mode: you see the pattern, you name the meaning, but you do not expand the aperture. Over time this narrows your luck surface — you become excellent at reading what you already encounter, but encounter less. The antidote is deliberate novelty: one genuinely new thing per week that you would not have chosen.`,
    closingBenediction: `${name}, you have a map now. The map is not the territory — but it tells you which direction to walk. Walk.`,
  };
}
