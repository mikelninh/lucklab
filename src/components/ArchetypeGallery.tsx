"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * ArchetypeGallery — interactive 6-card deck.
 *
 * Left stage: stacked archetype cards (9:16), pointer-parallax tilt on the
 *   active one, siblings fan behind with depth.
 * Right panel: Greek name, strongest/quietest levers, narrated story
 *   (reused verbatim from email-templates.ts ARCHETYPE_STORIES), CTA.
 *
 * Interaction: ←/→ keyboard, click the chip rail, click the card itself.
 * Reveal-on-scroll via IntersectionObserver.
 */

type Archetype = {
  id: string;
  name: string;
  greek: string;           // Greek letters (display)
  transliteration: string; // latinised, italic sub
  image: string;           // /archetypes/*.png
  strongest: string;
  quietest: string;
  tagline: string;         // one-line essence
  story: string;           // HTML allowed (from ARCHETYPE_STORIES.story)
  color: string;           // accent for chip dot / ring
};

const ARCHETYPES: Archetype[] = [
  {
    id: "seer",
    name: "The Seer",
    greek: "ΠΡΟΦΉΤΗΣ",
    transliteration: "prophētēs · the one who sees",
    image: "/archetypes/seer.png",
    strongest: "Noticing",
    quietest: "Acting",
    tagline: "Attention catches what others miss.",
    story:
      "Jung's patient was describing a dream about a golden scarab when a real beetle flew through the consulting-room window. He caught it and handed it to her. The therapeutic impasse broke. As a Seer, your attention catches what others miss. The question your Reading explores is what you do with what you catch — because noticing without acting is the Seer's specific trap.",
    color: "#9ab4ff",
  },
  {
    id: "wanderer",
    name: "The Wanderer",
    greek: "ΟΔΟΙΠΌΡΟΣ",
    transliteration: "hodoiporos · the one who walks",
    image: "/archetypes/wanderer.png",
    strongest: "Variance",
    quietest: "Rooting",
    tagline: "New routes. New people. New weather.",
    story:
      "Richard Wiseman found that self-described lucky people had one behaviour others lacked: they varied their routine relentlessly. New routes, new people, new places. As a Wanderer, this is your native mode. Your Reading explores what happens when you go further — not just new places, but staying long enough for them to change you back.",
    color: "#d9b470",
  },
  {
    id: "steerer",
    name: "The Steerer",
    greek: "ΚΥΒΕΡΝΉΤΗΣ",
    transliteration: "kybernētēs · the helmsman",
    image: "/archetypes/steerer.png",
    strongest: "Acting",
    quietest: "Surrender",
    tagline: "Kairos had a forelock. You grip.",
    story:
      "Lysippos sculpted Kairos — the god of the opportune moment — with a long forelock and a bald back. You could seize him as he approached, but once he passed, there was nothing to grip. As a Steerer, you seize. You always have. Your Reading explores the cost: the moments you seized that were not yet ripe.",
    color: "#c47e55",
  },
  {
    id: "yielder",
    name: "The Yielder",
    greek: "ΕΥΉΝΙΟΣ",
    transliteration: "euēnios · the one who flows",
    image: "/archetypes/yielder.png",
    strongest: "Surrender",
    quietest: "Acting",
    tagline: "Gripping constricts. Dropping opens.",
    story:
      'Chapter 48 of the Tao Te Ching says: <em>"In the pursuit of Tao, every day something is dropped."</em> As a Yielder, your gift is the ability to release the grip. But there is a difference between dropping what you hold and dropping where you stand. Your Reading explores that difference — and the practice that bridges it.',
    color: "#e9d8b0",
  },
  {
    id: "weaver",
    name: "The Weaver",
    greek: "ΥΦΑΝΤΉΣ",
    transliteration: "hyphantēs · the one who weaves",
    image: "/archetypes/weaver.png",
    strongest: "Weak Ties",
    quietest: "Solitude",
    tagline: "The thread you haven't pulled yet.",
    story:
      "Sociologist Mark Granovetter proved in 1973 that the connections that change lives are weak ties — acquaintances, not close friends. As a Weaver, your social sonar is always on. Your Reading explores the thread you haven't yet pulled — the one that would pull you somewhere you haven't imagined.",
    color: "#8cbf9a",
  },
  {
    id: "reader",
    name: "The Reader",
    greek: "ΑΝΑΓΝΏΣΤΗΣ",
    transliteration: "anagnōstēs · the one who reads",
    image: "/archetypes/reader.png",
    strongest: "Meaning-making",
    quietest: "Letting things be things",
    tagline: "When everything is a sign, nothing is a signal.",
    story:
      "Synchronicity — the perception of meaningful coincidence. As a Reader, you do this fluently. Too fluently, perhaps. Your Reading explores the line between making meaning and manufacturing it — because when everything is a sign, nothing is a signal.",
    color: "#c0707a",
  },
];

export function ArchetypeGallery() {
  const [active, setActive] = useState(0);
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const current = ARCHETYPES[active];

  const go = useCallback((delta: number) => {
    setActive((i) => (i + delta + ARCHETYPES.length) % ARCHETYPES.length);
  }, []);

  // Keyboard navigation (only when section is visible)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!revealed) return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, revealed]);

  // Reveal-on-scroll
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) {
          setRevealed(true);
          io.disconnect();
          break;
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pointer parallax tilt
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5..0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * 8, ry: x * 10 });
  }
  function onPointerLeave() {
    setTilt({ rx: 0, ry: 0 });
  }

  return (
    <section
      id="archetypes"
      ref={sectionRef}
      className={`relative max-w-6xl mx-auto px-6 py-24 md:py-32 ${revealed ? "gallery-revealed" : "gallery-hidden"}`}
    >
      <div className="eyebrow mb-4">02 / the six archetypes</div>
      <h2 className="font-display text-[36px] md:text-[52px] leading-[1.05] tracking-[-0.015em] font-light mb-4 text-balance max-w-3xl">
        Six dispositions.{" "}
        <em className="not-italic text-[var(--gold)]">One of them is yours.</em>
      </h2>
      <p className="text-[15px] text-[var(--text-muted)] max-w-2xl mb-14 leading-relaxed">
        Every Reading returns one of six kairotic archetypes &mdash; each named
        in Greek, each rooted in a verified research finding or a primary text.
        Move through the deck. One of these is already you.
      </p>

      <div className="grid md:grid-cols-[minmax(0,420px)_1fr] gap-10 md:gap-16 items-start">
        {/* ============ Stage: stacked deck ============ */}
        <div className="relative">
          <div
            ref={stageRef}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            className="relative mx-auto w-full max-w-[420px] aspect-[9/16] select-none"
            style={{ perspective: "1200px" }}
          >
            {ARCHETYPES.map((a, i) => {
              const offset = i - active;
              const abs = Math.abs(offset);
              const isActive = offset === 0;
              // Siblings fan behind, max 3 visible on each side
              const visible = abs <= 3;
              const translateX = offset * 14;     // px
              const translateY = abs * 8;
              const translateZ = -abs * 60;
              const rotate = offset * 3;          // deg
              const scale = 1 - abs * 0.05;
              const opacity = visible ? (isActive ? 1 : Math.max(0.25, 1 - abs * 0.25)) : 0;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Select ${a.name}`}
                  aria-pressed={isActive}
                  tabIndex={isActive ? 0 : -1}
                  className="absolute inset-0 rounded-xl overflow-hidden border border-[var(--border-bright)] bg-[var(--surface)] transition-all duration-500 ease-out will-change-transform"
                  style={{
                    transform: isActive
                      ? `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotate(${rotate}deg) scale(${scale}) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`
                      : `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotate(${rotate}deg) scale(${scale})`,
                    opacity,
                    zIndex: 10 - abs,
                    boxShadow: isActive
                      ? "0 40px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,169,97,0.25)"
                      : "0 20px 40px -20px rgba(0,0,0,0.5)",
                    pointerEvents: visible ? "auto" : "none",
                  }}
                >
                  <Image
                    src={a.image}
                    alt={`${a.name} archetype card`}
                    fill
                    sizes="(max-width: 768px) 90vw, 420px"
                    className="object-cover"
                    priority={i < 2}
                  />
                  {/* Overlay text only on the active card */}
                  {isActive && (
                    <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none">
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/85 backdrop-blur-sm bg-black/20 px-2 py-1 rounded">
                          {String(i + 1).padStart(2, "0")} / 06
                        </span>
                        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/70 backdrop-blur-sm bg-black/20 px-2 py-1 rounded">
                          lucklab.app
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/70 mb-2">
                          {a.transliteration.split(" · ")[0]}
                        </div>
                        <div className="font-display text-[28px] md:text-[34px] font-light tracking-tight text-white text-balance">
                          {a.name}
                        </div>
                        <div className="font-mono text-[9px] tracking-[0.3em] text-white/60 mt-3">
                          {a.strongest.toUpperCase()}&nbsp;&nbsp;·&nbsp;&nbsp;{a.quietest.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Nav arrows under the card */}
          <div className="mt-6 flex items-center justify-between gap-3 max-w-[420px] mx-auto">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous archetype"
              className="btn btn-ghost px-4 py-2 text-[13px]"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M9 2L5 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              prev
            </button>
            <span className="font-mono text-[10px] text-[var(--text-subtle)] tracking-[0.3em] uppercase">
              {String(active + 1).padStart(2, "0")} / {String(ARCHETYPES.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next archetype"
              className="btn btn-ghost px-4 py-2 text-[13px]"
            >
              next
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M3 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* ============ Narration panel ============ */}
        <div className="min-w-0">
          {/* Chip rail */}
          <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Archetypes">
            {ARCHETYPES.map((a, i) => (
              <button
                key={a.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className="group inline-flex items-center gap-2 px-3 py-1.5 border rounded-full text-[12px] font-mono tracking-wider uppercase transition-colors"
                style={{
                  borderColor: i === active ? "var(--gold)" : "var(--border)",
                  background: i === active ? "rgba(201,169,97,0.08)" : "transparent",
                  color: i === active ? "var(--gold-bright)" : "var(--text-muted)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: i === active ? a.color : "var(--text-faint)" }}
                />
                {a.id}
              </button>
            ))}
          </div>

          {/* Narration body — keyed to remount on change for fade */}
          <div key={current.id} className="archetype-panel">
            <div className="flex items-baseline flex-wrap gap-x-4 gap-y-1 mb-2">
              <div className="eyebrow eyebrow-tyche">
                {current.greek}
              </div>
              <span className="font-display italic text-[13px] text-[var(--text-subtle)]">
                {current.transliteration}
              </span>
            </div>

            <h3 className="font-display text-[40px] md:text-[52px] leading-[1.02] tracking-[-0.015em] font-light text-balance">
              {current.name}
            </h3>

            <p className="font-display italic text-[18px] text-[var(--gold)] mt-3 text-balance">
              {current.tagline}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="border-l-2 border-[var(--gold)] pl-4">
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--text-subtle)] mb-1">
                  Strongest
                </div>
                <div className="font-display text-[20px] text-[var(--text)]">
                  {current.strongest}
                </div>
              </div>
              <div className="border-l-2 border-[var(--text-faint)] pl-4">
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--text-subtle)] mb-1">
                  Quietest
                </div>
                <div className="font-display text-[20px] text-[var(--text-muted)]">
                  {current.quietest}
                </div>
              </div>
            </div>

            <p
              className="font-display text-[16px] md:text-[17px] text-[var(--text-muted)] leading-[1.75] mt-7 text-pretty max-w-xl"
              dangerouslySetInnerHTML={{ __html: current.story }}
            />

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/reading" className="btn btn-primary">
                Find your archetype
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M3 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <span className="font-mono text-[11px] text-[var(--text-subtle)] tracking-wider self-center">
                3 minutes · 10 inputs · no account
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .gallery-hidden :global(.archetype-panel),
        .gallery-hidden :global(h2),
        .gallery-hidden :global(.eyebrow) {
          opacity: 0;
          transform: translateY(12px);
        }
        .gallery-revealed :global(.archetype-panel),
        .gallery-revealed :global(h2),
        .gallery-revealed :global(.eyebrow) {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.8s cubic-bezier(0.16, 0.84, 0.28, 1),
                      transform 0.8s cubic-bezier(0.16, 0.84, 0.28, 1);
        }
        .archetype-panel {
          animation: panelFade 0.6s cubic-bezier(0.16, 0.84, 0.28, 1);
        }
        @keyframes panelFade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
