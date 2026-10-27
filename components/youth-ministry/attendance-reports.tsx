"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarRange,
  HeartHandshake,
  Loader2,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { YouthLeaderGate, YouthLeaderWorkspace } from "@/components/youth-ministry/youth-leader-gate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatDateKey,
  monthNames,
  sessionDateKey,
  summarizeMonths,
  summarizeWeeks,
  YouthAttendanceSession,
} from "@/lib/youth-attendance";

export function AttendanceReports() {
  return (
    <YouthLeaderGate>
      {(workspace) => <AttendanceReportDashboard {...workspace} />}
    </YouthLeaderGate>
  );
}

function AttendanceReportDashboard({ supabase, organization, classes }: YouthLeaderWorkspace) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const [selectedClassId, setSelectedClassId] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [sessions, setSessions] = useState<YouthAttendanceSession[]>([]);
  const [loading, setLoading] = useState(Boolean(classes.length));
  const [message, setMessage] = useState("");
  const yearOptions = Array.from({ length: 6 }, (_, index) => currentYear - index);

  useEffect(() => {
    if (!classes.length) return;

    let active = true;
    async function loadSessions() {
      const { data, error } = await supabase
        .from("attendance_sessions")
        .select("id,group_id,session_date,starts_at,headcount,visitor_count,submitted_at")
        .eq("organization_id", organization.id)
        .in("group_id", classes.map((educationClass) => educationClass.id))
        .neq("status", "cancelled")
        .not("headcount", "is", null)
        .gte("session_date", `${selectedYear}-01-01`)
        .lte("session_date", `${selectedYear}-12-31`)
        .order("session_date", { ascending: true });

      if (!active) return;
      if (error) {
        setMessage("Attendance history could not be loaded. Confirm the Watch Care class workflow has been applied and that this account has class access.");
        setSessions([]);
      } else {
        setSessions((data as YouthAttendanceSession[] | null) ?? []);
      }
      setLoading(false);
    }

    void loadSessions();
    return () => {
      active = false;
    };
  }, [classes, organization.id, selectedYear, supabase]);

  const visibleSessions = useMemo(
    () => selectedClassId === "all" ? sessions : sessions.filter((session) => session.group_id === selectedClassId),
    [selectedClassId, sessions],
  );
  const weekSummary = useMemo(
    () => summarizeWeeks(visibleSessions, selectedYear, selectedMonth),
    [selectedMonth, selectedYear, visibleSessions],
  );
  const monthSummary = useMemo(
    () => summarizeMonths(visibleSessions, selectedYear),
    [selectedYear, visibleSessions],
  );
  const selectedMonthSessions = useMemo(
    () => visibleSessions
      .filter((session) => {
        const dateKey = sessionDateKey(session);
        return Number(dateKey.slice(0, 4)) === selectedYear && Number(dateKey.slice(5, 7)) === selectedMonth + 1;
      })
      .sort((left, right) => sessionDateKey(left).localeCompare(sessionDateKey(right))),
    [selectedMonth, selectedYear, visibleSessions],
  );
  const classNames = useMemo(
    () => new Map(classes.map((educationClass) => [educationClass.id, educationClass.name])),
    [classes],
  );
  const yearAttendance = monthSummary.reduce((total, month) => total + month.attendance, 0);
  const yearSessions = monthSummary.reduce((total, month) => total + month.sessions, 0);
  const yearVisitors = monthSummary.reduce((total, month) => total + month.visitors, 0);
  const averageAttendance = yearSessions ? Math.round((yearAttendance / yearSessions) * 10) / 10 : 0;
  const maximumMonthAttendance = Math.max(...monthSummary.map((month) => month.attendance), 1);
  const strongestMonth = monthSummary.reduce((best, month) => month.attendance > best.attendance ? month : best, monthSummary[0]);

  if (!classes.length) {
    return (
      <Card>
        <CardContent className="space-y-3 p-6">
          <p className="font-semibold text-[var(--brand-navy)]">No Youth Ministry classes are available for reporting.</p>
          <p className="text-sm leading-6 text-[var(--brand-muted)]">Create the classes and assign teachers in Watch Care first. Reports will begin building as attendance is saved.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-burgundy-soft)] text-[var(--brand-burgundy)]">
              <BarChart3 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle>Choose your report view</CardTitle>
              <p className="mt-1 text-sm leading-6 text-[var(--brand-muted)]">See all Youth Ministry classes together or focus on one teacher’s class.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-2 text-sm font-medium text-[var(--brand-navy)]">
            Class
            <select className="h-11 w-full rounded-full border border-[var(--brand-border)] bg-white px-4 text-sm outline-none focus:border-[var(--brand-burgundy)]" value={selectedClassId} onChange={(event) => setSelectedClassId(event.target.value)}>
              <option value="all">All Youth Ministry classes</option>
              {classes.map((educationClass) => <option key={educationClass.id} value={educationClass.id}>{educationClass.name}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-[var(--brand-navy)]">
            Month view
            <select className="h-11 w-full rounded-full border border-[var(--brand-border)] bg-white px-4 text-sm outline-none focus:border-[var(--brand-burgundy)]" value={selectedMonth} onChange={(event) => setSelectedMonth(Number(event.target.value))}>
              {monthNames.map((month, index) => <option key={month} value={index}>{month}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-[var(--brand-navy)]">
            Year
            <select className="h-11 w-full rounded-full border border-[var(--brand-border)] bg-white px-4 text-sm outline-none focus:border-[var(--brand-burgundy)]" value={selectedYear} onChange={(event) => {
              setLoading(true);
              setMessage("");
              setSelectedYear(Number(event.target.value));
            }}>
              {yearOptions.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
          </label>
        </CardContent>
      </Card>

      {message ? <p className="rounded-2xl bg-[var(--brand-burgundy-soft)] p-4 text-sm leading-6 text-[var(--brand-burgundy)]" role="alert">{message}</p> : null}

      {loading ? (
        <div className="flex min-h-56 items-center justify-center gap-2 text-sm text-[var(--brand-muted)]">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--brand-burgundy)]" aria-hidden="true" />
          Building the attendance report…
        </div>
      ) : (
        <>
          <section aria-labelledby="month-report-title" className="space-y-5">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--brand-burgundy)]">Month view</p>
              <h2 id="month-report-title" className="mt-2 text-2xl font-semibold text-[var(--brand-navy)]">{monthNames[selectedMonth]} {selectedYear}, week by week</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">Week numbers follow the calendar: days 1–7 are Week 1, days 8–14 are Week 2, and so on.</p>
            </div>
            <div className={`grid gap-4 sm:grid-cols-2 ${weekSummary.length === 5 ? "xl:grid-cols-5" : "lg:grid-cols-4"}`}>
              {weekSummary.map((week) => (
                <Card key={week.week}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-[var(--brand-navy)]">Week {week.week}</p>
                      <span className="rounded-full bg-[var(--brand-soft)] px-2.5 py-1 text-xs font-medium text-[var(--brand-muted)]">{week.sessions} {week.sessions === 1 ? "class" : "classes"}</span>
                    </div>
                    <p className="mt-5 text-4xl font-semibold text-[var(--brand-burgundy)]">{week.attendance}</p>
                    <p className="mt-1 text-sm text-[var(--brand-muted)]">learning moments</p>
                    {week.visitors ? <p className="mt-3 text-xs font-medium text-emerald-800">Includes {week.visitors} {week.visitors === 1 ? "visitor" : "visitors"}</p> : null}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader><CardTitle>Recorded sessions this month</CardTitle></CardHeader>
              <CardContent>
                {selectedMonthSessions.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[36rem] text-left text-sm">
                      <thead className="border-b border-[var(--brand-border)] text-xs uppercase tracking-[0.12em] text-[var(--brand-muted)]">
                        <tr><th className="pb-3 font-medium">Date</th><th className="pb-3 font-medium">Class</th><th className="pb-3 text-right font-medium">Students & visitors</th><th className="pb-3 text-right font-medium">Visitors</th></tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--brand-border)]">
                        {selectedMonthSessions.map((session) => (
                          <tr key={session.id}>
                            <td className="py-4 font-medium text-[var(--brand-navy)]">{formatDateKey(sessionDateKey(session), { weekday: "short", month: "short", day: "numeric" })}</td>
                            <td className="py-4 text-[var(--brand-muted)]">{classNames.get(session.group_id) ?? "Youth class"}</td>
                            <td className="py-4 text-right text-lg font-semibold text-[var(--brand-navy)]">{session.headcount ?? 0}</td>
                            <td className="py-4 text-right text-[var(--brand-muted)]">{session.visitor_count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <p className="text-sm leading-6 text-[var(--brand-muted)]">No attendance has been recorded for this month yet.</p>}
              </CardContent>
            </Card>
          </section>

          <section aria-labelledby="year-report-title" className="space-y-5 pt-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--brand-burgundy)]">Year view</p>
              <h2 id="year-report-title" className="mt-2 text-2xl font-semibold text-[var(--brand-navy)]">The ministry’s impact in {selectedYear}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--brand-muted)]">A learning moment is one young person present for one recorded class. It gives teachers a tangible picture of the care and preparation they provide throughout the year.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Learning moments", value: yearAttendance, detail: "Young people welcomed and taught", icon: Sparkles },
                { label: "Classes recorded", value: yearSessions, detail: "Faithful weeks of ministry", icon: CalendarRange },
                { label: "Average attendance", value: averageAttendance, detail: "Per recorded class", icon: Users },
                { label: "Visitors welcomed", value: yearVisitors, detail: "New connections made", icon: HeartHandshake },
              ].map(({ label, value, detail, icon: Icon }) => (
                <Card key={label}>
                  <CardContent className="p-5">
                    <Icon className="h-5 w-5 text-[var(--brand-burgundy)]" aria-hidden="true" />
                    <p className="mt-5 text-3xl font-semibold text-[var(--brand-navy)]">{value.toLocaleString()}</p>
                    <p className="mt-1 font-medium">{label}</p>
                    <p className="mt-1 text-xs text-[var(--brand-muted)]">{detail}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-[var(--brand-burgundy)]" aria-hidden="true" /> Attendance through the year</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto pb-2">
                  <div className="grid h-64 min-w-[44rem] grid-cols-12 items-end gap-3 border-b border-[var(--brand-border)] px-2">
                    {monthSummary.map((month) => {
                      const height = month.attendance ? Math.max((month.attendance / maximumMonthAttendance) * 100, 8) : 2;
                      return (
                        <div className="flex h-full flex-col justify-end" key={month.month}>
                          <p className="mb-2 text-center text-xs font-semibold text-[var(--brand-navy)]">{month.attendance || "—"}</p>
                          <div className="mx-auto w-full max-w-10 rounded-t-xl bg-[var(--brand-burgundy)]/85" style={{ height: `${height}%` }} role="img" aria-label={`${monthNames[month.month]}: ${month.attendance} learning moments`} />
                          <p className="my-2 text-center text-xs text-[var(--brand-muted)]">{monthNames[month.month].slice(0, 3)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-3xl bg-[var(--brand-navy)] p-6 text-white sm:p-8">
              <Sparkles className="h-7 w-7 text-white/70" aria-hidden="true" />
              <h3 className="mt-5 text-2xl font-semibold">Your teaching is making a meaningful difference.</h3>
              <p className="mt-3 max-w-3xl leading-7 text-white/75">
                {yearAttendance
                  ? `Together, Youth Ministry teachers created ${yearAttendance.toLocaleString()} recorded learning moments in ${selectedYear}${strongestMonth.attendance ? `, with the strongest recorded participation in ${monthNames[strongestMonth.month]}` : ""}. Every number represents a young person who was welcomed, known, and taught the Word.`
                  : `As teachers begin recording attendance in ${selectedYear}, this page will show the steady impact of every prepared lesson, caring conversation, and welcoming classroom.`}
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
