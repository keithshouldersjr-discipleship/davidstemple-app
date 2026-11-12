import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Footprints,
  MessageCircleQuestion,
} from "lucide-react";
import { LessonInline, LessonParagraphs } from "@/components/bible-study/lesson-rich-text";
import { PrintLessonButton } from "@/components/bible-study/print-lesson-button";
import {
  formatStudyDate,
  getAdjacentJamesLessons,
  getJamesLesson,
  jamesLessons,
  jamesSeries,
} from "@/lib/james-study-data";

type LessonPageProps = {
  params: Promise<{ lesson: string }>;
};

export function generateStaticParams() {
  return jamesLessons.map((lesson) => ({ lesson: String(lesson.number) }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { lesson: lessonParam } = await params;
  const lesson = getJamesLesson(lessonParam);

  if (!lesson) return {};

  const title = `Lesson ${lesson.number}: ${lesson.title} | ${jamesSeries.title}`;
  const description = `${lesson.passage.reference} · We discuss this lesson ${formatStudyDate(lesson.studyDate)}. ${lesson.overview}`;
  const url = `https://davidstemple.app/${jamesSeries.slug}/${lesson.number}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", siteName: "David's Temple App" },
    twitter: { card: "summary_large_image", title, description },
  };
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-burgundy)]">
      <span className="h-px w-6 bg-[var(--brand-burgundy)]/50" aria-hidden />
      {children}
    </p>
  );
}

export default async function JamesLessonPage({ params }: LessonPageProps) {
  const { lesson: lessonParam } = await params;
  const lesson = getJamesLesson(lessonParam);

  if (!lesson) notFound();

  const { previous, next } = getAdjacentJamesLessons(lesson.number);
  const studyDate = formatStudyDate(lesson.studyDate);
  const lessonLabel = String(lesson.number).padStart(2, "0");
  const notices = lesson.scriptureNotices ?? [jamesSeries.scriptureNotice];
  const lessonPath = `davidstemple.app/${jamesSeries.slug}/${lesson.number}`;
  const pdfTitle = `${jamesSeries.title} - Lesson ${lesson.number} - ${lesson.title}`;

  return (
    <main className="james-lesson pb-16">
      {/* ── Header ─────────────────────────────────────────────── */}
      <section aria-label="Lesson details" className="james-lesson-header relative overflow-hidden bg-[var(--brand-navy)] text-white">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-10 select-none font-serif text-[16rem] font-bold leading-none text-white/[0.05] sm:-right-2 sm:text-[22rem]"
        >
          {lessonLabel}
        </span>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[var(--brand-burgundy)] via-[#c4405f] to-transparent"
        />

        <div className="relative mx-auto max-w-3xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
          <p className="james-print-only text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/70">
            David&rsquo;s Temple Missionary Baptist Church · {jamesSeries.eyebrow}
          </p>
          <Link
            href={`/${jamesSeries.slug}`}
            className="james-no-print inline-flex items-center gap-2 text-sm font-medium text-white/75 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> {jamesSeries.title}
          </Link>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[var(--brand-burgundy)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]">
              Lesson {lesson.number}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f2c4cf]">
              {jamesSeries.title}
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
            {lesson.title}
          </h1>
          <p className="mt-4 flex items-center gap-2 text-lg text-[#f2c4cf]">
            <BookOpen className="h-5 w-5 shrink-0" />
            {lesson.passage.reference}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="james-study-date inline-flex items-center gap-4 rounded-2xl border border-white/15 bg-white/[0.07] py-3 pl-3 pr-5 backdrop-blur">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--brand-navy)]">
                <CalendarDays className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/60">
                  Study date
                </span>
                <time dateTime={lesson.studyDate} className="block text-base font-semibold sm:text-lg">
                  {studyDate}
                </time>
              </span>
            </div>
            <PrintLessonButton
              documentTitle={pdfTitle}
              className="min-h-11 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-white transition hover:bg-white/20"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-12 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* ── Scripture ───────────────────────────────────────── */}
        <section
          aria-label={`${lesson.passage.reference} (${lesson.passage.translation})`}
          className="james-avoid-break relative overflow-hidden rounded-3xl border border-[var(--brand-border)] bg-white p-6 shadow-sm sm:p-9"
        >
          <span
            aria-hidden
            className="james-no-print pointer-events-none absolute right-5 top-14 select-none font-serif text-[10rem] leading-none text-[var(--brand-burgundy)]/[0.07] sm:right-8"
          >
            “
          </span>
          <div className="relative flex items-baseline justify-between gap-4 border-b border-[var(--brand-border)] pb-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-navy)]">
              {lesson.passage.reference}
            </p>
            <p className="text-xs font-semibold tracking-[0.18em] text-[var(--brand-muted)]">
              {lesson.passage.translation}
            </p>
          </div>
          <p className="james-scripture relative mt-5 font-serif text-lg leading-9 text-[var(--brand-text)] sm:text-xl sm:leading-10">
            {lesson.passage.verses.map((verse) => (
              <span key={verse.number}>
                <sup className="mr-1 font-sans text-[0.65rem] font-bold text-[var(--brand-burgundy)]">
                  {verse.number}
                </sup>
                {verse.text}{" "}
              </span>
            ))}
          </p>
        </section>

        {/* ── Overview ────────────────────────────────────────── */}
        <section className="james-avoid-break space-y-4">
          <SectionLabel>Overview</SectionLabel>
          <LessonParagraphs
            text={lesson.overview}
            className="james-overview text-xl leading-9 text-[var(--brand-navy)] sm:text-[1.35rem] sm:leading-10"
          />
          {lesson.keyIdea ? (
            <blockquote className="james-key-idea mt-2 border-l-4 border-[var(--brand-burgundy)] bg-[var(--brand-burgundy-soft)] py-5 pl-6 pr-5 font-serif text-xl font-semibold leading-8 text-[var(--brand-navy)] sm:text-2xl sm:leading-9">
              <LessonInline text={lesson.keyIdea} />
            </blockquote>
          ) : null}
        </section>

        {/* ── Outline ─────────────────────────────────────────── */}
        <section className="james-outline space-y-6">
          <SectionLabel>Outline</SectionLabel>

          <nav
            aria-label="Lesson outline"
            className="james-no-print grid gap-2 rounded-2xl bg-[var(--brand-soft)] p-2 sm:grid-cols-3"
          >
            {lesson.outline.map((point, index) => (
              <a
                key={point.heading}
                href={`#point-${index + 1}`}
                className="group rounded-xl px-4 py-3 transition hover:bg-white hover:shadow-sm"
              >
                <span className="text-xs font-bold text-[var(--brand-burgundy)]">{index + 1}.</span>{" "}
                <span className="text-sm font-semibold text-[var(--brand-navy)]">{point.heading}</span>
                <span className="mt-0.5 block text-xs text-[var(--brand-muted)]">{point.reference}</span>
              </a>
            ))}
          </nav>

          <ol className="space-y-8">
            {lesson.outline.map((point, index) => (
              <li
                key={point.heading}
                id={`point-${index + 1}`}
                className="james-point scroll-mt-28 rounded-3xl border border-[var(--brand-border)] bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="flex items-start gap-4 sm:gap-5">
                  <span
                    aria-hidden
                    className="font-serif text-5xl font-bold leading-none text-[var(--brand-burgundy)] sm:text-6xl"
                  >
                    {index + 1}
                  </span>
                  <div className="pt-1">
                    <h2 className="text-2xl font-semibold leading-tight text-[var(--brand-navy)] sm:text-[1.7rem]">
                      <span className="sr-only">{index + 1}. </span>
                      {point.heading}
                    </h2>
                    <p className="mt-1.5 text-sm font-semibold text-[var(--brand-muted)]">
                      ({point.reference})
                    </p>
                  </div>
                </div>

                <div className="james-point-body mt-6 space-y-5">
                  <LessonParagraphs
                    text={point.body}
                    className="text-base leading-8 text-[var(--brand-text)] sm:text-[1.05rem]"
                  />
                </div>

                <div className="james-panels mt-7 grid gap-4 md:grid-cols-[1.15fr_1fr]">
                  <div className="james-avoid-break rounded-2xl bg-[var(--brand-soft)] p-5">
                    <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--brand-navy)]">
                      <MessageCircleQuestion className="h-4 w-4 text-[var(--brand-burgundy)]" /> Reflection
                    </h3>
                    <ul className="mt-4 space-y-3.5">
                      {point.reflection.map((question) => (
                        <li key={question} className="flex gap-3 text-[0.95rem] leading-7 text-[var(--brand-text)]">
                          <span aria-hidden className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-navy)]/40" />
                          <span>
                            <LessonInline text={question} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="james-avoid-break rounded-2xl bg-[var(--brand-burgundy-soft)] p-5">
                    <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--brand-burgundy)]">
                      <Footprints className="h-4 w-4" /> Application
                    </h3>
                    <ul className="mt-4 space-y-3.5">
                      {point.application.map((step) => (
                        <li key={step} className="flex gap-3 text-[0.95rem] leading-7 text-[var(--brand-text)]">
                          <CheckCircle2 className="mt-1.5 h-4 w-4 shrink-0 text-[var(--brand-burgundy)]" />
                          <span>
                            <LessonInline text={step} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Conclusion ──────────────────────────────────────── */}
        <section className="james-conclusion james-avoid-break relative overflow-hidden rounded-3xl bg-[var(--brand-navy)] p-7 text-white sm:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[var(--brand-burgundy)]/30 blur-3xl"
          />
          <p className="relative text-xs font-semibold uppercase tracking-[0.22em] text-[#f2c4cf]">Conclusion</p>
          <LessonParagraphs
            text={lesson.conclusion}
            className="james-conclusion-text relative mt-4 font-serif text-xl leading-9 sm:text-2xl sm:leading-[2.6rem]"
          />
          {lesson.conclusionScripture ? (
            <figure className="james-conclusion-scripture relative mt-7 border-t border-white/15 pt-6">
              <blockquote className="font-serif text-lg italic leading-8 text-white/90 sm:text-xl sm:leading-9">
                {lesson.conclusionScripture.text}
              </blockquote>
              <figcaption className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#f2c4cf]">
                {lesson.conclusionScripture.reference} ({lesson.conclusionScripture.translation})
              </figcaption>
            </figure>
          ) : null}
        </section>

        {/* ── Next Steps ──────────────────────────────────────── */}
        <section className="james-avoid-break space-y-4">
          <SectionLabel>Next Steps</SectionLabel>
          <ul className="divide-y divide-[var(--brand-border)] overflow-hidden rounded-2xl border border-[var(--brand-border)] bg-white">
            {lesson.nextSteps.map((step) => (
              <li key={step} className="flex items-start gap-3 p-5 text-base leading-7 text-[var(--brand-text)]">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[var(--brand-burgundy)]" />
                <span>
                  <LessonInline text={step} />
                </span>
              </li>
            ))}
            {lesson.nextLessonPassage ? (
              <li className="flex items-start gap-3 bg-[var(--brand-soft)] p-5 text-base leading-7 text-[var(--brand-navy)]">
                <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-[var(--brand-burgundy)]" />
                <span>
                  <span className="font-semibold">Next Lesson:</span> {lesson.nextLessonPassage}
                </span>
              </li>
            ) : null}
          </ul>
        </section>

        <div className="james-no-print flex flex-col items-start gap-4 rounded-2xl border border-dashed border-[var(--brand-border)] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-[var(--brand-muted)]">
            <span className="block font-semibold text-[var(--brand-navy)]">Want a paper copy for class?</span>
            Print this lesson or save it as a PDF. It&rsquo;s formatted as a clean handout.
          </p>
          <PrintLessonButton
            documentTitle={pdfTitle}
            className="min-h-11 shrink-0 rounded-full bg-[var(--brand-burgundy)] px-5 py-2.5 text-white transition hover:bg-[#a20b31]"
          />
        </div>

        <div className="james-notices space-y-2 border-t border-[var(--brand-border)] pt-6 text-xs leading-5 text-[var(--brand-muted)]">
          {notices.map((notice) => (
            <p key={notice}>{notice}</p>
          ))}
          <p className="james-print-only pt-2 font-semibold text-[var(--brand-navy)]">
            Read online at {lessonPath}
          </p>
        </div>

        <nav className="james-no-print grid gap-3 sm:grid-cols-2" aria-label="Lesson navigation">
          {previous ? (
            <Link
              href={`/${jamesSeries.slug}/${previous.number}`}
              className="rounded-2xl border border-[var(--brand-border)] bg-white p-4 transition hover:border-[var(--brand-burgundy)]/35"
            >
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-muted)]">
                <ArrowLeft className="h-3.5 w-3.5" /> Previous
              </span>
              <span className="mt-2 block font-semibold text-[var(--brand-navy)]">
                Lesson {previous.number}: {previous.title}
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next ? (
            <Link
              href={`/${jamesSeries.slug}/${next.number}`}
              className="rounded-2xl border border-[var(--brand-border)] bg-white p-4 text-right transition hover:border-[var(--brand-burgundy)]/35"
            >
              <span className="flex items-center justify-end gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-muted)]">
                Next <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <span className="mt-2 block font-semibold text-[var(--brand-navy)]">
                Lesson {next.number}: {next.title}
              </span>
            </Link>
          ) : (
            <Link
              href={`/${jamesSeries.slug}`}
              className="flex items-center justify-end gap-2 rounded-2xl border border-[var(--brand-border)] bg-white p-4 text-right font-semibold text-[var(--brand-navy)] transition hover:border-[var(--brand-burgundy)]/35"
            >
              All {jamesSeries.title} lessons <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}
