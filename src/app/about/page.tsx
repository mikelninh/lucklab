import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TycheSigil } from "@/components/TycheSigil";

export const metadata = {
  title: "About — Luck Lab",
  description:
    "Why Luck Lab exists. What we believe about luck. Why Tyche speaks the way she speaks.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />

      <article className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        <div className="mb-12">
          <TycheSigil size={72} className="mb-8" />
          <div className="eyebrow mb-3">about</div>
          <h1 className="font-display text-[44px] md:text-[64px] leading-[1.02] tracking-[-0.02em] font-light text-balance">
            Honest mysticism,
            <br />
            <em className="not-italic text-gold-gradient">built carefully.</em>
          </h1>
        </div>

        <div className="space-y-6 text-[16px] md:text-[17px] text-[var(--text)] leading-[1.8] font-display font-light">
          <p>
            Luck Lab is a research platform for the oldest, most neglected
            question a person can ask: <em>why do good things happen to some people
            and not others, and can I do anything about it?</em>
          </p>

          <p>
            We take the question seriously. Which means we take seriously
            <em> both</em> the two-and-a-half thousand years of contemplative
            traditions that have tried to answer it, <em>and</em> the twenty years
            of controlled psychological research that has measured pieces of the
            answer empirically. We do not think these are in conflict. We think
            they are, with only slight translation, saying the same thing.
          </p>

          <p className="text-[var(--gold-bright)]">
            That thing, roughly, is this: luck is not random. Luck is a
            disposition. Dispositions are trainable.
          </p>
        </div>

        <div className="hairline my-16" />

        {/* Builder-mystic */}
        <section className="mb-16">
          <div className="eyebrow mb-4">our posture</div>
          <h2 className="font-display text-[32px] md:text-[40px] font-light leading-[1.12] mb-6 text-balance">
            Builder-mystic, not guru.
          </h2>
          <div className="space-y-5 text-[15px] md:text-[16px] text-[var(--text)] leading-[1.85]">
            <p>
              Most writing about luck falls into one of two failure modes.
              <strong className="text-[var(--gold)] font-normal"> Over-mystical:</strong> the
              universe wants you to&hellip; it is all vibration&hellip; trust the signs.
              <strong className="text-[var(--gold)] font-normal"> Over-flattened:</strong> luck is
              just survivorship bias, wishful thinking, cognitive error, dismissed.
            </p>
            <p>
              Both miss the interesting middle. The interesting middle is where
              Jung and Wiseman meet &mdash; where a 1952 monograph on
              synchronicity and a 2003 University of Hertfordshire study on
              luck-prone behaviour arrive at <em>overlapping</em>, not identical,
              conclusions. Something is happening. It is not supernatural. It is
              also not nothing.
            </p>
            <p>
              Our posture is what we would call <em>honest mysticism</em>: we
              take the traditions seriously without taking them literally; we
              quote primary sources, not their marketing copy; we cite research
              with its hedges intact; and when our agent Tyche cannot defend a
              claim with either empirical evidence <em>or</em> a convergence of
              traditions, she does not make the claim.
            </p>
            <p>
              She is an oracle. She is also a scholar. The two are the same job,
              done well.
            </p>
          </div>
        </section>

        <div className="hairline my-16" />

        {/* What we won't do */}
        <section className="mb-16">
          <div className="eyebrow mb-4">what we will not do</div>
          <h2 className="font-display text-[32px] md:text-[40px] font-light leading-[1.12] mb-6 text-balance">
            The tools we refused to use.
          </h2>
          <div className="space-y-5 text-[15px] md:text-[16px] text-[var(--text)] leading-[1.85]">
            <p>
              We will not cast horoscopes. Your birthdate is used, when you
              provide it, for <em>metaphor</em> &mdash; Tyche may reference your
              season of birth or Greek calendar month when it earns its place,
              never as prediction.
            </p>
            <p>
              We will not predict futures. No tradition Luck Lab draws from
              actually does this well, though many pretend to. We map
              dispositions and practices, not outcomes.
            </p>
            <p>
              We will not flatter. Your Reading names your weakest lever
              honestly. The discomfort of honest self-knowledge is the price of
              admission.
            </p>
            <p>
              We will not lock you into a subscription. We found subscriptions
              for things like this leave a sour taste. Buy the Reading once.
              Keep it forever. Come back in 90 days for a recalibration at
              no additional charge, baked in.
            </p>
          </div>
        </section>

        <div className="hairline my-16" />

        {/* The sources */}
        <section className="mb-16">
          <div className="eyebrow mb-4">the foundation</div>
          <h2 className="font-display text-[32px] md:text-[40px] font-light leading-[1.12] mb-6 text-balance">
            Where this comes from.
          </h2>
          <div className="space-y-5 text-[15px] md:text-[16px] text-[var(--text)] leading-[1.85]">
            <p>
              Luck Lab&rsquo;s central document is{" "}
              <em>The Luck Convergence Index</em> &mdash; a 10,000-word research
              essay cross-referencing twelve traditions against the modern
              empirical literature. Jungian synchronicity. Taoist <em>wu wei</em>.
              Kabbalistic <em>mazal</em>. Vedantic{" "}
              <em>karma</em> and <em>dharma</em>. Stoic <em>amor fati</em>.
              Buddhist <em>prat&imacr;tyasamutp&amacr;da</em>. Sufi{" "}
              <em>barakah</em>. Hermetic correspondences. The I Ching&rsquo;s
              timeliness. Yor&ugrave;b&aacute; <em>or&iacute;</em> and{" "}
              <em>&agrave;&#x1e63;&#x1eb9;</em>. The careful, hedged claims from
              quantum interpretations. And, centrally, Richard Wiseman&rsquo;s
              decade-long Luck Factor study at the University of Hertfordshire.
            </p>
            <p>
              Six mechanisms emerge from the cross-reference:{" "}
              <span className="kbd">attention</span>,{" "}
              <span className="kbd">openness</span>,{" "}
              <span className="kbd">aligned action</span>,{" "}
              <span className="kbd">surrender</span>,{" "}
              <span className="kbd">connection</span>, and{" "}
              <span className="kbd">meaning-making</span>. Wiseman has empirically
              validated four of them. The other two are the theoretical
              dimensions the traditions converge upon.
            </p>
            <p>
              The Reading takes ten calibrated inputs, maps your profile across
              the six, and returns the practice that your specific pattern
              requires. Nothing more mystical than that. Nothing less.
            </p>
            <p>
              You can read the full Convergence Index at no cost &mdash; it is
              the first thing we give you when you enter your email. Start
              there. Disagree with us from a position of having read what we
              read.
            </p>
          </div>
        </section>

        <div className="hairline my-16" />

        {/* Close */}
        <section>
          <div className="eyebrow mb-4">one final note</div>
          <div className="space-y-5 text-[15px] md:text-[16px] text-[var(--text)] leading-[1.85]">
            <p>
              The Greek word <em>kairos</em> means the opportune moment &mdash;
              the right time, the ripe instant, the pivot that rewards the
              person who is awake enough to notice it. It contrasts with{" "}
              <em>chronos</em>, which is clock time, linear time, time that just
              passes.
            </p>
            <p>
              Most of life is chronos. Every so often, something arrives that is
              kairos. If you cannot tell them apart, you miss the ones that
              mattered.
            </p>
            <p>Luck Lab exists to help you tell them apart.</p>
          </div>
        </section>

        <div className="mt-16 pt-12 border-t border-[var(--border)] text-center">
          <Link href="/reading" className="btn btn-primary">
            Take the Reading
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M3 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </article>

      <Footer />
    </>
  );
}
