import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, ChevronLeft, ClipboardCheck, LockKeyhole } from "lucide-react";
import { AttendanceReports } from "@/components/youth-ministry/attendance-reports";

export const metadata: Metadata = {
  title: "Youth Ministry Reports | David's Temple",
  description: "Monthly and yearly attendance impact reports for David's Temple Youth Ministry.",
};

export default function YouthAttendanceReportsPage() {
  return (
    <main>
      <section className="bg-[var(--brand-navy)] text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Link className="inline-flex items-center gap-1 text-sm font-semibold !text-white/70 transition hover:!text-white" href="/youth-ministry">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Youth Ministry hub
          </Link>
          <div className="mt-7 flex max-w-3xl items-start gap-4">
            <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 sm:flex"><BarChart3 className="h-7 w-7" aria-hidden="true" /></div>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/65">Ministry impact</p>
              <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">See the fruit of faithful teaching.</h1>
              <p className="mt-4 text-lg leading-8 text-white/75">Follow attendance week by week each month, then step back to see the learning moments your teachers create across the year.</p>
            </div>
          </div>
          <div className="mt-7 flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white/80"><LockKeyhole className="h-4 w-4" aria-hidden="true" />Leader-only reporting</span>
            <Link className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 font-semibold !text-white transition hover:bg-white/10" href="/youth-ministry/attendance"><ClipboardCheck className="h-4 w-4" aria-hidden="true" />Take attendance</Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <AttendanceReports />
      </section>
    </main>
  );
}
