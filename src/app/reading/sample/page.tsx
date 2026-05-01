import Link from "next/link";

export default function SampleReadingPage() {
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
          <p className="font-display text-[22px] md:text-[28px] leading-[1.4] text-[var(--text)] text-balance">
            Mikel, you are the kind of person luck finds when you leave the usual path.
          </p>
        </section>

        <section className="mb-12 card card-gold">
          <div className="eyebrow mb-3">what tyche notices</div>
          <p className="text-[16px] md:text-[17px] text-[var(--text)] leading-[1.8] text-pretty">
            You do not wait for luck to knock. You move first, then notice what opened. One answer says you want more structure; another says you get restless when the route repeats. That combination gives you reach, but it also makes you hard to pin down. People like you do best when the next step is concrete.
          </p>
        </section>

        <section className="mb-12 card">
          <div className="eyebrow mb-3">the contradiction</div>
          <p className="text-[16px] text-[var(--text)] leading-[1.8]">
            You want more structure, but your answers show that repetition drains you. The moment you feel boxed in, your luck starts to thin. You do better when the next step is concrete and the route can still breathe.
          </p>
        </section>

        <section className="mb-12">
          <div className="eyebrow mb-4">the six levers</div>
          <div className="card space-y-4">
            <div>
              <div className="font-mono text-[11px] text-[var(--gold)] tracking-wider mb-1">dominant</div>
              <p className="text-[15px] text-[var(--text)] leading-[1.8]">Openness is your strongest lever. You vary the route, ask the extra question, and move before the room settles. That is why opportunities reach you. Tomorrow, pick one normal thing and do it differently on purpose.</p>
            </div>
            <div>
              <div className="font-mono text-[11px] text-[var(--gold)] tracking-wider mb-1">quiet</div>
              <p className="text-[15px] text-[var(--text)] leading-[1.8]">Surrender is your weakest lever. The cost is not drama. It is drift. You keep moving, but not always with enough weight behind the choice. The corrective is simple: decide one thing completely before noon.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="eyebrow mb-4">tradition</div>
          <div className="card">
            <h2 className="font-display text-[26px] mb-2">Taoism</h2>
            <p className="text-[13px] text-[var(--text-subtle)] italic mb-4">flow</p>
            <p className="text-[15px] text-[var(--text)] leading-[1.85]">Taoism fits you because your answers show motion first and reflection second. The old Chinese idea is not passivity. It is acting without forcing the shape too early. Laozi writes, 'A journey of a thousand miles begins beneath one's feet.' For you, that means the next move matters more than the perfect theory. Tomorrow morning, before checking messages, stand still for one minute and decide the one route you will take first.</p>
          </div>
        </section>

        <section className="mb-14">
          <div className="eyebrow mb-4">seven-day plan</div>
          <div className="card space-y-4">
            <div className="flex gap-4">
              <div className="font-mono text-[12px] text-[var(--gold)] tracking-wider flex-shrink-0 pt-1">DAY 1</div>
              <p className="text-[14px] text-[var(--text)] leading-relaxed">Before your phone, stand at the edge of the bed for four minutes. Write the one thing you will do first today.</p>
            </div>
            <div className="flex gap-4">
              <div className="font-mono text-[12px] text-[var(--gold)] tracking-wider flex-shrink-0 pt-1">DAY 2</div>
              <p className="text-[14px] text-[var(--text)] leading-relaxed">Take a different route for one ordinary errand and notice what changes in your attention.</p>
            </div>
            <div className="flex gap-4">
              <div className="font-mono text-[12px] text-[var(--gold)] tracking-wider flex-shrink-0 pt-1">DAY 3</div>
              <p className="text-[14px] text-[var(--text)] leading-relaxed">Send one message you have been postponing. Keep it short and direct.</p>
            </div>
            <div className="flex gap-4">
              <div className="font-mono text-[12px] text-[var(--gold)] tracking-wider flex-shrink-0 pt-1">DAY 4</div>
              <p className="text-[14px] text-[var(--text)] leading-relaxed">Work for twenty minutes without switching tasks. Finish the smallest open loop.</p>
            </div>
            <div className="flex gap-4">
              <div className="font-mono text-[12px] text-[var(--gold)] tracking-wider flex-shrink-0 pt-1">DAY 5</div>
              <p className="text-[14px] text-[var(--text)] leading-relaxed">Make one decision before lunch and do not reopen it unless new information appears.</p>
            </div>
            <div className="flex gap-4">
              <div className="font-mono text-[12px] text-[var(--gold)] tracking-wider flex-shrink-0 pt-1">DAY 6</div>
              <p className="text-[14px] text-[var(--text)] leading-relaxed">Write down where you felt most alive this week and what was present.</p>
            </div>
            <div className="flex gap-4">
              <div className="font-mono text-[12px] text-[var(--gold)] tracking-wider flex-shrink-0 pt-1">DAY 7</div>
              <p className="text-[14px] text-[var(--text)] leading-relaxed">Keep one practice and drop one habit. Do not negotiate with yourself.</p>
            </div>
          </div>
        </section>

        <section className="mb-14">
          <div className="card card-gold text-center">
            <div className="eyebrow mb-3">shareable result</div>
            <p className="font-display text-[22px] text-[var(--text)] mb-2">Mikel, you are <em className="not-italic text-[var(--gold)]">The Wanderer</em>.</p>
            <p className="text-[14px] text-[var(--text-muted)] italic mb-6">New routes. New people. New weather.</p>
            <div className="grid sm:grid-cols-2 gap-2 text-left">
              {[
                "Attention 58 / 100",
                "Openness 82 / 100",
                "Action 64 / 100",
                "Surrender 41 / 100",
                "Connection 73 / 100",
                "Meaning 55 / 100",
              ].map((item) => (
                <div key={item} className="border border-[var(--border)] rounded px-3 py-2 text-[13px] text-[var(--text)]">
                  {item}
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
