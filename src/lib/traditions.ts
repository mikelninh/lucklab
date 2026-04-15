/**
 * The 12 traditions Kairos Lab cross-references.
 * Each encodes a specific mechanism for cultivating what we now call "luck".
 */

export type Tradition = {
  id: string;
  name: string;
  era: string;
  concept: string;
  conceptOrigin: string;
  mechanism: string;
  practice: string;
  convergesOn: "attention" | "openness" | "action" | "surrender" | "connection" | "meaning";
};

export const TRADITIONS: Tradition[] = [
  {
    id: "jung",
    name: "Jungian Psychology",
    era: "1920s · Zürich",
    concept: "synchronicity",
    conceptOrigin: "Carl Jung · Acausal Connecting Principle",
    mechanism: "An acausal relationship between inner state and outer event — meaningful coincidence as information.",
    practice: "Track coincidences. Ask what they mirror.",
    convergesOn: "meaning",
  },
  {
    id: "tao",
    name: "Taoism",
    era: "6th c. BCE · China",
    concept: "wu wei",
    conceptOrigin: "Laozi · Dao De Jing",
    mechanism: "Effortless alignment with the flow of reality; force produces resistance, yielding produces fortune.",
    practice: "Act from stillness. Do not strain.",
    convergesOn: "surrender",
  },
  {
    id: "kabbalah",
    name: "Kabbalah",
    era: "12th c. · Spain / Safed",
    concept: "mazal",
    conceptOrigin: "Zohar · Sefer Yetzirah",
    mechanism: "A downward flow of fortune from higher realms, channelled by alignment of intention and deed.",
    practice: "Align thought, speech, and action before important moments.",
    convergesOn: "attention",
  },
  {
    id: "vedanta",
    name: "Vedanta",
    era: "800 BCE · India",
    concept: "karma + dharma",
    conceptOrigin: "Upanishads · Bhagavad Gita",
    mechanism: "Aligned action (dharma) seeds cascading positive consequences (karma) across time.",
    practice: "Find your dharma. Act from it without attachment.",
    convergesOn: "action",
  },
  {
    id: "stoic",
    name: "Stoicism",
    era: "3rd c. BCE · Athens",
    concept: "amor fati",
    conceptOrigin: "Epictetus · Marcus Aurelius",
    mechanism: "Loving what happens transforms obstacle into path; embracing fate reveals hidden opportunity.",
    practice: "Say yes to what is. Look for the gift inside the adverse event.",
    convergesOn: "surrender",
  },
  {
    id: "buddhism",
    name: "Buddhism",
    era: "5th c. BCE · India",
    concept: "pratītyasamutpāda",
    conceptOrigin: "Pali Canon · Nagarjuna",
    mechanism: "Dependent origination: everything arises in relation to everything. No coincidence is truly isolated.",
    practice: "Notice the web. Nothing happens alone.",
    convergesOn: "connection",
  },
  {
    id: "quantum",
    name: "Quantum Physics",
    era: "1920s–present",
    concept: "observer effect",
    conceptOrigin: "Heisenberg · Wheeler · delayed-choice experiments",
    mechanism: "Observation collapses probability. Attention has a demonstrated role in outcome realisation.",
    practice: "Direct attention precisely to the outcome you want to resolve.",
    convergesOn: "attention",
  },
  {
    id: "wiseman",
    name: "Positive Psychology",
    era: "2003 · Univ. Hertfordshire",
    concept: "the luck factor",
    conceptOrigin: "Richard Wiseman · 10-year study, 400 subjects",
    mechanism: "Lucky people exhibit four measurable behaviours: maximise chance, listen to intuition, expect good fortune, turn bad luck to good.",
    practice: "Widen attention. Vary routine. Meet strangers. Reframe setbacks.",
    convergesOn: "openness",
  },
  {
    id: "sufi",
    name: "Sufism",
    era: "9th c. · Persia",
    concept: "barakah",
    conceptOrigin: "Rumi · Ibn Arabi",
    mechanism: "Blessing-flow — a mobile presence that accompanies aligned souls and touches what they touch.",
    practice: "Cultivate inner stillness. Blessing follows presence.",
    convergesOn: "surrender",
  },
  {
    id: "iching",
    name: "I Ching",
    era: "1000 BCE · China",
    concept: "timeliness",
    conceptOrigin: "Book of Changes · Ten Wings",
    mechanism: "Each moment has a specific texture; fortune comes from reading the moment and acting in accord.",
    practice: "Ask: what does this moment actually want?",
    convergesOn: "action",
  },
  {
    id: "hermetic",
    name: "Hermeticism",
    era: "2nd–3rd c. · Alexandria",
    concept: "as above, so below",
    conceptOrigin: "Corpus Hermeticum · Emerald Tablet",
    mechanism: "Outer events mirror inner states; the world responds to the quality of the observer&rsquo;s mind.",
    practice: "Change what you meet by changing the one meeting it.",
    convergesOn: "meaning",
  },
  {
    id: "yoruba",
    name: "Yorùbá / Ifá",
    era: "Pre-colonial West Africa",
    concept: "orí & àṣẹ",
    conceptOrigin: "Ifá divination tradition",
    mechanism: "Orí (inner destiny) guides àṣẹ (the power to bring things about). Consulting orí is consulting one&rsquo;s own luck.",
    practice: "Ask your inner self before deciding. Listen for resonance.",
    convergesOn: "connection",
  },
];

// The six convergence mechanisms (abstracted)
export const MECHANISMS = [
  {
    id: "attention",
    name: "Attention",
    gloss: "Precision of noticing.",
    description: "Where attention goes, possibility collapses. Every tradition trains the quality of looking.",
  },
  {
    id: "openness",
    name: "Openness",
    gloss: "Willingness to deviate.",
    description: "Lucky people expose themselves to more chance events by varying routine and meeting difference.",
  },
  {
    id: "action",
    name: "Aligned action",
    gloss: "Right move at the right moment.",
    description: "Kairos: the opportune moment. Acting in time matters more than acting hard.",
  },
  {
    id: "surrender",
    name: "Surrender",
    gloss: "Release of forcing.",
    description: "Gripping constricts. Yielding opens. Traditions converge on this paradox.",
  },
  {
    id: "connection",
    name: "Connection",
    gloss: "Density of relation.",
    description: "Luck lives in networks. Weak ties carry the serendipity that strong ties cannot.",
  },
  {
    id: "meaning",
    name: "Meaning-making",
    gloss: "Reading what happens.",
    description: "The same event is lucky or unlucky depending on the frame. Luck is partly interpretive skill.",
  },
] as const;

export type MechanismId = typeof MECHANISMS[number]["id"];
