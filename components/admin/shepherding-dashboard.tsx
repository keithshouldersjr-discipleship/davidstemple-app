"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  HeartHandshake,
  Home,
  Loader2,
  Lock,
  Phone,
  Plus,
  Printer,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  createSupabaseBrowserClient,
  type SupabaseMemberContactLogRow,
  type SupabaseMemberProfileRow,
} from "@/lib/supabase";
import type { CareStatus, MemberProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

type ShepherdingTab = "overview" | "deacons" | "health" | "prayer";
type OverviewDetailKey = "active" | "households" | "prayerList" | "birthdays";
type ContactType = "note" | "call" | "visit" | "text" | "card" | "prayer" | "other";

type PrayerListFormState = {
  memberId: string;
  careStatus: Exclude<CareStatus, "none">;
  careNotes: string;
};

type ContactLogFormState = {
  contactType: ContactType;
  contactedAt: string;
  notes: string;
};

type MemberContactLog = {
  id: string;
  memberId: string;
  contactType: ContactType;
  notes: string;
  contactedAt: string;
  createdBy?: string;
  createdAt: string;
};

type HouseholdGroup = {
  id: string;
  leader: MemberProfile;
  members: MemberProfile[];
};

const shepherdingDashboardEmails = (
  process.env.NEXT_PUBLIC_SHEPHERDING_DASHBOARD_EMAILS ?? "keithshouldersjr@gmail.com"
)
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const tabLabels: Record<ShepherdingTab, string> = {
  overview: "Overview",
  deacons: "Deacon Care",
  health: "Data Health",
  prayer: "Prayer List",
};

const careStatusLabels: Record<CareStatus, string> = {
  none: "Not on prayer list",
  sick_shut_in: "Sick & shut-in",
  bereavement: "Bereavement",
};

const contactTypeLabels: Record<ContactType, string> = {
  note: "Note",
  call: "Call",
  visit: "Visit",
  text: "Text",
  card: "Card",
  prayer: "Prayer",
  other: "Other",
};

const emptyPrayerListForm: PrayerListFormState = {
  memberId: "",
  careStatus: "sick_shut_in",
  careNotes: "",
};

function getTodayDateInputValue() {
  return new Date().toISOString().slice(0, 10);
}

const emptyContactLogForm: ContactLogFormState = {
  contactType: "note",
  contactedAt: getTodayDateInputValue(),
  notes: "",
};

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
    householdLeaderId: row.household_leader_id ?? undefined,
    careStatus: row.care_status ?? "none",
    careNotes: row.care_notes ?? undefined,
    careUpdatedAt: row.care_updated_at ?? undefined,
    status: row.status,
    notes: row.notes ?? undefined,
  };
}

function toMemberContactLog(row: SupabaseMemberContactLogRow): MemberContactLog {
  return {
    id: row.id,
    memberId: row.member_id,
    contactType: row.contact_type as ContactType,
    notes: row.notes,
    contactedAt: row.contacted_at,
    createdBy: row.created_by ?? undefined,
    createdAt: row.created_at,
  };
}

function getMemberName(member: MemberProfile) {
  return `${member.firstName} ${member.lastName}`.trim();
}

function hasContactInfo(member: MemberProfile) {
  return Boolean(member.phone || member.email);
}

function getCurrentMonthDay() {
  const now = new Date();
  return String(now.getMonth() + 1).padStart(2, "0");
}

function getCurrentMonthName() {
  return new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date());
}

function isBirthdayThisMonth(member: MemberProfile) {
  return member.birthdayMonthDay?.slice(0, 2) === getCurrentMonthDay();
}

function formatDisplayDate(value?: string) {
  if (!value) return "No date";

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function countHouseholds(members: MemberProfile[]) {
  const households = new Set<string>();

  for (const member of members) {
    households.add(member.householdLeaderId ?? member.id);
  }

  return households.size;
}

function MetricCard({
  icon,
  label,
  value,
  tone = "navy",
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  tone?: "navy" | "burgundy" | "amber" | "green";
  onClick?: () => void;
}) {
  const toneClass = {
    navy: "bg-[var(--brand-navy)]/8 text-[var(--brand-navy)]",
    burgundy: "bg-[var(--brand-burgundy-soft)] text-[var(--brand-burgundy)]",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
  }[tone];

  const content = (
    <>
      <div className={cn("mb-4 flex h-10 w-10 items-center justify-center rounded-full", toneClass)}>
        {icon}
      </div>
      <p className="text-3xl font-semibold text-[var(--brand-navy)]">{value}</p>
      <p className="mt-1 text-sm text-[var(--brand-muted)]">{label}</p>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className="rounded-2xl border border-[var(--brand-border)] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[var(--brand-burgundy)]/35 hover:shadow-lg hover:shadow-slate-900/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-burgundy)]"
        onClick={onClick}
      >
        {content}
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--brand-border)] bg-white p-4">
      {content}
    </div>
  );
}

function SimpleList({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: string[];
  emptyText: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--brand-border)] bg-white p-4">
      <p className="font-semibold text-[var(--brand-navy)]">{title}</p>
      {items.length ? (
        <ul className="mt-3 space-y-2 text-sm text-[var(--brand-text)]">
          {items.slice(0, 10).map((item) => (
            <li key={item} className="border-b border-[var(--brand-border)] pb-2 last:border-0 last:pb-0">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-[var(--brand-muted)]">{emptyText}</p>
      )}
    </div>
  );
}

function MemberDetailRow({ member }: { member: MemberProfile }) {
  return (
    <div className="grid gap-2 border-b border-[var(--brand-border)] px-4 py-3 text-sm last:border-0 sm:grid-cols-[1fr_1fr_1fr]">
      <div>
        <p className="font-semibold text-[var(--brand-navy)]">{getMemberName(member)}</p>
        <p className="text-xs text-[var(--brand-muted)]">{member.status}</p>
      </div>
      <p className="text-[var(--brand-text)]">{member.deaconGroup ?? "No deacon group"}</p>
      <p className="text-[var(--brand-text)]">
        {formatPhoneNumber(member.phone) || member.email || "No phone/email"}
        {member.birthdayMonthDay ? ` · Birthday ${member.birthdayMonthDay}` : ""}
      </p>
    </div>
  );
}

function HouseholdDetailRow({ household }: { household: HouseholdGroup }) {
  const householdMembers = household.members.filter((member) => member.id !== household.leader.id);

  return (
    <div className="border-b border-[var(--brand-border)] px-4 py-3 last:border-0">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-[var(--brand-navy)]">{getMemberName(household.leader)}</p>
          <p className="text-xs text-[var(--brand-muted)]">
            {household.members.length} member{household.members.length === 1 ? "" : "s"} represented
          </p>
        </div>
        <p className="text-sm text-[var(--brand-text)]">
          {formatPhoneNumber(household.leader.phone) || household.leader.email || "No phone/email"}
        </p>
      </div>
      {householdMembers.length ? (
        <p className="mt-2 text-sm text-[var(--brand-muted)]">
          Connected: {householdMembers.map(getMemberName).join(", ")}
        </p>
      ) : (
        <p className="mt-2 text-sm text-[var(--brand-muted)]">Single-member household.</p>
      )}
    </div>
  );
}

export function ShepherdingDashboard() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(supabase));
  const [message, setMessage] = useState("");
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [activeTab, setActiveTab] = useState<ShepherdingTab>("overview");
  const [overviewDetailKey, setOverviewDetailKey] = useState<OverviewDetailKey | null>(null);
  const [contactLogs, setContactLogs] = useState<MemberContactLog[]>([]);
  const [prayerListForm, setPrayerListForm] = useState<PrayerListFormState>(emptyPrayerListForm);
  const [contactLogForm, setContactLogForm] = useState<ContactLogFormState>(emptyContactLogForm);
  const [selectedPrayerMemberId, setSelectedPrayerMemberId] = useState<string | null>(null);
  const [isSavingCare, setIsSavingCare] = useState(false);

  const loadContactLogs = useCallback(async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("member_contact_logs")
      .select("id,member_id,contact_type,notes,contacted_at,created_by,created_at")
      .order("contacted_at", { ascending: false });

    if (error) {
      if (error.code !== "42P01") {
        setMessage("I could not load the prayer list contact log.");
      }
      setContactLogs([]);
      return;
    }

    setContactLogs((data as SupabaseMemberContactLogRow[]).map(toMemberContactLog));
  }, [supabase]);

  const loadMembers = useCallback(async () => {
    if (!supabase) return;

    setIsLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("member_profiles")
      .select(
        "id,first_name,last_name,birthday_month_day,phone,email,spouse_name,children,ministry_interests,deacon_group,household_leader_id,care_status,care_notes,care_updated_at,status,notes",
      )
      .order("last_name", { ascending: true })
      .order("first_name", { ascending: true });

    if (error) {
      setMessage("I could not load the member data for the shepherding dashboard.");
      setMembers([]);
    } else {
      setMembers((data as SupabaseMemberProfileRow[]).map(toMemberProfile));
      await loadContactLogs();
    }

    setIsLoading(false);
  }, [loadContactLogs, supabase]);

  const updateAuthorization = useCallback(
    async (userEmail?: string | null) => {
      const normalizedEmail = userEmail?.toLowerCase() ?? "";
      const allowed = Boolean(normalizedEmail && shepherdingDashboardEmails.includes(normalizedEmail));

      setCurrentUserEmail(normalizedEmail);
      setIsAllowed(allowed);

      if (allowed) {
        await loadMembers();
      } else {
        setMembers([]);
        setIsLoading(false);
      }
    },
    [loadMembers],
  );

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      const signedIn = Boolean(data.session);
      setIsSignedIn(signedIn);

      if (signedIn) {
        void updateAuthorization(data.session?.user.email);
      } else {
        setIsLoading(false);
      }
    });
  }, [supabase, updateAuthorization]);

  const activeMembers = useMemo(() => members.filter((member) => member.status === "active"), [members]);
  const inactiveMembers = useMemo(() => members.filter((member) => member.status === "inactive"), [members]);
  const deceasedMembers = useMemo(() => members.filter((member) => member.status === "deceased"), [members]);
  const birthdaysThisMonth = useMemo(() => activeMembers.filter(isBirthdayThisMonth), [activeMembers]);
  const withoutDeacon = useMemo(() => activeMembers.filter((member) => !member.deaconGroup), [activeMembers]);
  const withoutContact = useMemo(() => activeMembers.filter((member) => !hasContactInfo(member)), [activeMembers]);
  const withoutHousehold = useMemo(
    () => activeMembers.filter((member) => !member.householdLeaderId && !activeMembers.some((other) => other.householdLeaderId === member.id)),
    [activeMembers],
  );
  const withoutBirthday = useMemo(() => activeMembers.filter((member) => !member.birthdayMonthDay), [activeMembers]);
  const withoutMinistryInterest = useMemo(
    () => activeMembers.filter((member) => member.ministryInterests.length === 0),
    [activeMembers],
  );

  const householdGroups = useMemo(() => {
    const activeMembersById = new Map(activeMembers.map((member) => [member.id, member]));
    const groups = new Map<string, MemberProfile[]>();

    for (const member of activeMembers) {
      const householdId = member.householdLeaderId ?? member.id;
      groups.set(householdId, [...(groups.get(householdId) ?? []), member]);
    }

    return Array.from(groups.entries())
      .map(([householdId, householdMembers]) => {
        const leader = activeMembersById.get(householdId) ?? householdMembers[0];

        return {
          id: householdId,
          leader,
          members: [leader, ...householdMembers.filter((member) => member.id !== leader.id)],
        };
      })
      .sort((first, second) => getMemberName(first.leader).localeCompare(getMemberName(second.leader)));
  }, [activeMembers]);

  const deaconGroups = useMemo(() => {
    const groups = new Map<string, MemberProfile[]>();

    for (const member of activeMembers) {
      const group = member.deaconGroup ?? "Unassigned";
      groups.set(group, [...(groups.get(group) ?? []), member]);
    }

    return Array.from(groups.entries()).sort(([first], [second]) => first.localeCompare(second));
  }, [activeMembers]);

  const prayerListMembers = useMemo(
    () =>
      activeMembers
        .filter((member) => member.careStatus && member.careStatus !== "none")
        .sort((first, second) => {
          const statusSort = (first.careStatus ?? "none").localeCompare(second.careStatus ?? "none");

          return statusSort || getMemberName(first).localeCompare(getMemberName(second));
        }),
    [activeMembers],
  );

  const sickAndShutInMembers = useMemo(
    () => prayerListMembers.filter((member) => member.careStatus === "sick_shut_in"),
    [prayerListMembers],
  );
  const bereavementMembers = useMemo(
    () => prayerListMembers.filter((member) => member.careStatus === "bereavement"),
    [prayerListMembers],
  );
  const contactLogsByMember = useMemo(() => {
    const logsByMember = new Map<string, MemberContactLog[]>();

    for (const log of contactLogs) {
      logsByMember.set(log.memberId, [...(logsByMember.get(log.memberId) ?? []), log]);
    }

    return logsByMember;
  }, [contactLogs]);
  const selectedPrayerMember = selectedPrayerMemberId
    ? members.find((member) => member.id === selectedPrayerMemberId)
    : undefined;
  const selectedPrayerMemberLogs = selectedPrayerMember
    ? contactLogsByMember.get(selectedPrayerMember.id) ?? []
    : [];

  const overviewDetail = useMemo(() => {
    if (!overviewDetailKey) return null;

    const details: Record<
      OverviewDetailKey,
      {
        title: string;
        description: string;
        members?: MemberProfile[];
        households?: HouseholdGroup[];
        emptyText: string;
      }
    > = {
      active: {
        title: "Active members",
        description: "All active member profiles currently included in the directory.",
        members: activeMembers,
        emptyText: "No active members are currently listed.",
      },
      households: {
        title: "Households represented",
        description: "Household representatives and the members connected to each household.",
        households: householdGroups,
        emptyText: "No household groupings are currently listed.",
      },
      prayerList: {
        title: "Prayer list",
        description: "Members currently listed for sick & shut-in or bereavement prayer care.",
        members: prayerListMembers,
        emptyText: "No members are currently on the prayer list.",
      },
      birthdays: {
        title: "Birthdays this month",
        description: "Active members with birthdays in the current month.",
        members: birthdaysThisMonth,
        emptyText: "No active member birthdays are listed for this month.",
      },
    };

    return details[overviewDetailKey];
  }, [activeMembers, birthdaysThisMonth, householdGroups, overviewDetailKey, prayerListMembers]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) return;

    setIsLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
      setIsSignedIn(false);
      setIsLoading(false);
      return;
    }

    setIsSignedIn(true);
    await updateAuthorization(data.user.email);
  }

  async function handleSavePrayerListMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !prayerListForm.memberId) return;

    setIsSavingCare(true);
    setMessage("");

    const { error } = await supabase
      .from("member_profiles")
      .update({
        care_status: prayerListForm.careStatus,
        care_notes: prayerListForm.careNotes.trim() || null,
        care_updated_at: new Date().toISOString(),
      })
      .eq("id", prayerListForm.memberId);

    if (error) {
      setMessage(error.message);
    } else {
      setPrayerListForm(emptyPrayerListForm);
      await loadMembers();
    }

    setIsSavingCare(false);
  }

  async function handleRemoveFromPrayerList(memberId: string) {
    if (!supabase) return;

    setIsSavingCare(true);
    setMessage("");

    const { error } = await supabase
      .from("member_profiles")
      .update({
        care_status: "none",
        care_notes: null,
        care_updated_at: new Date().toISOString(),
      })
      .eq("id", memberId);

    if (error) {
      setMessage(error.message);
    } else {
      setSelectedPrayerMemberId(null);
      await loadMembers();
    }

    setIsSavingCare(false);
  }

  async function handleSaveContactLog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !selectedPrayerMember || !contactLogForm.notes.trim()) return;

    setIsSavingCare(true);
    setMessage("");

    const contactedAt = new Date(`${contactLogForm.contactedAt}T12:00:00`).toISOString();
    const { error } = await supabase.from("member_contact_logs").insert({
      member_id: selectedPrayerMember.id,
      contact_type: contactLogForm.contactType,
      notes: contactLogForm.notes.trim(),
      contacted_at: contactedAt,
      created_by: currentUserEmail || null,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setContactLogForm(emptyContactLogForm);
      await loadContactLogs();
    }

    setIsSavingCare(false);
  }

  function openPrayerMember(member: MemberProfile) {
    setSelectedPrayerMemberId(member.id);
    setContactLogForm(emptyContactLogForm);
  }

  if (!supabase) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="font-semibold text-[var(--brand-navy)]">Supabase is required for this dashboard.</p>
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
          <CardTitle>Pastor sign in</CardTitle>
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

  if (!isAllowed) {
    return (
      <Card className="max-w-2xl">
        <CardContent className="p-6">
          <p className="font-semibold text-[var(--brand-navy)]">This dashboard is limited to the pastor.</p>
          <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
            You are signed in as {currentUserEmail || "an authenticated user"}, but this page is not enabled for that account.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="admin-no-print flex flex-col gap-4 rounded-3xl border border-[var(--brand-border)] bg-white p-4 shadow-sm shadow-slate-900/5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-semibold text-[var(--brand-navy)]">Shepherding dashboards</p>
          <p className="text-sm text-[var(--brand-muted)]">
            Simple meeting views for prayer, care, follow-up, and wise decisions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button type="button" variant="ghost" onClick={() => void loadMembers()}>
            Refresh
          </Button>
        </div>
      </div>

      {message ? (
        <div className="rounded-2xl border border-[var(--brand-burgundy)]/20 bg-[var(--brand-burgundy-soft)] p-4 text-sm text-[var(--brand-burgundy)]">
          {message}
        </div>
      ) : null}

      <div className="admin-no-print flex overflow-x-auto rounded-full border border-[var(--brand-border)] bg-white p-1 shadow-sm shadow-slate-900/5">
        {(Object.keys(tabLabels) as ShepherdingTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            className={cn(
              "min-w-fit flex-1 rounded-full px-4 py-2 text-sm font-medium transition",
              activeTab === tab
                ? "bg-[var(--brand-navy)] text-white"
                : "text-[var(--brand-muted)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand-navy)]",
            )}
            onClick={() => setActiveTab(tab)}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-[var(--brand-muted)]">Loading shepherding data...</p>
      ) : null}

      {!isLoading && activeTab === "overview" ? (
        <div className="shepherding-overview-print space-y-6">
          <div className="shepherding-print-header">
            <Image
              src="/shepherding-dashboard-logo.png"
              alt="David's Temple Missionary Baptist Church"
              width={320}
              height={180}
              className="shepherding-print-logo"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-burgundy)]">
                Monthly Deacon Meeting
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-[var(--brand-navy)]">
                Shepherding Overview
              </h2>
              <p className="mt-1 text-sm text-[var(--brand-muted)]">
                {getCurrentMonthName()} prayer, birthday, and care summary
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              icon={<Users className="h-5 w-5" />}
              label="Active members"
              value={activeMembers.length}
              onClick={() => setOverviewDetailKey("active")}
            />
            <MetricCard
              icon={<Home className="h-5 w-5" />}
              label="Households"
              value={householdGroups.length}
              tone="green"
              onClick={() => setOverviewDetailKey("households")}
            />
            <MetricCard
              icon={<HeartHandshake className="h-5 w-5" />}
              label="Prayer List"
              value={prayerListMembers.length}
              tone="amber"
              onClick={() => setOverviewDetailKey("prayerList")}
            />
            <MetricCard
              icon={<CalendarDays className="h-5 w-5" />}
              label="Birthdays"
              value={birthdaysThisMonth.length}
              tone="burgundy"
              onClick={() => setOverviewDetailKey("birthdays")}
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-[var(--brand-border)] bg-white p-4">
              <p className="font-semibold text-[var(--brand-navy)]">Birthdays for {getCurrentMonthName()}</p>
              {birthdaysThisMonth.length ? (
                <div className="mt-3 divide-y divide-[var(--brand-border)]">
                  {birthdaysThisMonth.map((member) => (
                    <div key={member.id} className="grid gap-1 py-2 text-sm sm:grid-cols-[1fr_auto]">
                      <p className="font-medium text-[var(--brand-navy)]">{getMemberName(member)}</p>
                      <p className="text-[var(--brand-muted)]">{member.birthdayMonthDay}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-[var(--brand-muted)]">No birthdays are listed for this month.</p>
              )}
            </div>
            <div className="rounded-2xl border border-[var(--brand-border)] bg-white p-4">
              <p className="font-semibold text-[var(--brand-navy)]">Prayer List</p>
              {prayerListMembers.length ? (
                <div className="mt-3 divide-y divide-[var(--brand-border)]">
                  {prayerListMembers.map((member) => (
                    <div key={member.id} className="py-2 text-sm">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="font-medium text-[var(--brand-navy)]">{getMemberName(member)}</p>
                        <p className="text-[var(--brand-burgundy)]">
                          {careStatusLabels[member.careStatus ?? "none"]}
                        </p>
                      </div>
                      <p className="mt-1 text-[var(--brand-muted)]">
                        {member.careNotes || "No prayer note listed."}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-[var(--brand-muted)]">No members are currently on the prayer list.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {!isLoading && activeTab === "deacons" ? (
        <div className="grid gap-4">
          {deaconGroups.map(([group, groupMembers]) => {
            const groupWithoutContact = groupMembers.filter((member) => !hasContactInfo(member));
            const groupBirthdays = groupMembers.filter(isBirthdayThisMonth);
            const groupHouseholds = countHouseholds(groupMembers);

            return (
              <div key={group} className="rounded-2xl border border-[var(--brand-border)] bg-white p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="font-semibold text-[var(--brand-navy)]">{group}</p>
                    <p className="mt-1 text-sm text-[var(--brand-muted)]">
                      {groupMembers.length} active members · {groupHouseholds} households
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                      {groupWithoutContact.length} missing contact
                    </span>
                    <span className="rounded-full bg-[var(--brand-burgundy-soft)] px-3 py-1 text-[var(--brand-burgundy)]">
                      {groupBirthdays.length} birthdays
                    </span>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-3">
                  <SimpleList
                    title="Prayer notes"
                    items={groupBirthdays.map((member) => `${getMemberName(member)} - birthday ${member.birthdayMonthDay}`)}
                    emptyText="No birthdays this month."
                  />
                  <SimpleList
                    title="Contact gaps"
                    items={groupWithoutContact.map((member) => getMemberName(member))}
                    emptyText="Every member has phone or email listed."
                  />
                  <SimpleList
                    title="Household leaders"
                    items={groupMembers
                      .filter((member) => groupMembers.some((other) => other.householdLeaderId === member.id))
                      .map((member) => getMemberName(member))}
                    emptyText="No grouped households are listed for this deacon group yet."
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {!isLoading && activeTab === "health" ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard icon={<Phone className="h-5 w-5" />} label="Missing phone/email" value={withoutContact.length} tone="amber" />
            <MetricCard icon={<HeartHandshake className="h-5 w-5" />} label="Missing deacon group" value={withoutDeacon.length} tone="amber" />
            <MetricCard icon={<Home className="h-5 w-5" />} label="No household grouping" value={withoutHousehold.length} tone="burgundy" />
            <MetricCard icon={<ClipboardList className="h-5 w-5" />} label="No ministry interests" value={withoutMinistryInterest.length} />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <SimpleList
              title="Profiles needing contact info"
              items={withoutContact.map(getMemberName)}
              emptyText="No active members are missing both phone and email."
            />
            <SimpleList
              title="Profiles needing birthday"
              items={withoutBirthday.map(getMemberName)}
              emptyText="Every active member has a birthday month/day."
            />
            <SimpleList
              title="Profiles needing deacon assignment"
              items={withoutDeacon.map(getMemberName)}
              emptyText="Every active member has a deacon assignment."
            />
            <SimpleList
              title="Household grouping opportunities"
              items={withoutHousehold.map(getMemberName)}
              emptyText="Every active member is represented in a household grouping."
            />
          </div>
          <div className="rounded-2xl border border-[var(--brand-border)] bg-white p-4">
            <p className="font-semibold text-[var(--brand-navy)]">Status counts</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-700">
                <p className="text-2xl font-semibold">{activeMembers.length}</p>
                <p className="text-sm">Active</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4 text-amber-700">
                <p className="text-2xl font-semibold">{inactiveMembers.length}</p>
                <p className="text-sm">Inactive</p>
              </div>
              <div className="rounded-2xl bg-red-50 p-4 text-red-700">
                <p className="text-2xl font-semibold">{deceasedMembers.length}</p>
                <p className="text-sm">Deceased</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {!isLoading && activeTab === "prayer" ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard icon={<HeartHandshake className="h-5 w-5" />} label="On prayer list" value={prayerListMembers.length} tone="burgundy" />
            <MetricCard icon={<Home className="h-5 w-5" />} label="Sick & shut-in" value={sickAndShutInMembers.length} tone="amber" />
            <MetricCard icon={<ClipboardList className="h-5 w-5" />} label="Bereavement" value={bereavementMembers.length} />
          </div>

          <Card className="admin-no-print">
            <CardHeader>
              <CardTitle>Add to prayer list</CardTitle>
              <p className="text-sm text-[var(--brand-muted)]">
                Best practice here is to classify the member directly, then keep dated contact notes as history.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSavePrayerListMember} className="grid gap-3 lg:grid-cols-[1fr_0.7fr_1.3fr_auto]">
                <select
                  value={prayerListForm.memberId}
                  onChange={(event) => setPrayerListForm({ ...prayerListForm, memberId: event.target.value })}
                  className="h-11 rounded-full border border-[var(--brand-border)] bg-white px-4 text-sm text-[var(--brand-text)]"
                  required
                >
                  <option value="">Select member</option>
                  {activeMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {getMemberName(member)}
                    </option>
                  ))}
                </select>
                <select
                  value={prayerListForm.careStatus}
                  onChange={(event) =>
                    setPrayerListForm({
                      ...prayerListForm,
                      careStatus: event.target.value as Exclude<CareStatus, "none">,
                    })
                  }
                  className="h-11 rounded-full border border-[var(--brand-border)] bg-white px-4 text-sm text-[var(--brand-text)]"
                >
                  <option value="sick_shut_in">Sick & shut-in</option>
                  <option value="bereavement">Bereavement</option>
                </select>
                <Input
                  value={prayerListForm.careNotes}
                  onChange={(event) => setPrayerListForm({ ...prayerListForm, careNotes: event.target.value })}
                  placeholder="Brief prayer list note"
                />
                <Button type="submit" disabled={isSavingCare || !prayerListForm.memberId}>
                  {isSavingCare ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Add
                </Button>
              </form>
            </CardContent>
          </Card>

          {[
            ["Sick & shut-in", sickAndShutInMembers],
            ["Bereavement", bereavementMembers],
          ].map(([title, list]) => (
            <div key={title as string} className="overflow-hidden rounded-2xl border border-[var(--brand-border)] bg-white">
              <div className="border-b border-[var(--brand-border)] bg-[var(--brand-soft)] px-4 py-3">
                <p className="font-semibold text-[var(--brand-navy)]">{title as string}</p>
                <p className="text-sm text-[var(--brand-muted)]">
                  {(list as MemberProfile[]).length} member{(list as MemberProfile[]).length === 1 ? "" : "s"}
                </p>
              </div>
              {(list as MemberProfile[]).length ? (
                (list as MemberProfile[]).map((member) => {
                  const latestLog = contactLogsByMember.get(member.id)?.[0];

                  return (
                    <button
                      key={member.id}
                      type="button"
                      className="grid w-full grid-cols-1 gap-2 border-b border-[var(--brand-border)] px-4 py-4 text-left text-sm transition last:border-0 hover:bg-[var(--brand-soft)] lg:grid-cols-[1fr_1fr_1.5fr]"
                      onClick={() => openPrayerMember(member)}
                    >
                      <div>
                        <p className="font-semibold text-[var(--brand-navy)]">{getMemberName(member)}</p>
                        <p className="text-xs text-[var(--brand-muted)]">{member.deaconGroup ?? "No deacon group"}</p>
                      </div>
                      <p className="text-[var(--brand-text)]">
                        {formatPhoneNumber(member.phone) || member.email || "Needs contact info"}
                      </p>
                      <div className="text-[var(--brand-muted)]">
                        <p>{member.careNotes || "No prayer list note yet."}</p>
                        <p className="mt-1 text-xs">
                          {latestLog
                            ? `Last contact: ${formatDisplayDate(latestLog.contactedAt)} (${contactTypeLabels[latestLog.contactType]})`
                            : "No contact logged yet."}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="p-5 text-sm text-[var(--brand-muted)]">No members are currently listed here.</p>
              )}
            </div>
          ))}
        </div>
      ) : null}

      {overviewDetail ? (
        <div
          className="admin-no-print fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-3 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="overview-detail-title"
          onClick={() => setOverviewDetailKey(null)}
        >
          <Card
            className="max-h-[88vh] w-full max-w-3xl overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <CardHeader className="border-b border-[var(--brand-border)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle id="overview-detail-title">{overviewDetail.title}</CardTitle>
                  <p className="mt-1 text-sm text-[var(--brand-muted)]">{overviewDetail.description}</p>
                </div>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--brand-border)] text-[var(--brand-muted)] hover:bg-[var(--brand-soft)]"
                  aria-label="Close details"
                  onClick={() => setOverviewDetailKey(null)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="max-h-[68vh] overflow-y-auto p-0">
              {overviewDetail.households?.length ? (
                overviewDetail.households.map((household) => (
                  <HouseholdDetailRow key={household.id} household={household} />
                ))
              ) : overviewDetail.members?.length ? (
                overviewDetail.members.map((member) => <MemberDetailRow key={member.id} member={member} />)
              ) : (
                <p className="p-5 text-sm text-[var(--brand-muted)]">{overviewDetail.emptyText}</p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {selectedPrayerMember ? (
        <div
          className="admin-no-print fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-3 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="prayer-member-title"
          onClick={() => setSelectedPrayerMemberId(null)}
        >
          <Card
            className="max-h-[88vh] w-full max-w-3xl overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <CardHeader className="border-b border-[var(--brand-border)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle id="prayer-member-title">{getMemberName(selectedPrayerMember)}</CardTitle>
                  <p className="mt-1 text-sm text-[var(--brand-muted)]">
                    {careStatusLabels[selectedPrayerMember.careStatus ?? "none"]} ·{" "}
                    {selectedPrayerMember.deaconGroup ?? "No deacon group"}
                  </p>
                </div>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--brand-border)] text-[var(--brand-muted)] hover:bg-[var(--brand-soft)]"
                  aria-label="Close prayer list member"
                  onClick={() => setSelectedPrayerMemberId(null)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="max-h-[68vh] space-y-5 overflow-y-auto p-5">
              <div className="grid gap-3 rounded-2xl border border-[var(--brand-border)] bg-white p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-burgundy)]">
                    Contact
                  </p>
                  <p className="mt-1 text-sm text-[var(--brand-text)]">
                    {formatPhoneNumber(selectedPrayerMember.phone) || selectedPrayerMember.email || "No phone/email"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-burgundy)]">
                    Prayer note
                  </p>
                  <p className="mt-1 text-sm text-[var(--brand-text)]">
                    {selectedPrayerMember.careNotes || "No prayer list note yet."}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveContactLog} className="grid gap-3 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-soft)] p-4">
                <p className="font-semibold text-[var(--brand-navy)]">Add contact note</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <select
                    value={contactLogForm.contactType}
                    onChange={(event) =>
                      setContactLogForm({ ...contactLogForm, contactType: event.target.value as ContactType })
                    }
                    className="h-11 rounded-full border border-[var(--brand-border)] bg-white px-4 text-sm text-[var(--brand-text)]"
                  >
                    {(Object.keys(contactTypeLabels) as ContactType[]).map((type) => (
                      <option key={type} value={type}>
                        {contactTypeLabels[type]}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="date"
                    value={contactLogForm.contactedAt}
                    onChange={(event) => setContactLogForm({ ...contactLogForm, contactedAt: event.target.value })}
                  />
                </div>
                <textarea
                  value={contactLogForm.notes}
                  onChange={(event) => setContactLogForm({ ...contactLogForm, notes: event.target.value })}
                  placeholder="What happened? What should we remember for prayer or follow-up?"
                  className="min-h-28 rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 text-sm text-[var(--brand-text)] outline-none focus:border-[var(--brand-burgundy)]"
                  required
                />
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button type="submit" disabled={isSavingCare || !contactLogForm.notes.trim()}>
                    {isSavingCare ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Save contact
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isSavingCare}
                    onClick={() => void handleRemoveFromPrayerList(selectedPrayerMember.id)}
                  >
                    Remove from prayer list
                  </Button>
                </div>
              </form>

              <div className="overflow-hidden rounded-2xl border border-[var(--brand-border)] bg-white">
                <div className="border-b border-[var(--brand-border)] bg-[var(--brand-soft)] px-4 py-3">
                  <p className="font-semibold text-[var(--brand-navy)]">Contact log</p>
                </div>
                {selectedPrayerMemberLogs.length ? (
                  selectedPrayerMemberLogs.map((log) => (
                    <div key={log.id} className="border-b border-[var(--brand-border)] px-4 py-3 text-sm last:border-0">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="font-semibold text-[var(--brand-navy)]">{contactTypeLabels[log.contactType]}</p>
                        <p className="text-xs text-[var(--brand-muted)]">{formatDisplayDate(log.contactedAt)}</p>
                      </div>
                      <p className="mt-2 text-[var(--brand-text)]">{log.notes}</p>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-sm text-[var(--brand-muted)]">No contact has been logged yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
