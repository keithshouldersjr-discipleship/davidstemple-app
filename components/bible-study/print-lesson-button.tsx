"use client";

import { Printer } from "lucide-react";

type PrintLessonButtonProps = {
  className?: string;
  /** Suggested file name when a reader chooses "Save as PDF". */
  documentTitle?: string;
  label?: string;
};

export function PrintLessonButton({
  className = "",
  documentTitle,
  label = "Print or save as PDF",
}: PrintLessonButtonProps) {
  function handlePrint() {
    const originalTitle = document.title;
    if (documentTitle) document.title = documentTitle;

    const restore = () => {
      document.title = originalTitle;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);

    window.print();
  }

  return (
    <button
      type="button"
      onClick={handlePrint}
      className={`james-no-print inline-flex items-center justify-center gap-2 text-sm font-semibold ${className}`}
    >
      <Printer className="h-4 w-4" /> {label}
    </button>
  );
}
