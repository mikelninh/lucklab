"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { QUESTIONS, type Answer } from "@/lib/diagnostic";

export default function DiagnosticPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [step, setStep] = useState(0); // 0 = intro, 1..10 = questions, 11 = processing
  const [submitting, setSubmitting] = useState(false);

  const total = QUESTIONS.length;
  const progress = step === 0 ? 0 : Math.min(100, ((step - 1) / total) * 100);

  function selectOption(qid: number, oid: string) {
    setAnswers((prev) => {
      const next = prev.filter((a) => a.questionId !== qid);
      next.push({ questionId: qid, optionId: oid });
      return next;
    });
    // auto-advance after brief delay so user sees their selection
    setTimeout(() => {
      setStep((s) => Math.min(s + 1, total + 1));
    }, 280);
  }

  async function submit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/tyche/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      // Store result so /reading/preview can render it; in production we'd persist to DB
      sessionStorage.setItem("kairos:reading", JSON.stringify({ answers, ...data }));
      router.push("/reading/preview");
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      alert("Tyche is resting. Please try again in a moment.");
    }
  }

  const currentQ = step >= 1 && step <= total ? QUESTIONS[step - 1] : null;
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
            <div className="eyebrow">the kairos diagnostic</div>
            <div className="font-mono text-[11px] text-[var(--text-subtle)] tracking-wider">
              {step === 0 ? "0" : Math.min(step, total)} / {total}
            </div>
          </div>
          <div className="h-[2px] bg-[var(--border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--gold-dim)] via-[var(--gold)] to-[var(--gold-bright)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* INTRO */}
        {step === 0 && (
          <div>
            <h1 className="font-display text-[42px] md:text-[54px] leading-[1.05] tracking-[-0.015em] font-light text-balance">
              Ten inputs. <em className="not-italic text-[var(--gold)]">Three minutes.</em>
            </h1>
            <p className="text-[16px] text-[var(--text-muted)] mt-6 leading-relaxed">
              The Diagnostic maps your kairotic profile across six mechanisms &mdash;{" "}
              <span className="kbd kbd-tyche">attention</span>,{" "}
              <span className="kbd kbd-tyche">openness</span>,{" "}
              <span className="kbd kbd-tyche">action</span>,{" "}
              <span className="kbd kbd-tyche">surrender</span>,{" "}
              <span className="kbd kbd-tyche">connection</span>, and{" "}
              <span className="kbd kbd-tyche">meaning</span>. At the end, Tyche reads
              your pattern and returns your archetype plus a tradition match.
            </p>
            <p className="text-[14px] text-[var(--text-subtle)] mt-5 leading-relaxed">
              No account. No right answers. Read each option carefully &mdash; choose
              the one closest to your actual behaviour, not your ideal.
            </p>
            <div className="mt-10">
              <button
                onClick={() => setStep(1)}
                className="btn btn-primary"
              >
                Begin the Diagnostic
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M3 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* QUESTION */}
        {currentQ && (
          <div>
            <div className="eyebrow eyebrow-muted mb-3 text-[10px]">
              axis &middot; {currentQ.axis}
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

            <div className="flex justify-between items-center mt-10">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="text-[13px] text-[var(--text-muted)] hover:text-[var(--text)] font-mono tracking-wider"
              >
                ← back
              </button>
              {currentAnswer && (
                <button
                  onClick={() => setStep((s) => Math.min(s + 1, total + 1))}
                  className="btn btn-ghost text-[13px] !py-2 !px-4"
                >
                  next →
                </button>
              )}
            </div>
          </div>
        )}

        {/* FINAL STEP — submission */}
        {step > total && (
          <div className="text-center py-8">
            {!submitting ? (
              <div>
                <div className="eyebrow eyebrow-tyche mb-4">all inputs received</div>
                <h2 className="font-display text-[36px] md:text-[46px] leading-[1.1] font-light text-balance mb-4">
                  Tyche is ready to read.
                </h2>
                <p className="text-[15px] text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed mb-8">
                  She will map your pattern across the twelve traditions and return
                  your kairotic archetype, top tradition matches, and a free preview
                  of your protocol.
                </p>
                <button onClick={submit} className="btn btn-primary">
                  Consult Tyche
                </button>
                <p className="font-mono text-[11px] text-[var(--text-subtle)] mt-4 tracking-wider">
                  ~ 10 seconds · free
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
                  analysing your kairotic architecture…
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
