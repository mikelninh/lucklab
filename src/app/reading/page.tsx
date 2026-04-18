"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TycheSigil } from "@/components/TycheSigil";
import {
  QUESTIONS,
  PRESET_QUESTIONS,
  validatePersonalContext,
  type Answer,
  type PersonalContext,
} from "@/lib/diagnostic";

/**
 * Flow (redesigned — low-friction):
 *   0  = intro
 *   1..10 = the 10 Reading inputs
 *   11 = name (required — Tyche needs to address you)
 *   12 = OPTIONAL personal context (birthdate + question) — can skip
 *   13 = consult (submission)
 */
const TOTAL_Q = QUESTIONS.length;
const NAME_STEP = TOTAL_Q + 1; // 11
const CONTEXT_STEP = TOTAL_Q + 2; // 12
const SUBMIT_STEP = TOTAL_Q + 3; // 13

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

  // progress bar: 10 inputs + name = 11 meaningful steps (context is optional, doesn't count)
  const progressDenominator = TOTAL_Q + 1;
  const progressCounter = step === 0 ? 0 : Math.min(step, NAME_STEP);
  const progress = (progressCounter / progressDenominator) * 100;

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
      alert("Tyche needs at least your name before she can read.");
      return;
    }
    if (answers.length < 8) {
      alert(`Only ${answers.length} of 10 inputs recorded. Please go back and answer any you may have skipped.`);
      setStep(1); // send them back to question 1
      return;
    }
    setSubmitting(true);
    try {
      const cleanPersonal: PersonalContext = {
        name: personal.name!.trim(),
        birthdate: personal.birthdate?.trim() || "",
        currentQuestion: personal.currentQuestion?.trim() || "",
      };
      const payload = { answers, personal: cleanPersonal, tier: "free" };
      console.log("[kairos] submitting", answers.length, "answers for", cleanPersonal.name);
      const res = await fetch("/api/tyche/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      if (!res.ok) {
        console.error("[kairos] API error:", res.status, text);
        throw new Error(text || `HTTP ${res.status}`);
      }
      let data: Record<string, unknown>;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("[kairos] Invalid JSON:", text.slice(0, 200));
        throw new Error("Tyche returned something unexpected.");
      }
      sessionStorage.setItem(
        "kairos:reading",
        JSON.stringify({ answers, personal: cleanPersonal, ...data }),
      );
      router.push("/reading/preview");
    } catch (err) {
      setSubmitting(false);
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error("[kairos] consult failed:", msg);
      alert(`Tyche stumbled: ${msg.slice(0, 120)}`);
    }
  }

  const questionIdx = step >= 1 && step <= TOTAL_Q ? step - 1 : -1;
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
            <div className="eyebrow">the luck lab reading</div>
            <div className="font-mono text-[11px] text-[var(--text-subtle)] tracking-wider">
              {step === 0 ? "ready" : `${progressCounter} / ${progressDenominator}`}
            </div>
          </div>
          <div className="h-[2px] bg-[var(--border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--gold-dim)] via-[var(--gold)] to-[var(--gold-bright)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* ===== INTRO ===== */}
        {step === 0 && (
          <div>
            <TycheSigil size={72} className="mb-8" />
            <h1 className="font-display text-[42px] md:text-[58px] leading-[1.05] tracking-[-0.015em] font-light text-balance">
              Tyche is <em className="not-italic text-[var(--gold)]">ready</em> to read for you.
            </h1>
            <p className="text-[16px] text-[var(--text-muted)] mt-6 leading-relaxed max-w-lg">
              Ten calibrated inputs on how you meet the world. Tyche will map your
              kairotic profile across six trainable mechanisms and return your
              archetype, tradition match, and the doorway into your Reading.
            </p>
            <p className="text-[14px] text-[var(--text-subtle)] mt-4 leading-relaxed max-w-lg">
              Three minutes. No account required. No right answers &mdash; choose
              what is actually true, not what sounds best.
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

        {/* ===== THE 10 INPUTS ===== */}
        {currentQ && (
          <div>
            <div className="eyebrow eyebrow-muted mb-3 text-[10px]">
              input {questionIdx + 1} of {TOTAL_Q} &middot; {currentQ.axis}
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
                        selected ? "!bg-[rgba(201,169,97,0.2)] !text-[var(--gold-bright)] !border-[var(--gold)]" : ""
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
              onNext={next}
              nextDisabled={!currentAnswer}
              nextLabel="next →"
              compact
            />
          </div>
        )}

        {/* ===== NAME (REQUIRED) ===== */}
        {step === NAME_STEP && (
          <div>
            <div className="eyebrow eyebrow-tyche mb-3 text-[10px]">
              ten inputs received
            </div>
            <h2 className="font-display text-[30px] md:text-[42px] leading-[1.1] font-normal mb-3 text-balance">
              What shall Tyche call you?
            </h2>
            <p className="text-[14px] text-[var(--text-subtle)] italic mb-8 max-w-md">
              Your first name, so she can address the Reading to someone specific.
              That&rsquo;s all she needs.
            </p>
            <input
              type="text"
              autoFocus
              value={personal.name ?? ""}
              onChange={(e) => setPersonal((p) => ({ ...p, name: e.target.value }))}
              onKeyDown={(e) =>
                e.key === "Enter" && personal.name && personal.name.trim().length >= 1 && next()
              }
              placeholder="e.g. Mikel"
              className="w-full max-w-md px-4 py-3 bg-[var(--surface)] border border-[var(--border-bright)] rounded focus:border-[var(--gold)] outline-none text-[17px] font-display"
              maxLength={60}
            />
            <StepNav
              back={back}
              onNext={next}
              nextDisabled={!personal.name || personal.name.trim().length < 1}
              nextLabel="Continue →"
            />
          </div>
        )}

        {/* ===== OPTIONAL CONTEXT (SKIP AVAILABLE) ===== */}
        {step === CONTEXT_STEP && (
          <div>
            <div className="eyebrow eyebrow-muted mb-3 text-[10px]">
              optional &middot; for a deeper Reading
            </div>
            <h2 className="font-display text-[28px] md:text-[36px] leading-[1.12] font-normal mb-3 text-balance">
              {personal.name}, anything else Tyche should know?
            </h2>
            <p className="text-[13px] text-[var(--text-subtle)] italic mb-8 max-w-lg leading-relaxed">
              Both fields are optional &mdash; skip and Tyche reads from your ten
              inputs alone. But birthdate gives her poetic context (season, Greek
              calendar month) and a current question becomes the living thread of
              your Reading.
            </p>

            {/* birthdate */}
            <div className="mb-8">
              <label className="font-mono text-[11px] text-[var(--text-muted)] tracking-wider uppercase block mb-2">
                birthdate — optional
              </label>
              <input
                type="date"
                value={personal.birthdate ?? ""}
                onChange={(e) => setPersonal((p) => ({ ...p, birthdate: e.target.value }))}
                min="1900-01-01"
                max={new Date().toISOString().slice(0, 10)}
                className="px-4 py-3 bg-[var(--surface)] border border-[var(--border-bright)] rounded focus:border-[var(--gold)] outline-none text-[15px] font-display"
              />
            </div>

            {/* current question with preset chips */}
            <div className="mb-4">
              <label className="font-mono text-[11px] text-[var(--text-muted)] tracking-wider uppercase block mb-2">
                current question — optional
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {PRESET_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setPersonal((p) => ({ ...p, currentQuestion: q }))}
                    className={`text-[12px] px-3 py-1.5 rounded-full border transition-colors ${
                      personal.currentQuestion === q
                        ? "border-[var(--gold)] bg-[rgba(201,169,97,0.1)] text-[var(--gold-bright)]"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--gold-dim)]"
                    }`}
                  >
                    {q.length > 42 ? q.slice(0, 42) + "…" : q}
                  </button>
                ))}
              </div>
              <textarea
                value={personal.currentQuestion ?? ""}
                onChange={(e) =>
                  setPersonal((p) => ({ ...p, currentQuestion: e.target.value }))
                }
                placeholder="Or write your own — a phase, a choice, a longing, a stuck-place."
                rows={3}
                maxLength={280}
                className="w-full max-w-xl px-4 py-3 bg-[var(--surface)] border border-[var(--border-bright)] rounded focus:border-[var(--gold)] outline-none text-[14px] leading-relaxed resize-none"
              />
              <div className="font-mono text-[10px] text-[var(--text-subtle)] mt-1.5 tracking-wider">
                {(personal.currentQuestion ?? "").length} / 280
              </div>
            </div>

            <div className="flex justify-between items-center mt-12">
              <button
                onClick={back}
                className="text-[13px] text-[var(--text-muted)] hover:text-[var(--text)] font-mono tracking-wider"
              >
                ← back
              </button>
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => {
                    // skip — clear optional fields
                    setPersonal((p) => ({ ...p, birthdate: "", currentQuestion: "" }));
                    setStep(SUBMIT_STEP);
                  }}
                  className="text-[13px] text-[var(--text-muted)] hover:text-[var(--gold)] font-mono tracking-wider"
                >
                  skip this →
                </button>
                <button onClick={next} className="btn btn-primary">
                  Continue →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== CONSULT ===== */}
        {step === SUBMIT_STEP && (
          <div className="text-center py-6">
            {!submitting ? (
              <div>
                <TycheSigil size={96} className="mx-auto mb-8" />
                <div className="eyebrow eyebrow-tyche mb-4">tyche is ready</div>
                <h2 className="font-display text-[36px] md:text-[48px] leading-[1.1] font-light text-balance mb-4">
                  She sees you, <em className="not-italic text-[var(--tyche)]">{personal.name || "friend"}</em>.
                </h2>
                <p className="text-[15px] text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed mb-8">
                  She will read your pattern through twelve traditions, match your
                  archetype, and return your first glimpse &mdash; free.
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
