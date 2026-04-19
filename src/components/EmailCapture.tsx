"use client";

import { useState } from "react";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "convergence-index-landing" }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Subscribe failed");
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Subscribe failed. Retry in a moment.");
      setState("error");
    }
  }

  return (
    <div className="card card-gold">
      <div className="eyebrow mb-3">the convergence index</div>
      <h3 className="font-display text-[22px] text-[var(--text)] mb-3">
        Research paper &middot; PDF
      </h3>
      <p className="text-[13px] text-[var(--text-muted)] mb-5 leading-relaxed">
        Enter your email. We send you the Index as a PDF and occasional research
        updates. Unsubscribe any time.
      </p>

      {state === "sent" ? (
        <div className="border border-[var(--gold-dim)] bg-[rgba(201,169,97,0.06)] rounded p-5">
          <p className="text-[14px] text-[var(--gold-bright)] font-mono">
            ✓ SENT · CHECK YOUR INBOX
          </p>
          <p className="text-[13px] text-[var(--text-muted)] mt-2 leading-relaxed">
            Tyche has sent the Index. While you wait, read it here and take
            the Reading.
          </p>
          <div className="flex gap-2 mt-4">
            <a href="/convergence-index" className="btn btn-ghost text-[12px] !py-2 !px-4">
              Read the Index →
            </a>
            <a href="/reading" className="btn btn-primary text-[12px] !py-2 !px-4">
              Take the Reading →
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border-bright)] rounded focus:border-[var(--gold)] outline-none text-[14px] transition-colors"
            disabled={state === "loading"}
          />
          <button
            type="submit"
            disabled={state === "loading"}
            className="btn btn-primary justify-center"
          >
            {state === "loading" ? "Sending…" : "Download the Index"}
          </button>
          {error && (
            <p className="text-[12px] text-[var(--danger)] font-mono">
              {error}
            </p>
          )}
          <p className="font-mono text-[10px] text-[var(--text-subtle)] tracking-wider text-center mt-1">
            NO SPAM · UNSUBSCRIBE ANY TIME · GDPR-COMPLIANT
          </p>
        </form>
      )}
    </div>
  );
}
