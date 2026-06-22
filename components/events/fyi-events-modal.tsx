"use client";

import { useState } from "react";
import { Megaphone, X } from "lucide-react";
import { HomeEventsPreview } from "@/components/events/home-events-preview";
import type { Event } from "@/lib/types";

type FyiEventsModalProps = {
  events: Event[];
};

export function FyiEventsModal({ events }: FyiEventsModalProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen || events.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fyi-events-modal-title"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/25 bg-white shadow-2xl shadow-slate-950/30"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative border-b border-[var(--brand-border)] bg-[var(--brand-soft)] px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3 pr-12">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--brand-burgundy)] text-white shadow-sm">
              <Megaphone className="h-6 w-6" />
            </span>
            <div>
              <h2 id="fyi-events-modal-title" className="text-3xl font-semibold text-[var(--brand-navy)]">
                FYI
              </h2>
              <p className="mt-1 text-sm leading-6 text-[var(--brand-muted)]">
                Upcoming gatherings and ministry moments at David&apos;s Temple.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--brand-border)] bg-white text-[var(--brand-navy)] shadow-sm transition hover:bg-[var(--brand-burgundy-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-burgundy)]"
            aria-label="Close FYI events"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="bg-white p-3 sm:p-4">
          <HomeEventsPreview events={events} showHeader={false} listClassName="max-h-[68vh]" />
        </div>
      </div>
    </div>
  );
}
