"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Sticky bottom bar — appears after scrolling past the hero.
 * Hidden on /reading/* pages (user is already in the funnel).
 * The single highest-conversion element on scroll-heavy landing pages.
 */
export function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show on reading/checkout/legal pages
    const path = window.location.pathname;
    if (path.startsWith("/reading") || path.startsWith("/privacy") ||
        path.startsWith("/terms") || path.startsWith("/impressum") ||
        path.startsWith("/contact")) return;

    function onScroll() {
      setVisible(window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 no-print animate-slide-up">
      <div className="bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--border)] py-3 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <p className="hidden sm:block text-[13px] text-[var(--text-muted)]">
            <span className="text-[var(--gold)]">6 archetypes.</span> Which one are you?
          </p>
          <div className="flex items-center gap-3 ml-auto">
            <span className="font-mono text-[10px] text-[var(--text-subtle)] tracking-wider hidden md:block">
              3 MIN · NO ACCOUNT
            </span>
            <Link href="/reading" className="btn btn-primary !py-2 !px-5 text-[13px]">
              Take the Reading →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
