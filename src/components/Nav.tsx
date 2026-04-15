import Link from "next/link";
import { KairosMark } from "./TycheSigil";

export function Nav() {
  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-[var(--bg)]/75 border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition">
          <KairosMark />
        </Link>
        <div className="flex items-center gap-8">
          <Link
            href="/research"
            className="hidden sm:inline text-[13px] text-[var(--text-muted)] hover:text-[var(--text)] transition"
          >
            Research
          </Link>
          <Link
            href="/about"
            className="hidden sm:inline text-[13px] text-[var(--text-muted)] hover:text-[var(--text)] transition"
          >
            About
          </Link>
          <Link
            href="/reading"
            className="btn btn-primary text-[13px] !py-2 !px-4"
          >
            Begin Your Reading
          </Link>
        </div>
      </div>
    </nav>
  );
}
