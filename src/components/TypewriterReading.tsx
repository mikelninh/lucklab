/**
 * TypewriterReading — static excerpt of Lena's Yielder Reading.
 *
 * Previously a scroll-triggered typewriter animation. Removed 2026-04-20:
 * the faux-drama of typing-reveal was serving the producer, not the reader.
 * The words themselves are the proof; they do not need a performance.
 */

type Block = { kind: "lead" | "follow"; text: string };

const SCRIPT: Block[] = [
  {
    kind: "lead",
    text:
      "Lena, the problem is not that you cannot let go. The problem is that you recognise the opening before you trust yourself to step through it. You call this caution. It is actually delay at the moment luck becomes usable.",
  },
  {
    kind: "follow",
    text:
      "Surrender: 44. You said \u201CI had stopped trying to control the outcome\u201D when asked what preceded luck, yet another answer says you grip when uncertainty appears. That is the pattern: you can release in principle, but not at the threshold. The Reading names the exact place where momentum leaves.",
  },
];

export function TypewriterReading() {
  return (
    <div className="card card-tyche relative overflow-hidden">
        <div className="relative">
          <div className="eyebrow eyebrow-tyche mb-2 text-[10px]">
            sample excerpt · a real Reading
        </div>

        {SCRIPT.map((block, i) => {
          const isLead = block.kind === "lead";
          return (
            <div key={i} className="mb-5">
              {!isLead && i === 1 && <div className="hairline mb-5" aria-hidden="true" />}
              <p
                className={
                  isLead
                    ? "font-display text-[16px] md:text-[17px] text-[var(--text)] leading-[1.65] italic"
                    : "font-display text-[15px] text-[var(--text-muted)] leading-[1.65] italic"
                }
              >
                <span aria-hidden="true">&ldquo;</span>
                {block.text}
                <span aria-hidden="true">&rdquo;</span>
              </p>
            </div>
          );
        })}

        <div className="text-center mt-2">
          <span className="font-mono text-[10px] tracking-wider text-[var(--tyche)]">
            THE FULL READING RUNS 1,800+ WORDS · WRITTEN TO YOU BY NAME
          </span>
        </div>
      </div>
    </div>
  );
}
