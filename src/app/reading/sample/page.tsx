import Link from "next/link";

export default function SampleReadingPage() {
  const scores = [
    ["Attention", 58],
    ["Openness", 82],
    ["Action", 64],
    ["Surrender", 41],
    ["Connection", 73],
    ["Meaning", 55],
  ] as const;

  const plan = [
    "Day 1: Before your phone, write the one move and do it within ten minutes.",
    "Day 2: Take one ordinary task a different route and notice what changes.",
    "Day 3: Send the message you have been postponing. Keep it short.",
    "Day 4: Finish one open loop in a single twenty-minute block.",
    "Day 5: Decide one thing before lunch and do not reopen it.",
    "Day 6: Write down where you felt most alive this week and what was present.",
    "Day 7: Keep one practice and drop one habit. Leave the week with a rule.",
  ];

  return (
    <>
      <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <div className="eyebrow mb-3">sample output</div>
          <h1 className="font-display text-[clamp(42px,6vw,68px)] leading-[1] tracking-[-0.02em] font-light mt-3 text-balance">
            What the <em className="not-italic text-gold-gradient">Primer</em> can feel like
          </h1>
          <p className="text-[16px] text-[var(--text-muted)] mt-4 italic max-w-md mx-auto">
            A realistic example of the €9 result, simplified so you can judge the shape.
          </p>
        </div>

        <section className="mb-12">
          <p className="font-display text-[clamp(26px,3.4vw,38px)] leading-[1.25] text-[var(--text)] text-balance">
            You do not miss luck. You delay the moment it becomes real.
          </p>
        </section>

        <section className="mb-12 card card-gold">
          <div className="eyebrow mb-3">the reveal</div>
          <p className="text-[16px] md:text-[17px] text-[var(--text)] leading-[1.85] text-pretty">
            You spot openings early, but you keep asking for one more confirmation. That makes you careful, and it also costs momentum. Luck reaches you when the next move is concrete and you stop reopening it.
          </p>
        </section>

        <section className="mb-12 card">
          <div className="eyebrow mb-3">the contradiction</div>
          <p className="text-[16px] text-[var(--text)] leading-[1.85]">
            You want structure, but too much structure drains you. You do best with one clear first move and a route that can adapt once it starts.
          </p>
        </section>

        <section className="mb-12">
          <div className="eyebrow mb-4">the six levers</div>
          <div className="card space-y-4">
            <div>
              <div className="font-mono text-[11px] text-[var(--gold)] tracking-wider mb-1">dominant</div>
              <p className="text-[15px] text-[var(--text)] leading-[1.8]">
                Openness is your strongest lever. You notice openings, ask the extra question, and move before the room settles. That is not indecision; it is your edge. Tomorrow, make one decision after the first useful signal and do not search for a second verdict.
              </p>
            </div>
            <div>
              <div className="font-mono text-[11px] text-[var(--gold)] tracking-wider mb-1">quiet</div>
              <p className="text-[15px] text-[var(--text)] leading-[1.8]">
                Surrender is your weakest lever. The cost is drift, not drama. You keep options open one beat too long, and the decision loses weight. The corrective is simple: choose one thing completely before noon.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="eyebrow mb-4">tradition</div>
          <div className="card">
            <h2 className="font-display text-[26px] mb-2">Taoism</h2>
            <p className="text-[13px] text-[var(--text-subtle)] italic mb-4">wu wei, but practical</p>
            <p className="text-[15px] text-[var(--text)] leading-[1.85]">
              Taoism fits you because your answers show motion first and reflection second. The point is not passivity. It is not forcing the shape too early. Laozi writes, "A journey of a thousand miles begins with a single step." For you, the next move matters more than the perfect theory.
            </p>
            <p className="text-[15px] text-[var(--text)] leading-[1.85] mt-4">
              Tomorrow morning, before messages, write the one route you will take first and follow it.
            </p>
          </div>
        </section>

        <section className="mb-14">
          <div className="eyebrow mb-4">seven-day plan</div>
          <div className="card space-y-4">
            {plan.map((item) => {
              const [day, text] = item.split(": ");
              return (
                <div key={day} className="flex gap-4">
                  <div className="font-mono text-[12px] text-[var(--gold)] tracking-wider flex-shrink-0 pt-1">{day.toUpperCase()}</div>
                  <p className="text-[14px] text-[var(--text)] leading-relaxed">{text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-14">
          <div className="card card-gold text-center">
            <div className="eyebrow mb-3">shareable result</div>
            <p className="font-display text-[22px] text-[var(--text)] mb-2">
              You are <em className="not-italic text-[var(--gold)]">The Wayfinder</em>.
            </p>
            <p className="text-[14px] text-[var(--text-muted)] italic mb-6">
              You spot the opening. You need to trust it sooner.
            </p>
            <div className="grid sm:grid-cols-2 gap-2 text-left">
              {scores.map(([label, value]) => (
                <div key={label} className="border border-[var(--border)] rounded px-3 py-2 text-[13px] text-[var(--text)]">
                  {label} {value} / 100
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="text-center mb-4">
          <Link href="/reading" className="btn btn-primary">
            Try the real Reading
          </Link>
        </div>
      </article>
    </>
  );
}
