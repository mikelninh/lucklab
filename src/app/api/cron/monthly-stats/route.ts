/**
 * Monthly stats — fires on the 1st of each month.
 * Queries Stripe for the month just ended and emails you the numbers.
 *
 * Requires STRIPE_SECRET_KEY and ADMIN_EMAIL.
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { verifyCron } from "@/lib/cron-auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const deny = verifyCron(req);
  if (deny) return deny;

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!stripeKey || !resendKey || !adminEmail) {
    return NextResponse.json({
      ok: true,
      skipped: "missing env: STRIPE_SECRET_KEY / RESEND_API_KEY / ADMIN_EMAIL",
    });
  }

  const stripe = new Stripe(stripeKey);

  // Query last month's checkout sessions
  const now = new Date();
  const firstOfThisMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const firstOfLastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const gte = Math.floor(firstOfLastMonth.getTime() / 1000);
  const lt = Math.floor(firstOfThisMonth.getTime() / 1000);

  const sessions = await stripe.checkout.sessions.list({
    limit: 100,
    created: { gte, lt },
  });

  const paid = sessions.data.filter((s) => s.payment_status === "paid");
  const primerCount = paid.filter((s) => s.metadata?.tier === "primer").length;
  const fullCount = paid.filter((s) => s.metadata?.tier === "full").length;
  const totalCents = paid.reduce((sum, s) => sum + (s.amount_total ?? 0), 0);

  const label = firstOfLastMonth.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  const html = `<h2>Luck Lab — ${label}</h2>
<p><strong>Revenue:</strong> €${(totalCents / 100).toFixed(2)}</p>
<ul>
  <li>Primer (€9): ${primerCount}</li>
  <li>Full Reading (€29): ${fullCount}</li>
  <li>Total purchases: ${paid.length}</li>
</ul>
<p>Average revenue per sale: €${paid.length ? (totalCents / 100 / paid.length).toFixed(2) : "0.00"}</p>`;

  const resend = new Resend(resendKey);
  await resend.emails.send({
    from: "Kairos Stats <stats@lucklab.app>",
    to: adminEmail,
    subject: `Luck Lab · ${label} revenue report`,
    html,
  });

  return NextResponse.json({
    ok: true,
    month: label,
    purchases: paid.length,
    revenue: totalCents / 100,
    primerCount,
    fullCount,
  });
}
