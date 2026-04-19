"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

/**
 * Exit-intent popup — triggers when cursor leaves viewport (desktop)
 * or on rapid scroll-up (mobile). Shows once per session.
 * Catches ~5-10% of the 60% who would otherwise bounce silently.
 */
export function ExitIntent() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    // Don't show on reading pages (they're already engaged)
    if (window.location.pathname.startsWith("/reading")) return;

    let shown = false;
    const key = "kairos:exit-intent-shown";
    if (sessionStorage.getItem(key)) return;

    // Desktop: mouse leaves viewport
    function onMouseLeave(e: MouseEvent) {
      if (e.clientY < 5 && !shown) {
        shown = true;
        sessionStorage.setItem(key, "1");
        setShow(true);
        track("cta_click", { action: "exit_intent_shown" });
      }
    }

    // Mobile: rapid scroll up (user reaching for back/close)
    let lastScrollY = 0;
    let lastTime = Date.now();
    function onScroll() {
      const now = Date.now();
      const delta = lastScrollY - window.scrollY;
      const timeDelta = now - lastTime;
      // Fast upward scroll (>200px in <300ms) after scrolling down at least 500px
      if (delta > 200 && timeDelta < 300 && lastScrollY > 500 && !shown) {
        shown = true;
        sessionStorage.setItem(key, "1");
        setShow(true);
      }
      lastScrollY = window.scrollY;
      lastTime = now;
    }

    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [dismissed]);

  if (!show || dismissed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="card card-tyche max-w-md w-full relative text-center">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-4 text-[var(--text-subtle)] hover:text-[var(--text)] text-[18px]"
        >
          &times;
        </button>
        <div className="eyebrow eyebrow-tyche mb-4">before you go</div>
        <h3 className="font-display text-[28px] md:text-[32px] font-light leading-[1.15] mb-4 text-balance">
          Your archetype is <em className="not-italic text-[var(--gold)]">waiting</em>.
        </h3>
        <p className="text-[14px] text-[var(--text-muted)] mb-6 leading-relaxed">
          Three minutes. No account. Tyche will tell you which of six
          kairotic profiles you are — and which wisdom tradition speaks
          to your pattern.
        </p>
        <Link
          href="/reading"
          onClick={() => {
            track("cta_click", { action: "exit_intent_clicked" });
            setDismissed(true);
          }}
          className="btn btn-primary"
        >
          Take the Reading
        </Link>
        <p className="font-mono text-[10px] text-[var(--text-subtle)] mt-4 tracking-wider">
          BE AMONG THE FIRST · QUIETLY OPEN
        </p>
      </div>
    </div>
  );
}
