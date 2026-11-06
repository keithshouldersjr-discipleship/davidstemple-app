import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Snowflake } from "lucide-react";
import { formatStudyDate, jamesLessons, jamesSeries } from "@/lib/james-study-data";

const title = `${jamesSeries.title} | ${jamesSeries.eyebrow}`;

export const metadata: Metadata = {
  title,
  description: jamesSeries.description,
  alternates: { canonical: `https://davidstemple.app/${jamesSeries.slug}` },
  openGraph: {
    title,
    description: jamesSeries.description,
    url: `https://davidstemple.app/${jamesSeries.slug}`,
    type: "website",
    siteName: "David's Temple App",
  },
  twitter: { card: "summary_large_image", title, description: jamesSeries.description },
};

export default function JamesSeriesPage() {
  const lessons = [...jamesLessons].sort((a, b) => a.number - b.number);
  const latest = [...lessons].sort((a, b) => b.studyDate.localeCompare(a.studyDate))[0];

  return (
    <main>
      <section className="relative overflow-hidden bg-[var(--brand-navy)] text-white">
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-16 right-0 select-none font-serif text-[11rem] font-bold leading-none tracking-tight text-white/[0.05] sm:text-[17rem] lg:text-[20rem]"
        >
          James
        </span>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[var(--brand-burgundy)] via-[#c4405f] to-transparent"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/85">
            <Snowflake className="h-3.5 w-3.5 text-[#f2c4cf]" />
            {jamesSeries.eyebrow} · {jamesSeries.season}
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            {jamesSeries.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
            {jamesSeries.description}
          </p>
          {latest ? (
            <Link
              href={`/${jamesSeries.slug}/${latest.number}`}
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--brand-burgundy)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:bg-[#a20b31]"
            >
              Open Lesson {latest.number}: {latest.title} <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(17rem,.55fr)]">
          <div>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-burgundy)]">
                  Lessons
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-[var(--brand-navy)]">
                  Read ahead, then come ready to talk
                </h2>
              </div>
              <CalendarDays className="hidden h-7 w-7 text-[var(--brand-burgundy)] sm:block" />
            </div>

            <div className="space-y-4">
              {lessons.map((lesson) => (
                <Link
                  key={lesson.number}
                  href={`/${jamesSeries.slug}/${lesson.number}`}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 rounded-3xl border border-[var(--brand-border)] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--brand-burgundy)]/35 hover:shadow-md sm:p-6"
                >
                  <span className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-[var(--brand-navy)] text-white">
                    <span className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-white/60">Lesson</span>
                    <span className="font-serif text-2xl font-bold leading-none">{lesson.number}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-burgundy)]">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <time dateTime={lesson.studyDate}>{formatStudyDate(lesson.studyDate)}</time>
                      </span>
                    </span>
                    <span className="mt-1.5 block text-xl font-semibold text-[var(--brand-navy)] sm:text-2xl">
                      {lesson.title}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5 text-sm text-[var(--brand-muted)]">
                      <BookOpen className="h-3.5 w-3.5" /> {lesson.passage.reference}
                    </span>
                  </span>
                  <ArrowRight className="h-5 w-5 text-[var(--brand-muted)] transition group-hover:translate-x-1 group-hover:text-[var(--brand-burgundy)]" />
                </Link>
              ))}
            </div>

            <p className="mt-6 text-sm leading-6 text-[var(--brand-muted)]">
              New lessons are added here as the class moves through the book.
            </p>
          </div>

          <aside className="space-y-5">
            <div className="rounded-3xl border border-[var(--brand-border)] bg-white p-6 shadow-sm">
              <BookOpen className="h-7 w-7 text-[var(--brand-burgundy)]" />
              <h2 className="mt-4 text-xl font-semibold text-[var(--brand-navy)]">How to use these lessons</h2>
              <ol className="mt-4 space-y-4">
                {jamesSeries.howToUse.map((item, index) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--brand-muted)]">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-burgundy-soft)] text-xs font-bold text-[var(--brand-burgundy)]">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
