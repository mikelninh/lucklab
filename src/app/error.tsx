"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TycheSigil } from "@/components/TycheSigil";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production, pipe this to Sentry / Axiom / your log drain
    console.error("[kairos:error]", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-24 md:py-32 text-center min-h-screen flex flex-col justify-center">
      <TycheSigil size={72} className="mx-auto mb-8 opacity-50" glow={false} />
      <div className="eyebrow eyebrow-muted mb-4">tyche stumbled</div>
      <h1 className="font-display text-[40px] md:text-[52px] leading-[1.08] font-light mb-5 text-balance">
        Something went <em className="not-italic text-[var(--gold)]">sideways</em>.
      </h1>
      <p className="text-[15px] text-[var(--text-muted)] max-w-md mx-auto leading-relaxed mb-2">
        The oracle pipeline encountered a rupture. It happens rarely &mdash; the
        fix is usually retrying.
      </p>
      {error.digest && (
        <p className="font-mono text-[10px] text-[var(--text-subtle)] mt-4 tracking-wider">
          ERROR ID: {error.digest}
        </p>
      )}
      <div className="flex gap-3 justify-center flex-wrap mt-10">
        <button onClick={reset} className="btn btn-primary">
          Try again
        </button>
        <Link href="/" className="btn btn-ghost">
          Return home
        </Link>
      </div>
    </div>
  );
}
