import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { HomeEventsPreview } from "@/components/events/home-events-preview";
import { AskQuestionButton } from "@/components/home/ask-question-button";
import { PlanVisitButton } from "@/components/home/plan-visit-button";
import { ResourceCard } from "@/components/resources/resource-card";
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
        <HomeEventsPreview events={upcomingEvents.map(({ event }) => event)} />
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
