import { Fragment } from "react";

/**
 * Renders Keith's inline Markdown emphasis (**bold**, *italic*) without
 * changing his wording. Anything else is shown exactly as written.
 */
export function LessonInline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <strong key={index} className="font-semibold text-[var(--brand-navy)]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
          return <em key={index}>{part.slice(1, -1)}</em>;
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}

/** Splits a block on blank lines into paragraphs, keeping inline emphasis. */
export function LessonParagraphs({ text, className }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n\s*\n/).filter((paragraph) => paragraph.trim().length > 0);

  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={className}>
          <LessonInline text={paragraph.trim()} />
        </p>
      ))}
    </>
  );
}
