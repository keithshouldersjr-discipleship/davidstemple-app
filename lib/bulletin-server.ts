import { currentBulletin, type WeeklyBulletin } from "@/lib/bulletin-data";
import { createSupabaseServerClient, type SupabaseBulletinIssueRow } from "@/lib/supabase";

export async function getCurrentBulletin(): Promise<WeeklyBulletin> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return currentBulletin;
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

    return currentBulletin;
  }

  return (data as SupabaseBulletinIssueRow).content as WeeklyBulletin;
}
