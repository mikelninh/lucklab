/**
 * Analytics helper — Plausible (privacy-first) custom events.
 * No-ops if Plausible isn't configured, so callsites never have to guard.
 *
 * Setup: add NEXT_PUBLIC_PLAUSIBLE_DOMAIN to env. The script tag in
 * layout.tsx loads automatically. Configure goals in Plausible dashboard
 * to match event names below.
 */

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> },
    ) => void;
  }
}

export type KairosEvent =
  | "reading_start"
  | "reading_complete"
  | "preview_viewed"
  | "checkout_start"
  | "checkout_complete"
  | "subscribe_submit"
  | "pdf_download"
  | "article_read"
  | "cta_click";

export function track(
  event: KairosEvent,
  props?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined") return;
  if (!window.plausible) return;
  try {
    window.plausible(event, props ? { props } : undefined);
  } catch {
    // silent — never let analytics break the app
  }
}
