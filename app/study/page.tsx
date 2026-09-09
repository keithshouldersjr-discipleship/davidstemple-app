import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Download, Sparkles } from "lucide-react";
import { bibleStudy, studyLessons } from "@/lib/bible-study-data";

export const metadata: Metadata = {
  title: `${bibleStudy.title}: ${bibleStudy.subtitle}`,
  description: bibleStudy.description,
  openGraph: {
    title: `${bibleStudy.title}: ${bibleStudy.subtitle}`,
    description: bibleStudy.description,
    url: "https://davidstemple.app/study",
    type: "article",
    images: [
      {
        url: bibleStudy.coverUrl,
        width: 1224,
        height: 1584,
        alt: `${bibleStudy.title} Bible study cover`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${bibleStudy.title}: ${bibleStudy.subtitle}`,
    description: bibleStudy.description,
    images: [bibleStudy.coverUrl],
  },
};

export default function StudyPage() {
  return (
    <main>
      <section className="overflow-hidden bg-[var(--brand-navy)] text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1fr_19rem] lg:items-center lg:gap-14 lg:px-8 lg:py-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/85">
              <Sparkles className="h-3.5 w-3.5 text-[#f2c4cf]" />
              2026 Bible Study Series
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {bibleStudy.title}
            </h1>
            <p className="mt-4 max-w-2xl text-xl leading-8 text-[#f2c4cf] sm:text-2xl">
              {bibleStudy.subtitle}
            </p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              {bibleStudy.description}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/study/1"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--brand-burgundy)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:bg-[#a20b31]"
              >
                Begin Lesson 1 <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={bibleStudy.pdfUrl}
                download
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <Download className="h-4 w-4" /> Download full study guide
              </a>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[17rem] lg:max-w-none">
            <div className="rotate-1 overflow-hidden rounded-2xl bg-[#f1eadb] p-2 shadow-2xl shadow-black/25">
              <Image
                src={bibleStudy.coverUrl}
                alt={`${bibleStudy.title} study guide cover`}
                width={1224}
                height={1584}
                priority
                className="h-auto w-full rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(17rem,.55fr)]">
          <div>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-burgundy)]">
                  Weekly lessons
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-[var(--brand-navy)]">
                  Prepare one lesson at a time
                </h2>
              </div>
              <CalendarDays className="hidden h-7 w-7 text-[var(--brand-burgundy)] sm:block" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {studyLessons.map((lesson) => (
                <Link
                  key={lesson.number}
                  href={`/study/${lesson.number}`}
                  className="group rounded-3xl border border-[var(--brand-border)] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--brand-burgundy)]/35 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-navy)] text-sm font-bold text-white">
                      {lesson.number}
                    </span>
                    <ArrowRight className="mt-2 h-4 w-4 text-[var(--brand-muted)] transition group-hover:translate-x-1 group-hover:text-[var(--brand-burgundy)]" />
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-burgundy)]">
                    {lesson.date}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[var(--brand-navy)]">
                    {lesson.topic}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--brand-muted)]">
                    {lesson.scripture}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-3xl border border-[var(--brand-border)] bg-white p-6 shadow-sm">
              <BookOpen className="h-7 w-7 text-[var(--brand-burgundy)]" />
              <h2 className="mt-4 text-xl font-semibold text-[var(--brand-navy)]">How to prepare</h2>
              <ol className="mt-4 space-y-4">
                {bibleStudy.howToPrepare.map((item, index) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--brand-muted)]">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-burgundy-soft)] text-xs font-bold text-[var(--brand-burgundy)]">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>

            <blockquote className="rounded-3xl bg-[var(--brand-burgundy-soft)] p-6 text-[var(--brand-burgundy)]">
              <p className="text-sm font-semibold uppercase tracking-[0.16em]">Opening prayer</p>
              <p className="mt-3 text-base leading-7">{bibleStudy.openingPrayer}</p>
            </blockquote>
          </aside>
        </div>
      </section>
    </main>
  );
}
