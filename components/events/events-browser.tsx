"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock, FileText, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Event } from "@/lib/types";

type EventsBrowserProps = {
  events: Event[];
};

export function EventsBrowser({ events }: EventsBrowserProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId),
    [events, selectedEventId],
  );

  return (
    <>
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
    </>
  );
}
