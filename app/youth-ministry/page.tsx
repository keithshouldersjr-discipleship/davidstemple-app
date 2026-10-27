import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, BarChart3, BookOpenCheck, CalendarDays, ClipboardCheck, GraduationCap, LockKeyhole, Megaphone } from "lucide-react";
import { ScheduleTable } from "@/components/youth-ministry/schedule-table";
import { teachingSchedules, youthMinistryAnnouncements } from "@/content/youth-ministry";

export const metadata: Metadata = {
  title: "Youth Ministry | David's Temple",
  description:
    "Youth ministry teaching schedules and Christian Education announcements at David's Temple Missionary Baptist Church.",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export default function YouthMinistryPage() {
  return (
    <main>
      <section className="overflow-hidden bg-[var(--brand-navy)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:items-center lg:px-8 lg:py-12">
          <div className="space-y-6">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/70">
              Christian Education • Youth Ministry
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Growing young disciples with care and purpose.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-white/80">
              A central place for teaching assignments and ministry updates, helping our team prepare well, care for every age group, and build a consistent place for young people to learn and belong.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="#teaching-schedule" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--brand-burgundy)] px-6 text-sm font-semibold !text-white shadow-lg shadow-slate-950/20 transition hover:bg-[#700019] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                View teaching schedule
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="#announcements" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/45 bg-white/10 px-6 text-sm font-semibold !text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Ministry announcements
              </a>
              <Link href="/youth-ministry/attendance" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/45 bg-white/10 px-6 text-sm font-semibold !text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Teacher tools
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="relative min-h-72 overflow-hidden rounded-3xl shadow-2xl shadow-slate-950/30 sm:min-h-96">
            <Image
              src="/church-life/children-and-youth.png"
              alt="Children and youth gathered at David's Temple"
              fill
              priority
              sizes="(min-width: 768px) 44vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-navy)]/65 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/75">Our shared calling</p>
              <p className="mt-2 max-w-md text-lg font-semibold leading-7">Teach the Word. Know every child. Build a ministry where families can flourish.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="announcements" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 max-w-3xl space-y-3">
            <p className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.22em] text-[var(--brand-burgundy)]">
              <Megaphone className="h-4 w-4" aria-hidden="true" />
              Announcements
            </p>
            <h2 className="text-3xl font-semibold text-[var(--brand-navy)]">What the youth ministry team needs to know</h2>
            <p className="text-base leading-7 text-[var(--brand-muted)]">Schedule changes, classroom needs, training reminders, and other Christian Education updates will be shared here.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {youthMinistryAnnouncements.map((announcement) => (
              <article key={announcement.id} className="rounded-3xl border border-[var(--brand-burgundy)]/15 bg-[var(--brand-burgundy-soft)] p-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand-burgundy)]">Ministry update</span>
                  <time dateTime={announcement.startDate} className="text-xs font-medium text-[var(--brand-muted)]">{formatDate(announcement.startDate)}</time>
                </div>
                <h3 className="text-xl font-semibold text-[var(--brand-navy)]">{announcement.title}</h3>
                <p className="mt-3 leading-7 text-[var(--brand-text)]">{announcement.body}</p>
              </article>
            ))}
            <div className="rounded-3xl border border-dashed border-[var(--brand-navy)]/25 bg-[var(--brand-soft)] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand-navy)]/65">This is your ministry noticeboard</p>
              <h3 className="mt-3 text-xl font-semibold text-[var(--brand-navy)]">One dependable place for future updates</h3>
              <p className="mt-3 leading-7 text-[var(--brand-muted)]">New announcements can be added here as the Christian Education ministry grows and the team’s needs change.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="ministry-tools" className="scroll-mt-24 bg-[var(--brand-soft)]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-7 max-w-3xl space-y-3">
            <p className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.22em] text-[var(--brand-burgundy)]">
              <LockKeyhole className="h-4 w-4" aria-hidden="true" />
              Teacher & leader tools
            </p>
            <h2 className="text-3xl font-semibold text-[var(--brand-navy)]">Care for the class and see the impact</h2>
            <p className="text-base leading-7 text-[var(--brand-muted)]">Sign in with your Watch Care church account. Teachers see the classes assigned to them, while pastors and administrators can support the whole ministry.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Link href="/youth-ministry/attendance" className="group rounded-3xl border border-[var(--brand-border)] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--brand-burgundy)]/35 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-burgundy-soft)] text-[var(--brand-burgundy)]"><ClipboardCheck className="h-6 w-6" aria-hidden="true" /></div>
              <h3 className="mt-5 text-xl font-semibold text-[var(--brand-navy)]">Take weekly attendance</h3>
              <p className="mt-3 leading-7 text-[var(--brand-muted)]">Mark enrolled students present, add visitors, and save directly into the same shared record used by Watch Care.</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-burgundy)]">Open attendance <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" /></span>
            </Link>
            <Link href="/youth-ministry/reports" className="group rounded-3xl border border-[var(--brand-border)] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--brand-burgundy)]/35 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-burgundy-soft)] text-[var(--brand-burgundy)]"><BarChart3 className="h-6 w-6" aria-hidden="true" /></div>
              <h3 className="mt-5 text-xl font-semibold text-[var(--brand-navy)]">View ministry reports</h3>
              <p className="mt-3 leading-7 text-[var(--brand-muted)]">Follow Week 1 through Week 4 each month and celebrate a full year of learning moments, faithful classes, and welcomed visitors.</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-burgundy)]">See ministry impact <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" /></span>
            </Link>
          </div>
        </div>
      </section>

      <section id="teaching-schedule" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.22em] text-[var(--brand-burgundy)]">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                Teaching Schedule
              </p>
              <h2 className="text-3xl font-semibold text-[var(--brand-navy)]">Know where you are serving each week</h2>
              <p className="text-base leading-7 text-[var(--brand-muted)]">Assignments are tentative based on teacher input. Blank spaces mean that no teacher is currently listed in the source schedule.</p>
            </div>
            <nav aria-label="Teaching schedule sections" className="flex flex-wrap gap-2">
              {teachingSchedules.map((schedule) => (
                <a key={schedule.id} href={`#${schedule.id}`} className="rounded-full border border-[var(--brand-navy)]/15 bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-navy)] transition hover:border-[var(--brand-burgundy)]/35 hover:bg-[var(--brand-burgundy-soft)]">
                  {schedule.title}
                </a>
              ))}
            </nav>
          </div>
          <div className="grid gap-6">
            {teachingSchedules.map((schedule) => (
              <ScheduleTable key={schedule.id} schedule={schedule} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-[1fr_0.8fr] md:items-center lg:px-8">
          <div className="rounded-3xl border border-[var(--brand-border)] p-6 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-burgundy-soft)] text-[var(--brand-burgundy)]">
              <BookOpenCheck className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="mt-5 text-sm font-medium uppercase tracking-[0.18em] text-[var(--brand-burgundy)]">For our teachers</p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--brand-navy)]">Prepared teachers help create a caring ministry</h2>
            <p className="mt-3 leading-7 text-[var(--brand-muted)]">Review your assignment, communicate changes early, and help every student encounter Scripture in a class that is organized, welcoming, and ready for them.</p>
          </div>
          <div className="rounded-3xl bg-[var(--brand-navy)] p-6 text-white sm:p-8">
            <GraduationCap className="h-8 w-8 text-white/75" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-semibold">Want to support Youth Ministry?</h2>
            <p className="mt-3 leading-7 text-white/78">Explore the ministry page to connect with a leader and find a place to serve.</p>
            <Link href="/serve" className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold !text-[var(--brand-navy)] transition hover:bg-white/90">Join a ministry</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
