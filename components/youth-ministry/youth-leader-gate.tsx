"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, LockKeyhole, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import {
  EducationClass,
  formatRole,
  youthEducationClasses,
  YouthMinistryOrganization,
} from "@/lib/youth-attendance";

type AccessStatus = "checking" | "signed-out" | "ready" | "error" | "unconfigured";

export type YouthLeaderWorkspace = {
  supabase: SupabaseClient;
  organization: YouthMinistryOrganization;
  classes: EducationClass[];
};

type YouthLeaderGateProps = {
  children: (workspace: YouthLeaderWorkspace) => ReactNode;
};

export function YouthLeaderGate({ children }: YouthLeaderGateProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [status, setStatus] = useState<AccessStatus>(supabase ? "signed-out" : "unconfigured");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState<YouthMinistryOrganization | null>(null);
  const [classes, setClasses] = useState<EducationClass[]>([]);

  const loadAccess = useCallback(async (knownAuthUserId?: string) => {
    if (!supabase) return;

    let authUserId = knownAuthUserId;
    if (!authUserId) {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        setStatus("signed-out");
        return;
      }
      authUserId = authData.user?.id;
    }

    if (!authUserId) {
      setStatus("signed-out");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_user_id", authUserId)
      .maybeSingle();

    if (profileError || !profile) {
      setMessage("Your login is not connected to the shared Watch Care church profile yet.");
      setStatus("error");
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
      setStatus("error");
      return;
    }

    const [{ data: organizationData }, { data: classData, error: classError }] = await Promise.all([
      supabase
        .from("organizations")
        .select("id,name")
        .eq("id", membership.organization_id)
        .single(),
      supabase.rpc("get_attendance_classes", {
        active_organization_id: membership.organization_id,
      }),
    ]);

    if (classError) {
      setMessage("The Watch Care class-attendance workflow is not available yet, or this account does not have class access.");
      setStatus("error");
      return;
    }

    setOrganization({
      id: membership.organization_id,
      name: organizationData?.name ?? "David's Temple",
      role: membership.role,
    });
    setClasses(
      youthEducationClasses(((classData as EducationClass[] | null) ?? []).map((educationClass) => ({
        ...educationClass,
        roster_count: Number(educationClass.roster_count ?? 0),
      }))),
    );
    setStatus("ready");
  }, [supabase]);

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setStatus("checking");
        void loadAccess(data.session.user.id);
      }
    });
  }, [loadAccess, supabase]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    setStatus("checking");
    setMessage("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
      setStatus("signed-out");
      return;
    }

    setPassword("");
    await loadAccess(data.user.id);
  }

  async function handleSignOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setOrganization(null);
    setClasses([]);
    setMessage("");
    setStatus("signed-out");
  }

  if (status === "unconfigured") {
    return (
      <Card>
        <CardContent className="p-6 text-[var(--brand-muted)]">
          Add the shared Supabase environment values to enable Youth Ministry attendance.
        </CardContent>
      </Card>
    );
  }

  if (status === "checking") {
    return (
      <div className="flex min-h-56 items-center justify-center" aria-label="Loading leader access">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-burgundy)]" />
      </div>
    );
  }

  if (status === "signed-out") {
    return (
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-burgundy-soft)] text-[var(--brand-burgundy)]">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <CardTitle>Teacher and leader sign in</CardTitle>
          <p className="text-sm leading-6 text-[var(--brand-muted)]">
            Use the same church account you use for Watch Care. Student names and attendance reports stay protected.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <Input aria-label="Email" autoComplete="email" placeholder="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <Input aria-label="Password" autoComplete="current-password" placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            {message ? <p className="text-sm text-[var(--brand-burgundy)]" role="alert">{message}</p> : null}
            <Button className="w-full" type="submit">
              <LockKeyhole className="h-4 w-4" aria-hidden="true" />
              Sign in securely
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (status === "error" || !organization || !supabase) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="space-y-4 p-6">
          <p className="font-semibold text-[var(--brand-navy)]">Youth Ministry access could not be loaded.</p>
          <p className="text-sm leading-6 text-[var(--brand-muted)]" role="alert">{message}</p>
          <Button variant="secondary" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--brand-border)] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-[var(--brand-navy)]">{organization.name}</p>
          <p className="text-sm text-[var(--brand-muted)]">
            {formatRole(organization.role)} access · connected to the shared Watch Care record
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
        </Button>
      </div>
      {children({ supabase, organization, classes })}
    </div>
  );
}
