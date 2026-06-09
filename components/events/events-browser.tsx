"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock, FileText, Loader2, MapPin, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Event } from "@/lib/types";

type EventsBrowserProps = {
  events: Event[];
};

export function EventsBrowser({ events }: EventsBrowserProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestForm, setRequestForm] = useState({
    title: "",
    date: "",
    time: "",
    ministry: "",
    location: "",
    description: "",
  });
  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId),
    [events, selectedEventId],
  );

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
      setRequestForm({
        title: "",
        date: "",
        time: "",
        ministry: "",
        location: "",
        description: "",
      });
    }

    setIsSubmitting(false);
  }

  return (
    <>
      <div className="mb-5 flex justify-end">
        <Button type="button" onClick={() => setIsRequestOpen(true)}>
          <Plus className="h-4 w-4" />
          Submit event
        </Button>
      </div>

      <div className="max-h-[72vh] overflow-y-auto pr-1">
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <button
              key={event.id}
              type="button"
              className="text-left"
              onClick={() => setSelectedEventId(event.id)}
            >
              <Card className="h-full transition hover:-translate-y-1 hover:border-[var(--brand-burgundy)]/35 hover:shadow-md">
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <p className="text-sm leading-6 text-[var(--brand-muted)]">{event.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 text-sm text-[var(--brand-muted)]">
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-[var(--brand-burgundy)]" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[var(--brand-burgundy)]" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[var(--brand-burgundy)]" />
                      {event.location}
                    </span>
                  </div>
                  {event.flyerUrl ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-border)] px-4 py-2 text-sm font-medium text-[var(--brand-navy)]">
                      <FileText className="h-4 w-4 text-[var(--brand-burgundy)]" />
                      Flyer available
                    </span>
                  ) : null}
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>

      {selectedEvent ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-3 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-modal-title"
          onClick={() => setSelectedEventId(null)}
        >
          <Card className="max-h-[88vh] w-full max-w-2xl overflow-hidden" onClick={(event) => event.stopPropagation()}>
            <CardHeader className="border-b border-[var(--brand-border)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle id="event-modal-title">{selectedEvent.title}</CardTitle>
                  <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
                    {selectedEvent.description}
                  </p>
                </div>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--brand-border)] text-[var(--brand-muted)] hover:bg-[var(--brand-soft)]"
                  aria-label="Close event details"
                  onClick={() => setSelectedEventId(null)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="max-h-[68vh] space-y-5 overflow-y-auto p-5">
              <div className="grid gap-3 text-sm text-[var(--brand-muted)]">
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[var(--brand-burgundy)]" />
                  {selectedEvent.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[var(--brand-burgundy)]" />
                  {selectedEvent.time}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[var(--brand-burgundy)]" />
                  {selectedEvent.location}
                </span>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {selectedEvent.flyerUrl ? (
                  <Link href={selectedEvent.flyerUrl} target="_blank" rel="noreferrer">
                    <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                      <FileText className="h-4 w-4" />
                      View flyer
                    </Button>
                  </Link>
                ) : null}
                {selectedEvent.registrationUrl ? (
                  <Link href={selectedEvent.registrationUrl} target="_blank" rel="noreferrer">
                    <Button size="sm" className="w-full sm:w-auto">
                      Register
                    </Button>
                  </Link>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

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
                <Input value={requestForm.title} onChange={(e) => setRequestForm({ ...requestForm, title: e.target.value })} placeholder="Event title" required />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input type="date" value={requestForm.date} onChange={(e) => setRequestForm({ ...requestForm, date: e.target.value })} required />
                  <Input value={requestForm.time} onChange={(e) => setRequestForm({ ...requestForm, time: e.target.value })} placeholder="Time" required />
                </div>
                <Input value={requestForm.ministry} onChange={(e) => setRequestForm({ ...requestForm, ministry: e.target.value })} placeholder="Ministry" required />
                <Input value={requestForm.location} onChange={(e) => setRequestForm({ ...requestForm, location: e.target.value })} placeholder="Location" required />
                <Input value={requestForm.description} onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })} placeholder="Short description" required />
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
