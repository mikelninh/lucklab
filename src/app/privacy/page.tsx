import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy — Luck Lab",
  description: "How Luck Lab handles your personal data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <article className="max-w-2xl mx-auto px-6 py-16 md:py-24 prose-kairos">
        <div className="eyebrow mb-4">legal</div>
        <h1 className="font-display text-[40px] md:text-[48px] leading-[1.1] font-light mb-4">
          Privacy Policy
        </h1>
        <p className="font-mono text-[11px] text-[var(--text-subtle)] tracking-wider mb-12">
          LAST UPDATED: 15 APRIL 2026
        </p>

        <h2>1. Who we are</h2>
        <p>
          Luck Lab (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is a research platform for studying
          luck, synchronicity, and serendipity. You can reach us at{" "}
          <a href="mailto:hallo@lucklab.app">hallo@lucklab.app</a>.
        </p>
        <p>
          This policy explains what personal data we collect, how we use it, and
          the rights you have over it. It is written for clarity, not legal
          theatre. If anything is unclear, write to us.
        </p>

        <h2>2. What we collect</h2>

        <h3>When you take the Reading (free)</h3>
        <p>
          We collect your diagnostic answers (10 multiple-choice inputs), your
          first name, and optionally your birthdate and a short current-life
          question. These stay in your browser&rsquo;s session storage by default
          and are sent to our servers only when you click &ldquo;Consult Tyche&rdquo;.
        </p>

        <h3>When you subscribe to the Convergence Index</h3>
        <p>
          We collect your email address. We use it to deliver the Index and a
          short five-step email sequence over the following week. You can
          unsubscribe from any email.
        </p>

        <h3>When you purchase a Reading</h3>
        <p>
          Payment is processed by Stripe, which handles all card data &mdash; we
          never see it. Stripe provides us with your email, the amount paid, and
          a session ID. We attach your diagnostic answers to that session so we
          can generate your Reading.
        </p>

        <h3>What we do not collect</h3>
        <p>
          We do not track you across other websites. We do not sell data. We do
          not use advertising cookies. The only analytics we run is Plausible, a
          privacy-first analytics service that does not use cookies and does not
          collect personal data at all.
        </p>

        <h2>3. How we use it</h2>
        <ul>
          <li>To generate your Reading (OpenAI&rsquo;s API, see below).</li>
          <li>To deliver purchases and the email sequence you opted into.</li>
          <li>To improve the product in aggregate (e.g. &ldquo;most common growth edge&rdquo;).</li>
          <li>For legal and tax obligations (invoices, VAT).</li>
        </ul>

        <h2>4. Third parties</h2>
        <p>Your data may be shared with these service providers, all bound by data-processing agreements:</p>
        <ul>
          <li>
            <strong>OpenAI</strong> &mdash; processes your diagnostic answers and
            personal context to generate the Reading. Under OpenAI&rsquo;s current
            API terms, your data is not used to train their models.
          </li>
          <li>
            <strong>Stripe</strong> &mdash; payment processing. Their privacy
            policy: <a href="https://stripe.com/privacy" target="_blank" rel="noreferrer">stripe.com/privacy</a>.
          </li>
          <li>
            <strong>Resend</strong> &mdash; email delivery. Their privacy policy:{" "}
            <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noreferrer">resend.com/legal/privacy-policy</a>.
          </li>
          <li>
            <strong>Vercel</strong> &mdash; hosting. Their privacy policy:{" "}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">vercel.com/legal/privacy-policy</a>.
          </li>
          <li>
            <strong>Plausible Analytics</strong> &mdash; if enabled. Cookieless,
            EU-hosted, GDPR-compliant by design.
          </li>
        </ul>

        <h2>5. Data retention</h2>
        <ul>
          <li>
            <strong>Readings</strong>: kept for seven years (legal/tax requirement for
            the associated payment records).
          </li>
          <li>
            <strong>Subscribers</strong>: until you unsubscribe, then deleted
            within 30 days.
          </li>
          <li>
            <strong>Analytics</strong>: aggregated only, no personal data stored.
          </li>
        </ul>

        <h2>6. Your rights (GDPR)</h2>
        <p>You can at any time:</p>
        <ul>
          <li>Request a copy of what we hold on you.</li>
          <li>Ask us to correct or delete it.</li>
          <li>Withdraw consent (unsubscribe, cancel).</li>
          <li>Lodge a complaint with your local data-protection authority.</li>
        </ul>
        <p>
          Email{" "}
          <a href="mailto:hallo@lucklab.app">hallo@lucklab.app</a> and we will
          respond within 30 days.
        </p>

        <h2>7. International transfers</h2>
        <p>
          Some of our service providers (OpenAI, Stripe, Vercel) are based in
          the United States. They are either covered by the EU-US Data Privacy
          Framework or operate under Standard Contractual Clauses.
        </p>

        <h2>8. Changes</h2>
        <p>
          We&rsquo;ll announce material changes to this policy by email to
          subscribers and on this page. The &ldquo;last updated&rdquo; date at the top
          always reflects the current version.
        </p>

        <div className="mt-16 pt-8 border-t border-[var(--border)] flex gap-4">
          <Link href="/terms" className="btn btn-ghost text-[12px] !py-2 !px-4">
            Terms of Service →
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
