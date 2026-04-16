/**
 * Exemplar Reading excerpts — hand-written 12/10 quality.
 * Fed into the prompt as few-shot examples so the model matches this register.
 *
 * Each exemplar is ~600 words: the opening letter + one architecture paragraph
 * + one tradition section + the closing. Enough to calibrate voice without
 * bloating the prompt.
 */

export const EXEMPLAR_YIELDER = `
EXAMPLE OF A 12/10 READING (for a Yielder named "Lena" who asked "Should I stay or should I leave?"):

OPENING LETTER:
"Lena, you know something most people spend decades unlearning: that gripping constricts. Every contemplative tradition Kairos Lab has cross-referenced — Taoism, Sufism, Stoicism, Buddhism — names a version of the same paradox: the hand that opens receives more than the fist that closes.

You chose 'I want to let go but find myself gripping anyway.' That sentence is the entire Reading in miniature. You already know the answer to whether you should stay or leave. You do not yet trust it with your full weight. That distrust is not weakness — it is the last contraction before release, and every tradition I will cite below has a name for it.

Richard Wiseman's decade-long study at the University of Hertfordshire found that the subjects who scored highest on 'turning bad luck into good' shared one measurable trait: they did not resist what happened to them. They metabolised it. You metabolise well — your surrender score is your highest lever. But metabolising is not the same as moving. What follows is not advice. It is a map of the terrain you are already standing on."

ONE ARCHITECTURE PARAGRAPH (for the "surrender" lever):
"Surrender: 44. You said, 'I had just stopped trying to control the outcome' when asked what preceded your last lucky moment. And yet when uncertainty arrived, you chose 'I want to let go but find myself gripping anyway.' That is not a contradiction. It is a portrait. You know what release feels like — you have tasted it — but you cannot hold it as a default state. The Taoists would say you have glimpsed wu wei but have not yet moved in. Wiseman would say you are in the transition zone: your behaviour is changing faster than your belief about your behaviour. The practice is not more surrender. It is noticing that you are already surrendering, three or four times a day, without giving yourself credit."

ONE TRADITION SECTION:
"Taoism — wu wei. Your question is about staying or leaving. The Tao Te Ching chapter 48 answers it sideways: 'In the pursuit of learning, every day something is acquired. In the pursuit of Tao, every day something is dropped.' You have been acquiring reasons to stay and reasons to leave. You have not yet dropped the need to be certain before you move. Wu wei does not mean inaction. It means acting without the weight of forcing. The decision you are circling will not arrive through more analysis. It will arrive the way your last lucky moment did: when you stop trying to control the outcome.

PRACTICE: Tomorrow morning, before you check your phone, sit at the edge of your bed for four minutes. Set a timer. Ask yourself only this: 'If I trusted what I already know, what would I do today?' Do not answer. Let the question sit. Repeat for seven mornings. On the eighth morning, the answer will have arrived — not because you found it, but because you stopped obstructing it."

CLOSING:
"Lena, you asked whether you should stay or leave. Tyche does not answer that question. She observes that you already know, and that knowing has been waiting for you to stop gripping long enough to hear it. Walk."
`;

export const EXEMPLAR_SEER = `
EXAMPLE OF A 12/10 READING (for a Seer named "Kai" who asked "Why do I keep noticing signs but never acting on them?"):

OPENING LETTER:
"Kai, you see what others walk past. That is not a metaphor — it is the measurable core of your kairotic architecture. In Wiseman's newspaper experiment, the lucky subjects noticed the hidden message because they were not counting. You would have noticed it. You have always noticed it.

Your question — why you notice signs but never act — is not a question about perception. It is a question about the gap between seeing and moving. You are fluent in the first lever of luck and nearly silent in the third. That gap has a name in every tradition: in Taoism it is the difference between knowing the Tao and walking it. In the Bhagavad Gita it is Arjuna frozen on the battlefield, seeing everything, doing nothing. You are Arjuna before the chariot moves.

What follows will not fix your perception — it does not need fixing. It will address the three-second pause between the moment you see and the moment you decide it does not count."

ONE ARCHITECTURE PARAGRAPH (for the "action" lever):
"Aligned action: 22. When asked about intuition, you chose 'Sometimes — when the stakes are low.' Read that again. When the stakes are low, you act on what you see. When the stakes rise, you retreat to analysis. Wiseman's lucky subjects did the opposite: they trusted intuition MORE when it mattered, not less. The cost of your pattern is specific: you have a library of synchronicities you noticed and filed away, each one a door you saw clearly and chose not to open. The practice is not 'trust your gut more.' It is smaller than that. It is: the next time you notice a sign, act within ninety seconds. Before the analysis starts. Ninety seconds."

CLOSING:
"Kai, you asked why you keep noticing signs but never acting on them. You already know. The signs were never the problem. The pause was. Move."
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
