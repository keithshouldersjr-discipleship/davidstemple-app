"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Mail, Phone, UserRound } from "lucide-react";
import { InterestButton } from "@/components/connect/interest-button";
import { AddToCalendarButton } from "@/components/events/add-to-calendar-button";
import { EventRequestButton } from "@/components/events/event-request-button";
import { Button } from "@/components/ui/button";
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
  return (
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
                    <AddToCalendarButton event={event} />
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
                  <AddToCalendarButton event={event} />
                </div>
              </div>
            );
          })}
        </div>
    </div>
  );
}
