/**
 * Exemplar Reading excerpts — hand-written 12/10 quality.
 * Fed into the prompt as few-shot examples so the model matches this register.
 *
 * Each exemplar is ~600 words: the opening letter + one architecture paragraph
 * + one tradition section + the closing. Enough to calibrate voice without
 * bloating the prompt.
 */

export const EXEMPLAR_YIELDER = `
EXEMPLAR (match this quality):

OPENING: "Lena, you know something most people spend decades unlearning: that gripping constricts. You chose 'I want to let go but find myself gripping anyway.' That sentence is the entire Reading in miniature. You already know the answer. You do not yet trust it with your full weight."

ARCHITECTURE (one lever): "Surrender: 44. You said 'I had just stopped trying to control the outcome' when asked what preceded luck. Yet you chose 'I want to let go but find myself gripping anyway' about uncertainty. That is not a contradiction. It is a portrait. You have tasted release but cannot hold it as a default. The practice is not more surrender. It is noticing you are already surrendering, three times a day, without giving yourself credit."

PRACTICE: "Tomorrow morning, before your phone, sit at the edge of your bed for four minutes. Ask only: 'If I trusted what I already know, what would I do today?' Do not answer. Let the question sit. Seven mornings. On the eighth, the answer will have arrived — not because you found it, but because you stopped obstructing it."

CLOSING: "Lena, you asked whether to stay or leave. Tyche does not answer that. She observes you already know, and the knowing has been waiting for you to stop gripping long enough to hear it. Walk."
`;

export const EXEMPLAR_SEER = `
EXEMPLAR (match this quality):

OPENING: "Kai, you see what others walk past. Your question — why you notice signs but never act — is not about perception. It is about the gap between seeing and moving. In the Gita it is Arjuna frozen on the battlefield, seeing everything, doing nothing. You are Arjuna before the chariot moves."

ARCHITECTURE (one lever): "Action: 22. You chose 'Sometimes — when the stakes are low' about intuition. When stakes are low, you act on what you see. When they rise, you retreat to analysis. Wiseman's lucky subjects did the opposite. The cost: a library of synchronicities you noticed and filed away, each one a door you saw clearly and chose not to open. The practice: next time you notice a sign, act within ninety seconds. Before the analysis starts."

CLOSING: "Kai, you asked why you notice signs but never act. The signs were never the problem. The pause was. Move."
`;

/**
 * Returns the trimmed exemplar for the given archetype, or null if none exists.
 * We include at most ONE exemplar in the prompt to stay within token budget.
 */
export function getExemplar(archetypeId: string): string | null {
  const map: Record<string, string> = {
    yielder: EXEMPLAR_YIELDER,
    seer: EXEMPLAR_SEER,
  };
  // For archetypes without a dedicated exemplar, use the yielder (most universal)
  return map[archetypeId] || map["yielder"];
}
