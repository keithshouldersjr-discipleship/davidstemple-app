"use client";

import Image from "next/image";
import { Check, LoaderCircle, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import { FormEvent, useRef, useState } from "react";

type SignupRole = "mentor" | "mentee";
type SubmitState = "idle" | "submitting" | "success";

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-[var(--brand-border)] bg-white px-4 text-base font-normal text-[var(--brand-text)] outline-none transition placeholder:text-slate-400 focus:border-[var(--brand-burgundy)] focus:ring-4 focus:ring-[var(--brand-burgundy)]/10";
const choiceClass =
  "flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border border-[var(--brand-border)] px-4 py-3 text-sm leading-6 text-[var(--brand-text)] transition hover:bg-[var(--brand-soft)]";

export function PrayerMentorSignupForm() {
  const [role, setRole] = useState<SignupRole>("mentor");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const [submittedRole, setSubmittedRole] = useState<SignupRole>("mentor");
  const formRef = useRef<HTMLFormElement>(null);

  function selectRole(nextRole: SignupRole) {
    if (submitState === "submitting") return;
    setRole(nextRole);
    setError("");
    window.setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitState("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/prayer-mentors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, role }),
      });
      const result = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "We couldn't submit this signup. Please try again.");
      }

      setSubmittedRole(role);
      form.reset();
      setSubmitState("success");
    } catch (submissionError) {
      setSubmitState("idle");
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We couldn't submit this signup. Please try again.",
      );
    }
  }

  function startAnotherSignup() {
    setSubmitState("idle");
    setError("");
    window.setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Choose a signup type">
        <button
          type="button"
          onClick={() => selectRole("mentor")}
          aria-pressed={role === "mentor"}
          className={`rounded-2xl border p-5 text-left transition ${
            role === "mentor"
              ? "border-[var(--brand-burgundy)] bg-[var(--brand-burgundy-soft)] shadow-sm"
              : "border-[var(--brand-border)] bg-white hover:border-[var(--brand-navy)]/30"
          }`}
        >
          <span className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-navy)] text-white">
              <UserRound className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-lg font-semibold text-[var(--brand-navy)]">Sign up as a mentor</span>
              <span className="mt-1 block text-sm text-[var(--brand-muted)]">For adult prayer mentors</span>
            </span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => selectRole("mentee")}
          aria-pressed={role === "mentee"}
          className={`rounded-2xl border p-5 text-left transition ${
            role === "mentee"
              ? "border-[var(--brand-burgundy)] bg-[var(--brand-burgundy-soft)] shadow-sm"
              : "border-[var(--brand-border)] bg-white hover:border-[var(--brand-navy)]/30"
          }`}
        >
          <span className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-burgundy)] text-white">
              <UsersRound className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-lg font-semibold text-[var(--brand-navy)]">Enroll a mentee</span>
              <span className="mt-1 block text-sm text-[var(--brand-muted)]">For a parent or guardian</span>
            </span>
          </span>
        </button>
      </div>

      <form
        ref={formRef}
        className="mt-6 scroll-mt-28 overflow-hidden rounded-3xl border border-[var(--brand-border)] bg-white shadow-xl shadow-slate-900/8"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-5 border-b border-[var(--brand-border)] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-burgundy)]">
              {role === "mentor" ? "Prayer Mentor Signup" : "Mentee Enrollment"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--brand-navy)]">
              {role === "mentor" ? "Help a teen feel prayed for and supported" : "Help us get to know your teen"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">Fields marked with * are required.</p>
          </div>
          <Image
            src="/davids-temple-logo-color.png"
            width={180}
            height={90}
            alt="David's Temple Missionary Baptist Church"
            className="h-auto w-36 shrink-0 sm:w-40"
          />
        </div>

        <div className="space-y-8 p-6 sm:p-8">
          {role === "mentor" ? <MentorFields /> : <MenteeFields />}

          <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          </div>

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitState === "submitting"}
            className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-burgundy)] px-5 text-base font-semibold text-white shadow-sm transition hover:bg-[#710019] focus:outline-none focus:ring-4 focus:ring-[var(--brand-burgundy)]/25 disabled:cursor-not-allowed disabled:opacity-65"
          >
            {submitState === "submitting" ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> : null}
            {submitState === "submitting"
              ? "Submitting..."
              : role === "mentor"
                ? "Submit mentor signup"
                : "Submit mentee enrollment"}
          </button>
          <p className="text-center text-xs leading-5 text-[var(--brand-muted)]">
            Signup information is shared only with authorized David&apos;s Temple ministry leaders.
          </p>
        </div>
      </form>

      {submitState === "success" ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4" role="dialog" aria-modal="true" aria-labelledby="prayer-mentor-confirmation-title">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl sm:p-9">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Check className="h-8 w-8" aria-hidden="true" />
            </span>
            <h2 id="prayer-mentor-confirmation-title" className="mt-5 text-2xl font-semibold text-[var(--brand-navy)]">
              {submittedRole === "mentor" ? "Thank you for stepping forward!" : "Mentee enrollment received!"}
            </h2>
            <p className="mt-3 leading-7 text-[var(--brand-muted)]">
              {submittedRole === "mentor"
                ? "A ministry leader will review your signup and contact you about screening, training, and next steps."
                : "A ministry leader will review the enrollment and follow up with the parent or guardian about matching and next steps."}
            </p>
            <div className="mt-6 grid gap-3">
              <button type="button" onClick={startAnotherSignup} className="h-12 w-full rounded-xl bg-[var(--brand-navy)] px-5 font-semibold text-white hover:bg-[var(--brand-navy-dark)]">
                Submit another signup
              </button>
              <button type="button" onClick={() => window.location.assign("/")} className="h-12 w-full rounded-xl border border-[var(--brand-border)] px-5 font-semibold text-[var(--brand-navy)] hover:bg-[var(--brand-soft)]">
                Return home
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function MentorFields() {
  return (
    <>
      <section>
        <h3 className="text-lg font-semibold text-[var(--brand-navy)]">About you</h3>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
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
          <label className="text-sm font-semibold text-[var(--brand-navy)]">
            Preferred contact method *
            <select className={inputClass} name="preferredContact" defaultValue="" required>
              <option value="" disabled>Select one</option>
              <option value="Text">Text</option>
              <option value="Phone">Phone call</option>
              <option value="Email">Email</option>
            </select>
          </label>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-[var(--brand-navy)]">Your mentoring fit</h3>
        <div className="mt-4 grid gap-5">
          <label className="text-sm font-semibold text-[var(--brand-navy)]">
            How many mentees could you support well? *
            <select className={inputClass} name="maxMentees" defaultValue="1" required>
              <option value="1">1 mentee</option>
              <option value="2">Up to 2 mentees</option>
              <option value="3">Up to 3 mentees</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-soft)] p-5">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-[var(--brand-burgundy)]" aria-hidden="true" />
          <div>
            <h3 className="font-semibold text-[var(--brand-navy)]">Mentor commitments</h3>
            <p className="mt-1 text-sm leading-6 text-[var(--brand-muted)]">Please confirm each statement.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3">
          <label className={choiceClass}>
            <input className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--brand-burgundy)]" type="checkbox" name="adultConfirmation" value="Yes" required />
            <span>I confirm that I am at least 18 years old. *</span>
          </label>
          <label className={choiceClass}>
            <input className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--brand-burgundy)]" type="checkbox" name="screeningConsent" value="Yes" required />
            <span>I agree to complete David&apos;s Temple&apos;s required screening, training, and background-check process before being matched. *</span>
          </label>
          <label className={choiceClass}>
            <input className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--brand-burgundy)]" type="checkbox" name="mentorCommitment" value="Yes" required />
            <span>I will pray for my mentee, send regular encouragement, support approved public activities when possible, and follow church child-safety and communication policies. *</span>
          </label>
        </div>
      </section>
    </>
  );
}

function MenteeFields() {
  return (
    <>
      <section>
        <h3 className="text-lg font-semibold text-[var(--brand-navy)]">Parent or guardian</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">A parent or legal guardian should complete this enrollment for a teen under 18.</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[var(--brand-navy)]">
            Parent / guardian name *
            <input className={inputClass} name="guardianName" autoComplete="name" maxLength={160} required />
          </label>
          <label className="text-sm font-semibold text-[var(--brand-navy)]">
            Parent / guardian mobile *
            <input className={inputClass} name="guardianMobile" type="tel" inputMode="tel" autoComplete="tel" maxLength={30} placeholder="(555) 555-5555" required />
          </label>
          <label className="text-sm font-semibold text-[var(--brand-navy)] sm:col-span-2">
            Parent / guardian email *
            <input className={inputClass} name="guardianEmail" type="email" autoComplete="email" maxLength={160} required />
          </label>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-[var(--brand-navy)]">About the mentee</h3>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[var(--brand-navy)]">
            First name *
            <input className={inputClass} name="firstName" autoComplete="given-name" maxLength={80} required />
          </label>
          <label className="text-sm font-semibold text-[var(--brand-navy)]">
            Last name *
            <input className={inputClass} name="lastName" autoComplete="family-name" maxLength={80} required />
          </label>
          <label className="text-sm font-semibold text-[var(--brand-navy)]">
            Age *
            <input className={inputClass} name="age" type="number" inputMode="numeric" min={12} max={19} required />
          </label>
          <label className="text-sm font-semibold text-[var(--brand-navy)]">
            Grade *
            <select className={inputClass} name="grade" defaultValue="" required>
              <option value="" disabled>Select one</option>
              {["6th", "7th", "8th", "9th", "10th", "11th", "12th", "Graduated / not in high school"].map((grade) => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-[var(--brand-navy)]">
            Mentee mobile (optional)
            <input className={inputClass} name="menteeMobile" type="tel" inputMode="tel" maxLength={30} />
          </label>
          <label className="text-sm font-semibold text-[var(--brand-navy)] sm:col-span-2">
            Mentee email (optional)
            <input className={inputClass} name="menteeEmail" type="email" maxLength={160} />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-soft)] p-5">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-[var(--brand-burgundy)]" aria-hidden="true" />
          <div>
            <h3 className="font-semibold text-[var(--brand-navy)]">Parent / guardian consent</h3>
            <p className="mt-1 text-sm leading-6 text-[var(--brand-muted)]">Please confirm both statements.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3">
          <label className={choiceClass}>
            <input className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--brand-burgundy)]" type="checkbox" name="guardianConsent" value="Yes" required />
            <span>I give permission for this teen to participate in the David&apos;s Temple Prayer Mentor Program and be paired with a screened adult mentor of the same sex. *</span>
          </label>
          <label className={choiceClass}>
            <input className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--brand-burgundy)]" type="checkbox" name="communicationConsent" value="Yes" required />
            <span>I understand that mentor communication and support at public activities will be coordinated with the family and must follow church child-safety policies. *</span>
          </label>
        </div>
      </section>
    </>
  );
}
