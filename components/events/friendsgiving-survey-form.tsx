"use client";

import { Check, LoaderCircle } from "lucide-react";
import { FormEvent, useRef, useState } from "react";

type SubmitState = "idle" | "submitting" | "success";

const prompts = [
  {
    name: "praise",
    label: "What is one thing you are praising God for?",
    placeholder: "I am praising God for...",
  },
  {
    name: "different",
    label: "What is one thing we should consider doing differently?",
    placeholder: "One thing to consider for next time is...",
  },
  {
    name: "learned",
    label: "What is one thing you learned from today?",
    placeholder: "Today I learned...",
  },
] as const;

export function FriendsgivingSurveyForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const confirmationHeadingRef = useRef<HTMLHeadingElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitState("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      praise: formData.get("praise"),
      different: formData.get("different"),
      learned: formData.get("learned"),
      website: formData.get("website"),
    };

    try {
      const response = await fetch("/api/friendsgiving-survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "We couldn't save your reflection. Please try again.");
      }

      form.reset();
      setSubmitState("success");
      window.setTimeout(() => confirmationHeadingRef.current?.focus(), 0);
    } catch (submissionError) {
      setSubmitState("idle");
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We couldn't save your reflection. Please try again.",
      );
    }
  }

  if (submitState === "success") {
    return (
      <section className="rounded-3xl border border-emerald-200 bg-white p-7 text-center shadow-xl shadow-slate-900/8 sm:p-10" aria-live="polite">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Check className="h-8 w-8" aria-hidden="true" />
        </span>
        <h2 ref={confirmationHeadingRef} tabIndex={-1} className="mt-5 text-2xl font-semibold text-[var(--brand-navy)] outline-none sm:text-3xl">
          Thank you for reflecting with us.
        </h2>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-[var(--brand-muted)]">
          Your response was received. We are grateful for what God did through Friendsgiving and for your help as we prepare for what comes next.
        </p>
        <button
          type="button"
          onClick={() => setSubmitState("idle")}
          className="mt-6 h-12 rounded-xl border border-[var(--brand-border)] bg-white px-5 font-semibold text-[var(--brand-navy)] transition hover:bg-[var(--brand-soft)]"
        >
          Share another reflection
        </button>
      </section>
    );
  }

  return (
    <form className="overflow-hidden rounded-3xl border border-[var(--brand-border)] bg-white shadow-xl shadow-slate-900/8" onSubmit={handleSubmit}>
      <div className="border-b border-[var(--brand-border)] p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-burgundy)]">Three short reflections</p>
        <h2 className="mt-2 text-2xl font-semibold text-[var(--brand-navy)] sm:text-3xl">Tell us about your Friendsgiving experience</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">All three responses are required. Your answers are anonymous.</p>
      </div>

      <div className="space-y-7 p-6 sm:p-8">
        {prompts.map((prompt, index) => (
          <label key={prompt.name} className="block text-base font-semibold text-[var(--brand-navy)]">
            <span className="mr-2 text-[var(--brand-burgundy)]">{index + 1}.</span>
            {prompt.label}
            <textarea
              className="mt-3 min-h-28 w-full resize-y rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 text-base font-normal leading-7 text-[var(--brand-text)] outline-none transition placeholder:text-slate-400 focus:border-[var(--brand-burgundy)] focus:ring-4 focus:ring-[var(--brand-burgundy)]/10"
              name={prompt.name}
              maxLength={1_000}
              placeholder={prompt.placeholder}
              required
            />
          </label>
        ))}

        <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
        </div>

        {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p> : null}

        <button
          type="submit"
          disabled={submitState === "submitting"}
          className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-burgundy)] px-5 text-base font-semibold text-white shadow-sm transition hover:bg-[#710019] focus:outline-none focus:ring-4 focus:ring-[var(--brand-burgundy)]/25 disabled:cursor-not-allowed disabled:opacity-65"
        >
          {submitState === "submitting" ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> : null}
          {submitState === "submitting" ? "Submitting..." : "Submit reflection"}
        </button>
        <p className="text-center text-xs leading-5 text-[var(--brand-muted)]">
          Responses are reviewed by David&apos;s Temple ministry leaders as we celebrate and improve future gatherings.
        </p>
      </div>
    </form>
  );
}
