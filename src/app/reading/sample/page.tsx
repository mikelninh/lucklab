import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TycheSigil } from "@/components/TycheSigil";
import { ArchetypeReveal } from "@/components/ArchetypeReveal";

const SAMPLE = {
  archetype: { name: "The Wanderer", tagline: "New routes. New people. New weather." },
  greeting: "Mikel, you are the kind of person luck finds when you leave the usual path.",
  glimpse:
    "You do not wait for luck to knock. You move first, then notice what opened. One answer says you want more structure; another says you get restless when the route repeats. That combination gives you reach, but it also makes you hard to pin down. People like you do best when the next step is concrete.",
  contradiction:
    "You want more structure, but your answers show that repetition drains you. The moment you feel boxed in, your luck starts to thin. You do better when the next step is concrete and the route can still breathe.",
  dominant:
    "Openness is your strongest lever. You vary the route, ask the extra question, and move before the room settles. That is why opportunities reach you. Tomorrow, pick one normal thing and do it differently on purpose.",
  quiet:
    "Surrender is your weakest lever. The cost is not drama. It is drift. You keep moving, but not always with enough weight behind the choice. The corrective is simple: decide one thing completely before noon.",
  traditionName: "Taoism",
  traditionConcept: "flow",
  traditionEssay:
    "Taoism fits you because your answers show motion first and reflection second. The old Chinese idea is not passivity. It is acting without forcing the shape too early. Laozi writes, 'A journey of a thousand miles begins beneath one's feet.' For you, that means the next move matters more than the perfect theory. Tomorrow morning, before checking messages, stand still for one minute and decide the one route you will take first.",
  sevenDayPlan: [
    "Day 1: Before your phone, stand at the edge of the bed for four minutes. Write the one thing you will do first today.",
    "Day 2: Take a different route for one ordinary errand and notice what changes in your attention.",
    "Day 3: Send one message you have been postponing. Keep it short and direct.",
    "Day 4: Work for twenty minutes without switching tasks. Finish the smallest open loop.",
    "Day 5: Make one decision before lunch and do not reopen it unless new information appears.",
    "Day 6: Write down where you felt most alive this week and what was present.",
    "Day 7: Keep one practice and drop one habit. Do not negotiate with yourself.",
  ],
};

export default function SampleReadingPage() {
  return (
    <>
      <Nav />
      <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <TycheSigil size={80} className="mx-auto mb-6" />
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
            {SAMPLE.greeting}
          </p>
        </section>

        <section className="mb-12 card card-gold">
          <div className="eyebrow mb-3">what tyche notices</div>
          <p className="text-[16px] md:text-[17px] text-[var(--text)] leading-[1.8] text-pretty">
            {SAMPLE.glimpse}
          </p>
        </section>

        <section className="mb-12 card">
          <div className="eyebrow mb-3">the contradiction</div>
          <p className="text-[16px] text-[var(--text)] leading-[1.8]">
            {SAMPLE.contradiction}
          </p>
        </section>

        <section className="mb-12">
          <div className="eyebrow mb-4">the six levers</div>
          <div className="card space-y-4">
            <div>
              <div className="font-mono text-[11px] text-[var(--gold)] tracking-wider mb-1">dominant</div>
              <p className="text-[15px] text-[var(--text)] leading-[1.8]">{SAMPLE.dominant}</p>
            </div>
            <div>
              <div className="font-mono text-[11px] text-[var(--gold)] tracking-wider mb-1">quiet</div>
              <p className="text-[15px] text-[var(--text)] leading-[1.8]">{SAMPLE.quiet}</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="eyebrow mb-4">tradition</div>
          <div className="card">
            <h2 className="font-display text-[26px] mb-2">{SAMPLE.traditionName}</h2>
            <p className="text-[13px] text-[var(--text-subtle)] italic mb-4">{SAMPLE.traditionConcept}</p>
            <p className="text-[15px] text-[var(--text)] leading-[1.85]">{SAMPLE.traditionEssay}</p>
          </div>
        </section>

        <section className="mb-14">
          <div className="eyebrow mb-4">seven-day plan</div>
          <div className="card space-y-4">
            {SAMPLE.sevenDayPlan.map((day, i) => (
              <div key={day} className="flex gap-4">
                <div className="font-mono text-[12px] text-[var(--gold)] tracking-wider flex-shrink-0 pt-1">
                  DAY {i + 1}
                </div>
                <p className="text-[14px] text-[var(--text)] leading-relaxed">{day}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <ArchetypeReveal
            name="Mikel"
            archetype={SAMPLE.archetype.name}
            tagline={SAMPLE.archetype.tagline}
            scores={{ attention: 58, openness: 82, action: 64, surrender: 41, connection: 73, meaning: 55 }}
          />
        </section>

        <div className="text-center mb-4">
          <Link href="/reading" className="btn btn-primary">
            Try the real Reading
          </Link>
        </div>
      </article>
      <Footer />
    </>
  );
}
