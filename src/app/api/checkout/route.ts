import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import type { Answer } from "@/lib/diagnostic";

export const runtime = "nodejs";

const schema = z.object({
  answers: z.array(
    z.object({ questionId: z.number(), optionId: z.string() }),
  ),
  archetypeId: z.string(),
  email: z.string().email().optional(),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json(
      { error: "Payments are not configured. Add STRIPE_SECRET_KEY to .env" },
      { status: 503 },
    );
  }

  const stripe = new Stripe(stripeKey);
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    req.headers.get("origin") ||
    "http://localhost:3000";

  // Stripe metadata has a 500-char-per-value limit. We compact the answer list.
  const compactAnswers = compactEncode(parsed.data.answers);
  if (compactAnswers.length > 480) {
    return NextResponse.json({ error: "Payload too large" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: parsed.data.email,
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: 2900, // €29.00
          product_data: {
            name: "Tyche's Reading — Kairos Lab",
            description:
              "A personalised 20-page reading of your kairotic profile, with tradition-matched practices and a 30-day protocol.",
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/reading/full?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/reading/preview?cancelled=1`,
    metadata: {
      archetypeId: parsed.data.archetypeId,
      answers: compactAnswers,
      product: "tyche_reading",
    },
  });

  return NextResponse.json({ url: session.url, id: session.id });
}

// Compact "[{questionId:1, optionId:'1a'}, …]" → "1:1a,2:2c,…"
function compactEncode(answers: Answer[]): string {
  return answers.map((a) => `${a.questionId}:${a.optionId}`).join(",");
}
