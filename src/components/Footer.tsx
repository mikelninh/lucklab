import Link from "next/link";
import { KairosMark } from "./TycheSigil";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-24">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <KairosMark />
            <p className="text-[13px] text-[var(--text-muted)] mt-4 max-w-sm leading-relaxed">
              A research platform studying luck, synchronicity, and serendipity —
              cross-referencing 12 wisdom traditions with modern science. Guided by{" "}
              <span className="text-[var(--tyche)]">Tyche</span>, our AI oracle.
            </p>
          </div>
          <div>
            <div className="eyebrow eyebrow-muted mb-4">Explore</div>
            <ul className="space-y-2.5 text-[13px]">
              <li><Link href="/reading" className="text-[var(--text)] hover:text-[var(--gold)] transition">Begin Your Reading</Link></li>
              <li><Link href="/reviews" className="text-[var(--text)] hover:text-[var(--gold)] transition">Readers</Link></li>
              <li><Link href="/tyche" className="text-[var(--text)] hover:text-[var(--gold)] transition">Consult Tyche</Link></li>
              <li><Link href="/research" className="text-[var(--text)] hover:text-[var(--gold)] transition">Research</Link></li>
              <li><Link href="/#pricing" className="text-[var(--text)] hover:text-[var(--gold)] transition">Tyche&rsquo;s Reading</Link></li>
            </ul>
          </div>
          <div>
            <div className="eyebrow eyebrow-muted mb-4">Lab</div>
            <ul className="space-y-2.5 text-[13px]">
              <li><Link href="/about" className="text-[var(--text)] hover:text-[var(--gold)] transition">About</Link></li>
              <li><Link href="/contact" className="text-[var(--text)] hover:text-[var(--gold)] transition">Contact</Link></li>
              <li><Link href="/impressum" className="text-[var(--text)] hover:text-[var(--gold)] transition">Impressum</Link></li>
              <li><Link href="/privacy" className="text-[var(--text)] hover:text-[var(--gold)] transition">Privacy</Link></li>
              <li><Link href="/terms" className="text-[var(--text)] hover:text-[var(--gold)] transition">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="hairline mt-12 mb-6" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="font-mono text-[11px] text-[var(--text-subtle)] tracking-wider leading-relaxed">
            Built by Mikel Ninh, Berlin.{" "}
            <Link href="/impressum" className="hover:text-[var(--gold)]">Impressum</Link> ·{" "}
            <Link href="/privacy" className="hover:text-[var(--gold)]">Privacy</Link> ·{" "}
            <Link href="/terms" className="hover:text-[var(--gold)]">Terms</Link> ·{" "}
            <a
              href="https://github.com/mikelninh/kairos/blob/main/CHANGELOG.md"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--gold)]"
            >
              Changelog
            </a>
          </p>
          <p className="font-mono text-[11px] text-[var(--text-subtle)] tracking-wider">
            v1.0 · updated 2026-04-20
          </p>
        </div>
      </div>
    </footer>
  );
}
