import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { encodeAnswers } from "@/lib/answer-codec";
import { rateLimit, LIMITS } from "@/lib/rate-limit";

export const runtime = "nodejs";

const TIERS = {
  primer: {
    unitAmount: 900, // €9.00
    name: "Archetype Primer — Kairos Lab",
    description:
      "Your personalised archetype profile — six-lever breakdown, tradition essay, and a seven-day practice. Delivered instantly.",
    successPath: "/reading/primer",
  },
  full: {
    unitAmount: 2900, // €29.00
    name: "Tyche's Reading — Kairos Lab",
    description:
      "Your full personalised 30-day Reading, addressed to you by name, responding to your current question. Delivered instantly.",
    successPath: "/reading/full",
  },
} as const;

type Tier = keyof typeof TIERS;

const schema = z.object({
  answers: z.array(z.object({ questionId: z.number(), optionId: z.string() })),
  archetypeId: z.string(),
  personal: z.object({
    name: z.string().min(1).max(60),
    // Birthdate and currentQuestion are optional — empty string or valid input
    birthdate: z
      .string()
      .regex(/^(\d{4}-\d{2}-\d{2})?$/)
      .optional()
      .default(""),
    currentQuestion: z.string().max(280).optional().default(""),
  }),
  tier: z.enum(["primer", "full"]),
});

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, LIMITS.checkout);
  if (!rl.ok) return rl.response;

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json(
      { error: "Payments are not configured. Add STRIPE_SECRET_KEY to .env.local" },
      { status: 503 },
    );
  }

  const { tier, answers, personal, archetypeId } = parsed.data;
  const tierConfig = TIERS[tier as Tier];
  const stripe = new Stripe(stripeKey);
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    req.headers.get("origin") ||
    "http://localhost:3000";

  const encodedAnswers = encodeAnswers(answers);
  // Compact personal context for metadata (500-char limit per key)
  const encodedPersonal = JSON.stringify(personal);
  if (encodedAnswers.length > 480 || encodedPersonal.length > 480) {
    return NextResponse.json({ error: "Payload too large" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: undefined, // Stripe will collect it
    allow_promotion_codes: true, // enables abandoned-cart recovery codes
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 min — triggers expired webhook sooner
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: tierConfig.unitAmount,
          product_data: {
            name: tierConfig.name,
            description: tierConfig.description,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}${tierConfig.successPath}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/reading/preview?cancelled=1`,
    metadata: {
      archetypeId,
      answers: encodedAnswers,
      personal: encodedPersonal,
      tier,
      product: `kairos_${tier}`,
    },
  });

  return NextResponse.json({ url: session.url, id: session.id });
}
