"use client";

import { useEffect, useState } from "react";
import {
  Check,
  CheckCheck,
  CircleMinus,
  CirclePlus,
  ClipboardCheck,
  Loader2,
  RefreshCw,
  Save,
  Users,
} from "lucide-react";
import { YouthLeaderGate, YouthLeaderWorkspace } from "@/components/youth-ministry/youth-leader-gate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ClassAttendanceRosterMember,
  ClassAttendanceSummary,
  formatDateKey,
  isValidDateKey,
  localDateKey,
} from "@/lib/youth-attendance";

export function AttendanceWorkspace() {
  return (
    <YouthLeaderGate>
      {(workspace) => <ClassAttendanceForm {...workspace} />}
    </YouthLeaderGate>
  );
}

async function fetchClassAttendance(
  supabase: YouthLeaderWorkspace["supabase"],
  organizationId: string,
  classId: string,
  sessionDate: string,
) {
  const [rosterResult, summaryResult] = await Promise.all([
    supabase.rpc("get_simple_class_attendance_roster", {
      active_organization_id: organizationId,
      active_group_id: classId,
      active_session_date: sessionDate,
    }),
    supabase.rpc("get_simple_class_attendance_summary", {
      active_organization_id: organizationId,
      active_group_id: classId,
      active_session_date: sessionDate,
    }),
  ]);

  return {
    error: rosterResult.error?.message ?? summaryResult.error?.message ?? "",
    roster: (rosterResult.data as ClassAttendanceRosterMember[] | null) ?? [],
    summary: ((summaryResult.data as ClassAttendanceSummary[] | null) ?? [])[0] ?? null,
  };
}

function ClassAttendanceForm({ supabase, organization, classes }: YouthLeaderWorkspace) {
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id ?? "");
  const [sessionDate, setSessionDate] = useState(localDateKey());
  const [roster, setRoster] = useState<ClassAttendanceRosterMember[]>([]);
  const [summary, setSummary] = useState<ClassAttendanceSummary | null>(null);
  const [presentIds, setPresentIds] = useState<Set<string>>(new Set());
  const [visitorCount, setVisitorCount] = useState(0);
  const [loading, setLoading] = useState(Boolean(selectedClassId));
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const selectedClass = classes.find((educationClass) => educationClass.id === selectedClassId);
  const dateValid = isValidDateKey(sessionDate);

  useEffect(() => {
    if (!selectedClassId || !dateValid) return;

    let active = true;
    void fetchClassAttendance(supabase, organization.id, selectedClassId, sessionDate).then((result) => {
      if (!active) return;
      if (result.error) {
        setMessage(result.error);
        setRoster([]);
        setSummary(null);
      } else {
        setRoster(result.roster);
        setSummary(result.summary);
        setPresentIds(new Set(result.roster.filter((member) => member.present).map((member) => member.member_id)));
        setVisitorCount(result.summary?.visitor_count ?? 0);
        setDirty(false);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [dateValid, organization.id, reloadKey, selectedClassId, sessionDate, supabase]);

  const presentCount = presentIds.size;
  const headcount = presentCount + visitorCount;
  const allPresent = roster.length > 0 && presentIds.size === roster.length;

  function togglePresent(memberId: string) {
    setPresentIds((current) => {
      const next = new Set(current);
      if (next.has(memberId)) next.delete(memberId);
      else next.add(memberId);
      return next;
    });
    setDirty(true);
  }

  function toggleEveryone() {
    setPresentIds(allPresent ? new Set() : new Set(roster.map((member) => member.member_id)));
    setDirty(true);
  }

  async function saveAttendance() {
    if (!selectedClassId || !dateValid) return;

    setSaving(true);
    setMessage("");
    const { error } = await supabase.rpc("submit_simple_class_attendance", {
      active_organization_id: organization.id,
      active_group_id: selectedClassId,
      active_session_date: sessionDate,
      active_present_member_ids: [...presentIds],
      active_visitor_count: visitorCount,
    });

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setDirty(false);
    setLoading(true);
    setReloadKey((key) => key + 1);
  }

  if (!classes.length) {
    return (
      <Card>
        <CardContent className="space-y-3 p-6">
          <p className="font-semibold text-[var(--brand-navy)]">No Youth Ministry classes are assigned to this account.</p>
          <p className="text-sm leading-6 text-[var(--brand-muted)]">
            A pastor or administrator can create the class and assign its teachers in Watch Care. Once assigned, the same class will appear here automatically.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <div className="space-y-5">
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-burgundy-soft)] text-[var(--brand-burgundy)]">
                <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <CardTitle>Choose the class and date</CardTitle>
                <p className="mt-1 text-sm leading-6 text-[var(--brand-muted)]">Your authorized classes come directly from Watch Care.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-[var(--brand-navy)]">
              Class
              <select
                className="h-11 w-full rounded-full border border-[var(--brand-border)] bg-white px-4 text-sm text-[var(--brand-text)] outline-none focus:border-[var(--brand-burgundy)]"
                value={selectedClassId}
                onChange={(event) => {
                  setSelectedClassId(event.target.value);
                  setLoading(true);
                  setMessage("");
                  setRoster([]);
                  setSummary(null);
                  setDirty(false);
                }}
              >
                {classes.map((educationClass) => <option key={educationClass.id} value={educationClass.id}>{educationClass.name}</option>)}
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-[var(--brand-navy)]">
              Session date
              <Input
                className="rounded-full"
                type="date"
                value={sessionDate}
                onChange={(event) => {
                  const nextDate = event.target.value;
                  setSessionDate(nextDate);
                  setLoading(Boolean(nextDate && isValidDateKey(nextDate)));
                  setMessage("");
                  setRoster([]);
                  setSummary(null);
                  setDirty(false);
                }}
              />
              {!dateValid ? <span className="block text-xs text-[var(--brand-burgundy)]">Choose a valid date.</span> : null}
            </label>
          </CardContent>
        </Card>

        {summary && !dirty ? (
          <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-900" role="status">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white"><Check className="h-4 w-4" /></span>
            <div>
              <p className="font-semibold">Attendance saved for {formatDateKey(sessionDate, { month: "long", day: "numeric" })}</p>
              <p className="text-sm leading-6 text-emerald-800">You can make corrections and save this class again.</p>
            </div>
          </div>
        ) : null}

        {message ? (
          <div className="rounded-2xl bg-[var(--brand-burgundy-soft)] p-4 text-sm leading-6 text-[var(--brand-burgundy)]" role="alert">
            <p>{message}</p>
            <Button className="mt-3" size="sm" variant="secondary" onClick={() => {
              setLoading(true);
              setMessage("");
              setReloadKey((key) => key + 1);
            }}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Try again
            </Button>
          </div>
        ) : null}

        <Card>
          <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
            <div>
              <CardTitle>Class roll</CardTitle>
              <p className="mt-1 text-sm text-[var(--brand-muted)]">Tap each student who is present.</p>
            </div>
            <Button size="sm" variant="secondary" disabled={loading || !roster.length} onClick={toggleEveryone}>
              <CheckCheck className="h-4 w-4" aria-hidden="true" />
              {allPresent ? "Clear all" : "Mark all"}
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-[var(--brand-muted)]">
                <Loader2 className="h-5 w-5 animate-spin text-[var(--brand-burgundy)]" />
                Loading the class roll…
              </div>
            ) : roster.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {roster.map((member) => {
                  const present = presentIds.has(member.member_id);
                  return (
                    <button
                      className={`flex min-h-16 items-center gap-3 rounded-2xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-burgundy)] ${present ? "border-emerald-700 bg-emerald-50" : "border-[var(--brand-border)] bg-white hover:border-[var(--brand-burgundy)]/35"}`}
                      key={member.member_id}
                      type="button"
                      role="checkbox"
                      aria-checked={present}
                      onClick={() => togglePresent(member.member_id)}
                    >
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${present ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-300 bg-white"}`}>
                        {present ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
                      </span>
                      <span className="min-w-0 flex-1 font-medium text-[var(--brand-navy)]">{member.display_name}</span>
                      <span className={`text-xs font-semibold ${present ? "text-emerald-800" : "text-[var(--brand-muted)]"}`}>{present ? "Present" : "Not marked"}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[var(--brand-border)] p-5">
                <p className="font-semibold text-[var(--brand-navy)]">No students are enrolled in this class yet.</p>
                <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">Manage this class roster in Watch Care, then return here to record attendance.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-[var(--brand-navy)]">Visitors</p>
              <p className="mt-1 text-sm leading-6 text-[var(--brand-muted)]">Count guests without creating a student profile.</p>
            </div>
            <div className="flex items-center gap-4" aria-label="Visitor count">
              <button
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--brand-border)] text-[var(--brand-navy)] transition hover:bg-[var(--brand-soft)] disabled:opacity-40"
                type="button"
                aria-label="Remove one visitor"
                disabled={visitorCount === 0}
                onClick={() => {
                  setVisitorCount((count) => Math.max(0, count - 1));
                  setDirty(true);
                }}
              ><CircleMinus className="h-5 w-5" aria-hidden="true" /></button>
              <span className="min-w-8 text-center text-2xl font-semibold text-[var(--brand-navy)]">{visitorCount}</span>
              <button
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--brand-border)] text-[var(--brand-navy)] transition hover:bg-[var(--brand-soft)]"
                type="button"
                aria-label="Add one visitor"
                onClick={() => {
                  setVisitorCount((count) => count + 1);
                  setDirty(true);
                }}
              ><CirclePlus className="h-5 w-5" aria-hidden="true" /></button>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full" size="lg" disabled={!dateValid || loading || saving} onClick={() => void saveAttendance()}>
          {saving ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Save className="h-5 w-5" aria-hidden="true" />}
          {saving ? "Saving attendance…" : `Save attendance (${headcount})`}
        </Button>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-24">
        <Card className="overflow-hidden border-0 bg-[var(--brand-navy)] text-white">
          <CardContent className="p-6">
            <Users className="h-7 w-7 text-white/70" aria-hidden="true" />
            <p className="mt-5 text-sm font-medium uppercase tracking-[0.18em] text-white/65">Today’s class</p>
            <p className="mt-2 text-xl font-semibold">{selectedClass?.name ?? "Youth class"}</p>
            <dl className="mt-6 space-y-4">
              <div className="flex items-end justify-between gap-4 border-b border-white/15 pb-4">
                <dt className="text-sm text-white/70">Enrolled present</dt>
                <dd className="text-3xl font-semibold">{presentCount}<span className="text-base font-normal text-white/60">/{roster.length}</span></dd>
              </div>
              <div className="flex items-end justify-between gap-4">
                <dt className="text-sm text-white/70">Total attendance</dt>
                <dd className="text-4xl font-semibold">{headcount}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        <div className="rounded-2xl bg-[var(--brand-burgundy-soft)] p-5">
          <p className="font-semibold text-[var(--brand-navy)]">One shared ministry record</p>
          <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">Saving here updates the same class, roster, and attendance history used in Watch Care.</p>
        </div>
      </aside>
    </div>
  );
}
