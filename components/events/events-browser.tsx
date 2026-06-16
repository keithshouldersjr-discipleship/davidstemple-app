"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock, Mail, MapPin, Phone, UserRound, X } from "lucide-react";
import { InterestButton } from "@/components/connect/interest-button";
import { EventRequestButton } from "@/components/events/event-request-button";
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

  function cleanPhone(phone: string) {
    return phone.replace(/[^\d+]/g, "");
  }

  return (
    <>
      <div className="mb-5 flex justify-end">
        <EventRequestButton />
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
                  {event.requestVolunteers && event.supportNeeded?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {event.supportNeeded.map((item) => (
                        <span key={item} className="rounded-full border border-[var(--brand-border)] bg-white px-3 py-1 text-xs font-medium text-[var(--brand-navy)]">
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {event.leaderName || event.leaderEmail || event.leaderPhone ? (
                    <div className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-soft)] p-3 text-sm">
                      <span className="flex items-center gap-2 font-medium text-[var(--brand-navy)]">
                        <UserRound className="h-4 w-4 text-[var(--brand-burgundy)]" />
                        {event.leaderName ?? "Team leader"}
                      </span>
                      <span className="mt-1 block text-[var(--brand-muted)]">
                        Contact this leader to help support the event.
                      </span>
                    </div>
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
                {selectedEvent.requestVolunteers ? (
                  <InterestButton
                    sourceType="event"
                    sourceId={selectedEvent.id}
                    sourceTitle={selectedEvent.title}
                    interestArea={selectedEvent.ministry ?? selectedEvent.title}
                    supportNeeded={selectedEvent.supportNeeded}
                    label="Volunteer"
                    className="w-full sm:w-auto"
                  />
                ) : null}
                {selectedEvent.leaderEmail ? (
                  <Link href={`mailto:${selectedEvent.leaderEmail}?subject=${encodeURIComponent(`I would like to help with ${selectedEvent.title}`)}`}>
                    <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                      <Mail className="h-4 w-4" />
                      Email leader
                    </Button>
                  </Link>
                ) : null}
                {selectedEvent.leaderPhone ? (
                  <Link href={`sms:${cleanPhone(selectedEvent.leaderPhone)}`}>
                    <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                      <Phone className="h-4 w-4" />
                      Text leader
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
              {selectedEvent.requestVolunteers && selectedEvent.supportNeeded?.length ? (
                <div className="rounded-2xl border border-[var(--brand-border)] p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand-burgundy)]">Help needed</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedEvent.supportNeeded.map((item) => (
                      <span key={item} className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-medium text-[var(--brand-navy)]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {selectedEvent.leaderName || selectedEvent.leaderEmail || selectedEvent.leaderPhone ? (
                <div className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-soft)] p-4">
                  <p className="flex items-center gap-2 font-semibold text-[var(--brand-navy)]">
                    <UserRound className="h-4 w-4 text-[var(--brand-burgundy)]" />
                    {selectedEvent.leaderName ?? "Team leader"}
                  </p>
                  <div className="mt-3 grid gap-2 text-sm text-[var(--brand-muted)]">
                    {selectedEvent.leaderEmail ? (
                      <span className="flex items-center gap-2 break-all">
                        <Mail className="h-4 w-4 shrink-0 text-[var(--brand-burgundy)]" />
                        {selectedEvent.leaderEmail}
                      </span>
                    ) : null}
                    {selectedEvent.leaderPhone ? (
                      <span className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-[var(--brand-burgundy)]" />
                        {selectedEvent.leaderPhone}
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}

    </>
  );
}
