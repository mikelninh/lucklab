import type { Answer } from "./diagnostic";

export function encodeAnswers(answers: Answer[]): string {
  return answers.map((a) => `${a.questionId}:${a.optionId}`).join(",");
}

export function decodeAnswers(s: string): Answer[] {
  if (!s) return [];
  return s
    .split(",")
    .map((chunk) => {
      const [qid, oid] = chunk.split(":");
      return { questionId: Number(qid), optionId: oid };
    })
    .filter((a) => Number.isFinite(a.questionId) && !!a.optionId);
}
