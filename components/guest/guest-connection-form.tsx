"use client";

import Image from "next/image";
import { Check, LoaderCircle } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

const interestOptions = [
  "Membership",
  "Baptism",
  "Children & Youth",
  "Serving",
  "Sunday School / Bible Study",
  "Speaking with the Pastor",
] as const;

const heardOptions = [
  "Friend / Family",
  "Social Media",
  "Website",
  "Community Event",
  "Drive By / Sign",
  "Other",
] as const;

type SubmitState = "idle" | "submitting" | "success";

export function GuestConnectionForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const modalHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (submitState !== "success") return;

    modalHeadingRef.current?.focus();
    const redirectTimer = window.setTimeout(() => window.location.assign("/"), 5_000);
    const countdownTimer = window.setInterval(() => {
      setSecondsRemaining((current) => Math.max(0, current - 1));
    }, 1_000);

    return () => {
      window.clearTimeout(redirectTimer);
      window.clearInterval(countdownTimer);
    };
  }, [submitState]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitState("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      mobile: formData.get("mobile"),
      email: formData.get("email"),
      firstVisit: formData.get("firstVisit"),
      textOptIn: formData.get("textOptIn"),
      prayerRequest: formData.get("prayerRequest"),
      interests: formData.getAll("interests"),
      howHeard: formData.get("howHeard"),
      website: formData.get("website"),
    };

    try {
      const response = await fetch("/api/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "We couldn't submit your information. Please try again.");
      }

      form.reset();
      setSecondsRemaining(5);
      setSubmitState("success");
    } catch (submissionError) {
      setSubmitState("idle");
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We couldn't submit your information. Please try again.",
      );
    }
  }

  const inputClass =
    "mt-2 h-12 w-full rounded-xl border border-[var(--brand-border)] bg-white px-4 text-base text-[var(--brand-text)] outline-none transition placeholder:text-slate-400 focus:border-[var(--brand-burgundy)] focus:ring-4 focus:ring-[var(--brand-burgundy)]/10";

  return (
    <>
      <form
        className="overflow-hidden rounded-3xl border border-[var(--brand-border)] bg-white shadow-xl shadow-slate-900/8"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-5 border-b border-[var(--brand-border)] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-burgundy)]">Guest Connection</p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--brand-navy)]">Tell us about your visit</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">Fields marked with * are required.</p>
          </div>
          <Image
            src="/davids-temple-logo-color.png"
            width={180}
            height={90}
            alt="David's Temple Missionary Baptist Church"
            className="h-auto w-36 shrink-0 sm:w-40"
            priority
          />
        </div>

        <div className="space-y-8 p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-semibold text-[var(--brand-navy)]">
              First name *
              <input className={inputClass} name="firstName" autoComplete="given-name" maxLength={80} required />
            </label>
            <label className="text-sm font-semibold text-[var(--brand-navy)]">
              Last name *
              <input className={inputClass} name="lastName" autoComplete="family-name" maxLength={80} required />
            </label>
            <label className="text-sm font-semibold text-[var(--brand-navy)]">
              Mobile number *
              <input className={inputClass} name="mobile" type="tel" inputMode="tel" autoComplete="tel" maxLength={30} placeholder="(555) 555-5555" required />
            </label>
            <label className="text-sm font-semibold text-[var(--brand-navy)]">
              Email address
              <input className={inputClass} name="email" type="email" autoComplete="email" maxLength={160} />
            </label>
          </div>

          <fieldset>
            <legend className="text-base font-semibold text-[var(--brand-navy)]">Is this your first time worshiping with us? *</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {(["Yes", "No"] as const).map((option) => (
                <label key={option} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-[var(--brand-border)] px-4 py-3 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-soft)]">
                  <input className="h-5 w-5 accent-[var(--brand-burgundy)]" type="radio" name="firstVisit" value={option} required />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-base font-semibold text-[var(--brand-navy)]">I&apos;d like to learn more about...</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {interestOptions.map((option) => (
                <label key={option} className="grid min-h-12 cursor-pointer grid-cols-[1.25rem_1fr] items-center gap-3 rounded-xl border border-[var(--brand-border)] px-4 py-3 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-soft)]">
                  <input className="h-5 w-5 accent-[var(--brand-burgundy)]" type="checkbox" name="interests" value={option} />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block text-sm font-semibold text-[var(--brand-navy)]">
            How can we pray for you?
            <textarea
              className="mt-2 min-h-28 w-full resize-y rounded-xl border border-[var(--brand-border)] bg-white px-4 py-3 text-base font-normal text-[var(--brand-text)] outline-none transition placeholder:text-slate-400 focus:border-[var(--brand-burgundy)] focus:ring-4 focus:ring-[var(--brand-burgundy)]/10"
              name="prayerRequest"
              maxLength={1_500}
              placeholder="Share as much or as little as you would like."
            />
          </label>

          <label className="block text-sm font-semibold text-[var(--brand-navy)]">
            How did you hear about David&apos;s Temple?
            <select className={inputClass} name="howHeard" defaultValue="">
              <option value="">Select one</option>
              {heardOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>

          <fieldset>
            <legend className="text-base font-semibold text-[var(--brand-navy)]">Want to stay in the loop? *</legend>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
              Choose whether you&apos;d like occasional text updates about upcoming events, services, and church activities.
            </p>
            <div className="mt-3 grid gap-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--brand-border)] px-4 py-3 text-sm leading-6 text-[var(--brand-text)] hover:bg-[var(--brand-soft)]">
                <input className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--brand-burgundy)]" type="radio" name="textOptIn" value="Yes" required />
                <span><strong>Yes, keep me in the loop.</strong> We promise not to overload your phone.</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--brand-border)] px-4 py-3 text-sm text-[var(--brand-text)] hover:bg-[var(--brand-soft)]">
                <input className="h-5 w-5 shrink-0 accent-[var(--brand-burgundy)]" type="radio" name="textOptIn" value="No" required />
                No thanks.
              </label>
            </div>
          </fieldset>

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
            {submitState === "submitting" ? "Submitting..." : "Submit connection card"}
          </button>
          <p className="text-center text-xs leading-5 text-[var(--brand-muted)]">Your information is shared only with the David&apos;s Temple follow-up team.</p>
        </div>
      </form>

      {submitState === "success" ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4" role="dialog" aria-modal="true" aria-labelledby="guest-confirmation-title">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl sm:p-9">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Check className="h-8 w-8" aria-hidden="true" />
            </span>
            <h2 id="guest-confirmation-title" ref={modalHeadingRef} tabIndex={-1} className="mt-5 text-2xl font-semibold text-[var(--brand-navy)] outline-none">
              Thank you for connecting with us!
            </h2>
            <p className="mt-3 leading-7 text-[var(--brand-muted)]">
              Your information was received successfully. Someone from David&apos;s Temple will follow up with you soon.
            </p>
            <p className="mt-4 text-sm text-[var(--brand-muted)]">Returning to the home page in {secondsRemaining} seconds.</p>
            <button type="button" onClick={() => window.location.assign("/")} className="mt-6 h-12 w-full rounded-xl bg-[var(--brand-navy)] px-5 font-semibold text-white hover:bg-[var(--brand-navy-dark)]">
              Return home now
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
