import { formatStudyDate, getJamesLesson, jamesLessons, jamesSeries } from "@/lib/james-study-data";
import { jamesShareImageSize, renderJamesShareImage } from "@/lib/james-share-image";

export const alt = `${jamesSeries.title} lesson`;
export const size = jamesShareImageSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return jamesLessons.map((lesson) => ({ lesson: String(lesson.number) }));
}

export default async function Image({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson: lessonParam } = await params;
  const lesson = getJamesLesson(lessonParam);

  return renderJamesShareImage({
    eyebrow: lesson ? `${jamesSeries.title} · Lesson ${lesson.number}` : jamesSeries.title,
    title: lesson?.title ?? jamesSeries.title,
    passage: lesson?.passage.reference,
    date: lesson ? formatStudyDate(lesson.studyDate) : undefined,
  });
}
