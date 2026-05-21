import Link from "next/link";
import { CalendarDays, MessageCircle } from "lucide-react";
import { ChatPanel } from "@/components/assistant/chat-panel";
import { ResourceCard } from "@/components/resources/resource-card";
import { Button } from "@/components/ui/button";
import { events, resources } from "@/lib/mock-data";
import type { Event } from "@/lib/types";

function parseEventDate(event: Event) {
  const parsed = new Date(`${event.date} 12:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getEventsWithinDays(days: number) {
  const today = new Date("2026-05-21T00:00:00");
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + days);

  return events
    .map((event) => ({ event, date: parseEventDate(event) }))
    .filter(
      (item): item is { event: Event; date: Date } =>
        item.date !== null && item.date >= today && item.date <= endDate,
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
}

function formatDay(date: Date) {
  return new Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(date);
}

export default function Home() {
  const featuredResources = resources.slice(0, 6);
  const upcomingEvents = getEventsWithinDays(90);

  return (
    <main>
      <section className="relative overflow-hidden bg-[var(--brand-navy)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_28rem)]" />
        <div className="pointer-events-none absolute -right-12 top-12 text-[18rem] font-bold leading-none text-white/[0.035] sm:text-[26rem]">
          +
        </div>
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-[1fr_0.86fr] md:items-center lg:px-8 lg:py-14">
          <div className="space-y-8">
            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-6xl">
                Ask. Find. Stay connected.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-white/80">
                A simple digital hub for David&apos;s Temple members, visitors, and ministry
                leaders.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/ask">
                <Button size="lg">
                  <MessageCircle className="h-5 w-5" />
                  Ask a question
                </Button>
              </Link>
            </div>
          </div>
          <ChatPanel compact />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-[var(--brand-burgundy)]">
              Next 90 Days
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--brand-navy)]">
              Upcoming at David&apos;s Temple
            </h2>
          </div>
          <Link href="/events" className="hidden text-sm font-medium text-[var(--brand-burgundy)] sm:inline-flex">
            View full calendar
          </Link>
        </div>
        <div className="overflow-hidden rounded-3xl border border-[var(--brand-border)] bg-white shadow-sm shadow-slate-900/5">
          <div className="border-b border-[var(--brand-border)] bg-[var(--brand-soft)] px-5 py-4">
            <div className="flex items-center gap-3 text-[var(--brand-navy)]">
              <CalendarDays className="h-5 w-5 text-[var(--brand-burgundy)]" />
              <p className="font-semibold">Calendar preview</p>
            </div>
          </div>
          <div className="grid gap-0 divide-y divide-[var(--brand-border)]">
            {upcomingEvents.map(({ event, date }) => (
              <Link
                key={event.id}
                href="/events"
                className="grid grid-cols-[4.5rem_1fr] gap-4 p-4 transition hover:bg-[var(--brand-soft)] sm:grid-cols-[5.25rem_1fr_auto] sm:items-center"
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
                  <p className="font-semibold text-[var(--brand-navy)]">{event.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--brand-muted)]">
                    {event.time} · {event.location}
                  </p>
                </div>
                <span className="hidden rounded-full border border-[var(--brand-border)] px-4 py-2 text-sm font-medium text-[var(--brand-muted)] sm:inline-flex">
                  Details
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-[var(--brand-burgundy)]">
              Helpful Links
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--brand-navy)]">
              Resources at a glance
            </h2>
          </div>
          <Link href="/resources" className="hidden text-sm font-medium text-[var(--brand-burgundy)] sm:inline-flex">
            View all resources
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </section>
    </main>
  );
}
