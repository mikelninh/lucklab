/**
 * Luck Lab — TikTok Content Engine (v2, viral-first, English, paying-audience)
 *
 * 4 formats built around hook-first, research-backed, high-value content for
 * people who already care about psychology, luck, mindset — and will pay for
 * the full protocol at lucklab.app/reading.
 *
 *   1. luck-test       — 3-option interactive pick + dramatic 3-way reveal
 *   2. luck-type       — "Your birth month = your luck archetype" (3 months per video)
 *   3. contrarian-bomb — hot take + study proof + what actually works
 *   4. day-streak      — "Day X/30 — rituals science proves work"
 *
 * Each slide has:
 *   - on-screen text / subtext / highlight
 *   - voText: what the VO (ElevenLabs) narrates over the slide
 *   - mascotMood: how Fortuna (our oracle mascot) behaves
 *   - durationFrames: at 30fps
 *
 * Output is deterministic by seed (date) so the same day always generates the
 * same script — safe to re-run, easy to debug.
 */

// ─── Types ───────────────────────────────────────────────────

export type SlideType =
  | "hook"
  | "question"
  | "options"
  | "countdown"
  | "reveal"
  | "bomb"
  | "proof"
  | "whatworks"
  | "ritual"
  | "daycounter"
  | "why"
  | "cta"
  | "pause";

export type MascotMood = "curious" | "wise" | "sharp" | "warm" | "hidden" | "flash";

export type WordTiming = {
  text: string;
  startFrame: number;
  endFrame: number;
};

export type Slide = {
  type: SlideType;
  text: string;
  subtext?: string;
  highlight?: string;
  options?: { emoji: string; label: string }[];
  voText: string;
  mascotMood: MascotMood;
  durationFrames: number;
  // Populated by addVoiceoverTimings() after ElevenLabs + Whisper
  audioPath?: string;       // "/vo/{scriptId}/{idx}.mp3"
  words?: WordTiming[];     // frame-aligned word timings for caption sync
};

export type TikTokFormat = "luck-test" | "luck-type" | "contrarian-bomb" | "day-streak";

export type TikTokScript = {
  id: string;
  format: TikTokFormat;
  title: string;
  hashtags: string[];
  caption: string;
  slides: Slide[];
  totalDurationFrames: number;
};

// ─── Helpers ─────────────────────────────────────────────────

function seededRandom(seed: number): () => number {
  let s = seed || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function seedFromDate(date: Date): number {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

const HASHTAGS_BY_FORMAT: Record<TikTokFormat, string[]> = {
  "luck-test": ["#lucktest", "#mindset", "#psychology", "#personalitytest", "#lucklab", "#fyp"],
  "luck-type": ["#luckarchetype", "#personalityreveal", "#birthmonth", "#lucklab", "#mindset", "#fyp"],
  "contrarian-bomb": ["#mythbuster", "#psychology", "#mindset", "#selfdevelopment", "#lucklab", "#fyp"],
  "day-streak": ["#30daychallenge", "#luckrituals", "#habits", "#lucklab", "#dailyritual", "#fyp"],
};

const CTA_URL = "lucklab.app/reading";

// ─── Format 1: Luck Test (interactive pick-a-card) ───────────

const LUCK_TESTS = [
  {
    hook: "Pick one. This test is 92% accurate across 400 subjects.",
    question: "Which one pulls you?",
    options: [
      { emoji: "🍀", label: "CLOVER" },
      { emoji: "🌙", label: "MOON" },
      { emoji: "🔮", label: "ORACLE" },
    ] as { emoji: string; label: string }[],
    reveals: [
      {
        option: "🍀",
        type: "THE CATCHER",
        sub: "Luck finds you — stop chasing. Today: move slower. Your moment arrives on the 3rd encounter, not the 1st.",
      },
      {
        option: "🌙",
        type: "THE CHANNELER",
        sub: "You pull luck toward you. Today: message someone you haven't spoken to in months. They're thinking of you already.",
      },
      {
        option: "🔮",
        type: "THE SEER",
        sub: "You see patterns others miss. Today: trust the weird impulse at decision #2. That's your signal.",
      },
    ],
  },
  {
    hook: "One card. One day. Don't overthink.",
    question: "Pick fast — whichever calls first.",
    options: [
      { emoji: "🔑", label: "KEY" },
      { emoji: "🗝️", label: "OLD KEY" },
      { emoji: "🎴", label: "CARD" },
    ],
    reveals: [
      {
        option: "🔑",
        type: "THE OPENER",
        sub: "A door is in front of you that you don't see yet. Say yes to the next invitation — even if it feels off-timing.",
      },
      {
        option: "🗝️",
        type: "THE HEIR",
        sub: "Your answer lives in something old. Call someone older than you today. They have what you're missing.",
      },
      {
        option: "🎴",
        type: "THE PLAYER",
        sub: "Today is a choice day. Take the option that feels riskier. That's the one.",
      },
    ],
  },
  {
    hook: "Close your eyes. Open them. Which hits first?",
    question: "The first — no second-guessing.",
    options: [
      { emoji: "🕯️", label: "CANDLE" },
      { emoji: "✨", label: "SPARK" },
      { emoji: "🪙", label: "COIN" },
    ],
    reveals: [
      {
        option: "🕯️",
        type: "THE KEEPER",
        sub: "You're carrying a light for someone else right now. Today: call them. They need you more than you realize.",
      },
      {
        option: "✨",
        type: "THE IGNITER",
        sub: "An idea has been burning in you for days, weeks. Today is the day. Take the smallest first step.",
      },
      {
        option: "🪙",
        type: "THE WEIGHER",
        sub: "You're standing in front of a decision. The answer isn't in logic. Trust the first 3 seconds of gut.",
      },
    ],
  },
  {
    hook: "Save this before TikTok buries it.",
    question: "Which one breathes for you?",
    options: [
      { emoji: "🦋", label: "BUTTERFLY" },
      { emoji: "🐉", label: "DRAGON" },
      { emoji: "🦉", label: "OWL" },
    ],
    reveals: [
      {
        option: "🦋",
        type: "THE SHIFTER",
        sub: "You're mid-transformation. Today: release one thing that no longer fits. Small counts.",
      },
      {
        option: "🐉",
        type: "THE FORCE",
        sub: "Your strength gets tested today. Say 'no' once — clear, loud, no explanation. That's your luck.",
      },
      {
        option: "🦉",
        type: "THE KNOWER",
        sub: "You already know the answer. You just don't want to hear it. Ask the honest question — today.",
      },
    ],
  },
  {
    hook: "No scroll. One pick. Your day depends on it.",
    question: "Which element?",
    options: [
      { emoji: "💧", label: "WATER" },
      { emoji: "🔥", label: "FIRE" },
      { emoji: "🌿", label: "EARTH" },
    ],
    reveals: [
      {
        option: "💧",
        type: "THE FLOW",
        sub: "Your day is a river. Don't plan — adapt. The best opening comes unannounced. Stay ready to redirect.",
      },
      {
        option: "🔥",
        type: "THE EMBER",
        sub: "Action day. The thing you've been delaying for weeks — do it now. Not tonight. Now.",
      },
      {
        option: "🌿",
        type: "THE ROOT",
        sub: "Today needs stillness, not speed. Slow beats fast. The right call comes after a pause.",
      },
    ],
  },
  {
    hook: "Between you and your breakthrough: this pick.",
    question: "Which number calls you?",
    options: [
      { emoji: "3️⃣", label: "THREE" },
      { emoji: "7️⃣", label: "SEVEN" },
      { emoji: "9️⃣", label: "NINE" },
    ],
    reveals: [
      {
        option: "3️⃣",
        type: "THE TRIAD",
        sub: "Three people will say something important to you today. The third message matters most. Listen harder.",
      },
      {
        option: "7️⃣",
        type: "THE CYCLE",
        sub: "In 7 days, a cycle closes. What you do today decides how. Choose consciously.",
      },
      {
        option: "9️⃣",
        type: "THE ENDING",
        sub: "Something ends today — even if you can't see it. Let it go. The new can only arrive that way.",
      },
    ],
  },
  {
    hook: "Your subconscious already knows. Just ask.",
    question: "Which color is in your mind right now?",
    options: [
      { emoji: "🟥", label: "RED" },
      { emoji: "🟦", label: "BLUE" },
      { emoji: "🟨", label: "YELLOW" },
    ],
    reveals: [
      {
        option: "🟥",
        type: "THE PULSE",
        sub: "Something in you wants out. A conversation, a truth, a boundary. Today is the day — say it.",
      },
      {
        option: "🟦",
        type: "THE DEPTH",
        sub: "You need clarity, not action. Walk for 20 minutes. No phone. The answer arrives.",
      },
      {
        option: "🟨",
        type: "THE LIGHT",
        sub: "Someone is thinking of you right now. Message the first person who pops into your head. No reason. Now.",
      },
    ],
  },
  {
    hook: "The simplest test you'll take this year. And the most accurate.",
    question: "Which shape feels right?",
    options: [
      { emoji: "🔺", label: "TRIANGLE" },
      { emoji: "⭕", label: "CIRCLE" },
      { emoji: "🟪", label: "SQUARE" },
    ],
    reveals: [
      {
        option: "🔺",
        type: "THE PEAK",
        sub: "You're climbing. Don't push harder. The summit arrives on its own schedule — trust the pace.",
      },
      {
        option: "⭕",
        type: "THE CYCLER",
        sub: "Something keeps repeating in your life. Today: break the pattern. New route, new person, new meal.",
      },
      {
        option: "🟪",
        type: "THE FOUNDATION",
        sub: "You're stable enough to risk now. The thing you've been avoiding — today is safe enough.",
      },
    ],
  },
];

function generateLuckTest(seed: number): TikTokScript {
  const rng = seededRandom(seed);
  const test = pick(LUCK_TESTS, rng);

  const slides: Slide[] = [
    {
      type: "hook",
      text: test.hook,
      voText: test.hook,
      mascotMood: "curious",
      durationFrames: 60,
    },
    {
      type: "question",
      text: test.question,
      subtext: "(fast — no second-guessing)",
      voText: `${test.question} Fast. No second-guessing.`,
      options: test.options,
      mascotMood: "curious",
      durationFrames: 90,
    },
    {
      type: "countdown",
      text: "3",
      voText: "Three...",
      mascotMood: "wise",
      durationFrames: 25,
    },
    {
      type: "countdown",
      text: "2",
      voText: "Two...",
      mascotMood: "wise",
      durationFrames: 25,
    },
    {
      type: "countdown",
      text: "1",
      voText: "One.",
      mascotMood: "flash",
      durationFrames: 25,
    },
    ...test.reveals.map((r) => ({
      type: "reveal" as const,
      text: r.type,
      subtext: r.sub,
      highlight: r.option,
      voText: `If you picked ${r.option} — you're ${r.type}. ${r.sub}`,
      mascotMood: "warm" as const,
      durationFrames: 110,
    })),
    {
      type: "cta",
      text: "Full 3-min reading →",
      subtext: CTA_URL,
      voText: `Want the full three-minute reading for your archetype? Go to ${CTA_URL}. Link in bio.`,
      mascotMood: "warm",
      durationFrames: 90,
    },
  ];

  const totalDurationFrames = slides.reduce((s, sl) => s + sl.durationFrames, 0);

  return {
    id: `luck-test-${seed}`,
    format: "luck-test",
    title: `Luck Test — ${test.hook.slice(0, 40)}`,
    hashtags: HASHTAGS_BY_FORMAT["luck-test"],
    caption: `${test.hook}\n\nWhich one did you pick? Comment below — I read every reply.\n\nFull 3-min reading for your archetype → ${CTA_URL}\n\n${HASHTAGS_BY_FORMAT["luck-test"].join(" ")}`,
    slides,
    totalDurationFrames,
  };
}

// ─── Format 2: Luck Type (birth month → archetype) ───────────

const MONTH_ARCHETYPES = [
  { month: "January",   name: "The Guardian",  trait: "Your luck is stoic. Water erodes rock — you win through constancy, not speed." },
  { month: "February",  name: "The Dreamer",   trait: "You receive luck through intuition. Your dreams are signals — write them down." },
  { month: "March",     name: "The Pioneer",   trait: "You're the first chapter. Your luck arrives when you jump before others." },
  { month: "April",     name: "The Builder",   trait: "Steady rain, fertile ground. Your luck grows through repetition, not breakthrough." },
  { month: "May",       name: "The Bloom",     trait: "You're magnetic. People come to you — and luck follows people, always." },
  { month: "June",      name: "The Mirror",    trait: "You reflect luck back. The more you give, the more returns — that's your law." },
  { month: "July",      name: "The Wave",      trait: "Your luck comes in waves. Ebb is preparation. Flood is harvest. Never swim against it." },
  { month: "August",    name: "The Flame",     trait: "Your luck runs hot and fast. Burns bright, leaves gold. Act in the fire — never after." },
  { month: "September", name: "The Harvest",   trait: "You reap what others sowed. Timing is your talent — wait for the ripe moment." },
  { month: "October",   name: "The Shadow",    trait: "You see what's hidden. Your luck lives in the gaps — where others see nothing." },
  { month: "November",  name: "The Phoenix",   trait: "Your luck comes through loss. Every ash is a new beginning — grieve quickly, rise quickly." },
  { month: "December",  name: "The Oracle",    trait: "You feel timing. Your luck is when, not where. Move when the moment calls — not before." },
];

function generateLuckType(seed: number): TikTokScript {
  const rng = seededRandom(seed);
  const startIdx = Math.floor(rng() * 12);
  const triad = [0, 1, 2].map((i) => MONTH_ARCHETYPES[(startIdx + i) % 12]);

  const slides: Slide[] = [
    {
      type: "hook",
      text: "Your birth month is your luck archetype.",
      subtext: "Save this before TikTok buries it.",
      voText: "Your birth month is your luck archetype. Save this before TikTok buries it.",
      mascotMood: "wise",
      durationFrames: 70,
    },
    {
      type: "pause",
      text: "Today: these three.",
      voText: "Today: these three months.",
      mascotMood: "wise",
      durationFrames: 40,
    },
    ...triad.map((a) => ({
      type: "reveal" as const,
      text: a.name.toUpperCase(),
      subtext: a.trait,
      highlight: a.month,
      voText: `${a.month}: ${a.name}. ${a.trait}`,
      mascotMood: "warm" as const,
      durationFrames: 110,
    })),
    {
      type: "cta",
      text: "Your full archetype reading →",
      subtext: CTA_URL,
      voText: `Get your full archetype reading at ${CTA_URL}. Three minutes, backed by twelve wisdom traditions. Link in bio.`,
      mascotMood: "warm",
      durationFrames: 90,
    },
  ];

  const totalDurationFrames = slides.reduce((s, sl) => s + sl.durationFrames, 0);

  return {
    id: `luck-type-${seed}`,
    format: "luck-type",
    title: `Luck Type — ${triad.map((t) => t.month).join(", ")}`,
    hashtags: HASHTAGS_BY_FORMAT["luck-type"],
    caption: `Your birth month is your luck archetype. ${triad.map((t) => `${t.month}: ${t.name}`).join(" · ")}. Full reading (3 min) → ${CTA_URL}\n\n${HASHTAGS_BY_FORMAT["luck-type"].join(" ")}`,
    slides,
    totalDurationFrames,
  };
}

// ─── Format 3: Contrarian Bomb (myth-buster + proof) ─────────

const BOMBS = [
  {
    bomb: "Manifesting makes you UNHAPPIER.",
    proof: "Oettingen, 2014 · NYU · 20 years of research",
    mechanism: "Positive visualization lowers your energy — your brain thinks you already have it.",
    whatWorks: [
      "Mental Contrasting — visualize + name the obstacle",
      "Implementation Intentions — 'if X, then Y'",
      "WOOP Method: Wish · Outcome · Obstacle · Plan",
    ],
  },
  {
    bomb: "Lucky people DON'T believe in luck.",
    proof: "Wiseman, 2003 · 400 subjects · 10-year study",
    mechanism: "They believe in attention. Luck is a side-effect of present-moment perception.",
    whatWorks: [
      "Take a different route home",
      "Do one thing differently from yesterday",
      "3-line mindfulness journal at night",
    ],
  },
  {
    bomb: "Positive affirmations make you POORER.",
    proof: "Wood et al., 2009 · University of Waterloo",
    mechanism: "Low self-worth + affirmations = bigger gap between 'is' and 'should'. You feel worse.",
    whatWorks: [
      "Questions beat statements: 'What could go well today?'",
      "3 small wins at night — written",
      "Let yourself think: 'Maybe it works.'",
    ],
  },
  {
    bomb: "Chasing happiness lowers it by 32%.",
    proof: "Mauss et al., 2011 · UC Berkeley",
    mechanism: "Chasing makes every moment you don't feel it — a failure. Pursuit creates scarcity.",
    whatWorks: [
      "Focus on meaning, not feeling",
      "Gratitude over optimization",
      "Let small joys stay small",
    ],
  },
  {
    bomb: "Goal-setting DESTROYS motivation.",
    proof: "Ordóñez et al., 2009 · Harvard Working Paper 09-083",
    mechanism: "Specific goals raise stress, tunnel vision, unethical shortcuts — and KILL intrinsic motivation.",
    whatWorks: [
      "Systems over goals (James Clear)",
      "Direction over destination",
      "Small wins over mega-goals",
    ],
  },
  {
    bomb: "Gratitude journals DON'T work (usually).",
    proof: "Davis et al., 2016 · Meta-analysis of 38 studies",
    mechanism: "Daily journaling shows no effect. Only weekly AND specific AND novel entries move the needle.",
    whatWorks: [
      "Once a week, not daily",
      "Specific details, not generic",
      "Never repeat the same thing twice",
    ],
  },
  {
    bomb: "Optimists die YOUNGER than realists.",
    proof: "Friedman, 1995 · Longevity Project · 1500 subjects · 80 years",
    mechanism: "Too much optimism → less caution → more accidents, worse decisions.",
    whatWorks: [
      "Realistic optimism (Seligman)",
      "Conscientiousness > cheerfulness",
      "Expect best. Plan worst.",
    ],
  },
  {
    bomb: "'Follow your passion' is the worst career advice.",
    proof: "Newport, 2012 · 'So Good They Can't Ignore You'",
    mechanism: "Passion follows competence, not the other way. Chasers switch endlessly and never get good.",
    whatWorks: [
      "Craftsman Mindset — get good at what you do",
      "Autonomy > passion as a filter",
      "Passion is a byproduct, not a prerequisite",
    ],
  },
  {
    bomb: "Brainstorming makes teams DUMBER.",
    proof: "Mullen et al., 1991 · Meta-analysis of 20 studies",
    mechanism: "Group thinking drops idea quality ~30% compared to working alone first.",
    whatWorks: [
      "Brainwriting — alone first, then share",
      "Nominal Group Technique",
      "Anonymous idea intake, then discuss",
    ],
  },
  {
    bomb: "Rewards KILL great work.",
    proof: "Deci, 1971 · University of Rochester",
    mechanism: "External rewards destroy intrinsic motivation — the 'overjustification effect'.",
    whatWorks: [
      "Autonomy · Mastery · Purpose (Pink, 2009)",
      "Reward effort, not outcome",
      "Never pay for something someone already loves",
    ],
  },
];

function generateContrarianBomb(seed: number): TikTokScript {
  const rng = seededRandom(seed);
  const b = pick(BOMBS, rng);

  const slides: Slide[] = [
    {
      type: "bomb",
      text: b.bomb,
      voText: b.bomb,
      mascotMood: "sharp",
      durationFrames: 75,
    },
    {
      type: "proof",
      text: b.proof,
      subtext: b.mechanism,
      voText: `${b.proof}. Here's why: ${b.mechanism}`,
      mascotMood: "wise",
      durationFrames: 120,
    },
    {
      type: "pause",
      text: "What ACTUALLY works:",
      voText: "What actually works:",
      mascotMood: "wise",
      durationFrames: 40,
    },
    ...b.whatWorks.map((w, i) => ({
      type: "whatworks" as const,
      text: w,
      highlight: `${i + 1}`,
      voText: `Number ${i + 1}. ${w}.`,
      mascotMood: "warm" as const,
      durationFrames: 75,
    })),
    {
      type: "cta",
      text: "Full protocol →",
      subtext: CTA_URL,
      voText: `Full research-backed protocol at ${CTA_URL}. Three minutes, no account, link in bio.`,
      mascotMood: "sharp",
      durationFrames: 75,
    },
  ];

  const totalDurationFrames = slides.reduce((s, sl) => s + sl.durationFrames, 0);

  return {
    id: `contrarian-bomb-${seed}`,
    format: "contrarian-bomb",
    title: `Bomb — ${b.bomb.slice(0, 40)}`,
    hashtags: HASHTAGS_BY_FORMAT["contrarian-bomb"],
    caption: `${b.bomb}\n\n${b.proof}\n\nWhat works:\n${b.whatWorks.map((w, i) => `${i + 1}. ${w}`).join("\n")}\n\nFull protocol → ${CTA_URL}\n\n${HASHTAGS_BY_FORMAT["contrarian-bomb"].join(" ")}`,
    slides,
    totalDurationFrames,
  };
}

// ─── Format 4: Day Streak (30-day ritual series) ─────────────

const DAILY_RITUALS = [
  { day: 1,  name: "The 4-7-8 Decision",    instruction: "Before your next important decision: inhale 4s, hold 7s, exhale 8s. Then decide.", why: "Lowers cortisol 18%, activates prefrontal cortex (Jerath, 2015)." },
  { day: 2,  name: "New Route",             instruction: "Take a path today you've never taken — even if it's 10 min longer.", why: "Lucky people break routines. New routes = new chance encounters (Wiseman, 2003)." },
  { day: 3,  name: "The Morning Question",  instruction: "Before touching your phone: ask 'What could surprise me today — for the better?'", why: "Open expectation beats goal-orientation for serendipity (Oettingen, 2014)." },
  { day: 4,  name: "3 Priorities",          instruction: "Tonight: write 3 things that matter tomorrow. Nothing more. Nothing less.", why: "Implementation intentions triple follow-through (Gollwitzer, 1999)." },
  { day: 5,  name: "Eat the Frog",          instruction: "The most uncomfortable task: first. Before email. Before anything else.", why: "Willpower peaks in the morning (Baumeister, 2007)." },
  { day: 6,  name: "Name-Drop",             instruction: "Ask a stranger their name today. Use it once back in conversation.", why: "Micro-connections measurably raise life satisfaction (Epley, 2014)." },
  { day: 7,  name: "Future-Self Note",      instruction: "Write 2 sentences to yourself, one week out. What do you want to remember now?", why: "Future-self continuity → better decisions (Hershfield, 2011)." },
  { day: 8,  name: "The 2-Minute Rule",     instruction: "If it takes under 2 minutes: do it now. No list. No deferral.", why: "Closes open loops, lowers cognitive load (Allen, 2001)." },
  { day: 9,  name: "Gratitude Micro",       instruction: "Tonight: one detail you've never been grateful for. Specific. Short.", why: "Novelty beats frequency in gratitude journaling (Davis meta-analysis, 2016)." },
  { day: 10, name: "The Unfinished Trick",  instruction: "Stop MID-task today. Interrupt before it's done.", why: "Zeigarnik effect — your brain keeps working. Tomorrow starts stronger." },
  { day: 11, name: "Cold Message",          instruction: "Message someone you haven't spoken to in 3+ months. No agenda.", why: "Weak ties generate 58% of all jobs and breakthroughs (Granovetter, 1973)." },
  { day: 12, name: "The 10-Second Pause",   instruction: "Before saying 'yes' today: pause 10 seconds. Then answer.", why: "Impulsive commitments correlate with burnout (Brown, 2018)." },
  { day: 13, name: "Not-To-Do",             instruction: "Write 3 things you're NOT doing today. This list matters more than your to-do.", why: "Focus through subtraction (McKeown, Essentialism)." },
  { day: 14, name: "The Stranger Room",     instruction: "20 min at a place you've never been. Alone. No phone.", why: "Novelty triggers hippocampal neurogenesis (Kempermann, 2002)." },
  { day: 15, name: "Meta Question",         instruction: "Ask once today: 'Am I working on the right problem?' Answer honestly.", why: "Problem framing determines 80% of solution quality (Basadur, 1994)." },
  { day: 16, name: "The Tiny Joy List",     instruction: "List 10 small joys possible today. Do one.", why: "Savoring outperforms major events (Bryant, 2007)." },
  { day: 17, name: "Feedback Request",      instruction: "Ask one person: 'What would you change about my work?' Then shut up. Listen.", why: "Lucky people seek feedback actively — unlucky avoid it (Wiseman, 2003)." },
  { day: 18, name: "Digital Fast",          instruction: "60 min offline. Anytime today. Not in the evening.", why: "Screen breaks raise creativity by 43% (Mark, 2014)." },
  { day: 19, name: "The Why-Chain",         instruction: "On the next decision: ask 'why?' 5 times. Note each answer.", why: "5-Whys — the strongest root-cause technique (Toyota, Toyoda)." },
  { day: 20, name: "Physical Reset",        instruction: "Stand up. Walk 5 min. 3 deep breaths. Sit back down.", why: "Embodiment affects cognition bidirectionally (Barsalou, 2008)." },
  { day: 21, name: "Letter to No One",      instruction: "Write a letter you'll never send — about something unsaid.", why: "Expressive writing lowers stress, raises clarity (Pennebaker, 1997)." },
  { day: 22, name: "The Money Trail",       instruction: "Track every euro you spend today. No judgment. Just tracking.", why: "Awareness beats intention for financial habits (Thaler, 2008)." },
  { day: 23, name: "Simplification",        instruction: "What are you doing today you could NOT do? Drop one thing.", why: "Subtraction is systematically underused (Adams, Nature, 2021)." },
  { day: 24, name: "Outside Perspective",   instruction: "Make one decision today as your hero or mentor would.", why: "Self-distancing improves decisions by 35% (Kross, 2014)." },
  { day: 25, name: "Boredom Minute",        instruction: "5 minutes doing nothing. No phone. Just wall. Let boredom hit.", why: "Boredom triggers creativity and goal review (Mann, 2014)." },
  { day: 26, name: "The 1-10 Scale",        instruction: "Rate today 1-10. Then ask: what would have made it a 10?", why: "Scaling from Solution-Focused Therapy (de Shazer, 1985)." },
  { day: 27, name: "Thank-You Message",     instruction: "Message one person: 'Thank you for [specific detail].' No reason. Today.", why: "Gratitude expression raises bond strength + receiver happiness (Algoe, 2013)." },
  { day: 28, name: "Future-Self Dialogue",  instruction: "Picture you, 10 years out. What would they tell you NOW?", why: "Future-self continuity correlates with self-control (Hershfield, 2011)." },
  { day: 29, name: "Observer Practice",     instruction: "10 min watching people in a public place. No judgment. Just see.", why: "Theory-of-mind training raises social intelligence (Kidd, 2013)." },
  { day: 30, name: "The Reset",             instruction: "Which 3 of the 29 rituals are you keeping? Write them. Drop the rest.", why: "Consolidation beats accumulation. Few deep > many shallow." },
];

function generateDayStreak(seed: number): TikTokScript {
  const dayIdx = seed % 30;
  return _buildDayStreakScript(DAILY_RITUALS[dayIdx], seed);
}

/** Generate DayStreak for an explicit day (1–30), independent of date seed.
 *  Used by the 30-day series render so every day exists as its own video. */
export function generateDayStreakForDay(day: number): TikTokScript {
  const clamped = Math.max(1, Math.min(30, day));
  const ritual = DAILY_RITUALS[clamped - 1];
  // Deterministic id suffix per-day so cached VO and renders don't collide.
  return _buildDayStreakScript(ritual, 200000 + clamped);
}

function _buildDayStreakScript(
  ritual: typeof DAILY_RITUALS[number],
  idSeed: number
): TikTokScript {

  const slides: Slide[] = [
    {
      type: "daycounter",
      text: `Day ${ritual.day}/30`,
      subtext: "Luck rituals science actually backs",
      voText: `Day ${ritual.day} of 30. Luck rituals science actually backs.`,
      mascotMood: "warm",
      durationFrames: 60,
    },
    {
      type: "ritual",
      text: ritual.name.toUpperCase(),
      voText: ritual.name,
      mascotMood: "wise",
      durationFrames: 60,
    },
    {
      type: "ritual",
      text: ritual.instruction,
      voText: ritual.instruction,
      mascotMood: "warm",
      durationFrames: 150,
    },
    {
      type: "why",
      text: "Why it works:",
      subtext: ritual.why,
      voText: `Why it works: ${ritual.why}`,
      mascotMood: "wise",
      durationFrames: 120,
    },
    {
      type: "cta",
      text: "Full 30-day protocol →",
      subtext: CTA_URL,
      voText: `Full thirty-day protocol and your personal reading at ${CTA_URL}. Link in bio.`,
      mascotMood: "warm",
      durationFrames: 90,
    },
  ];

  const totalDurationFrames = slides.reduce((s, sl) => s + sl.durationFrames, 0);

  return {
    id: `day-streak-${idSeed}`,
    format: "day-streak",
    title: `Day ${ritual.day}/30 — ${ritual.name}`,
    hashtags: HASHTAGS_BY_FORMAT["day-streak"],
    caption: `Day ${ritual.day}/30 — ${ritual.name}\n\n${ritual.instruction}\n\nWhy: ${ritual.why}\n\nFull 30-day protocol + your personal reading → ${CTA_URL}\n\n${HASHTAGS_BY_FORMAT["day-streak"].join(" ")}`,
    slides,
    totalDurationFrames,
  };
}

/** All 30 DayStreak variants, in chronological order (Day 1 → Day 30). */
export function generateAllDayStreakVariants(): TikTokScript[] {
  return Array.from({ length: 30 }, (_, i) => generateDayStreakForDay(i + 1));
}

// ─── Public API ──────────────────────────────────────────────

export function generate(format: TikTokFormat, seed: number): TikTokScript {
  switch (format) {
    case "luck-test":
      return generateLuckTest(seed);
    case "luck-type":
      return generateLuckType(seed);
    case "contrarian-bomb":
      return generateContrarianBomb(seed);
    case "day-streak":
      return generateDayStreak(seed);
  }
}

/**
 * Day-of-week rotation — tuned for a paying, psychology-curious audience:
 *   Sun → luck-type       (identity, save-bait, weekend reflection)
 *   Mon → luck-test       (engagement kickoff)
 *   Tue → contrarian-bomb (skeptic-bait, shareable)
 *   Wed → luck-type       (second type of the week)
 *   Thu → day-streak      (retention, habit crowd)
 *   Fri → contrarian-bomb (scroll-stopping weekend prep)
 *   Sat → luck-test       (weekend entertainment)
 */
const DAY_ROTATION: TikTokFormat[] = [
  "luck-type",       // Sun (0)
  "luck-test",       // Mon (1)
  "contrarian-bomb", // Tue (2)
  "luck-type",       // Wed (3)
  "day-streak",      // Thu (4)
  "contrarian-bomb", // Fri (5)
  "luck-test",       // Sat (6)
];

export function generateForDate(date: Date): TikTokScript {
  const format = DAY_ROTATION[date.getDay()];
  return generate(format, seedFromDate(date));
}

export function generateAllFormatsForDate(date: Date): TikTokScript[] {
  const seed = seedFromDate(date);
  return (["luck-test", "luck-type", "contrarian-bomb", "day-streak"] as TikTokFormat[]).map((f) =>
    generate(f, seed)
  );
}

export function generateWeek(startDate: Date): TikTokScript[] {
  const out: TikTokScript[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    out.push(generateForDate(d));
  }
  return out;
}
