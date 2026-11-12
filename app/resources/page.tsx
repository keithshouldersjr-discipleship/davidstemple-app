import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays } from "lucide-react";
import { ResourceGrid } from "@/components/resources/resource-grid";
import { formatStudyDate, getFeaturedJamesLesson, jamesSeries } from "@/lib/james-study-data";
import { resources } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Church Resources | David's Temple",
  description:
    "Bible study materials, church information, care resources, ministry updates, and helpful links from David's Temple Missionary Baptist Church.",
};

export default function ResourcesPage() {
  const featuredLesson = getFeaturedJamesLesson();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-[var(--brand-burgundy)]">
          Resources
        </p>
        <h1 className="text-4xl font-semibold text-[var(--brand-navy)]">Resources for your growing</h1>
        <p className="text-lg leading-8 text-[var(--brand-muted)]">
          Prepare for Bible study, find helpful church information, and take your next step in worship, growth, service, or care.
        </p>
      </div>

      <section
        aria-labelledby="featured-study-title"
        className="relative mb-12 overflow-hidden rounded-[2rem] bg-[var(--brand-navy)] text-white shadow-xl shadow-[#002F5F]/10"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[var(--brand-burgundy)] via-[#c4405f] to-transparent"
        />
        <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_19rem]">
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#f2c4cf]">
              <BookOpen className="h-4 w-4" /> Featured Bible study
            </p>
            <h2 id="featured-study-title" className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
              {jamesSeries.title}
            </h2>
            <p className="mt-3 text-lg leading-7 text-[#f2c4cf]">
              {jamesSeries.eyebrow} · {jamesSeries.season}
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
              {jamesSeries.description}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {featuredLesson ? (
                <Link
                  href={`/${jamesSeries.slug}/${featuredLesson.number}`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--brand-burgundy)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a20b31]"
                >
                  Open Lesson {featuredLesson.number} <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
              <Link
                href={`/${jamesSeries.slug}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                See all lessons
              </Link>
            </div>
          </div>

          {featuredLesson ? (
            <Link
              href={`/${jamesSeries.slug}/${featuredLesson.number}`}
              className="group relative flex flex-col justify-end overflow-hidden border-t border-white/10 bg-[#0a3d73] p-6 transition hover:bg-[#0d4580] sm:p-8 md:border-l md:border-t-0"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-4 -top-6 select-none font-serif text-[9rem] font-bold leading-none text-white/[0.06]"
              >
                {String(featuredLesson.number).padStart(2, "0")}
              </span>
              <span className="relative text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                This week&rsquo;s lesson
              </span>
              <span className="relative mt-3 block font-serif text-2xl font-semibold leading-snug">
                {featuredLesson.title}
              </span>
              <span className="relative mt-2 flex items-center gap-2 text-sm text-[#f2c4cf]">
                <BookOpen className="h-4 w-4 shrink-0" /> {featuredLesson.passage.reference}
              </span>
              <span className="relative mt-5 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.07] p-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--brand-navy)]">
                  <CalendarDays className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/60">
                    Study date
                  </span>
                  <time dateTime={featuredLesson.studyDate} className="block text-sm font-semibold">
                    {formatStudyDate(featuredLesson.studyDate)}
                  </time>
                </span>
              </span>
            </Link>
          ) : null}
        </div>
      </section>

      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--brand-burgundy)]">
          All church resources
        </p>
      </div>
      <ResourceGrid resources={resources} />
    </main>
  );
}
