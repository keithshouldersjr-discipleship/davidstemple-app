"use client";

import { useEffect, useState } from "react";
import { hospitalityAssessment } from "@/lib/bible-study-data";

const scale = ["Rarely", "Sometimes", "Usually", "Consistently"];

function getResult(score: number, ranges: readonly string[]) {
  if (score <= 5) return ranges[0];
  if (score <= 8) return ranges[1];
  if (score <= 10) return ranges[2];
  return ranges[3];
}

export function HospitalityAssessment() {
  const storageKey = "dt-study-welcome-to-worship-assessment";
  const [scores, setScores] = useState<Record<string, number>>({});
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored) setScores(JSON.parse(stored) as Record<string, number>);
      } catch {
        // The assessment remains usable for the current visit.
      }
      setHasLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function setScore(key: string, value: number) {
    const nextScores = { ...scores, [key]: value };
    setScores(nextScores);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextScores));
    } catch {
      // The assessment remains usable for the current visit.
    }
  }

  return (
    <section className="rounded-3xl bg-[var(--brand-navy)] p-5 text-white shadow-xl shadow-[#002F5F]/10 sm:p-7">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f0c8d2]">
        Lesson 1 activity
      </p>
      <h2 className="mt-2 text-2xl font-semibold">Hospitality assessment</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
        Score what is normally true, not what you intend. Your answers stay private and are saved only on this device.
      </p>

      <div className="mt-7 space-y-6">
        {hospitalityAssessment.map((assessment) => {
          const values = assessment.questions.map(
            (_, index) => scores[`${assessment.id}-${index}`] ?? 0,
          );
          const total = values.reduce((sum, value) => sum + value, 0);
          const isComplete = values.every(Boolean);

          return (
            <div key={assessment.id} className="rounded-3xl bg-white p-5 text-[var(--brand-text)] sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-[var(--brand-navy)]">
                    {assessment.title}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--brand-muted)]">
                    {assessment.timeframe}
                  </p>
                </div>
                <div className="rounded-2xl bg-[var(--brand-soft)] px-4 py-2 text-center">
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--brand-muted)]">Score</p>
                  <p className="text-lg font-bold text-[var(--brand-navy)]">{total || 0} / 12</p>
                </div>
              </div>

              <div className="mt-5 space-y-6">
                {assessment.questions.map((question, questionIndex) => {
                  const key = `${assessment.id}-${questionIndex}`;
                  return (
                    <fieldset key={question} disabled={!hasLoaded}>
                      <legend className="text-sm font-medium leading-6">
                        {questionIndex + 1}. {question}
                      </legend>
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {scale.map((label, index) => {
                          const value = index + 1;
                          const selected = scores[key] === value;
                          return (
                            <label
                              key={label}
                              className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-xs font-medium transition ${
                                selected
                                  ? "border-[var(--brand-burgundy)] bg-[var(--brand-burgundy)] text-white"
                                  : "border-[var(--brand-border)] bg-white text-[var(--brand-muted)] hover:border-[var(--brand-burgundy)]/40"
                              }`}
                            >
                              <input
                                type="radio"
                                name={key}
                                value={value}
                                checked={selected}
                                onChange={() => setScore(key, value)}
                                className="sr-only"
                              />
                              <span className="block text-base font-bold">{value}</span>
                              {label}
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl bg-[var(--brand-burgundy-soft)] px-4 py-3 text-sm font-medium text-[var(--brand-burgundy)]" aria-live="polite">
                {isComplete
                  ? `Your result: ${getResult(total, assessment.ranges)}`
                  : "Answer all three questions to see your result."}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
