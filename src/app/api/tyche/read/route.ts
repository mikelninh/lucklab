import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  QUESTIONS,
  computeScores,
  normalisedScores,
  archetypeFor,
  growthEdge,
  type Answer,
} from "@/lib/diagnostic";
import { TRADITIONS, MECHANISMS } from "@/lib/traditions";
import { buildFreeReadingPrompt } from "@/lib/tyche-prompt";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const answers = body.answers as Answer[];
    if (!Array.isArray(answers) || answers.length < 8) {
      return NextResponse.json(
        { error: "At least 8 answers required" },
        { status: 400 },
      );
    }

    // Deterministic layer — always works, no AI needed
    const scores = computeScores(answers);
    const norm = normalisedScores(scores);
    const archetype = archetypeFor(scores);
    const edge = growthEdge(scores);
    const edgeMechanism = MECHANISMS.find((m) => m.id === edge)!;
    const resonantTraditions = archetype.resonantTraditions
      .map((id) => TRADITIONS.find((t) => t.id === id)?.name)
      .filter(Boolean) as string[];

    const scoreSummary = MECHANISMS.map((m) => `- ${m.name}: ${norm[m.id]}/100`).join("\n");

    // Narrative of their answers for context
    const answersNarrative = answers
      .map((a) => {
        const q = QUESTIONS.find((x) => x.id === a.questionId);
        const o = q?.options.find((x) => x.id === a.optionId);
        return q && o ? `Q${q.id} (${q.axis}): "${q.prompt}" → chose [${o.kbd}] "${o.label}"` : "";
      })
      .filter(Boolean)
      .join("\n");

    const [dom1, dom2] = archetype.dominant.map(
      (d) => MECHANISMS.find((m) => m.id === d)?.name || d,
    );

    // AI layer — Tyche's voice. Graceful fallback if no key.
    let tyche: unknown = null;
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      const client = new OpenAI({ apiKey });
      const prompt = buildFreeReadingPrompt({
        archetypeName: archetype.name,
        archetypeTagline: archetype.tagline,
        archetypeDescription: archetype.description,
        scoreSummary,
        dominantTwo: [dom1, dom2],
        growthEdge: edgeMechanism.name,
        resonantTraditions,
        answersNarrative,
      });

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });
      const raw = completion.choices[0]?.message?.content;
      if (raw) {
        try {
          tyche = JSON.parse(raw);
        } catch {
          tyche = null;
        }
      }
    }

    // Fallback reading when no OpenAI key is configured (dev-only)
    if (!tyche) {
      tyche = {
        greeting: `You are ${archetype.name}. ${archetype.tagline}`,
        archetypeInsight: archetype.description,
        traditionMatch: {
          primary: resonantTraditions[0] ?? "Taoism",
          why: `Your pattern converges with the ${resonantTraditions[0] ?? "Taoist"} mechanism of cultivated alignment.`,
        },
        growthEdge: `Your quietest lever is ${edgeMechanism.name.toLowerCase()}. ${edgeMechanism.description} This week, notice one moment per day where you could practise this.`,
        teaser:
          "The full Reading from Tyche maps this across all twelve traditions and generates your 30-day protocol.",
      };
    }

    return NextResponse.json({
      archetype: {
        id: archetype.id,
        name: archetype.name,
        greek: archetype.greek,
        tagline: archetype.tagline,
      },
      scores: norm,
      growthEdge: edgeMechanism.name,
      resonantTraditions,
      tyche,
    });
  } catch (err) {
    console.error("[tyche/read]", err);
    return NextResponse.json(
      { error: "Tyche encountered a rupture in the oracle pipeline." },
      { status: 500 },
    );
  }
}
