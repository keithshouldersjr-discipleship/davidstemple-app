"use client";

import { useEffect, useState } from "react";
import { Check, PencilLine } from "lucide-react";

type PreparationNotesProps = {
  lessonNumber: number;
  prompts: string[];
};

export function PreparationNotes({ lessonNumber, prompts }: PreparationNotesProps) {
  const storageKey = `dt-study-welcome-to-worship-${lessonNumber}-notes`;
  const [notes, setNotes] = useState<string[]>(() => prompts.map(() => ""));
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored) as string[];
          setNotes(prompts.map((_, index) => parsed[index] ?? ""));
        }
      } catch {
        // Notes still work for the current visit when storage is unavailable.
      }
      setHasLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [prompts, storageKey]);

  function updateNote(index: number, value: string) {
    const nextNotes = notes.map((note, noteIndex) =>
      noteIndex === index ? value : note,
    );
    setNotes(nextNotes);

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextNotes));
      setHasSaved(true);
      window.setTimeout(() => setHasSaved(false), 1800);
    } catch {
      setHasSaved(false);
    }
  }

  return (
    <section className="rounded-3xl border border-[var(--brand-border)] bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand-burgundy)]">
            Personal preparation
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--brand-navy)]">
            Reflection & notes
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--brand-muted)]">
            Take a moment with each question before class. Your responses stay private and are saved only on this device.
          </p>
        </div>
        <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-burgundy-soft)] text-[var(--brand-burgundy)] sm:flex">
          <PencilLine className="h-5 w-5" />
        </span>
      </div>

      <div className="space-y-6">
        {prompts.map((prompt, index) => (
          <label key={prompt} className="block">
            <span className="mb-2 flex gap-3 text-sm font-medium leading-6 text-[var(--brand-text)]">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-navy)] text-xs text-white">
                {index + 1}
              </span>
              {prompt}
            </span>
            <textarea
              value={notes[index] ?? ""}
              onChange={(event) => updateNote(index, event.target.value)}
              rows={3}
              disabled={!hasLoaded}
              placeholder="Write your thoughts..."
              className="min-h-24 w-full resize-y rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-soft)] px-4 py-3 text-base leading-6 text-[var(--brand-text)] outline-none transition placeholder:text-slate-400 focus:border-[var(--brand-burgundy)] focus:bg-white focus:ring-4 focus:ring-[var(--brand-burgundy)]/8 disabled:opacity-60"
            />
          </label>
        ))}
      </div>

      <p className="mt-4 flex min-h-5 items-center gap-1.5 text-xs text-[var(--brand-muted)]" aria-live="polite">
        {hasSaved ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-600" /> Saved on this device
          </>
        ) : null}
      </p>
    </section>
  );
}
