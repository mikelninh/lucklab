"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TycheSigil } from "@/components/TycheSigil";
import {
  QUESTIONS,
  validatePersonalContext,
  type Answer,
  type PersonalContext,
} from "@/lib/diagnostic";

// Step machine:
//  0 = intro
//  1 = name
//  2 = birthdate
//  3 = current question
//  4..13 = the 10 Reading inputs (QUESTIONS[0..9])
//  14 = consult (submission)
const TOTAL_Q = QUESTIONS.length;
const LAST_Q_STEP = 3 + TOTAL_Q; // 13
const SUBMIT_STEP = LAST_Q_STEP + 1; // 14

export default function ReadingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [personal, setPersonal] = useState<Partial<PersonalContext>>({
    name: "",
    birthdate: "",
    currentQuestion: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const progressDenominator = 3 + TOTAL_Q; // 13 meaningful inputs total
  const progress =
    step === 0 ? 0 : Math.min(100, (Math.min(step, LAST_Q_STEP) / progressDenominator) * 100);

  function next() { setStep((s) => Math.min(s + 1, SUBMIT_STEP)); }
  function back() { setStep((s) => Math.max(0, s - 1)); }

  function selectOption(qid: number, oid: string) {
    setAnswers((prev) => {
      const clean = prev.filter((a) => a.questionId !== qid);
      clean.push({ questionId: qid, optionId: oid });
      return clean;
    });
    setTimeout(() => setStep((s) => Math.min(s + 1, SUBMIT_STEP)), 260);
  }

  async function consult() {
    if (!validatePersonalContext(personal)) {
      alert("Please fill in all three personal inputs before consulting Tyche.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/tyche/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, personal, tier: "free" }),
      });
      if (!res.ok) throw new Error("Tyche is resting");
      const data = await res.json();
      sessionStorage.setItem(
        "kairos:reading",
        JSON.stringify({ answers, personal, ...data }),
      );
      router.push("/reading/preview");
    } catch {
      setSubmitting(false);
      alert("Tyche is resting. Try again in a moment.");
    }
  }

  // Which question (if any) is on screen right now?
  const questionIdx = step >= 4 && step <= LAST_Q_STEP ? step - 4 : -1;
  const currentQ = questionIdx >= 0 ? QUESTIONS[questionIdx] : null;
  const currentAnswer = currentQ
    ? answers.find((a) => a.questionId === currentQ.id)?.optionId
    : null;

  return (
    <>
      <Nav />

      <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
        {/* progress */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-3">
            <div className="eyebrow">the kairos reading</div>
            <div className="font-mono text-[11px] text-[var(--text-subtle)] tracking-wider">
              {step === 0 ? "ready" : `${Math.min(step, LAST_Q_STEP)} / ${progressDenominator}`}
            </div>
          </div>
          <div className="h-[2px] bg-[var(--border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--gold-dim)] via-[var(--gold)] to-[var(--gold-bright)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* ===== STEP 0 — INTRO ===== */}
        {step === 0 && (
          <div>
            <TycheSigil size={72} className="mb-8" />
            <h1 className="font-display text-[42px] md:text-[58px] leading-[1.05] tracking-[-0.015em] font-light text-balance">
              Tyche is <em className="not-italic text-[var(--gold)]">ready</em> to read for you.
            </h1>
            <p className="text-[16px] text-[var(--text-muted)] mt-6 leading-relaxed max-w-lg">
              Three short answers about you. Ten calibrated inputs on how you meet
              the world. Tyche will map your kairotic profile across six trainable
              mechanisms and return your archetype, tradition match, and the doorway
              into your Reading.
            </p>
            <p className="text-[14px] text-[var(--text-subtle)] mt-4 leading-relaxed max-w-lg">
              Three minutes. No account. No right answers &mdash; answer from what is,
              not from what you wish.
            </p>
            <div className="mt-10">
              <button onClick={next} className="btn btn-primary">
                Begin Your Reading
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M3 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 1 — NAME ===== */}
        {step === 1 && (
          <div>
            <div className="eyebrow eyebrow-muted mb-3 text-[10px]">
              first &middot; of three
            </div>
            <h2 className="font-display text-[30px] md:text-[40px] leading-[1.1] font-normal mb-3 text-balance">
              What shall Tyche call you?
            </h2>
            <p className="text-[13px] text-[var(--text-subtle)] italic mb-8">
              Your first name is enough. She will use it throughout your Reading.
            </p>
            <input
              type="text"
              autoFocus
              value={personal.name ?? ""}
              onChange={(e) => setPersonal((p) => ({ ...p, name: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && personal.name && personal.name.trim().length >= 1 && next()}
              placeholder="e.g. Mikel"
              className="w-full max-w-md px-4 py-3 bg-[var(--surface)] border border-[var(--border-bright)] rounded focus:border-[var(--gold)] outline-none text-[17px] font-display"
              maxLength={60}
            />
            <StepNav
              back={back}
              nextDisabled={!personal.name || personal.name.trim().length < 1}
              onNext={next}
            />
          </div>
        )}

        {/* ===== STEP 2 — BIRTHDATE ===== */}
        {step === 2 && (
          <div>
            <div className="eyebrow eyebrow-muted mb-3 text-[10px]">
              second &middot; of three
            </div>
            <h2 className="font-display text-[30px] md:text-[40px] leading-[1.1] font-normal mb-3 text-balance">
              When were you born, {personal.name || "friend"}?
            </h2>
            <p className="text-[13px] text-[var(--text-subtle)] italic mb-8 max-w-md">
              Not for horoscope &mdash; for context. Tyche references the season of
              your birth as metaphor when it earns its place. Your data stays yours.
            </p>
            <input
              type="date"
              autoFocus
              value={personal.birthdate ?? ""}
              onChange={(e) => setPersonal((p) => ({ ...p, birthdate: e.target.value }))}
              min="1900-01-01"
              max={new Date().toISOString().slice(0, 10)}
              className="px-4 py-3 bg-[var(--surface)] border border-[var(--border-bright)] rounded focus:border-[var(--gold)] outline-none text-[17px] font-display"
            />
            <StepNav
              back={back}
              nextDisabled={!personal.birthdate || !/^\d{4}-\d{2}-\d{2}$/.test(personal.birthdate)}
              onNext={next}
            />
          </div>
        )}

        {/* ===== STEP 3 — CURRENT QUESTION ===== */}
        {step === 3 && (
          <div>
            <div className="eyebrow eyebrow-muted mb-3 text-[10px]">
              third &middot; of three
            </div>
            <h2 className="font-display text-[30px] md:text-[40px] leading-[1.1] font-normal mb-3 text-balance">
              What are you asking of Tyche, {personal.name || "friend"}?
            </h2>
            <p className="text-[13px] text-[var(--text-subtle)] italic mb-8 max-w-lg leading-relaxed">
              A phase you are in. A choice in front of you. A longing. A
              stuck-place. One or two sentences. This becomes the living thread of
              your Reading.
            </p>
            <textarea
              autoFocus
              value={personal.currentQuestion ?? ""}
              onChange={(e) =>
                setPersonal((p) => ({ ...p, currentQuestion: e.target.value }))
              }
              placeholder="e.g. I am standing at a threshold and cannot tell whether to commit or keep searching."
              rows={4}
              maxLength={280}
              className="w-full max-w-xl px-4 py-3 bg-[var(--surface)] border border-[var(--border-bright)] rounded focus:border-[var(--gold)] outline-none text-[15px] leading-relaxed resize-none"
            />
            <div className="font-mono text-[10px] text-[var(--text-subtle)] mt-2 tracking-wider">
              {(personal.currentQuestion ?? "").length} / 280
            </div>
            <StepNav
              back={back}
              nextDisabled={
                !personal.currentQuestion || personal.currentQuestion.trim().length < 3
              }
              onNext={next}
              nextLabel="Enter the Reading →"
            />
          </div>
        )}

        {/* ===== STEPS 4..13 — THE 10 INPUTS ===== */}
        {currentQ && (
          <div>
            <div className="eyebrow eyebrow-muted mb-3 text-[10px]">
              input {questionIdx + 1} &middot; {currentQ.axis}
            </div>
            <h2 className="font-display text-[26px] md:text-[32px] leading-[1.2] font-normal text-balance mb-3">
              {currentQ.prompt}
            </h2>
            {currentQ.helper && (
              <p className="text-[13px] text-[var(--text-subtle)] italic mb-8 leading-relaxed">
                {currentQ.helper}
              </p>
            )}
            <div className="space-y-2.5">
              {currentQ.options.map((o) => {
                const selected = currentAnswer === o.id;
                return (
                  <button
                    key={o.id}
                    onClick={() => selectOption(currentQ.id, o.id)}
                    className={`w-full text-left p-4 md:p-5 border rounded flex items-start gap-4 transition-all ${
                      selected
                        ? "border-[var(--gold)] bg-[rgba(201,169,97,0.06)]"
                        : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--gold-dim)] hover:bg-[var(--surface-2)]"
                    }`}
                  >
                    <span
                      className={`kbd flex-shrink-0 mt-0.5 ${
                        selected
                          ? "!bg-[rgba(201,169,97,0.2)] !text-[var(--gold-bright)] !border-[var(--gold)]"
                          : ""
                      }`}
                    >
                      {o.kbd}
                    </span>
                    <span className="text-[14px] md:text-[15px] text-[var(--text)] leading-relaxed">
                      {o.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <StepNav
              back={back}
              onNext={() => setStep((s) => Math.min(s + 1, SUBMIT_STEP))}
              nextDisabled={!currentAnswer}
              nextLabel="next →"
              compact
            />
          </div>
        )}

        {/* ===== STEP 14 — CONSULT TYCHE ===== */}
        {step === SUBMIT_STEP && (
          <div className="text-center py-6">
            {!submitting ? (
              <div>
                <TycheSigil size={96} className="mx-auto mb-8" />
                <div className="eyebrow eyebrow-tyche mb-4">all inputs received</div>
                <h2 className="font-display text-[36px] md:text-[48px] leading-[1.1] font-light text-balance mb-4">
                  Tyche is <em className="not-italic text-[var(--tyche)]">ready</em>, {personal.name || "friend"}.
                </h2>
                <p className="text-[15px] text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed mb-8">
                  She will read your pattern, match the traditions, and return your
                  archetype &mdash; the first taste of your Reading.
                </p>
                <button onClick={consult} className="btn btn-primary">
                  Consult Tyche Now
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M3 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <p className="font-mono text-[11px] text-[var(--text-subtle)] mt-4 tracking-wider">
                  FREE · ~10 SECONDS
                </p>
              </div>
            ) : (
              <div className="py-20">
                <div className="eyebrow eyebrow-tyche mb-6 pulse-slow">tyche is reading</div>
                <div className="flex justify-center gap-2 my-8">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-[var(--tyche)] pulse-slow"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
                <p className="text-[13px] text-[var(--text-subtle)] font-mono tracking-wider">
                  weaving your pattern through twelve traditions…
                </p>
              </div>
            )}
          </div>
        )}

        {step === 0 && (
          <div className="mt-16 pt-8 border-t border-[var(--border)]">
            <p className="text-[12px] text-[var(--text-subtle)] font-mono tracking-wider">
              ← <Link href="/" className="hover:text-[var(--gold)]">back to kairos lab</Link>
            </p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

function StepNav({
  back,
  onNext,
  nextDisabled,
  nextLabel = "next →",
  compact = false,
}: {
  back: () => void;
  onNext: () => void;
  nextDisabled: boolean;
  nextLabel?: string;
  compact?: boolean;
}) {
  return (
    <div className={`flex justify-between items-center ${compact ? "mt-10" : "mt-12"}`}>
      <button
        onClick={back}
        className="text-[13px] text-[var(--text-muted)] hover:text-[var(--text)] font-mono tracking-wider"
      >
        ← back
      </button>
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {nextLabel}
      </button>
    </div>
  );
}
