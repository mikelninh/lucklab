import Link from "next/link";
import Image from "next/image";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Posters — Luck Lab",
  description:
    "Top 10 Luck Lab bestseller posters. Print-ready designs for print-on-demand and direct download.",
};

const posters = [
  { file: "01-train-your-luck.svg", title: "Train Your Luck" },
  { file: "02-small-signals-big-futures.svg", title: "Small Signals, Big Futures" },
  { file: "03-fortune-favors-the-curious.svg", title: "Fortune Favors the Curious" },
  { file: "04-luck-is-a-practice.svg", title: "Luck Is a Practice" },
  { file: "05-chance-meets-preparation.svg", title: "Chance Meets Preparation" },
  { file: "06-trust-the-pattern.svg", title: "Trust the Pattern" },
  { file: "07-kairos-over-chronos.svg", title: "Kairos Over Chronos" },
  { file: "08-stay-open-stay-lucky.svg", title: "Stay Open, Stay Lucky" },
  { file: "09-build-serendipity.svg", title: "Build Serendipity" },
  { file: "10-become-a-luck-magnet.svg", title: "Become a Luck Magnet" },
];

export default function PostersPage() {
  return (
    <>
      <Nav />

      <main className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <div className="max-w-3xl mb-10 md:mb-14">
          <div className="eyebrow mb-3">print shop</div>
          <h1 className="font-display text-[38px] md:text-[58px] leading-[1.04] tracking-[-0.02em] font-light text-balance">
            Luck Lab Top 10
            <br />
            <em className="not-italic text-gold-gradient">Bestseller Posters</em>
          </h1>
          <p className="mt-5 text-[15px] md:text-[17px] text-[var(--text-muted)] leading-[1.8]">
            You can preview every design below. Each poster links directly to the original print-ready SVG file.
          </p>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posters.map((poster) => {
            const href = `/posters/top-10-bestsellers/${poster.file}`;

            return (
              <article key={poster.file} className="panel overflow-hidden">
                <a href={href} target="_blank" rel="noreferrer" className="block">
                  <Image
                    src={href}
                    alt={`Luck Lab poster: ${poster.title}`}
                    width={1200}
                    height={1500}
                    className="w-full h-auto aspect-[4/5] object-cover"
                    loading="lazy"
                    unoptimized
                  />
                </a>
                <div className="p-4 border-t border-[var(--border)]">
                  <h2 className="font-display text-[22px] leading-[1.2]">{poster.title}</h2>
                  <Link
                    href={href}
                    target="_blank"
                    className="inline-block mt-3 text-[13px] text-[var(--gold)] hover:text-[var(--gold-bright)] transition"
                  >
                    Open print file →
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      </main>

      <Footer />
    </>
  );
}
