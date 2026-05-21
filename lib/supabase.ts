import { createClient } from "@supabase/supabase-js";

export type SupabaseEventRow = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  location: string | null;
  registration_url: string | null;
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

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
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
