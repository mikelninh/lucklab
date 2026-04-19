import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { rateLimit, LIMITS } from "@/lib/rate-limit";
import {
  QUESTIONS,
  computeScores,
  normalisedScores,
  archetypeFor,
  growthEdge,
  validatePersonalContext,
  type Answer,
  type PersonalContext,
} from "@/lib/diagnostic";
import { TRADITIONS, MECHANISMS } from "@/lib/traditions";
import { buildFreeTeaserPrompt } from "@/lib/tyche-prompt";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, LIMITS.tyche);
  if (!rl.ok) return rl.response;

  try {
    const body = await req.json();
    const answers = body.answers as Answer[];
    const personal = body.personal as Partial<PersonalContext> | undefined;

    if (!Array.isArray(answers) || answers.length < 8) {
      return NextResponse.json({ error: "At least 8 inputs required" }, { status: 400 });
    }

    // Deterministic layer — always runs, AI-free
    const scores = computeScores(answers);
    const norm = normalisedScores(scores);
    const archetype = archetypeFor(scores);
    const edge = growthEdge(scores);
    const edgeMechanism = MECHANISMS.find((m) => m.id === edge)!;
    const resonantTraditions = archetype.resonantTraditions
      .map((id) => TRADITIONS.find((t) => t.id === id)?.name)
      .filter(Boolean) as string[];

    const scoreSummary = MECHANISMS.map(
      (m) => `- ${m.name}: ${norm[m.id]}/100`,
    ).join("\n");
    const answersNarrative = answers
      .map((a) => {
        const q = QUESTIONS.find((x) => x.id === a.questionId);
        const o = q?.options.find((x) => x.id === a.optionId);
        return q && o ? `Q${q.id} (${q.axis}): [${o.kbd}] ${o.label}` : "";
      })
      .filter(Boolean)
      .join("\n");
    const [dom1, dom2] = archetype.dominant.map(
      (d) => MECHANISMS.find((m) => m.id === d)?.name || d,
    );
    const personalCtx = personal && validatePersonalContext(personal) ? personal : undefined;

    // AI layer — the free teaser. Graceful fallback without key.
    let tyche: unknown = null;
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        const client = new OpenAI({ apiKey });
        const completion = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: buildFreeTeaserPrompt({
                archetypeName: archetype.name,
                archetypeTagline: archetype.tagline,
                archetypeDescription: archetype.description,
                scoreSummary,
                dominantTwo: [dom1, dom2],
                growthEdge: edgeMechanism.name,
                resonantTraditions,
                answersNarrative,
                personal: personalCtx,
              }),
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        });
        const raw = completion.choices[0]?.message?.content;
        if (raw) tyche = JSON.parse(raw);
      } catch (err) {
        console.error("[tyche/read:openai]", err);
      }
    }

    // Deterministic fallback teaser
    if (!tyche) {
      const nameBit = personalCtx?.name ? `, ${personalCtx.name}` : "";
      tyche = {
        greeting: `You are the ${archetype.name}${nameBit}.`,
        archetypeGlimpse: `${archetype.description} The pattern of your answers makes this clear — though the depth is only half-shown here.`,
        traditionTease: {
          name: resonantTraditions[0] ?? "Taoism",
          hook: `Your resonant tradition is ${resonantTraditions[0] ?? "Taoism"} — a concept there speaks directly to your ${dom1.toLowerCase()}.`,
        },
        unlockPrompt: `Unlock the Primer (€9) to see your full six-lever profile, or the Reading (€29) for your personalised 30-day protocol.`,
      };
    }

    return NextResponse.json({
      archetype: {
        id: archetype.id,
        name: archetype.name,
        greek: archetype.greek,
        tagline: archetype.tagline,
      },
      tyche,
      // The following is used by later tiers (Primer/Full), not shown in free teaser
      locked: {
        scores: norm,
        growthEdge: edgeMechanism.name,
        resonantTraditions,
      },
    });
  } catch (err) {
    console.error("[tyche/read]", err);
    return NextResponse.json(
      { error: "Tyche is not responding. Retry in a moment." },
      { status: 500 },
    );
  }
}
