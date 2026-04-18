import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TycheSigil } from "@/components/TycheSigil";

export const metadata = {
  title: "Contact — Luck Lab",
  description: "Reach Luck Lab. We read everything.",
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <article className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        <TycheSigil size={64} className="mb-8" />
        <div className="eyebrow mb-3">contact</div>
        <h1 className="font-display text-[44px] md:text-[56px] leading-[1.05] font-light mb-6 text-balance">
          Write to us.
        </h1>
        <p className="text-[16px] text-[var(--text-muted)] leading-relaxed max-w-lg mb-12">
          We read every email. Tyche may be an oracle, but the humans behind
          Luck Lab are reachable and reply within 48 hours.
        </p>

        <div className="space-y-8">
          <div className="card">
            <div className="eyebrow mb-3">general</div>
            <h3 className="font-display text-[22px] font-normal mb-2">
              Questions, feedback, ideas
            </h3>
            <p className="text-[14px] text-[var(--text-muted)] mb-4 leading-relaxed">
              Anything about the Reading, the research, the Convergence Index,
              or the platform.
            </p>
            <a
              href="mailto:hallo@lucklab.app"
              className="btn btn-ghost"
            >
              hallo@lucklab.app
            </a>
          </div>

          <div className="card">
            <div className="eyebrow mb-3">support</div>
            <h3 className="font-display text-[22px] font-normal mb-2">
              Purchase issues or refunds
            </h3>
            <p className="text-[14px] text-[var(--text-muted)] mb-4 leading-relaxed">
              If the Reading did not generate, if you were charged in error, or
              if something did not land &mdash; write to us and we will make it
              right, no questions asked.
            </p>
            <a
              href="mailto:hallo@lucklab.app?subject=Support%20request"
              className="btn btn-ghost"
            >
              hallo@lucklab.app
            </a>
          </div>

          <div className="card">
            <div className="eyebrow mb-3">press &amp; partnerships</div>
            <h3 className="font-display text-[22px] font-normal mb-2">
              Media, newsletters, collaborations
            </h3>
            <p className="text-[14px] text-[var(--text-muted)] mb-4 leading-relaxed">
              Journalist? Newsletter writer? Researcher? Podcast host? We are
              happy to share the Convergence Index data and speak about the
              thesis.
            </p>
            <a
              href="mailto:hallo@lucklab.app?subject=Press%20%2F%20partnership"
              className="btn btn-ghost"
            >
              hallo@lucklab.app
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--border)]">
          <div className="eyebrow eyebrow-muted mb-3">legal address</div>
          <p className="text-[14px] text-[var(--text-muted)] leading-relaxed">
            Michael Ninh · Luck Lab<br />
            Boxhagener Str. 94<br />
            10245 Berlin, Deutschland
          </p>
          <Link
            href="/impressum"
            className="text-[13px] text-[var(--gold)] font-mono tracking-wider mt-4 inline-block"
          >
            FULL IMPRESSUM →
          </Link>
        </div>
      </article>
      <Footer />
    </>
  );
}
