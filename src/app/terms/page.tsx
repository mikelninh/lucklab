import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Terms of Service — Luck Lab",
  description: "The terms under which Luck Lab provides its services.",
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <article className="max-w-2xl mx-auto px-6 py-16 md:py-24 prose-kairos">
        <div className="eyebrow mb-4">legal</div>
        <h1 className="font-display text-[40px] md:text-[48px] leading-[1.1] font-light mb-4">
          Terms of Service
        </h1>
        <p className="font-mono text-[11px] text-[var(--text-subtle)] tracking-wider mb-12">
          LAST UPDATED: 15 APRIL 2026
        </p>

        <h2>1. What Luck Lab is</h2>
        <p>
          Luck Lab is a research platform that helps you map your relationship
          with luck, chance, and meaningful coincidence. We offer a free Reading,
          a €9 Archetype Primer, and a €29 Full Reading. These are educational
          and reflective tools. They are not medical, psychological, financial, or
          legal advice.
        </p>

        <h2>2. Who we are</h2>
        <p>
          Luck Lab. Contact: <a href="mailto:hallo@lucklab.app">hallo@lucklab.app</a>.
        </p>

        <h2>3. What you agree to</h2>
        <p>By using the site you agree that:</p>
        <ul>
          <li>You are at least 16 years old (or have parental consent).</li>
          <li>You provide accurate information in the Reading.</li>
          <li>You will not attempt to abuse, scrape, or reverse-engineer the service.</li>
          <li>You understand that Readings are produced with the assistance of AI
            and are for reflection, not prediction.</li>
        </ul>

        <h2>4. Purchases &amp; refunds</h2>
        <p>
          We deliver the digital product (Primer or Full Reading) immediately
          upon successful payment. Under EU distance-selling law, digital
          products lose the 14-day right of withdrawal once delivery has begun,
          and you expressly consent to this by clicking &ldquo;Unlock&rdquo;.
        </p>
        <p>
          That said: if the service fails to deliver what was promised (e.g. the
          Reading does not generate), write to us at{" "}
          <a href="mailto:hallo@lucklab.app">hallo@lucklab.app</a> and we will
          refund no questions asked. Your integrity is worth more to us than €29.
        </p>

        <h2>5. The 90-day Return and Gift Reading</h2>
        <p>
          The €29 Full Reading includes a 90-day Return (a recalibrated Reading
          delivered ~90 days after purchase) and one Gift Reading code you may
          send to someone else. The Gift Reading is non-transferable to a
          different product, non-refundable separately, and expires one year
          from the original purchase if not redeemed.
        </p>

        <h2>6. Limits of the service</h2>
        <p>
          Readings are reflective tools drawn from wisdom traditions and
          behavioural research. They are not:
        </p>
        <ul>
          <li>Predictions of specific future events.</li>
          <li>Medical or mental-health advice &mdash; see a qualified practitioner if you need that.</li>
          <li>Financial or legal advice.</li>
          <li>Substitutes for your own judgement.</li>
        </ul>

        <h2>7. Content &amp; intellectual property</h2>
        <p>
          All text, images, and code on the site are © Luck Lab unless
          otherwise credited. Your Reading (the personalised output) is yours to
          keep, share, and print for personal use. You may not resell or
          republish Luck Lab content without permission.
        </p>

        <h2>8. Service availability</h2>
        <p>
          We aim for high availability but don&rsquo;t promise zero downtime. We
          may change, suspend, or retire parts of the service at any time. If a
          paid feature is retired, we will honour or refund active purchases.
        </p>

        <h2>9. Liability</h2>
        <p>
          To the maximum extent permitted by law, our total liability for any
          claim related to the service is limited to the amount you paid us in
          the twelve months preceding the claim.
        </p>

        <h2>10. Governing law</h2>
        <p>
          These terms are governed by the laws of Germany. Disputes go to the
          competent courts at our registered address, except where EU consumer
          law provides otherwise.
        </p>

        <h2>11. Changes</h2>
        <p>
          We may update these terms. Material changes will be announced by email
          and on this page. Continued use after a change constitutes acceptance.
        </p>

        <div className="mt-16 pt-8 border-t border-[var(--border)] flex gap-4">
          <Link href="/privacy" className="btn btn-ghost text-[12px] !py-2 !px-4">
            Privacy Policy →
          </Link>
          <Link href="/" className="btn btn-ghost text-[12px] !py-2 !px-4">
            ← Home
          </Link>
        </div>
      </article>
      <Footer />
    </>
  );
}
