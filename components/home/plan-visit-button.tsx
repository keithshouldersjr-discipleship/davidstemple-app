"use client";

import Link from "next/link";
import { CalendarDays, Mail, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export function PlanVisitButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button type="button" size="lg" className="w-full whitespace-nowrap sm:w-auto" onClick={() => setIsOpen(true)}>
        <CalendarDays className="h-5 w-5" />
        Plan a Visit
      </Button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-3 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="plan-visit-title"
          onClick={() => setIsOpen(false)}
        >
          <Card className="max-h-[90vh] w-full max-w-3xl overflow-hidden" onClick={(event) => event.stopPropagation()}>
            <div className="relative min-h-44 bg-cover bg-center" style={{ backgroundImage: "url('/church-life/fellowship-outside.png')" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-navy)]/92 via-[var(--brand-navy)]/68 to-transparent" />
              <div className="relative flex h-full min-h-44 items-start justify-between gap-4 p-6 text-white">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/75">Plan a Visit</p>
                  <h2 id="plan-visit-title" className="mt-3 max-w-xl text-3xl font-semibold leading-tight">
                    We would love to worship with you.
                  </h2>
                </div>
                <button
                  type="button"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/50 bg-white/10 text-white hover:bg-white/20"
                  aria-label="Close plan a visit"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <CardContent className="max-h-[62vh] space-y-5 overflow-y-auto p-5">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Sunday School", "8:30 AM"],
                  ["Morning Worship", "9:30 AM"],
                  ["Bible Study", "11:00 AM & 6:00 PM"],
                ].map(([label, time]) => (
                  <div key={label} className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-soft)] p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--brand-burgundy)]">{label}</p>
                    <p className="mt-2 text-lg font-semibold text-[var(--brand-navy)]">{time}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_0.9fr]">
                <div className="rounded-2xl border border-[var(--brand-border)] p-5">
                  <CardTitle className="text-xl">What to expect</CardTitle>
                  <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
                    You can expect a warm welcome, worship centered on Jesus Christ, and people ready to help you find your way. We will add more guest details here as they are finalized.
                  </p>
                </div>
                <div className="rounded-2xl bg-[var(--brand-navy)] p-5 text-white">
                  <p className="flex items-center gap-2 font-semibold">
                    <MapPin className="h-4 w-4" />
                    Guest next step
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/80">
                    Have a question before you come? Reach out and a leader will help you prepare for your visit.
                  </p>
                </div>
              </div>

              <Link href="mailto:keithshouldersjr@gmail.com?subject=Guest%20Inquiry" className="block">
                <Button size="lg" className="w-full">
                  <Mail className="h-5 w-5" />
                  Connect With a Leader
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
}
