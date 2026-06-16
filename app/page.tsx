import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronDown, Mail, Phone, UserRound } from "lucide-react";
import { InterestButton } from "@/components/connect/interest-button";
import { EventRequestButton } from "@/components/events/event-request-button";
import { AskQuestionButton } from "@/components/home/ask-question-button";
import { PlanVisitButton } from "@/components/home/plan-visit-button";
import { ResourceCard } from "@/components/resources/resource-card";
import { Button } from "@/components/ui/button";
import { getEvents } from "@/lib/data";
import { resources } from "@/lib/mock-data";
import type { Event } from "@/lib/types";

export const revalidate = 300;

function parseEventDate(event: Event) {
  const parsed = new Date(`${event.date} 12:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getEventsWithinDays(events: Event[], days: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
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

function cleanPhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

export default async function Home() {
  const events = await getEvents();
  const featuredResources = resources.filter((resource) => resource.isActive).sort((a, b) => a.sortOrder - b.sortOrder).slice(0, 6);
  const upcomingEvents = getEventsWithinDays(events, 90);
  const churchLifePhotos = [
    {
      src: "/church-life/fellowship-outside.png",
      title: "Fellowship",
      className: "sm:col-span-2",
    },
    {
      src: "/church-life/youth-craft-table.png",
      title: "Youth",
      className: "",
    },
    {
      src: "/church-life/children-playing.png",
      title: "Families",
      className: "",
    },
  ];

  return (
    <main>
      <section className="relative overflow-hidden bg-[var(--brand-navy)]">
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-[0.96fr_1.04fr] md:items-center lg:px-8 lg:py-12">
          <div className="space-y-7">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/70">
              David&apos;s Temple Missionary Baptist Church
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Evangelizing, equipping, and empowering believers to the glory of God.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-white/80">
              Find service times, upcoming events, ministry contacts, and clear next steps for getting connected.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <details className="group rounded-2xl border border-white/20 bg-white/10 text-white">
                <summary className="flex h-12 cursor-pointer list-none items-center justify-between gap-3 px-5 text-sm font-semibold marker:hidden">
                  Service Times
                  <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                </summary>
                <div className="grid gap-3 border-t border-white/15 px-5 py-4 text-sm text-white/84">
                  <p className="flex items-center justify-between gap-4">
                    <span>Sunday School</span>
                    <span className="font-semibold text-white">8:30 AM</span>
                  </p>
                  <p className="flex items-center justify-between gap-4">
                    <span>Morning Worship</span>
                    <span className="font-semibold text-white">9:30 AM</span>
                  </p>
                  <p className="flex items-center justify-between gap-4">
                    <span>Bible Study</span>
                    <span className="font-semibold text-white">11:00 AM & 6:00 PM</span>
                  </p>
                </div>
              </details>
              <PlanVisitButton />
              <AskQuestionButton />
            </div>
          </div>
          <div className="grid min-h-[22rem] grid-cols-2 gap-3 sm:min-h-[30rem]">
            <div
              className="col-span-2 rounded-3xl bg-cover bg-center shadow-2xl shadow-slate-950/30 sm:col-span-1 sm:row-span-2"
              style={{ backgroundImage: "url('/church-life/fellowship-outside.png')" }}
              aria-label="David's Temple members fellowshipping outside"
            />
            <div
              className="rounded-3xl bg-cover bg-center shadow-xl shadow-slate-950/24"
              style={{ backgroundImage: "url('/church-life/welcome-gift.png')" }}
              aria-label="David's Temple welcoming a young member"
            />
            <div
              className="rounded-3xl bg-cover bg-center shadow-xl shadow-slate-950/24"
              style={{ backgroundImage: "url('/church-life/youth-smiling.png')" }}
              aria-label="David's Temple youth smiling"
            />
          </div>
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
        </div>
        <div className="overflow-hidden rounded-3xl border border-[var(--brand-border)] bg-white shadow-sm shadow-slate-900/5">
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
          <div className="max-h-[26rem] overflow-y-auto overscroll-contain scroll-smooth divide-y divide-[var(--brand-border)]">
            {upcomingEvents.map(({ event, date }) => (
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
                  {event.supportNeeded?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {event.supportNeeded.map((item) => (
                        <span key={item} className="rounded-full border border-[var(--brand-border)] bg-white px-3 py-1 text-xs font-medium text-[var(--brand-navy)]">
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="hidden gap-2 sm:grid">
                  <InterestButton
                    sourceType="event"
                    sourceId={event.id}
                    sourceTitle={event.title}
                    interestArea={event.ministry ?? event.title}
                    supportNeeded={event.supportNeeded}
                    label="Volunteer"
                    variant="secondary"
                  />
                  <Link href="/events" className="rounded-full border border-[var(--brand-border)] px-4 py-2 text-center text-sm font-medium text-[var(--brand-muted)] transition hover:border-[var(--brand-burgundy)]/35 hover:bg-white">
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="mb-6 max-w-3xl space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-[var(--brand-burgundy)]">
              Church Life
            </p>
            <h2 className="text-3xl font-semibold text-[var(--brand-navy)]">
              A place to worship, grow, and belong
            </h2>
          </div>
          <div className="grid auto-rows-[14rem] gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {churchLifePhotos.map((photo) => (
              <div
                key={photo.src}
                className={`relative overflow-hidden rounded-3xl bg-cover bg-center shadow-sm shadow-slate-900/8 ${photo.className}`}
                style={{ backgroundImage: `url('${photo.src}')` }}
                aria-label={`David's Temple ${photo.title.toLowerCase()}`}
              >
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 to-transparent p-4">
                  <p className="font-semibold text-white">{photo.title}</p>
                </div>
              </div>
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
          <Link
            href="/resources"
            className="hidden text-sm font-medium text-[var(--brand-burgundy)] sm:inline-flex"
          >
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
