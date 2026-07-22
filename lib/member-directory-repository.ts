import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  SupabaseMemberContactLogRow,
  SupabaseMemberProfileRow,
} from "@/lib/supabase";

export type MemberDirectoryEntryInput = {
  id?: string;
  firstName: string;
  lastName: string;
  birthdayMonthDay?: string | null;
  phone?: string | null;
  email?: string | null;
  spouseName?: string | null;
  children?: string[];
  ministryInterests?: string[];
  deaconGroup?: string | null;
  householdLeaderId?: string | null;
  status: "active" | "inactive" | "deceased";
  notes?: string | null;
};

export async function listMemberDirectoryEntries(client: SupabaseClient) {
  const { data, error } = await client.rpc("get_member_directory_entries");
  if (error) throw error;
  return (data ?? []) as SupabaseMemberProfileRow[];
}

export async function saveMemberDirectoryEntry(
  client: SupabaseClient,
  input: MemberDirectoryEntryInput,
) {
  const { data, error } = await client.rpc("upsert_member_directory_entry", {
    active_member_id: input.id || null,
    first_name: input.firstName.trim(),
    last_name: input.lastName.trim(),
    birthday_month_day: input.birthdayMonthDay?.trim() || null,
    phone: input.phone?.trim() || null,
    email: input.email?.trim() || null,
    spouse_name: input.spouseName?.trim() || null,
    children: input.children ?? [],
    ministry_interests: input.ministryInterests ?? [],
    deacon_group: input.deaconGroup?.trim() || null,
    household_leader_id: input.householdLeaderId || null,
    status: input.status,
    notes: input.notes?.trim() || null,
  });
  if (error) throw error;
  return data as string;
}

export async function updateMemberDirectoryEntry(
  client: SupabaseClient,
  memberId: string,
  changes: Record<string, string | string[] | null>,
) {
  const { error } = await client.rpc("update_member_directory_entry", {
    active_member_id: memberId,
    changes,
  });
  if (error) throw error;
}

export async function listMemberDirectoryContactLogs(client: SupabaseClient) {
  const { data, error } = await client.rpc("get_member_directory_contact_logs");
  if (error) throw error;
  return (data ?? []) as SupabaseMemberContactLogRow[];
}

export async function addMemberDirectoryContactLog(
  client: SupabaseClient,
  input: {
    memberId: string;
    contactType: string;
    notes: string;
    contactedAt: string;
  },
) {
  const { error } = await client.rpc("add_member_directory_contact_log", {
    active_member_id: input.memberId,
    active_contact_type: input.contactType,
    active_notes: input.notes.trim(),
    active_contacted_at: input.contactedAt,
  });
  if (error) throw error;
}
