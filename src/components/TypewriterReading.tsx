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
      "Lena, you know something most people spend decades unlearning: that gripping constricts. You chose \u201CI want to let go but find myself gripping anyway.\u201D That sentence is the entire Reading in miniature. You already know the answer. You do not yet trust it with your full weight.",
  },
  {
    kind: "follow",
    text:
      "Surrender: 44. You said \u201CI had stopped trying to control the outcome\u201D when asked what preceded luck. Yet you chose \u201CI want to let go but find myself gripping anyway\u201D about uncertainty. That is not a contradiction. It is a portrait.",
  },
];

export function TypewriterReading() {
  return (
    <div className="card card-tyche relative overflow-hidden">
      <div className="relative">
        <div className="eyebrow eyebrow-tyche mb-2 text-[10px]">
          sample · the yielder · tyche.read()
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
            THIS CONTINUES FOR 1,800+ WORDS · WRITTEN TO YOU BY NAME
          </span>
        </div>
      </div>
    </div>
  );
}
