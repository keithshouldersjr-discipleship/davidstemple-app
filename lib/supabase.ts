import { createClient } from "@supabase/supabase-js";

export type SupabaseEventRow = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  ministry: string | null;
  location: string | null;
  registration_url: string | null;
  flyer_url: string | null;
};

export type SupabaseEventRequestRow = {
  id: string;
  title: string;
  date: string;
  time: string | null;
  ministry: string | null;
  location: string | null;
  description: string | null;
  status: "pending" | "approved" | "rejected";
  approved_event_id: string | null;
  created_at: string;
};

export type SupabaseChurchInfoRow = {
  id: string;
  topic: string;
  question: string;
  answer: string;
  source_url: string | null;
  last_updated: string;
};

export type SupabaseMinistryContactRow = {
  id: string;
  ministry_name: string;
  leader_name: string;
  phone: string;
  description: string | null;
  category: string;
  is_active: boolean;
  sort_order: number;
};

export type SupabaseMemberProfileRow = {
  id: string;
  first_name: string;
  last_name: string;
  birthday_month_day: string | null;
  phone: string | null;
  email: string | null;
  spouse_name: string | null;
  children: string[] | null;
  ministry_interests: string[] | null;
  deacon_group: string | null;
  status: "active" | "inactive" | "deceased";
  notes: string | null;
};

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export function createSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
    },
  );
}
