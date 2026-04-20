"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

type State =
  | { kind: "working" }
  | { kind: "done"; wasSubscribed: boolean }
  | { kind: "error"; message: string };

function UnsubscribeBody() {
  const params = useSearchParams();
  const [state, setState] = useState<State>({ kind: "working" });

  useEffect(() => {
    const token = params.get("token") || "";
    const email = params.get("email") || "";
    if (!token && !email) {
      setState({ kind: "error", message: "No unsubscribe token in this link." });
      return;
    }
    const qs = token
      ? `token=${encodeURIComponent(token)}`
      : `email=${encodeURIComponent(email)}`;
    fetch(`/api/unsubscribe?${qs}`, { method: "POST" })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setState({ kind: "error", message: data.error || "That link didn't verify." });
          return;
        }
        setState({ kind: "done", wasSubscribed: !!data.wasSubscribed });
      })
      .catch((err) => {
        setState({ kind: "error", message: (err as Error).message });
      });
  }, [params]);

  return (
    <div className="max-w-xl mx-auto px-6 py-20 md:py-28">
      <div className="eyebrow mb-4">Unsubscribe</div>
      {state.kind === "working" && (
        <>
          <h1 className="font-display text-[32px] md:text-[40px] leading-[1.12] font-normal mb-4">
            Processing your request.
          </h1>
          <p className="text-[14px] text-[var(--text-muted)] font-mono tracking-wider">
            One moment.
          </p>
        </>
      )}
      {state.kind === "done" && (
        <>
          <h1 className="font-display text-[32px] md:text-[40px] leading-[1.12] font-normal mb-4">
            You are unsubscribed.
          </h1>
          <p className="text-[15px] text-[var(--text-muted)] leading-relaxed mb-6">
            {state.wasSubscribed
              ? "Your address has been removed from the list. No further emails from Luck Lab."
              : "We had already recorded an unsubscribe for that address. Nothing more will be sent."}
          </p>
          <p className="text-[14px] text-[var(--text-subtle)] leading-relaxed">
            If this was a mistake, reply to the last email you received and I'll put you back on.
            <br />
            <span className="font-mono text-[11px] tracking-wider">— Mikel</span>
          </p>
          <div className="mt-10">
            <Link href="/" className="btn btn-ghost text-[13px]">
              Back to Luck Lab
            </Link>
          </div>
        </>
      )}
      {state.kind === "error" && (
        <>
          <h1 className="font-display text-[32px] md:text-[40px] leading-[1.12] font-normal mb-4">
            That link didn&rsquo;t verify.
          </h1>
          <p className="text-[15px] text-[var(--text-muted)] leading-relaxed mb-6">
            {state.message}
          </p>
          <p className="text-[14px] text-[var(--text-subtle)] leading-relaxed">
            The fastest remedy: reply to any Luck Lab email with the word <em>unsubscribe</em>.
            I'll remove you by hand.
          </p>
          <div className="mt-10">
            <Link href="/" className="btn btn-ghost text-[13px]">
              Back to Luck Lab
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <>
      <Nav />
      <Suspense fallback={<div className="max-w-xl mx-auto px-6 py-20" />}>
        <UnsubscribeBody />
      </Suspense>
      <Footer />
    </>
  );
}
