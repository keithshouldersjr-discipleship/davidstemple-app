"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Mail, MapPin, Phone, UserRound, X } from "lucide-react";
import { InterestButton } from "@/components/connect/interest-button";
import { EventRequestButton } from "@/components/events/event-request-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Event } from "@/lib/types";

type HomeEventsPreviewProps = {
  events: Event[];
  showHeader?: boolean;
  listClassName?: string;
};

function parseEventDate(event: Event) {
  const parsed = new Date(`${event.date} 12:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
}

function formatDay(date: Date) {
  return new Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(date);
}

function cleanPhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

export function HomeEventsPreview({ events, showHeader = true, listClassName = "max-h-[26rem]" }: HomeEventsPreviewProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId),
    [events, selectedEventId],
  );

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-[var(--brand-border)] bg-white shadow-sm shadow-slate-900/5">
        {showHeader ? (
          <div className="border-b border-[var(--brand-border)] bg-[var(--brand-soft)] px-5 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-[var(--brand-navy)]">
                <CalendarDays className="h-5 w-5 text-[var(--brand-burgundy)]" />
                <p className="font-semibold">Calendar preview</p>
              </div>
              <div className="grid gap-2 sm:flex sm:items-center">
                <EventRequestButton size="sm" className="w-full sm:w-auto" />
                <Link href="/events">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    View full calendar
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : null}
        <div className={`${listClassName} overflow-y-auto overscroll-contain scroll-smooth divide-y divide-[var(--brand-border)]`}>
          {events.map((event) => {
            const date = parseEventDate(event);

            if (!date) {
              return null;
            }

            return (
              <div
                key={event.id}
                className="grid min-h-24 grid-cols-[4.5rem_1fr] gap-4 p-4 transition hover:bg-[var(--brand-soft)] sm:grid-cols-[5.25rem_1fr_auto] sm:items-center"
              >
                <div className="rounded-2xl border border-[var(--brand-burgundy)]/15 bg-[var(--brand-burgundy-soft)] px-3 py-2 text-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-[var(--brand-burgundy)]">
                    {formatMonth(date)}
                  </p>
                  <p className="text-2xl font-semibold text-[var(--brand-navy)]">
                    {formatDay(date)}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-[var(--brand-navy)]">
                    {event.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--brand-muted)]">
                    {event.time} · {event.location}
                  </p>
                  {event.leaderName || event.leaderEmail || event.leaderPhone ? (
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--brand-muted)]">
                      <span className="inline-flex items-center gap-2 font-medium text-[var(--brand-navy)]">
                        <UserRound className="h-4 w-4 text-[var(--brand-burgundy)]" />
                        {event.leaderName ?? "Team leader"}
                      </span>
                      {event.leaderEmail ? (
                        <Link href={`mailto:${event.leaderEmail}?subject=${encodeURIComponent(`I would like to help with ${event.title}`)}`} className="inline-flex items-center gap-1.5 font-medium text-[var(--brand-burgundy)]">
                          <Mail className="h-4 w-4" />
                          Email
                        </Link>
                      ) : null}
                      {event.leaderPhone ? (
                        <Link href={`sms:${cleanPhone(event.leaderPhone)}`} className="inline-flex items-center gap-1.5 font-medium text-[var(--brand-burgundy)]">
                          <Phone className="h-4 w-4" />
                          Text
                        </Link>
                      ) : null}
                    </div>
                  ) : null}
                  {event.requestVolunteers && event.supportNeeded?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {event.supportNeeded.map((item) => (
                        <span key={item} className="rounded-full border border-[var(--brand-border)] bg-white px-3 py-1 text-xs font-medium text-[var(--brand-navy)]">
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2 sm:hidden">
                    {event.requestVolunteers ? (
                      <InterestButton
                        sourceType="event"
                        sourceId={event.id}
                        sourceTitle={event.title}
                        interestArea={event.ministry ?? event.title}
                        supportNeeded={event.supportNeeded}
                        label="Volunteer"
                        variant="secondary"
                      />
                    ) : null}
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedEventId(event.id)}
                    >
                      Details
                    </Button>
                  </div>
                </div>
                <div className="hidden gap-2 sm:grid">
                  {event.requestVolunteers ? (
                    <InterestButton
                      sourceType="event"
                      sourceId={event.id}
                      sourceTitle={event.title}
                      interestArea={event.ministry ?? event.title}
                      supportNeeded={event.supportNeeded}
                      label="Volunteer"
                      variant="secondary"
                    />
                  ) : null}
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedEventId(event.id)}
                  >
                    Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedEvent ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-3 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="home-event-modal-title"
          onClick={() => setSelectedEventId(null)}
        >
          <Card className="max-h-[88vh] w-full max-w-2xl overflow-hidden" onClick={(event) => event.stopPropagation()}>
            <CardHeader className="border-b border-[var(--brand-border)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle id="home-event-modal-title">{selectedEvent.title}</CardTitle>
                  <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
                    {selectedEvent.description}
                  </p>
                </div>
                <button
                  type="button"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--brand-border)] text-[var(--brand-muted)] hover:bg-[var(--brand-soft)]"
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
