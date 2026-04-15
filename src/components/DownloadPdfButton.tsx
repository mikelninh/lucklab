"use client";

/**
 * Minimal "Download PDF" button — uses browser's built-in print-to-PDF with
 * our print stylesheet in globals.css. No server infrastructure, works everywhere.
 *
 * For a richer server-side PDF later:
 * - Install @sparticuz/chromium + puppeteer-core
 * - Create /api/reading/pdf/[sessionId] route that renders the page headlessly
 * - See docs/PDF-SERVER.md for the implementation sketch
 */
export function DownloadPdfButton({ label = "Download as PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn btn-ghost no-print"
    >
      {label}
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M6 1v8m0 0l-3-3m3 3l3-3M1 10.5h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
