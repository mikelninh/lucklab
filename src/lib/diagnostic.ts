/**
 * The Kairos Diagnostic — 10 calibrated inputs.
 * Each option scores 0-3 on one or more of the six mechanisms.
 * Final profile → archetype + tradition matches + growth edge.
 */

import type { MechanismId } from "./traditions";

export type Scores = Record<MechanismId, number>;

export type Option = {
  id: string;
  kbd: string; // mono tag shown in UI
  label: string;
  scores: Partial<Scores>;
};

export type Question = {
  id: number;
  axis: string; // human-readable axis name
  prompt: string;
  helper?: string;
  options: Option[];
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    axis: "antecedent",
    prompt: "Recall the last time something lucky happened to you. What preceded it?",
    helper: "Think of a specific event — an unexpected gift, timing, opportunity, encounter.",
    options: [
      {
        id: "1a",
        kbd: "attention",
        label: "I noticed something subtle others would have missed.",
        scores: { attention: 3 },
      },
      {
        id: "1b",
        kbd: "deviation",
        label: "I said yes to something outside my normal routine.",
        scores: { openness: 3 },
      },
      {
        id: "1c",
        kbd: "release",
        label: "I had just stopped trying to control the outcome.",
        scores: { surrender: 3 },
      },
      {
        id: "1d",
        kbd: "contact",
        label: "I spoke to someone I normally would not have.",
        scores: { connection: 3 },
      },
    ],
  },
  {
    id: 2,
    axis: "coincidence response",
    prompt: "When a strange coincidence occurs, your first instinct is:",
    options: [
      {
        id: "2a",
        kbd: "calculate",
        label: "Interesting. I estimate the probability.",
        scores: { attention: 1, meaning: 0 },
      },
      {
        id: "2b",
        kbd: "decode",
        label: "I look for the pattern or message.",
        scores: { meaning: 3 },
      },
      {
        id: "2c",
        kbd: "follow",
        label: "I act on it. Coincidences are invitations.",
        scores: { action: 3, meaning: 1 },
      },
      {
        id: "2d",
        kbd: "dismiss",
        label: "Coincidence. My brain just notices patterns.",
        scores: {},
      },
    ],
  },
  {
    id: 3,
    axis: "uncertainty",
    prompt: "Your relationship with uncertainty:",
    options: [
      {
        id: "3a",
        kbd: "avoid",
        label: "I prefer plans. Ambiguity makes me uncomfortable.",
        scores: {},
      },
      {
        id: "3b",
        kbd: "thrive",
        label: "I love the unexpected. Best things were never planned.",
        scores: { openness: 3, surrender: 1 },
      },
      {
        id: "3c",
        kbd: "tension",
        label: "I want to let go but find myself gripping anyway.",
        scores: { surrender: 1 },
      },
      {
        id: "3d",
        kbd: "integrate",
        label: "I plan the plannable and stay open to the rest.",
        scores: { surrender: 2, action: 2 },
      },
    ],
  },
  {
    id: 4,
    axis: "routine deviation",
    prompt: "In the past month, how often did you do something genuinely outside your routine?",
    helper: "A new route, a new place, a new type of event, a spontaneous yes.",
    options: [
      { id: "4a", kbd: "0", label: "Rarely or never.", scores: {} },
      { id: "4b", kbd: "1-2", label: "Once or twice.", scores: { openness: 1 } },
      { id: "4c", kbd: "weekly", label: "Weekly.", scores: { openness: 2 } },
      { id: "4d", kbd: "often", label: "Several times a week — novelty is a value.", scores: { openness: 3 } },
    ],
  },
  {
    id: 5,
    axis: "social surface",
    prompt: "At an event with strangers, you:",
    options: [
      { id: "5a", kbd: "bubble", label: "Stay close to the people I came with.", scores: {} },
      { id: "5b", kbd: "polite", label: "Speak to a few if they approach.", scores: { connection: 1 } },
      {
        id: "5c",
        kbd: "seek",
        label: "Actively look for new conversations.",
        scores: { connection: 3 },
      },
      {
        id: "5d",
        kbd: "mine",
        label: "Ask questions until I find something unexpected.",
        scores: { connection: 3, attention: 1 },
      },
    ],
  },
  {
    id: 6,
    axis: "attention width",
    prompt: "Your attentional default:",
    helper:
      "Wiseman found lucky people habitually notice more at the periphery while unlucky people narrow onto the task.",
    options: [
      { id: "6a", kbd: "narrow", label: "Tightly focused on the task. Rest is noise.", scores: {} },
      { id: "6b", kbd: "scattered", label: "Scattered — pulled by everything at once.", scores: {} },
      {
        id: "6c",
        kbd: "wide",
        label: "Wide — I naturally notice things at the edges.",
        scores: { attention: 3 },
      },
      {
        id: "6d",
        kbd: "flexible",
        label: "I switch between narrow and wide deliberately.",
        scores: { attention: 3, meaning: 1 },
      },
    ],
  },
  {
    id: 7,
    axis: "setback reframe",
    prompt: "When something goes wrong, you tend to:",
    options: [
      { id: "7a", kbd: "rumi", label: "Ruminate on what went wrong.", scores: {} },
      {
        id: "7b",
        kbd: "force",
        label: "Push harder against it.",
        scores: { action: 1 },
      },
      {
        id: "7c",
        kbd: "redirect",
        label: "Ask what it is redirecting me toward.",
        scores: { meaning: 2, surrender: 2 },
      },
      {
        id: "7d",
        kbd: "door",
        label: "Notice what door has just opened.",
        scores: { meaning: 3, surrender: 1 },
      },
    ],
  },
  {
    id: 8,
    axis: "meaning-capture",
    prompt: "Do you record meaningful events, dreams, or coincidences?",
    options: [
      { id: "8a", kbd: "no", label: "Not at all.", scores: {} },
      { id: "8b", kbd: "occ", label: "Occasionally, in scattered notes.", scores: { meaning: 1 } },
      { id: "8c", kbd: "reg", label: "Regularly — I keep a journal.", scores: { meaning: 2 } },
      {
        id: "8d",
        kbd: "pattern",
        label: "Yes, and I revisit entries to trace patterns.",
        scores: { meaning: 3, attention: 1 },
      },
    ],
  },
  {
    id: 9,
    axis: "intuition",
    prompt: "Acting on intuition:",
    options: [
      {
        id: "9a",
        kbd: "distrust",
        label: "I distrust it. I rely on analysis.",
        scores: {},
      },
      {
        id: "9b",
        kbd: "sometimes",
        label: "Sometimes — when the stakes are low.",
        scores: { action: 1 },
      },
      {
        id: "9c",
        kbd: "often",
        label: "Often, though I verify afterward.",
        scores: { action: 2 },
      },
      {
        id: "9d",
        kbd: "calibrated",
        label: "I follow it, and I track my hit-rate over time.",
        scores: { action: 3, meaning: 1 },
      },
    ],
  },
  {
    id: 10,
    axis: "definition of luck",
    prompt: "In one phrase, luck is:",
    options: [
      {
        id: "10a",
        kbd: "random",
        label: "Random probability. Some get more, some get less.",
        scores: {},
      },
      {
        id: "10b",
        kbd: "ready",
        label: "Preparation meeting opportunity.",
        scores: { attention: 2, action: 2 },
      },
      {
        id: "10c",
        kbd: "flow",
        label: "A flow you tune into.",
        scores: { surrender: 2, connection: 1 },
      },
      {
        id: "10d",
        kbd: "skill",
        label: "A trainable skill.",
        scores: { action: 2, openness: 2 },
      },
    ],
  },
];

// ======================= Scoring =======================

export type Answer = { questionId: number; optionId: string };

// ======================= Personal context =======================
// Collected before the quiz — makes the Reading genuinely unique.

export type PersonalContext = {
  name: string;           // "Mikel"
  birthdate: string;      // ISO date "1994-03-14"
  currentQuestion: string; // what they are asking of Tyche, free text (≤280 chars)
};

// Name is the only required field. Birthdate and currentQuestion are optional —
// when present they enrich the Reading, when absent Tyche simply addresses the
// reader by name without mythic context or specific thread.
export function validatePersonalContext(c: Partial<PersonalContext>): c is PersonalContext {
  return (
    typeof c.name === "string" && c.name.trim().length >= 1 && c.name.trim().length <= 60
  );
}

// Preset questions people can pick if they can't articulate their own
export const PRESET_QUESTIONS = [
  "I am standing at a threshold and cannot tell whether to commit or keep searching.",
  "I feel stuck in a pattern I cannot name — what is actually happening?",
  "I am about to make a decision that will shape the next year. How should I read this moment?",
  "I want to be luckier. I do not know where to start.",
  "Something keeps almost happening, and I cannot tell if I should keep trying or let it go.",
  "I am waiting for clarity. What am I missing?",
] as const;

// Derive mythic metadata from birthdate — the Greek/classical angle that makes
// the Reading feel bespoke without pretending to be astrology.
export function birthContext(birthdateISO: string): {
  season: string;
  seasonEpithet: string;
  greekMonth: string;
  elementalAffinity: string;
} {
  const d = new Date(birthdateISO);
  const m = d.getMonth() + 1; // 1-12
  const day = d.getDate();

  // Northern-hemisphere seasons (the tradition the vocabulary comes from)
  let season = "spring";
  let seasonEpithet = "the renewing season";
  if ((m === 12 && day >= 21) || m === 1 || m === 2 || (m === 3 && day < 20)) {
    season = "winter";
    seasonEpithet = "the deepening season";
  } else if ((m === 3 && day >= 20) || m === 4 || m === 5 || (m === 6 && day < 21)) {
    season = "spring";
    seasonEpithet = "the renewing season";
  } else if ((m === 6 && day >= 21) || m === 7 || m === 8 || (m === 9 && day < 23)) {
    season = "summer";
    seasonEpithet = "the fullness season";
  } else {
    season = "autumn";
    seasonEpithet = "the harvest season";
  }

  // Greek (Attic) calendar approximate mapping, month ~ classical month name
  const greekMonths = [
    "Gamelion", "Anthesterion", "Elaphebolion", "Mounichion",
    "Thargelion", "Skirophorion", "Hekatombaion", "Metageitnion",
    "Boedromion", "Pyanepsion", "Maimakterion", "Poseideon",
  ];
  const greekMonth = greekMonths[m - 1];

  // Four classical elements — rough traditional season-element mapping
  const elementalAffinity =
    season === "spring" ? "air — beginnings, breath, weaving"
    : season === "summer" ? "fire — expression, clarity, action"
    : season === "autumn" ? "earth — consolidation, harvest, grounding"
    : "water — depth, inward seeing, release";

  return { season, seasonEpithet, greekMonth, elementalAffinity };
}

export function emptyScores(): Scores {
  return { attention: 0, openness: 0, action: 0, surrender: 0, connection: 0, meaning: 0 };
}

export function computeScores(answers: Answer[]): Scores {
  const scores = emptyScores();
  for (const a of answers) {
    const q = QUESTIONS.find((x) => x.id === a.questionId);
    if (!q) continue;
    const opt = q.options.find((o) => o.id === a.optionId);
    if (!opt) continue;
    for (const [k, v] of Object.entries(opt.scores)) {
      scores[k as MechanismId] += v ?? 0;
    }
  }
  return scores;
}

// Theoretical max per mechanism — for normalisation
export const MAX_SCORES: Scores = (() => {
  const s = emptyScores();
  for (const q of QUESTIONS) {
    const bestPerMechanism: Partial<Scores> = {};
    for (const opt of q.options) {
      for (const [k, v] of Object.entries(opt.scores)) {
        const key = k as MechanismId;
        bestPerMechanism[key] = Math.max(bestPerMechanism[key] ?? 0, v ?? 0);
      }
    }
    for (const [k, v] of Object.entries(bestPerMechanism)) {
      s[k as MechanismId] += v ?? 0;
    }
  }
  return s;
})();

export function normalisedScores(scores: Scores): Scores {
  const out = emptyScores();
  for (const k of Object.keys(scores) as MechanismId[]) {
    out[k] = MAX_SCORES[k] > 0 ? Math.round((scores[k] / MAX_SCORES[k]) * 100) : 0;
  }
  return out;
}

// ======================= Archetypes =======================

export type Archetype = {
  id: string;
  name: string;
  greek: string;
  tagline: string;
  description: string;
  dominant: MechanismId[];
  resonantTraditions: string[]; // tradition ids
};

export const ARCHETYPES: Archetype[] = [
  {
    id: "seer",
    name: "The Seer",
    greek: "ὁ προβλέπων",
    tagline: "You win through precision of noticing.",
    description:
      "Your kairotic engine is attention. You perceive what others walk past — weak signals, subtle shifts, meaningful details. Luck finds you through the information edge.",
    dominant: ["attention", "meaning"],
    resonantTraditions: ["jung", "hermetic", "kabbalah", "quantum"],
  },
  {
    id: "wanderer",
    name: "The Wanderer",
    greek: "ὁ ὁδοιπόρος",
    tagline: "You win through exposure to the new.",
    description:
      "Your kairotic engine is openness. You widen the surface area of your life. More novel contexts → more chance for serendipity. Luck finds you through variance.",
    dominant: ["openness", "connection"],
    resonantTraditions: ["wiseman", "buddhism", "yoruba"],
  },
  {
    id: "steerer",
    name: "The Steerer",
    greek: "ὁ κυβερνήτης",
    tagline: "You win through acting at the opportune moment.",
    description:
      "Your kairotic engine is aligned action. You sense when a moment is ripe and move. You convert potential into outcome where others hesitate. Luck finds you through timing.",
    dominant: ["action", "attention"],
    resonantTraditions: ["vedanta", "iching", "stoic"],
  },
  {
    id: "yielder",
    name: "The Yielder",
    greek: "ὁ ἐνδιδούς",
    tagline: "You win by releasing the grip.",
    description:
      "Your kairotic engine is surrender. Where others force, you yield. Where others grip, you open. The unforced outcome reaches you because you are not clamping down on it.",
    dominant: ["surrender", "meaning"],
    resonantTraditions: ["tao", "sufi", "stoic", "buddhism"],
  },
  {
    id: "weaver",
    name: "The Weaver",
    greek: "ὁ ὑφαντής",
    tagline: "You win through the density of your relationships.",
    description:
      "Your kairotic engine is connection. Your luck rides on the social graph — weak ties, strange introductions, unexpected collaborators. Luck finds you through other people.",
    dominant: ["connection", "openness"],
    resonantTraditions: ["yoruba", "buddhism", "sufi"],
  },
  {
    id: "reader",
    name: "The Reader",
    greek: "ὁ ἑρμηνευτής",
    tagline: "You win through the quality of your interpretation.",
    description:
      "Your kairotic engine is meaning-making. The same event is lucky or unlucky depending on the frame. You have trained the frame. Luck finds you because you know how to read what happens.",
    dominant: ["meaning", "surrender"],
    resonantTraditions: ["jung", "hermetic", "iching"],
  },
];

export function archetypeFor(scores: Scores): Archetype {
  // Rank mechanisms by normalised score; match archetype whose dominant axes
  // best align with the top two.
  const norm = normalisedScores(scores);
  const ranked = (Object.entries(norm) as [MechanismId, number][]).sort(
    (a, b) => b[1] - a[1],
  );
  const [top1, top2] = [ranked[0][0], ranked[1][0]];

  let best: { a: Archetype; score: number } | null = null;
  for (const a of ARCHETYPES) {
    let s = 0;
    if (a.dominant[0] === top1) s += 3;
    if (a.dominant[1] === top1) s += 2;
    if (a.dominant[0] === top2) s += 2;
    if (a.dominant[1] === top2) s += 1;
    if (!best || s > best.score) best = { a, score: s };
  }
  return best!.a;
}

export function growthEdge(scores: Scores): MechanismId {
  const norm = normalisedScores(scores);
  const ranked = (Object.entries(norm) as [MechanismId, number][]).sort(
    (a, b) => a[1] - b[1],
  );
  return ranked[0][0];
}
