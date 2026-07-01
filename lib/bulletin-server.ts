import { currentBulletin, type WeeklyBulletin } from "@/lib/bulletin-data";
import { createSupabaseServerClient, type SupabaseBulletinIssueRow } from "@/lib/supabase";

function getCentralCalendarDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "numeric",
    timeZone: "America/Chicago",
    year: "numeric",
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return new Date(
    Date.UTC(
      Number(values.year),
      Number(values.month) - 1,
      Number(values.day),
    ),
  );
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

function formatRangeDate(date: Date, includeYear: boolean) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    ...(includeYear ? { year: "numeric" } : {}),
  }).format(date);
}

function getCurrentWeekDateRange() {
  const today = getCentralCalendarDate();
  const weekStart = addDays(today, -today.getUTCDay());
  const weekEnd = addDays(weekStart, 6);
  const sameYear = weekStart.getUTCFullYear() === weekEnd.getUTCFullYear();
  const start = formatRangeDate(weekStart, !sameYear);
  const end = formatRangeDate(weekEnd, true);

  return `${start} - ${end}`;
}

function withCurrentWeekDateRange(bulletin: WeeklyBulletin): WeeklyBulletin {
  return {
    ...bulletin,
    dateRange: getCurrentWeekDateRange(),
  };
}

export async function getCurrentBulletin(): Promise<WeeklyBulletin> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return withCurrentWeekDateRange(currentBulletin);
  }

  const { data, error } = await supabase
    .from("bulletin_issues")
    .select("id,slug,content,is_published,published_at,updated_by,created_at,updated_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    if (error && !["42P01", "PGRST205"].includes(error.code)) {
      console.error("Unable to load bulletin issue", error);
    }

    return withCurrentWeekDateRange(currentBulletin);
  }

  return withCurrentWeekDateRange((data as SupabaseBulletinIssueRow).content as WeeklyBulletin);
}
