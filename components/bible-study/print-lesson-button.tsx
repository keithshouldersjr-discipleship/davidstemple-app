"use client";

import { Printer } from "lucide-react";

export function PrintLessonButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`james-no-print inline-flex items-center gap-2 text-sm font-semibold ${className}`}
    >
      <Printer className="h-4 w-4" /> Print this lesson
    </button>
  );
}
