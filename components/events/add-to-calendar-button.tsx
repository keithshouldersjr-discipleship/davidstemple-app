"use client";

import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calendarFileName, createCalendarFile } from "@/lib/calendar";
import type { Event } from "@/lib/types";

type AddToCalendarButtonProps = {
  event: Event;
  className?: string;
};

export function AddToCalendarButton({ event, className }: AddToCalendarButtonProps) {
  function addToCalendar() {
    const calendarFile = createCalendarFile(event);

    if (!calendarFile) {
      return;
    }

    const url = URL.createObjectURL(new Blob([calendarFile], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = calendarFileName(event);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className={className}
      onClick={addToCalendar}
    >
      <CalendarPlus className="h-4 w-4" />
      Add to calendar
    </Button>
  );
}
