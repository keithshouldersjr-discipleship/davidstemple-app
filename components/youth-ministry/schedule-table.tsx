import { Badge } from "@/components/ui/badge";
import type { TeacherAssignment, TeachingSchedule } from "@/content/youth-ministry";
import { scheduleWeeks } from "@/content/youth-ministry";

function Assignment({ assignment }: { assignment: TeacherAssignment }) {
  if (!assignment.name) {
    return <span className="text-sm text-slate-400">No teacher listed</span>;
  }

  if (assignment.name === "TBD") {
    return <Badge>TBD</Badge>;
  }

  return (
    <span className="flex flex-wrap items-center gap-2">
      <span>{assignment.name}</span>
      {assignment.lead ? <Badge>Lead teacher</Badge> : null}
    </span>
  );
}

export function ScheduleTable({ schedule }: { schedule: TeachingSchedule }) {
  return (
    <section id={schedule.id} className="scroll-mt-28 rounded-3xl border border-[var(--brand-border)] bg-white shadow-sm shadow-slate-900/5">
      <div className="border-b border-[var(--brand-border)] px-5 py-5 sm:px-6">
        <h3 className="text-2xl font-semibold text-[var(--brand-navy)]">{schedule.title}</h3>
        <p className="mt-2 leading-7 text-[var(--brand-muted)]">{schedule.description}</p>
      </div>

      <div className="grid gap-4 p-4 lg:hidden">
        {schedule.rows.map((row) => (
          <article key={row.ageGroup} className="overflow-hidden rounded-2xl border border-[var(--brand-border)]">
            <h4 className="bg-[var(--brand-navy)] px-4 py-3 font-semibold text-white">{row.ageGroup}</h4>
            <dl className="divide-y divide-[var(--brand-border)]">
              {scheduleWeeks.map((week, index) => (
                <div key={week} className="grid grid-cols-[6.5rem_1fr] gap-3 px-4 py-3">
                  <dt className="text-sm font-semibold text-[var(--brand-navy)]">{week}</dt>
                  <dd className="text-sm text-[var(--brand-text)]">
                    <Assignment assignment={row.assignments[index]} />
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <caption className="sr-only">{schedule.title} teacher assignments by age group and week</caption>
          <thead>
            <tr className="bg-[var(--brand-navy)] text-white">
              <th scope="col" className="w-36 px-5 py-4 text-sm font-semibold">Age group</th>
              {scheduleWeeks.map((week) => (
                <th key={week} scope="col" className="px-5 py-4 text-sm font-semibold">{week}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--brand-border)]">
            {schedule.rows.map((row) => (
              <tr key={row.ageGroup} className="align-top odd:bg-white even:bg-slate-50/70">
                <th scope="row" className="px-5 py-5 font-semibold text-[var(--brand-navy)]">{row.ageGroup}</th>
                {row.assignments.map((assignment, index) => (
                  <td key={`${row.ageGroup}-${scheduleWeeks[index]}`} className="min-w-36 px-5 py-5 text-sm leading-6 text-[var(--brand-text)]">
                    <Assignment assignment={assignment} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {schedule.note ? (
        <p className="border-t border-[var(--brand-border)] bg-[var(--brand-soft)] px-5 py-4 text-sm leading-6 text-[var(--brand-muted)] sm:px-6">
          {schedule.note}
        </p>
      ) : null}
    </section>
  );
}
