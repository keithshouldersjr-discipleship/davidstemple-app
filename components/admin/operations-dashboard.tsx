"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { CalendarCheck, HeartHandshake, Loader2, LogOut, ShieldCheck, UserRoundPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { ChurchOperationsDashboardData } from "@/lib/types";

type ActiveOrganization = {
  id: string;
  name: string;
  role: string;
};

const emptyDashboard: ChurchOperationsDashboardData = {
  metrics: {
    active_members: 0,
    attendance_last_30_days: 0,
    first_time_guests_last_30_days: 0,
    unique_servants_last_90_days: 0,
    members_not_serving_last_90_days: 0,
  },
  attendance_by_week: [],
  upcoming_serving: [],
};

function formatRole(role: string) {
  return role.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function OperationsDashboard() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [message, setMessage] = useState("");
  const [organization, setOrganization] = useState<ActiveOrganization | null>(null);
  const [dashboard, setDashboard] = useState<ChurchOperationsDashboardData>(emptyDashboard);

  const loadDashboard = useCallback(async () => {
    if (!supabase) return;

    setLoading(true);
    setMessage("");

    const { data: authData } = await supabase.auth.getUser();
    const authUserId = authData.user?.id;

    if (!authUserId) {
      setSignedIn(false);
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_user_id", authUserId)
      .maybeSingle();

    if (profileError || !profile) {
      setMessage("Your login works, but it is not connected to the shared church profile yet. Run the Watchcare owner/bootstrap migration first.");
      setLoading(false);
      return;
    }

    const { data: membership, error: membershipError } = await supabase
      .from("organization_memberships")
      .select("organization_id,role")
      .eq("user_id", profile.id)
      .eq("status", "active")
      .limit(1)
      .maybeSingle();

    if (membershipError || !membership) {
      setMessage("No active church access was found for this account.");
      setLoading(false);
      return;
    }

    const { data: organizationData } = await supabase
      .from("organizations")
      .select("id,name")
      .eq("id", membership.organization_id)
      .single();

    const { data, error } = await supabase.rpc("get_church_operations_dashboard", {
      active_organization_id: membership.organization_id,
    });

    if (error) {
      setMessage("The shared operations migration has not been applied yet, or your role cannot read it.");
      setLoading(false);
      return;
    }

    setOrganization({
      id: membership.organization_id,
      name: organizationData?.name ?? "Church",
      role: membership.role,
    });
    setDashboard((data as ChurchOperationsDashboardData | null) ?? emptyDashboard);
    setSignedIn(true);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(Boolean(data.session));
      if (data.session) {
        void loadDashboard();
      } else {
        setLoading(false);
      }
    });
  }, [loadDashboard, supabase]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setPassword("");
    await loadDashboard();
  }

  async function handleSignOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSignedIn(false);
    setOrganization(null);
    setDashboard(emptyDashboard);
    setMessage("");
  }

  if (!supabase) {
    return <Card><CardContent className="p-6 text-[var(--brand-muted)]">Add the Supabase environment values to enable the operations dashboard.</CardContent></Card>;
  }

  if (!signedIn) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Leader sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <Input aria-label="Email" autoComplete="email" placeholder="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <Input aria-label="Password" autoComplete="current-password" placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            {message ? <p className="text-sm text-[var(--brand-burgundy)]">{message}</p> : null}
            <Button className="w-full" disabled={loading} type="submit">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return <div className="flex min-h-48 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-[var(--brand-burgundy)]" /></div>;
  }

  if (!organization) {
    return (
      <Card>
        <CardContent className="space-y-4 p-6">
          <p className="text-[var(--brand-muted)]">{message || "Church access could not be loaded."}</p>
          <Button variant="secondary" onClick={handleSignOut}><LogOut className="h-4 w-4" /> Sign out</Button>
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    { label: "Active members", value: dashboard.metrics.active_members, icon: Users, detail: "Canonical member records" },
    { label: "Attendance", value: dashboard.metrics.attendance_last_30_days, icon: CalendarCheck, detail: "Person check-ins, last 30 days" },
    { label: "First-time guests", value: dashboard.metrics.first_time_guests_last_30_days, icon: UserRoundPlus, detail: "Last 30 days" },
    { label: "People serving", value: dashboard.metrics.unique_servants_last_90_days, icon: HeartHandshake, detail: "Unique servants, last 90 days" },
  ];
  const maximumAttendance = Math.max(...dashboard.attendance_by_week.map((week) => week.attendance), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--brand-border)] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-[var(--brand-navy)]">{organization.name}</p>
          <p className="text-sm text-[var(--brand-muted)]">{formatRole(organization.role)} access · shared Supabase church record</p>
        </div>
        <Button size="sm" variant="secondary" onClick={handleSignOut}><LogOut className="h-4 w-4" /> Sign out</Button>
      </div>

      {message ? <p className="rounded-xl bg-[var(--brand-burgundy-soft)] p-4 text-sm text-[var(--brand-burgundy)]">{message}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon, detail }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-burgundy-soft)] text-[var(--brand-burgundy)]"><Icon className="h-5 w-5" /></div>
              <p className="text-3xl font-semibold text-[var(--brand-navy)]">{value}</p>
              <p className="mt-1 font-medium">{label}</p>
              <p className="mt-1 text-xs text-[var(--brand-muted)]">{detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader><CardTitle>Eight-week attendance</CardTitle></CardHeader>
          <CardContent>
            {dashboard.attendance_by_week.length ? (
              <div className="space-y-3">
                {dashboard.attendance_by_week.map((week) => (
                  <div className="grid grid-cols-[6rem_1fr_2.5rem] items-center gap-3" key={week.week}>
                    <span className="text-sm text-[var(--brand-muted)]">{new Date(`${week.week}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[var(--brand-burgundy)]" style={{ width: `${Math.max((week.attendance / maximumAttendance) * 100, 4)}%` }} /></div>
                    <span className="text-right text-sm font-semibold text-[var(--brand-navy)]">{week.attendance}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-[var(--brand-muted)]">No attendance has been recorded yet. Start with Sunday School and Bible study sessions.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Participation signal</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-[var(--brand-soft)] p-4">
              <p className="text-3xl font-semibold text-[var(--brand-navy)]">{dashboard.metrics.members_not_serving_last_90_days}</p>
              <p className="text-sm text-[var(--brand-muted)]">active members with no recorded serving in 90 days</p>
            </div>
            <p className="text-sm leading-6 text-[var(--brand-muted)]">Treat this as a conversation list, not a performance score. Confirm the serving data before acting on it.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Admin workspaces</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <Link className="rounded-xl border border-[var(--brand-border)] p-4 transition hover:border-[var(--brand-burgundy)]/40 hover:bg-[var(--brand-burgundy-soft)]" href="/admin"><strong className="block text-[var(--brand-navy)]">Member directory</strong><span className="mt-1 block text-sm text-[var(--brand-muted)]">Maintain legacy profiles during migration</span></Link>
          <Link className="rounded-xl border border-[var(--brand-border)] p-4 transition hover:border-[var(--brand-burgundy)]/40 hover:bg-[var(--brand-burgundy-soft)]" href="/admin/shepherding"><strong className="block text-[var(--brand-navy)]">Shepherding</strong><span className="mt-1 block text-sm text-[var(--brand-muted)]">Care lists and leader follow-up</span></Link>
          <div className="rounded-xl border border-dashed border-[var(--brand-border)] p-4"><strong className="block text-[var(--brand-navy)]">Attendance & serving</strong><span className="mt-1 block text-sm text-[var(--brand-muted)]">Data foundation ready; capture workflow is the next milestone</span></div>
        </CardContent>
      </Card>
    </div>
  );
}
