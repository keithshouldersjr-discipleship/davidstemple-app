"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  Copy,
  Download,
  Loader2,
  Lock,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  SquarePen,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BulletinAdminPanel } from "@/components/admin/bulletin-admin-panel";
import { EventsAdminPanel } from "@/components/admin/events-admin-panel";
import { currentBulletin } from "@/lib/bulletin-data";
import {
  createSupabaseBrowserClient,
  type SupabaseMemberProfileRow,
} from "@/lib/supabase";
import type { MemberProfile, MemberStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type MemberFormState = {
  id?: string;
  firstName: string;
  lastName: string;
  birthdayMonthDay: string;
  phone: string;
  email: string;
  spouseName: string;
  children: string;
  ministryInterests: string;
  deaconGroup: string;
  status: MemberStatus;
  notes: string;
};

type DirectoryRole = "owner" | "admin" | "leader" | "member" | "none";
type AdminTab = "directory" | "events" | "bulletin";
type ProfileModalMode = "view" | "edit";

const communicationsManagerEmails = [
  "keithshouldersjr@gmail.com",
  "jonesmi411@yahoo.com",
  "karomc1987@gmail.com",
];

const emptyForm: MemberFormState = {
  firstName: "",
  lastName: "",
  birthdayMonthDay: "",
  phone: "",
  email: "",
  spouseName: "",
  children: "",
  ministryInterests: "",
  deaconGroup: "",
  status: "active",
  notes: "",
};

const statusStyles: Record<MemberStatus, string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  inactive: "border-amber-200 bg-amber-50 text-amber-700",
  deceased: "border-red-200 bg-red-50 text-red-700",
};

const deaconGroupOptions = [
  "Deacon Bobby Shoulders",
  "Deacon Bobby McDonald",
  "Deacon Maurice Pryor",
  "Deacon Reggie Battles",
  "Deacon Walter Hamilton",
  "Deacon Derrick Ward",
  "Deacon Billy Hammer",
  "Deacon Wilbert Woodruff",
  "Deacon Ronald Peoples",
];

function toMemberProfile(row: SupabaseMemberProfileRow): MemberProfile {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    birthdayMonthDay: row.birthday_month_day ?? undefined,
    phone: row.phone ? formatPhoneNumber(row.phone) : undefined,
    email: row.email ?? undefined,
    spouseName: row.spouse_name ?? undefined,
    children: row.children ?? [],
    ministryInterests: row.ministry_interests ?? [],
    deaconGroup: row.deacon_group ?? undefined,
    status: row.status,
    notes: row.notes ?? undefined,
  };
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatPhoneNumber(value?: string) {
  const digits = (value ?? "").replace(/\D/g, "");

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  return value ?? "";
}

function normalizePhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 10) {
    return formatPhoneNumber(digits);
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return formatPhoneNumber(digits);
  }

  return value.trim();
}

function getInitialAdminTab(): AdminTab {
  if (typeof window === "undefined") {
    return "directory";
  }

  const tab = new URLSearchParams(window.location.search).get("tab");

  return tab === "events" || tab === "bulletin" ? tab : "directory";
}

function profileToForm(profile: MemberProfile): MemberFormState {
  return {
    id: profile.id,
    firstName: profile.firstName,
    lastName: profile.lastName,
    birthdayMonthDay: profile.birthdayMonthDay ?? "",
    phone: formatPhoneNumber(profile.phone),
    email: profile.email ?? "",
    spouseName: profile.spouseName ?? "",
    children: profile.children.join(", "),
    ministryInterests: profile.ministryInterests.join(", "),
    deaconGroup: profile.deaconGroup ?? "",
    status: profile.status,
    notes: profile.notes ?? "",
  };
}

function canEditMember(member: MemberProfile, currentUserEmail: string, role: DirectoryRole) {
  return (
    role === "owner" ||
    role === "admin" ||
    Boolean(member.email && member.email.toLowerCase() === currentUserEmail.toLowerCase())
  );
}

function getProfileFields(member: MemberProfile) {
  return [
    ["Phone", formatPhoneNumber(member.phone)],
    ["Email", member.email],
    ["Birthday", member.birthdayMonthDay],
    ["Spouse", member.spouseName],
    ["Children", member.children.join(", ")],
    ["Ministry interests", member.ministryInterests.join(", ")],
    ["Deacon group", member.deaconGroup],
  ].filter((field): field is [string, string] => Boolean(field[1]));
}

export function MemberDirectoryDashboard() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(supabase));
  const [message, setMessage] = useState("");
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<MemberStatus | "all">("all");
  const [deaconGroup, setDeaconGroup] = useState("all");
  const [form, setForm] = useState<MemberFormState>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [directoryRole, setDirectoryRole] = useState<DirectoryRole>("none");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>(getInitialAdminTab);
  const [profileModalMode, setProfileModalMode] = useState<ProfileModalMode>("view");

  const canManageAll = directoryRole === "owner" || directoryRole === "admin";
  const isCommunicationManager = communicationsManagerEmails.includes(currentUserEmail);
  const canManageEvents = canManageAll || isCommunicationManager;
  const canManageBulletin = canManageAll || isCommunicationManager;
  const canViewFullDirectory =
    directoryRole === "owner" || directoryRole === "admin" || directoryRole === "leader";

  const filteredMembers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return members.filter((member) => {
      const searchTarget = [
        member.firstName,
        member.lastName,
        member.email,
        member.phone,
        member.spouseName,
        member.deaconGroup,
        ...member.children,
        ...member.ministryInterests,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!normalizedSearch || searchTarget.includes(normalizedSearch)) &&
        (status === "all" || member.status === status) &&
        (deaconGroup === "all" || member.deaconGroup === deaconGroup)
      );
    });
  }, [deaconGroup, members, search, status]);

  const selectedMember = useMemo(() => {
    return filteredMembers.find((member) => member.id === selectedMemberId);
  }, [filteredMembers, selectedMemberId]);

  const loadMembers = useCallback(async () => {
    if (!supabase) return;

    setIsLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("member_profiles")
      .select(
        "id,first_name,last_name,birthday_month_day,phone,email,spouse_name,children,ministry_interests,deacon_group,status,notes",
      )
      .order("last_name", { ascending: true })
      .order("first_name", { ascending: true });

    if (error) {
      setMessage(
        "I could not load the directory. Make sure the member directory SQL has been run and your email is listed in admin_users.",
      );
      setMembers([]);
    } else {
      setMembers((data as SupabaseMemberProfileRow[]).map(toMemberProfile));
    }

    setIsLoading(false);
  }, [supabase]);

  const loadCurrentUserRole = useCallback(async () => {
    if (!supabase) return "none" as DirectoryRole;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userEmail = user?.email?.toLowerCase() ?? "";

    setCurrentUserEmail(userEmail);

    if (!userEmail) {
      setDirectoryRole("none");
      return "none" as DirectoryRole;
    }

    const { data, error } = await supabase
      .from("admin_users")
      .select("role")
      .eq("email", userEmail)
      .maybeSingle();

    if (error || !data) {
      setDirectoryRole("none");
      return "none" as DirectoryRole;
    }

    const role = (data.role ?? "none") as DirectoryRole;
    setDirectoryRole(role);
    return role;
  }, [supabase]);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      const signedIn = Boolean(data.session);
      setIsSignedIn(signedIn);
      setIsLoading(false);

      if (signedIn) {
        loadCurrentUserRole().then((role) => {
          if (role !== "none") {
            void loadMembers();
          }
        });
      }
    });
  }, [loadCurrentUserRole, loadMembers, supabase]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) return;

    setIsLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
      setIsSignedIn(false);
      setIsLoading(false);
      return;
    }

    setIsSignedIn(true);
    const role = await loadCurrentUserRole();

    if (role !== "none") {
      await loadMembers();
    } else {
      setMembers([]);
    }
  }

  async function handleSignOut() {
    if (!supabase) return;

    await supabase.auth.signOut();
    setIsSignedIn(false);
    setCurrentUserEmail("");
    setDirectoryRole("none");
    setMembers([]);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) return;

    if (!canManageAll && !form.id) {
      setMessage("Only admins can add new member profiles.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    const payload = {
      id: form.id,
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      birthday_month_day: form.birthdayMonthDay.trim() || null,
      phone: normalizePhoneNumber(form.phone) || null,
      email: form.email.trim() || null,
      spouse_name: form.spouseName.trim() || null,
      children: splitList(form.children),
      ministry_interests: splitList(form.ministryInterests),
      deacon_group: form.deaconGroup.trim() || null,
      status: form.status,
      notes: form.notes.trim() || null,
    };

    const { error } = await supabase.from("member_profiles").upsert(payload).select("id").single();

    if (error) {
      setMessage(error.message);
    } else {
      setForm(emptyForm);
      setProfileModalMode("view");
      await loadMembers();
    }

    setIsSaving(false);
  }

  async function copyField(label: string, value?: string) {
    if (!value) return;

    await navigator.clipboard.writeText(value);
    setCopiedField(label);
    window.setTimeout(() => setCopiedField(null), 1400);
  }

  function closeProfileModal() {
    setSelectedMemberId(null);
    setProfileModalMode("view");
    setForm(emptyForm);
  }

  function openProfileModal(memberId: string) {
    setSelectedMemberId(memberId);
    setProfileModalMode("view");
  }

  function startModalEdit(member: MemberProfile) {
    if (!canEditMember(member, currentUserEmail, directoryRole)) {
      setMessage("You can only update the member profile connected to your email address.");
      return;
    }

    setForm(profileToForm(member));
    setProfileModalMode("edit");
  }

  if (!supabase) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="font-semibold text-[var(--brand-navy)]">Supabase is required for the admin directory.</p>
          <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
            Add your Supabase URL and anon key to `.env.local`, then restart the app.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!isSignedIn) {
    return (
      <Card className="max-w-xl">
        <CardHeader>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-navy)]/8 text-[var(--brand-navy)]">
            <Lock className="h-6 w-6" />
          </span>
          <CardTitle>Admin sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              required
            />
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              required
            />
            {message ? <p className="text-sm text-[var(--brand-burgundy)]">{message}</p> : null}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="admin-no-print flex rounded-full border border-[var(--brand-border)] bg-white p-1 shadow-sm shadow-slate-900/5">
        {[
          ["directory", "Member Directory"],
          ["events", "Events"],
          ["bulletin", "Bulletin"],
        ].map(([tab, label]) => (
          <button
            key={tab}
            type="button"
            className={cn(
              "flex-1 rounded-full px-4 py-2 text-sm font-medium transition",
              activeTab === tab
                ? "bg-[var(--brand-navy)] text-white"
                : "text-[var(--brand-muted)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand-navy)]",
            )}
            onClick={() => {
              const nextTab = tab as AdminTab;
              setActiveTab(nextTab);
              window.history.replaceState(
                null,
                "",
                nextTab === "directory" ? "/admin" : `/admin?tab=${nextTab}`,
              );
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "events" ? <EventsAdminPanel canManageAll={canManageEvents} /> : null}

      {activeTab === "bulletin" ? (
        <BulletinAdminPanel
          canManageBulletin={canManageBulletin}
          initialBulletin={currentBulletin}
        />
      ) : null}

      {activeTab === "directory" ? (
      <>
      <div className="admin-no-print flex flex-col gap-3 rounded-3xl border border-[var(--brand-border)] bg-white p-4 shadow-sm shadow-slate-900/5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-[var(--brand-navy)]">Church directory</p>
          <p className="text-sm text-[var(--brand-muted)]">
            {filteredMembers.length} visible members from {members.length} total
            {directoryRole !== "none" ? ` · ${directoryRole} access` : ""}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" variant="secondary" onClick={() => window.print()}>
            <Download className="h-4 w-4" />
            Print / PDF
          </Button>
          {canManageAll ? (
            <Button type="button" onClick={() => setForm(emptyForm)}>
              <Plus className="h-4 w-4" />
              New member
            </Button>
          ) : null}
          <Button type="button" variant="ghost" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </div>

      {message ? (
        <div className="rounded-2xl border border-[var(--brand-burgundy)]/20 bg-[var(--brand-burgundy-soft)] p-4 text-sm text-[var(--brand-burgundy)]">
          {message}
        </div>
      ) : null}

      {canViewFullDirectory ? (
        <div className="admin-no-print">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Filters</CardTitle>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSearch("");
                      setStatus("all");
                      setDeaconGroup("all");
                    }}
                  >
                    Reset
                  </Button>
                  <Button type="button" variant="secondary" size="sm" onClick={() => window.print()}>
                    <Download className="h-4 w-4" />
                    Print filtered
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--brand-muted)]" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search names, phone, email, ministries..." className="pl-10" />
              </div>
              <select value={status} onChange={(e) => setStatus(e.target.value as MemberStatus | "all")} className="h-11 rounded-full border border-[var(--brand-border)] bg-white px-4 text-sm text-[var(--brand-text)]">
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="deceased">Deceased</option>
              </select>
              <select value={deaconGroup} onChange={(e) => setDeaconGroup(e.target.value)} className="h-11 rounded-full border border-[var(--brand-border)] bg-white px-4 text-sm text-[var(--brand-text)]">
                <option value="all">All deacon groups</option>
                {deaconGroupOptions.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="admin-directory-print">
        {isLoading ? (
          <p className="text-sm text-[var(--brand-muted)]">Loading directory...</p>
        ) : filteredMembers.length ? (
          <>
            {canViewFullDirectory ? (
              <Card className="overflow-hidden">
                <CardHeader className="border-b border-[var(--brand-border)]">
                  <CardTitle>Member list</CardTitle>
                  <p className="text-sm text-[var(--brand-muted)]">
                    Select a name or phone number to view the full profile.
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="admin-directory-list max-h-[34rem] overflow-y-auto">
                    {filteredMembers.map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        className={cn(
                          "grid w-full grid-cols-[1fr_auto] gap-3 border-b border-[var(--brand-border)] px-4 py-3 text-left transition hover:bg-[var(--brand-soft)]",
                          selectedMember?.id === member.id && "bg-[var(--brand-burgundy-soft)]",
                        )}
                        onClick={() => openProfileModal(member.id)}
                      >
                        <span>
                          <span className="block font-semibold text-[var(--brand-navy)]">
                            {member.firstName} {member.lastName}
                          </span>
                          <span className="mt-1 block text-xs text-[var(--brand-muted)]">
                            {member.deaconGroup ?? "No deacon group listed"}
                          </span>
                        </span>
                        <span className="flex items-center gap-2 text-sm font-medium text-[var(--brand-muted)]">
                          <Phone className="h-4 w-4 text-[var(--brand-burgundy)]" />
                          {formatPhoneNumber(member.phone) || "No phone"}
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </>
        ) : (
          <Card className="md:col-span-2 xl:col-span-3">
            <CardContent className="p-6">
              <p className="font-semibold text-[var(--brand-navy)]">No members match these filters.</p>
              <p className="mt-2 text-sm text-[var(--brand-muted)]">
                Reset the filters or search for a different name, group, or ministry interest.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {canManageAll || form.id ? (
        <div id="member-form" className="admin-no-print">
          <Card>
            <CardHeader>
              <CardTitle>{form.id ? "Update member" : "Add member"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="First name" required />
                  <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Last name" required />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input value={form.birthdayMonthDay} onChange={(e) => setForm({ ...form, birthdayMonthDay: e.target.value })} placeholder="Birthday MM-DD" />
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: formatPhoneNumber(e.target.value) })} placeholder="Phone" />
                </div>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email"
                  disabled={!canManageAll}
                />
                <Input value={form.spouseName} onChange={(e) => setForm({ ...form, spouseName: e.target.value })} placeholder="Spouse name" />
                <Input value={form.children} onChange={(e) => setForm({ ...form, children: e.target.value })} placeholder="Children, separated by commas" />
                <Input value={form.ministryInterests} onChange={(e) => setForm({ ...form, ministryInterests: e.target.value })} placeholder="Ministry interests, separated by commas" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <select
                    value={form.deaconGroup}
                    onChange={(event) => setForm({ ...form, deaconGroup: event.target.value })}
                    className="h-11 rounded-full border border-[var(--brand-border)] bg-white px-4 text-sm text-[var(--brand-text)] outline-none focus:border-[var(--brand-burgundy)]"
                  >
                    <option value="">Select deacon group</option>
                    {deaconGroupOptions.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                  {canManageAll ? (
                    <select
                      value={form.status}
                      onChange={(event) => setForm({ ...form, status: event.target.value as MemberStatus })}
                      className="h-11 rounded-full border border-[var(--brand-border)] bg-white px-4 text-sm text-[var(--brand-text)] outline-none focus:border-[var(--brand-burgundy)]"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="deceased">Deceased</option>
                    </select>
                  ) : (
                    <Input value={form.status} disabled />
                  )}
                </div>
                {canManageAll ? (
                  <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Private notes" />
                ) : null}
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Save member
                  </Button>
                  {form.id ? (
                    <Button type="button" variant="secondary" onClick={() => setForm(emptyForm)}>
                      Cancel
                    </Button>
                  ) : null}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {selectedMember ? (
        <div
          className="admin-no-print fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-3 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="member-profile-title"
          onClick={closeProfileModal}
        >
          <Card
            className="max-h-[88vh] w-full max-w-2xl overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <CardHeader className="border-b border-[var(--brand-border)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle id="member-profile-title">
                    {profileModalMode === "edit" ? "Edit profile" : `${selectedMember.firstName} ${selectedMember.lastName}`}
                  </CardTitle>
                  <p className="mt-1 text-sm text-[var(--brand-muted)]">
                    {selectedMember.deaconGroup ?? "No deacon group listed"}
                  </p>
                </div>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--brand-border)] text-[var(--brand-muted)] hover:bg-[var(--brand-soft)]"
                  aria-label="Close member profile"
                  onClick={closeProfileModal}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="max-h-[68vh] space-y-4 overflow-y-auto p-5">
              {profileModalMode === "edit" ? (
                <form onSubmit={handleSave} className="grid gap-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="First name" required />
                    <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Last name" required />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input value={form.birthdayMonthDay} onChange={(e) => setForm({ ...form, birthdayMonthDay: e.target.value })} placeholder="Birthday MM-DD" />
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: formatPhoneNumber(e.target.value) })} placeholder="Phone" />
                  </div>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Email"
                    disabled={!canManageAll}
                  />
                  <Input value={form.spouseName} onChange={(e) => setForm({ ...form, spouseName: e.target.value })} placeholder="Spouse name" />
                  <Input value={form.children} onChange={(e) => setForm({ ...form, children: e.target.value })} placeholder="Children, separated by commas" />
                  <Input value={form.ministryInterests} onChange={(e) => setForm({ ...form, ministryInterests: e.target.value })} placeholder="Ministry interests, separated by commas" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <select
                      value={form.deaconGroup}
                      onChange={(event) => setForm({ ...form, deaconGroup: event.target.value })}
                      className="h-11 rounded-full border border-[var(--brand-border)] bg-white px-4 text-sm text-[var(--brand-text)] outline-none focus:border-[var(--brand-burgundy)]"
                    >
                      <option value="">Select deacon group</option>
                      {deaconGroupOptions.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                    {canManageAll ? (
                      <select
                        value={form.status}
                        onChange={(event) => setForm({ ...form, status: event.target.value as MemberStatus })}
                        className="h-11 rounded-full border border-[var(--brand-border)] bg-white px-4 text-sm text-[var(--brand-text)] outline-none focus:border-[var(--brand-burgundy)]"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="deceased">Deceased</option>
                      </select>
                    ) : (
                      <Input value={form.status} disabled />
                    )}
                  </div>
                  {canManageAll ? (
                    <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Private notes" />
                  ) : null}
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Save profile
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => setProfileModalMode("view")}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
              <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize", statusStyles[selectedMember.status])}>
                {selectedMember.status}
              </span>
              <div className="grid gap-3">
                {getProfileFields(selectedMember).map(([label, value]) => (
                    <div
                      key={label}
                      className="flex flex-col gap-3 rounded-2xl border border-[var(--brand-border)] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand-burgundy)]">
                          {label}
                        </p>
                        <p className="mt-1 break-words text-sm font-medium text-[var(--brand-navy)]">
                          {value}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => void copyField(label, value)}
                      >
                        {copiedField === label ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copiedField === label ? "Copied" : "Copy"}
                      </Button>
                    </div>
                ))}
              </div>
              {canEditMember(selectedMember, currentUserEmail, directoryRole) ? (
                <Button type="button" variant="secondary" onClick={() => startModalEdit(selectedMember)}>
                  <SquarePen className="h-4 w-4" />
                  Edit profile
                </Button>
              ) : null}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
      </>
      ) : null}
    </div>
  );
}
