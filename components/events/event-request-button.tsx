"use client";

import { FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type EventRequestButtonProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "light" | "ghost";
};

const emptyRequestForm = {
  title: "",
  date: "",
  time: "",
  ministry: "",
  location: "",
  description: "",
};

const ministryOptions = [
  "Church",
  "Brotherhood",
  "Sister 2 Sister",
  "Youth",
  "Choir",
  "Ushers",
  "Deacons",
  "Mothers",
];

const timeOptions = Array.from({ length: 32 }, (_, index) => {
  const hour24 = 6 + Math.floor(index / 2);
  const minute = index % 2 === 0 ? "00" : "30";
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 > 12 ? hour24 - 12 : hour24;

  return `${hour12}:${minute} ${period}`;
});

function FieldLabel({
  children,
  required = false,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <span className="text-sm font-medium text-[var(--brand-navy)]">
      {children}
      {required ? <span className="ml-1 text-[var(--brand-burgundy)]">*</span> : null}
    </span>
  );
}

export function EventRequestButton({
  className,
  size = "md",
  variant = "primary",
}: EventRequestButtonProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [canSubmitRequests, setCanSubmitRequests] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestForm, setRequestForm] = useState(emptyRequestForm);

  useEffect(() => {
    let isMounted = true;

    async function loadRole() {
      if (!supabase) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      const email = user?.email?.toLowerCase();

      if (!email) return;

      const { data, error } = await supabase
        .from("admin_users")
        .select("role")
        .eq("email", email)
        .maybeSingle();

      if (!isMounted) return;

      setCanSubmitRequests(Boolean(!error && data && ["owner", "admin", "leader"].includes(data.role)));
    }

    void loadRole();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  async function submitEventRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setRequestMessage("");

    const {
      data: { session },
    } = supabase ? await supabase.auth.getSession() : { data: { session: null } };

    const response = await fetch("/api/event-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify(requestForm),
    });
    const data = (await response.json().catch(() => ({}))) as { message?: string };

    setRequestMessage(data.message ?? "Thanks. Your request has been submitted.");

    if (response.ok) {
      setRequestForm(emptyRequestForm);
      setIsSubmitted(true);
    }

    setIsSubmitting(false);
  }

  function openRequestForm() {
    setIsSubmitted(false);
    setRequestMessage("");
    setIsRequestOpen(true);
  }

  function closeRequestForm() {
    setIsRequestOpen(false);
    setIsSubmitted(false);
    setRequestMessage("");
  }

  if (!canSubmitRequests) {
    return null;
  }

  return (
    <>
      <Button type="button" size={size} variant={variant} className={className} onClick={openRequestForm}>
        <Plus className="h-4 w-4" />
        Submit request
      </Button>

      {isRequestOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-3 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-request-title"
          onClick={closeRequestForm}
        >
          <Card className="max-h-[88vh] w-full max-w-2xl overflow-hidden" onClick={(event) => event.stopPropagation()}>
            <CardHeader className="border-b border-[var(--brand-border)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle id="event-request-title">Submit an event</CardTitle>
                  <p className="mt-2 text-sm text-[var(--brand-muted)]">
                    Share the event details for communications review.
                  </p>
                </div>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--brand-border)] text-[var(--brand-muted)] hover:bg-[var(--brand-soft)]"
                  aria-label="Close event request"
                  onClick={closeRequestForm}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="max-h-[68vh] overflow-y-auto p-5">
              {isSubmitted ? (
                <div className="grid justify-items-center gap-4 py-8 text-center">
                  <CheckCircle2 className="h-14 w-14 text-emerald-600" />
                  <div className="space-y-2">
                    <p className="text-xl font-semibold text-[var(--brand-navy)]">
                      Event request submitted
                    </p>
                    <p className="max-w-md text-sm leading-6 text-[var(--brand-muted)]">
                      Your request has been successfully submitted and will be reviewed by the communications team.
                    </p>
                  </div>
                  <Button type="button" onClick={closeRequestForm}>
                    Done
                  </Button>
                </div>
              ) : (
                <form onSubmit={submitEventRequest} className="grid gap-4">
                  <label className="grid gap-2">
                    <FieldLabel required>Title</FieldLabel>
                    <Input value={requestForm.title} onChange={(event) => setRequestForm({ ...requestForm, title: event.target.value })} placeholder="Event title" required />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2">
                      <FieldLabel required>Date</FieldLabel>
                      <Input type="date" value={requestForm.date} onChange={(event) => setRequestForm({ ...requestForm, date: event.target.value })} required />
                    </label>
                    <label className="grid gap-2">
                      <FieldLabel required>Time</FieldLabel>
                      <select
                        value={requestForm.time}
                        onChange={(event) => setRequestForm({ ...requestForm, time: event.target.value })}
                        required
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-[var(--brand-navy)] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Select time</option>
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label className="grid gap-2">
                    <FieldLabel required>Ministry</FieldLabel>
                    <select
                      value={requestForm.ministry}
                      onChange={(event) => setRequestForm({ ...requestForm, ministry: event.target.value })}
                      required
                      className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-[var(--brand-navy)] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select ministry</option>
                      {ministryOptions.map((ministry) => (
                        <option key={ministry} value={ministry}>
                          {ministry}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2">
                    <FieldLabel>Location</FieldLabel>
                    <Input value={requestForm.location} onChange={(event) => setRequestForm({ ...requestForm, location: event.target.value })} placeholder="Location" />
                  </label>
                  <label className="grid gap-2">
                    <FieldLabel>Short description</FieldLabel>
                    <Input value={requestForm.description} onChange={(event) => setRequestForm({ ...requestForm, description: event.target.value })} placeholder="Short description" />
                  </label>
                  {requestMessage ? <p className="text-sm text-[var(--brand-burgundy)]">{requestMessage}</p> : null}
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
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
