import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Download,
  Heart,
  MessageCircleQuestion,
} from "lucide-react";
import { HospitalityAssessment } from "@/components/bible-study/hospitality-assessment";
import { PreparationNotes } from "@/components/bible-study/preparation-notes";
import {
  bibleStudy,
  getLesson,
  lessonReview,
  sessionPlan,
  studyLessons,
} from "@/lib/bible-study-data";

type LessonPageProps = {
  params: Promise<{ lesson: string }>;
};

export function generateStaticParams() {
  return studyLessons.map((lesson) => ({ lesson: String(lesson.number) }));
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { lesson: lessonParam } = await params;
  const lesson = getLesson(lessonParam);

  if (!lesson) return {};

  const title = `Lesson ${lesson.number}: ${lesson.topic} | ${bibleStudy.title}`;
  const description = `${lesson.date}. Prepare for Bible study with the Scripture, overview, questions, reflection, and prayer for ${lesson.topic}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://davidstemple.app/study/${lesson.number}`,
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
      title,
      description,
      images: [bibleStudy.coverUrl],
    },
  };
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-4">
      {items.map((item, index) => (
        <li key={item} className="flex gap-3 text-base leading-7 text-[var(--brand-text)]">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand-navy)] text-xs font-bold text-white">
            {index + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lesson: lessonParam } = await params;
  const lesson = getLesson(lessonParam);

  if (!lesson) notFound();

  const previousLesson = getLesson(lesson.number - 1);
  const nextLesson = getLesson(lesson.number + 1);

  return (
    <main className="pb-14">
      <header className="border-b border-white/10 bg-[var(--brand-navy)] text-white">
        <div className="mx-auto max-w-4xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
          <Link
            href="/study"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/75 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> All lessons
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-[var(--brand-burgundy)] px-3 py-1.5 font-semibold text-white">
              Lesson {lesson.number} of {studyLessons.length}
            </span>
            <span className="inline-flex items-center gap-1.5 text-white/75">
              <CalendarDays className="h-4 w-4" /> {lesson.date}
            </span>
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">{lesson.topic}</h1>
          <p className="mt-4 flex max-w-3xl items-start gap-2 text-base leading-7 text-[#f2c4cf] sm:text-lg">
            <BookOpen className="mt-1 h-5 w-5 shrink-0" />
            <span>{lesson.scripture}</span>
          </p>
          <a
            href={bibleStudy.pdfUrl}
            download
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-white/35 underline-offset-4 hover:decoration-white"
          >
            <Download className="h-4 w-4" /> Download the complete guide
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-7 px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
        <section className="rounded-3xl border border-[var(--brand-border)] bg-white p-5 shadow-sm sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand-burgundy)]">Overview</p>
          <div className="mt-4 space-y-4 text-base leading-7 text-[var(--brand-text)]">
            {lesson.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>

          {lesson.keyIdeas ? (
            <div className="mt-7 rounded-2xl bg-[var(--brand-soft)] p-5">
              <h2 className="font-semibold text-[var(--brand-navy)]">
                {lesson.number === 6 ? "Our goals" : "Key ideas"}
              </h2>
              <ul className="mt-3 space-y-3">
                {lesson.keyIdeas.map((idea) => (
                  <li key={idea} className="flex gap-2.5 text-sm leading-6 text-[var(--brand-muted)]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-burgundy)]" /> {idea}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        {lesson.number === 1 ? <HospitalityAssessment /> : null}

        {lesson.number === 6 ? (
          <section className="rounded-3xl border border-[var(--brand-border)] bg-white p-5 shadow-sm sm:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand-burgundy)]">One-hour workshop</p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--brand-navy)]">Session plan</h2>
            <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--brand-border)]">
              {sessionPlan.map(([time, activity]) => (
                <div key={time} className="grid grid-cols-[6.5rem_1fr] border-b border-[var(--brand-border)] last:border-b-0">
                  <p className="bg-[var(--brand-soft)] px-4 py-3 text-sm font-semibold text-[var(--brand-navy)]">{time}</p>
                  <p className="px-4 py-3 text-sm text-[var(--brand-muted)]">{activity}</p>
                </div>
              ))}
            </div>

            <h3 className="mt-8 text-lg font-semibold text-[var(--brand-navy)]">Review what we learned</h3>
            <div className="mt-4 space-y-3">
              {lessonReview.map(([number, topic, idea]) => (
                <div key={number} className="grid gap-1 rounded-2xl bg-[var(--brand-soft)] p-4 sm:grid-cols-[9rem_1fr] sm:gap-4">
                  <p className="text-sm font-semibold text-[var(--brand-navy)]">Lesson {number}: {topic}</p>
                  <p className="text-sm leading-6 text-[var(--brand-muted)]">{idea}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="grid gap-7 lg:grid-cols-2">
          <div className="rounded-3xl border border-[var(--brand-border)] bg-white p-5 shadow-sm sm:p-7">
            <BookOpen className="h-7 w-7 text-[var(--brand-burgundy)]" />
            <h2 className="mt-4 text-2xl font-semibold text-[var(--brand-navy)]">Studying the text</h2>
            <div className="mt-5"><NumberedList items={lesson.studyQuestions} /></div>
          </div>

          <div className="rounded-3xl border border-[var(--brand-border)] bg-white p-5 shadow-sm sm:p-7">
            <MessageCircleQuestion className="h-7 w-7 text-[var(--brand-burgundy)]" />
            <h2 className="mt-4 text-2xl font-semibold text-[var(--brand-navy)]">Discussion</h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-[var(--brand-text)]">
              {lesson.discussion.map((item) => <p key={item}>{item}</p>)}
            </div>
          </div>
        </section>

        <PreparationNotes lessonNumber={lesson.number} prompts={lesson.reflection} />

        <blockquote className="rounded-3xl bg-[var(--brand-burgundy-soft)] p-6 text-[var(--brand-burgundy)] sm:p-7">
          <Heart className="h-7 w-7" />
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em]">Closing prayer</p>
          <p className="mt-3 text-lg leading-8">{lesson.prayer}</p>
        </blockquote>

        <nav className="grid gap-3 border-t border-[var(--brand-border)] pt-7 sm:grid-cols-2" aria-label="Lesson navigation">
          {previousLesson ? (
            <Link href={`/study/${previousLesson.number}`} className="group rounded-2xl border border-[var(--brand-border)] bg-white p-4 transition hover:border-[var(--brand-burgundy)]/35">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-muted)]"><ArrowLeft className="h-3.5 w-3.5" /> Previous</span>
              <span className="mt-2 block font-semibold text-[var(--brand-navy)]">Lesson {previousLesson.number}: {previousLesson.topic}</span>
            </Link>
          ) : <span />}
          {nextLesson ? (
            <Link href={`/study/${nextLesson.number}`} className="group rounded-2xl border border-[var(--brand-border)] bg-white p-4 text-right transition hover:border-[var(--brand-burgundy)]/35">
              <span className="flex items-center justify-end gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-muted)]">Next <ArrowRight className="h-3.5 w-3.5" /></span>
              <span className="mt-2 block font-semibold text-[var(--brand-navy)]">Lesson {nextLesson.number}: {nextLesson.topic}</span>
            </Link>
          ) : <Link href="/study" className="rounded-2xl border border-[var(--brand-border)] bg-white p-4 text-right font-semibold text-[var(--brand-navy)] transition hover:border-[var(--brand-burgundy)]/35">Return to all lessons</Link>}
        </nav>
      </div>
    </main>
  );
}
