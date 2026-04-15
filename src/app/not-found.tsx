import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TycheSigil } from "@/components/TycheSigil";

export default function NotFound() {
  return (
    <>
      <Nav />
      <div className="max-w-2xl mx-auto px-6 py-24 md:py-32 text-center">
        <TycheSigil size={80} className="mx-auto mb-8 opacity-60" glow={false} />
        <div className="eyebrow eyebrow-muted mb-4">404 &middot; kairos</div>
        <h1 className="font-display text-[48px] md:text-[64px] leading-[1.05] font-light mb-6 text-balance">
          This was not the <em className="not-italic text-[var(--gold)]">opportune moment</em>.
        </h1>
        <p className="text-[15px] text-[var(--text-muted)] max-w-md mx-auto leading-relaxed mb-10">
          The page you sought does not exist. That, too, may be information.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/" className="btn btn-primary">
            Return home
          </Link>
          <Link href="/reading" className="btn btn-ghost">
            Begin Your Reading
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
