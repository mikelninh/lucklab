"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

/**
 * EmailReading — "Email me my Reading" button.
 * Sends the current page URL to the user's email so they have it forever.
 * Uses /api/email-reading endpoint.
 */

export function EmailReading({ sessionId }: { sessionId: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("sending");
    track("cta_click", { action: "email_reading" });
    try {
      const res = await fetch("/api/email-reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, sessionId }),
      });
      if (!res.ok) throw new Error("Send failed");
      setState("sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="card text-center no-print">
        <p className="font-mono text-[12px] text-[var(--gold)] tracking-wider">
          ✓ SENT — CHECK YOUR INBOX
        </p>
        <p className="text-[13px] text-[var(--text-muted)] mt-2">
          Your Reading is now in your inbox. Keep it forever.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={send} className="card text-center no-print">
      <div className="eyebrow mb-3">keep this reading</div>
      <p className="text-[14px] text-[var(--text-muted)] mb-4">
        Email yourself a link to this Reading so you can revisit it any time.
      </p>
      <div className="flex gap-2 max-w-sm mx-auto">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-3 py-2 bg-[var(--bg)] border border-[var(--border-bright)] rounded focus:border-[var(--gold)] outline-none text-[13px]"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="btn btn-primary !py-2 !px-4 text-[12px]"
        >
          {state === "sending" ? "…" : "Send"}
        </button>
      </div>
      {state === "error" && (
        <p className="text-[11px] text-[var(--danger)] mt-2 font-mono">
          Email service did not accept the request. Retry in a moment.
        </p>
      )}
    </form>
  );
}
