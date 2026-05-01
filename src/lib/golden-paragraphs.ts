/**
 * Golden paragraphs — hand-crafted opening passages, one per archetype.
 * These are NOT AI-generated. They are written by a human to be beautiful,
 * specific, and to set the voice for the entire Reading.
 *
 * The editor prompt (pass 2) weaves these into the opening letter,
 * adapting them to the reader's name and question.
 */

export const GOLDEN_OPENINGS: Record<string, string> = {
  seer: `You see what others walk past. That is not a metaphor — it is the measurable core of your kairotic architecture. In Wiseman's newspaper experiment, the lucky subjects noticed the hidden message because they were not counting. You would have noticed it. You have always noticed it. The question that has brought you here is not whether you perceive enough — it is whether you are perceiving the right things, at the right depth, at the cost of what you are not seeing at the edges.`,

  wanderer: `You do not stay where you are told to stay. That is your engine. Every tradition Luck Lab has studied names a version of the same thing: fortune moves toward the one who moves. The Taoist sage Zhuangzi called it "the wandering that has no destination." Wiseman measured it as "maximising chance opportunities through varied routine." You call it Tuesday. The question is not whether you will encounter luck — you will, more often than most — but whether you will recognise it when it arrives wearing a face you did not expect.`,

  steerer: `You act. Where others deliberate, you have already moved. One old sculpture captured the opportune moment with a long forelock and a bald back of the head: you could seize it as it approached, but once it passed, there was nothing to grip. You seize it. You always have. What you may not yet see is the cost: the moments you seized that were not yet ripe, the doors you forced that would have opened on their own, the difference between acting at the right time and acting because stillness frightens you.`,

  yielder: `You know something most people spend decades unlearning: that gripping constricts. Every contemplative tradition that Luck Lab has cross-referenced — Taoism, Sufism, Stoicism, Buddhism — names a version of the same paradox: the hand that opens receives more than the fist that closes. You chose "I want to let go but find myself gripping anyway." That sentence is the entire Reading in miniature. You already know the answer. You do not yet trust it with your full weight. That is what this Reading is for.`,

  weaver: `Your luck lives in other people. Not in charm — in the density and quality of your relational web. Sociologist Mark Granovetter proved in 1973 what the Yorùbá tradition had always known: the connections that change your life are not your close friends but your acquaintances, your weak ties, the conversation you almost did not have. You are wired for this. Your answers show a pattern of social attentiveness that most people cannot train. What you may be missing is that the web works in both directions — and the thread you have not yet pulled is the one that would pull you somewhere you have not imagined.`,

  reader: `You make meaning where others see noise. A setback is not a wall for you — it is information. A coincidence is not a coincidence — it is a sentence in a language you are still learning to read. Carl Jung called this capacity synchronicity: the ability to perceive acausal connections between inner states and outer events. Wiseman called it "turning bad luck into good" — his fourth and most powerful luck behaviour. You already do this. The danger is that you do it so fluently that you stop questioning whether the meaning you are making is the meaning that is actually there.`,
};

/**
 * Section transitions — hand-crafted connective tissue between Reading sections.
 * These replace the mechanical "Section 1 / Section 2" feel with prose rhythm.
 */
export const TRANSITIONS = {
  afterOpening: "What follows is not advice. It is a map of the terrain you are already standing on.",
  beforeTraditions: "Three traditions have walked this ground before you. Each left a trail marker.",
  beforeProtocol: "Theory without practice is tourism. Here is the itinerary.",
  beforeRitual: "Everything above collapses into one daily act.",
  beforeWarnings: "Every archetype has a shadow. Yours is specific.",
  beforeClosing: "One last thing, and then this Reading is yours.",
};
