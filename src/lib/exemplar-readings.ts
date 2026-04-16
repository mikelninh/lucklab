/**
 * Exemplar Readings — hand-written 12/10 quality.
 *
 * These are embedded in the prompt as few-shot examples. The model matches
 * quality it can SEE. One exemplar per archetype, trimmed to ~400 words
 * (opening + one architecture paragraph + one practice + closing).
 *
 * The FULL Yielder exemplar (1,900 words) lives at:
 *   /content/exemplar-yielder-full.md
 * for reference and future few-shot use when we have longer function timeouts.
 */

export const EXEMPLAR_YIELDER = `
EXEMPLAR — match this quality exactly:

OPENING: "Collin, you know something most people spend decades unlearning: that gripping constricts. You chose 'I want to let go but find myself gripping anyway.' That sentence is the entire Reading in miniature. You already know the answer. You do not yet trust it with your full weight. That distrust is not weakness — it is the last contraction before release."

ARCHITECTURE (showing how to handle one lever): "Surrender: 44. You said 'I had just stopped trying to control the outcome' when asked what preceded luck. Yet you chose 'I want to let go but find myself gripping anyway' about uncertainty. That is not a contradiction. It is a portrait. You have tasted release but cannot hold it as a default. The practice is not more surrender. It is noticing you are already surrendering, three times a day, without giving yourself credit."

ARCHITECTURE (showing how to find a contradiction): "Here is the contradiction that defines your pattern: your surrender is your highest lever, but your openness is zero. You can let go of outcomes but not routines. That is like being able to swim but refusing to enter the water."

PRACTICE (showing physical specificity): "Tomorrow morning, before your phone, sit at the edge of your bed for four minutes. Ask only: 'If I trusted what I already know, what would I do today?' Do not answer. Let the question sit. Seven mornings. On the eighth, the answer will have arrived — not because you found it, but because you stopped obstructing it."

WARNINGS (showing honest specificity): "The Yielder's trap is passive yielding — releasing the grip then sitting still, calling it surrender. Surrender without movement is not wu wei. It is avoidance wearing a philosophical costume. Your openness of zero is the evidence. The corrective: one genuinely unfamiliar action per week. The Yielder who does not move discovers the river has become a pond."

CLOSING: "Collin, you asked how to read this moment. You have been reading it longer than you think. The grip is loosening. Let it."
`;

export const EXEMPLAR_SEER = `
EXEMPLAR — match this quality exactly:

OPENING: "Kai, you see what others walk past. Your question — why you notice signs but never act — is not about perception. It is about the gap between seeing and moving. In the Gita it is Arjuna frozen on the battlefield, seeing everything, doing nothing. You are Arjuna before the chariot moves."

ARCHITECTURE (one lever): "Action: 22. You chose 'Sometimes — when the stakes are low' about intuition. When stakes are low, you act on what you see. When they rise, you retreat to analysis. Wiseman's lucky subjects did the opposite. The cost: a library of synchronicities you noticed and filed away, each one a door you saw clearly and chose not to open."

PRACTICE: "The next time you notice a sign — a coincidence, a pull, a name that appears twice — act within ninety seconds. Before the analysis starts. Ninety seconds is the window between intuition and overthinking. Use it."

CLOSING: "Kai, you asked why you notice signs but never act. The signs were never the problem. The pause was. Move."
`;

export const EXEMPLAR_WANDERER = `
EXEMPLAR — match this quality exactly:

OPENING: "You do not stay where you are told to stay. That is your engine. Zhuangzi called it 'the wandering that has no destination.' Wiseman measured it as 'maximising chance opportunities through varied routine.' You call it Tuesday. The question is not whether you will encounter luck — you will, more often than most — but whether you will recognise it when it arrives wearing a face you did not expect."

ARCHITECTURE (one lever): "Connection: 67. You chose 'ask questions until I find something unexpected.' That is not socialising. That is mining. You treat every new person as a potential vein of information, and you are almost always right. Granovetter proved in 1973 that weak ties carry the opportunities strong ties cannot. You are wired for weak ties. The danger is that you collect them without deepening any."

CLOSING: "You asked what to do next. You already know: go somewhere you have not been. But this time, stay long enough for the place to change you back."
`;

export const EXEMPLAR_STEERER = `
EXEMPLAR — match this quality exactly:

OPENING: "You act. Where others deliberate, you have already moved. The Greeks sculpted Kairos with a forelock and a bald back: you could seize him approaching but not after he passed. You seize him. You always have. What you may not yet see is the cost: the moments you seized that were not yet ripe, the doors you forced that would have opened on their own."

ARCHITECTURE (one lever): "Surrender: 11. You chose 'push harder against it' when facing setbacks. Read that beside your action score of 82. You are a person who moves — but you cannot stop moving. Stillness feels like failure to you. It is not. It is the pause between the inhale and the exhale, and without it, the breathing becomes gasping."

CLOSING: "You asked when to act. Tyche's answer: you already know when. The question you have not asked is when to stop."
`;

export const EXEMPLAR_WEAVER = `
EXEMPLAR — match this quality exactly:

OPENING: "Your luck lives in other people. Not in charm — in the density and quality of your relational web. Granovetter proved what the Yorùbá tradition always knew: the connections that change your life are not your close friends but your acquaintances, the conversation you almost did not have."

ARCHITECTURE (one lever): "Attention: 31. You chose 'wide — I naturally notice things at the edges.' For most archetypes that score means perception. For you it means something different: you notice people. The shift in someone's expression. The name mentioned twice. The friend-of-a-friend. Your attention is social sonar, and it is always on."

CLOSING: "You asked who to trust. The answer is not a name. It is a frequency: trust the connection that makes you slightly nervous. That is the one carrying the signal."
`;

export const EXEMPLAR_READER = `
EXEMPLAR — match this quality exactly:

OPENING: "You make meaning where others see noise. A setback is not a wall for you — it is information. A coincidence is not a coincidence — it is a sentence in a language you are still learning to read. Jung called this synchronicity. Wiseman called it 'turning bad luck into good.' You do it so fluently that the danger is no longer missing meaning. It is manufacturing it."

ARCHITECTURE (one lever): "Meaning-making: 91. You chose 'I revisit entries to trace patterns.' That is not journaling. That is decryption. You treat your life as a text and yourself as the reader. The risk: when everything is a sign, nothing is a signal. The practice is not more meaning. It is learning which meanings to release."

CLOSING: "You asked what this all means. Tyche's answer is the one you will like least: not everything does. The skill is knowing which things do. You are closer to that skill than you think."
`;

/**
 * Returns the exemplar for the given archetype ID.
 */
export function getExemplar(archetypeId: string): string | null {
  const map: Record<string, string> = {
    yielder: EXEMPLAR_YIELDER,
    seer: EXEMPLAR_SEER,
    wanderer: EXEMPLAR_WANDERER,
    steerer: EXEMPLAR_STEERER,
    weaver: EXEMPLAR_WEAVER,
    reader: EXEMPLAR_READER,
  };
  return map[archetypeId] || map["yielder"];
}
