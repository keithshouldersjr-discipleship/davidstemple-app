"use client";

import { FormEvent, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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

export function EventRequestButton({
  className,
  size = "md",
  variant = "primary",
}: EventRequestButtonProps) {
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestForm, setRequestForm] = useState(emptyRequestForm);

  async function submitEventRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setRequestMessage("");

    const response = await fetch("/api/event-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestForm),
    });
    const data = (await response.json().catch(() => ({}))) as { message?: string };

    setRequestMessage(data.message ?? "Thanks. Your request has been submitted.");

    if (response.ok) {
      setRequestForm(emptyRequestForm);
    }

    setIsSubmitting(false);
  }

  return (
    <>
      <Button type="button" size={size} variant={variant} className={className} onClick={() => setIsRequestOpen(true)}>
        <Plus className="h-4 w-4" />
        Submit request
      </Button>

      {isRequestOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-3 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-request-title"
          onClick={() => setIsRequestOpen(false)}
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
                  onClick={() => setIsRequestOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="max-h-[68vh] overflow-y-auto p-5">
              <form onSubmit={submitEventRequest} className="grid gap-3">
                <Input value={requestForm.title} onChange={(event) => setRequestForm({ ...requestForm, title: event.target.value })} placeholder="Event title" required />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input type="date" value={requestForm.date} onChange={(event) => setRequestForm({ ...requestForm, date: event.target.value })} required />
                  <Input value={requestForm.time} onChange={(event) => setRequestForm({ ...requestForm, time: event.target.value })} placeholder="Time" required />
                </div>
                <Input value={requestForm.ministry} onChange={(event) => setRequestForm({ ...requestForm, ministry: event.target.value })} placeholder="Ministry" required />
                <Input value={requestForm.location} onChange={(event) => setRequestForm({ ...requestForm, location: event.target.value })} placeholder="Location" required />
                <Input value={requestForm.description} onChange={(event) => setRequestForm({ ...requestForm, description: event.target.value })} placeholder="Short description" required />
                {requestMessage ? <p className="text-sm text-[var(--brand-burgundy)]">{requestMessage}</p> : null}
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Submit request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
}
