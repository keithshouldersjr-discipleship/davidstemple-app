"use client";

import { FormEvent, type ReactNode, useState } from "react";
import { CheckCircle2, HeartHandshake, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type InterestButtonProps = {
  sourceType: "event" | "ministry" | "sunday" | "general";
  sourceTitle: string;
  sourceId?: string;
  interestArea?: string;
  supportNeeded?: string[];
  label?: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "light" | "ghost";
  className?: string;
};

type InterestFormState = {
  name: string;
  email: string;
  phone: string;
  preferredContact: string;
  message: string;
};

const emptyForm: InterestFormState = {
  name: "",
  email: "",
  phone: "",
  preferredContact: "Text",
  message: "",
};

export function InterestButton({
  sourceType,
  sourceTitle,
  sourceId,
  interestArea,
  supportNeeded = [],
  label = "I want to get involved",
  size = "sm",
  variant = "primary",
  className,
}: InterestButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function submitInterest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const response = await fetch("/api/interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        sourceType,
        sourceTitle,
        sourceId,
        interestArea: interestArea ?? sourceTitle,
        supportNeeded,
      }),
    });

    const result = (await response.json().catch(() => ({}))) as { message?: string };

    if (!response.ok) {
      setMessage(result.message ?? "Something went wrong. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setSubmitted(true);
    setMessage(result.message ?? "Thanks for reaching out.");
    setForm(emptyForm);
    setIsSubmitting(false);
  }

  function closeModal() {
    setIsOpen(false);
    window.setTimeout(() => {
      setMessage("");
      setSubmitted(false);
      setForm(emptyForm);
    }, 200);
  }

  return (
    <>
      <Button type="button" size={size} variant={variant} className={className} onClick={() => setIsOpen(true)}>
        <HeartHandshake className="h-4 w-4" />
        {label}
      </Button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-3 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="interest-modal-title"
          onClick={closeModal}
        >
          <Card className="max-h-[88vh] w-full max-w-xl overflow-hidden" onClick={(event) => event.stopPropagation()}>
            <CardHeader className="border-b border-[var(--brand-border)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle id="interest-modal-title">Get involved</CardTitle>
                  <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">{sourceTitle}</p>
                </div>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--brand-border)] text-[var(--brand-muted)] hover:bg-[var(--brand-soft)]"
                  aria-label="Close interest form"
                  onClick={closeModal}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="max-h-[68vh] overflow-y-auto p-5">
              {submitted ? (
                <div className="space-y-4 rounded-2xl bg-[var(--brand-soft)] p-5 text-center">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-[var(--brand-burgundy)]" />
                  <p className="font-semibold text-[var(--brand-navy)]">Request sent</p>
                  <p className="text-sm leading-6 text-[var(--brand-muted)]">{message}</p>
                  <Button type="button" size="sm" onClick={closeModal}>
                    Close
                  </Button>
                </div>
              ) : (
                <form onSubmit={submitInterest} className="grid gap-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      placeholder="Your name"
                      required
                      className="h-11 rounded-md border border-[var(--brand-border)] bg-white px-3 text-sm text-[var(--brand-navy)] outline-none focus:border-[var(--brand-burgundy)]"
                    />
                    <select
                      value={form.preferredContact}
                      onChange={(event) => setForm({ ...form, preferredContact: event.target.value })}
                      className="h-11 rounded-md border border-[var(--brand-border)] bg-white px-3 text-sm text-[var(--brand-navy)] outline-none focus:border-[var(--brand-burgundy)]"
                    >
                      <option>Text</option>
                      <option>Call</option>
                      <option>Email</option>
                    </select>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                      placeholder="Email"
                      className="h-11 rounded-md border border-[var(--brand-border)] bg-white px-3 text-sm text-[var(--brand-navy)] outline-none focus:border-[var(--brand-burgundy)]"
                    />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(event) => setForm({ ...form, phone: event.target.value })}
                      placeholder="Phone"
                      className="h-11 rounded-md border border-[var(--brand-border)] bg-white px-3 text-sm text-[var(--brand-navy)] outline-none focus:border-[var(--brand-burgundy)]"
                    />
                  </div>
                  {supportNeeded.length ? (
                    <div className="rounded-2xl bg-[var(--brand-soft)] p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand-burgundy)]">Help needed</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {supportNeeded.map((item) => (
                          <span key={item} className="rounded-full border border-[var(--brand-border)] bg-white px-3 py-1 text-xs font-medium text-[var(--brand-navy)]">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <textarea
                    value={form.message}
                    onChange={(event) => setForm({ ...form, message: event.target.value })}
                    placeholder="Tell us what you are interested in or when you are available."
                    rows={4}
                    className="min-h-28 rounded-md border border-[var(--brand-border)] bg-white px-3 py-3 text-sm text-[var(--brand-navy)] outline-none focus:border-[var(--brand-burgundy)]"
                  />
                  {message ? <p className="text-sm text-[var(--brand-burgundy)]">{message}</p> : null}
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <HeartHandshake className="h-4 w-4" />}
                    Send request
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
}
