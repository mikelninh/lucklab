/**
 * Stripe webhook — handles lifecycle events.
 *
 * Today: abandoned checkout recovery.
 * When `checkout.session.expired` fires (Stripe fires this ~24h after a
 * session was created if never paid), we send the customer a recovery email
 * with a €5-off promo code valid for 72 hours.
 *
 * Setup: in Stripe Dashboard → Developers → Webhooks, add this URL
 * (production: https://your-domain.com/api/stripe/webhook) and select events:
 *   - checkout.session.expired
 *   - checkout.session.completed  (future: for Supabase persistence)
 * Copy the signing secret into STRIPE_WEBHOOK_SECRET.
 */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { abandonedCheckoutEmail } from "@/lib/email-templates";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey);
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch (err) {
    console.error("[stripe:webhook] bad signature", err);
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.expired") {
    await handleAbandonedCheckout(
      event.data.object as Stripe.Checkout.Session,
      stripe,
    );
  }

  return NextResponse.json({ received: true });
}

async function handleAbandonedCheckout(
  session: Stripe.Checkout.Session,
  stripe: Stripe,
): Promise<void> {
  const email = session.customer_email ?? session.customer_details?.email;
  const tierMeta = session.metadata?.tier;
  const tier: "primer" | "full" = tierMeta === "full" ? "full" : "primer";
  if (!email) {
    console.warn("[abandoned] no email on session", session.id);
    return;
  }

  // Create a one-off promo code for €5 off
  let code: string | null = null;
  const amountOff = 500; // 500 cents = €5
  try {
    const coupon = await stripe.coupons.create({
      amount_off: amountOff,
      currency: "eur",
      duration: "once",
      redeem_by: Math.floor(Date.now() / 1000) + 72 * 60 * 60, // 72h
      max_redemptions: 1,
      name: `Recovery · €5 off · ${new Date().toISOString().slice(0, 10)}`,
    });
    const promoParams = {
      coupon: coupon.id,
      code: `TYCHE5-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      max_redemptions: 1,
      expires_at: Math.floor(Date.now() / 1000) + 72 * 60 * 60,
    };
    // Cast through unknown — Stripe types expect a `promotion` field this SDK
    // version does not require at runtime.
    const promo = await stripe.promotionCodes.create(
      promoParams as unknown as Stripe.PromotionCodeCreateParams,
    );
    code = promo.code;
  } catch (err) {
    console.error("[abandoned:coupon]", err);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !code) {
    console.warn("[abandoned] cannot send — missing resend key or code failed");
    return;
  }
  const resend = new Resend(apiKey);
  const tpl = abandonedCheckoutEmail(tier, code, amountOff);
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Tyche · Luck Lab <tyche@lucklab.app>",
      to: email,
      subject: tpl.subject,
      html: tpl.html.replace(/\{\{email\}\}/g, encodeURIComponent(email)),
    });
  } catch (err) {
    console.error("[abandoned:send]", err);
  }
}
