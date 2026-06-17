"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  HandCoins,
  Heart,
  HeartHandshake,
  Loader2,
  MapPin,
  Mic,
  Phone,
  School,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Resource } from "@/lib/types";

const icons = {
  BookOpen,
  CalendarDays,
  HandCoins,
  Heart,
  HeartHandshake,
  MapPin,
  Mic,
  Phone,
  School,
  Sparkles,
  UserRound,
};

type ResourceCardProps = {
  resource: Resource;
};

type PrayerFormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
  anonymous: boolean;
};

const emptyPrayerForm: PrayerFormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
  anonymous: false,
};

export function ResourceCard({ resource }: ResourceCardProps) {
  const Icon = resource.icon ? icons[resource.icon as keyof typeof icons] : Sparkles;
  const isPrayerRequest = resource.id === "prayer-request";
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyPrayerForm);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function closeModal() {
    setIsOpen(false);
    window.setTimeout(() => {
      setForm(emptyPrayerForm);
      setMessage("");
      setSubmitted(false);
      setIsSubmitting(false);
    }, 200);
  }

  async function submitPrayerRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "prayer",
        ...form,
      }),
    });

    const result = (await response.json().catch(() => ({}))) as { message?: string };

    if (!response.ok) {
      setMessage(result.message ?? "Something went wrong. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setSubmitted(true);
    setMessage(result.message ?? "Thank you for sharing your prayer request.");
    setForm(emptyPrayerForm);
    setIsSubmitting(false);
  }

  const card = (
    <Card className="h-full transition hover:-translate-y-1 hover:border-[var(--brand-burgundy)]/35 hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-navy)]/8 text-[var(--brand-navy)] group-hover:bg-[var(--brand-burgundy-soft)] group-hover:text-[var(--brand-burgundy)]">
            <Icon className="h-5 w-5" />
          </span>
          <Badge>{resource.category}</Badge>
        </div>
        <CardTitle>{resource.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-[var(--brand-muted)]">{resource.description}</p>
      </CardContent>
    </Card>
  );

  if (isPrayerRequest) {
    return (
      <>
        <button
          type="button"
          className="group block h-full w-full text-left"
          onClick={() => setIsOpen(true)}
        >
          {card}
        </button>

        {isOpen ? (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-3 sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="prayer-request-title"
            onClick={closeModal}
          >
            <Card className="max-h-[88vh] w-full max-w-xl overflow-hidden" onClick={(event) => event.stopPropagation()}>
              <CardHeader className="border-b border-[var(--brand-border)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle id="prayer-request-title">Submit a Prayer Request</CardTitle>
                    <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
                      Share how we can pray with you. You can include contact information for follow up or submit anonymously.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--brand-border)] text-[var(--brand-muted)] hover:bg-[var(--brand-soft)]"
                    aria-label="Close prayer request form"
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
                    <p className="font-semibold text-[var(--brand-navy)]">Prayer request sent</p>
                    <p className="text-sm leading-6 text-[var(--brand-muted)]">{message}</p>
                    <Button type="button" size="sm" onClick={closeModal}>
                      Close
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={submitPrayerRequest} className="grid gap-4">
                    <label className="flex items-start gap-3 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-soft)] p-4 text-sm text-[var(--brand-muted)]">
                      <input
                        type="checkbox"
                        checked={form.anonymous}
                        onChange={(event) => setForm({ ...form, anonymous: event.target.checked })}
                        className="mt-1 h-4 w-4 accent-[var(--brand-burgundy)]"
                      />
                      <span>
                        Submit anonymously
                        <span className="mt-1 block text-xs leading-5">
                          If selected, your name, email, and phone number will not be included.
                        </span>
                      </span>
                    </label>

                    {!form.anonymous ? (
                      <div className="grid gap-3">
                        <Input
                          value={form.name}
                          onChange={(event) => setForm({ ...form, name: event.target.value })}
                          placeholder="Your name"
                        />
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Input
                            type="tel"
                            value={form.phone}
                            onChange={(event) => setForm({ ...form, phone: event.target.value })}
                            placeholder="Phone for follow up"
                          />
                          <Input
                            type="email"
                            value={form.email}
                            onChange={(event) => setForm({ ...form, email: event.target.value })}
                            placeholder="Email for follow up"
                          />
                        </div>
                      </div>
                    ) : null}

                    <textarea
                      value={form.message}
                      onChange={(event) => setForm({ ...form, message: event.target.value })}
                      placeholder="How can we pray with you?"
                      required
                      rows={6}
                      className="min-h-36 rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 text-sm text-[var(--brand-navy)] outline-none placeholder:text-[var(--brand-muted)] focus:border-[var(--brand-burgundy)]"
                    />

                    {message ? <p className="text-sm text-[var(--brand-burgundy)]">{message}</p> : null}

                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" />}
                      Submit request
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

  return (
    <Link href={resource.url} className="group block h-full">
      {card}
    </Link>
  );
}
