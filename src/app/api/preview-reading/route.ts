/**
 * Preview endpoint — generates a Reading WITHOUT Stripe.
 * ONLY works in development or when PREVIEW_SECRET matches.
 * Use to test what €9 / €29 output looks like before real purchases.
 *
 * Usage:
 *   POST /api/preview-reading
 *   Body: { tier: "primer" | "full", answers: [...], personal: {...}, secret: "..." }
 */

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { tracedOpenAI } from "@/lib/langfuse-client";
import Anthropic from "@anthropic-ai/sdk";
import {
  QUESTIONS,
  computeScores,
  normalisedScores,
  archetypeFor,
  growthEdge,
  type Answer,
  type PersonalContext,
} from "@/lib/diagnostic";
import { TRADITIONS, MECHANISMS } from "@/lib/traditions";
import { buildPrimerPrompt, buildFullReadingPrompt } from "@/lib/tyche-prompt";
import { buildEditorPrompt } from "@/lib/tyche-editor";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { tier, answers, personal, secret } = body as {
    tier: "primer" | "full";
    answers: Answer[];
    personal: PersonalContext;
    secret?: string;
  };

  // Security: only allow in dev or with secret
  const isdev = process.env.NODE_ENV !== "production";
  const secretMatch = secret && secret === process.env.CRON_SECRET;
  if (!isdev && !secretMatch) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const scores = computeScores(answers);
  const norm = normalisedScores(scores);
  const archetype = archetypeFor(scores);
  const edge = growthEdge(scores);
  const edgeMech = MECHANISMS.find((m) => m.id === edge)!;
  const resonant = archetype.resonantTraditions
    .map((id) => TRADITIONS.find((t) => t.id === id)?.name)
    .filter(Boolean) as string[];

  const context = {
    archetypeName: archetype.name,
    archetypeTagline: archetype.tagline,
    archetypeDescription: archetype.description,
    scoreSummary: MECHANISMS.map((m) => `- ${m.name}: ${norm[m.id]}/100`).join("\n"),
    dominantTwo: archetype.dominant.map((d) => MECHANISMS.find((m) => m.id === d)?.name || d),
    growthEdge: edgeMech.name,
    resonantTraditions: resonant,
    answersNarrative: answers
      .map((a) => {
        const q = QUESTIONS.find((x) => x.id === a.questionId);
        const o = q?.options.find((x) => x.id === a.optionId);
        return q && o ? `Q${q.id} (${q.axis}): "${q.prompt}" → chose [${o.kbd}] "${o.label}"` : "";
      })
      .filter(Boolean)
      .join("\n"),
    personal,
  };

  const prompt = tier === "full" ? buildFullReadingPrompt(context) : buildPrimerPrompt(context);

  // Try Claude first, then OpenAI
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  let result: unknown = null;
  let model = "unknown";

  if (anthropicKey) {
    try {
      const claude = new Anthropic({ apiKey: anthropicKey });
      const msg = await claude.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt + "\n\nReturn ONLY JSON. No markdown fences." }],
      });
      const text = msg.content[0].type === "text" ? msg.content[0].text : "";
      const clean = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
      result = JSON.parse(clean);
      model = "claude-sonnet";
    } catch (err) {
      console.error("[preview:claude]", err);
    }
  }

  if (!result && openaiKey) {
    try {
      const client = tracedOpenAI({
        apiKey: openaiKey,
        traceName: `preview-reading · ${archetype.id}`,
        tags: ["preview-reading", `tier:${tier}`, `archetype:${archetype.id}`],
        metadata: {
          tier,
          archetype_id: archetype.id,
          archetype_name: archetype.name,
        },
      });
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.72,
      });
      result = JSON.parse(completion.choices[0]?.message?.content || "{}");
      model = "gpt-4o-mini";
    } catch (err) {
      console.error("[preview:openai]", err);
    }
  }

  return NextResponse.json({
    tier,
    model,
    archetype: { name: archetype.name, tagline: archetype.tagline },
    scores: norm,
    growthEdge: edgeMech.name,
    resonantTraditions: resonant,
    reading: result,
  });
}
