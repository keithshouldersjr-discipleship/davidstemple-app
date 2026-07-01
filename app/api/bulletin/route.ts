import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { type WeeklyBulletin } from "@/lib/bulletin-data";
import { getCurrentBulletin } from "@/lib/bulletin-server";

const bulletinManagerEmail = "keithshouldersjr@gmail.com";

function clean(value?: string) {
  return value?.trim() ?? "";
}

function createAuthorizedSupabaseClient(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const authorization = request.headers.get("authorization");

  if (!supabaseUrl || !supabaseAnonKey) {
    return { configured: false, supabase: null };
  }

  if (!authorization) {
    return { configured: true, supabase: null };
  }

  return {
    configured: true,
    supabase: createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: authorization,
        },
      },
    }),
  };
}

async function canManageBulletin(request: Request) {
  const { configured, supabase } = createAuthorizedSupabaseClient(request);

  if (!supabase) {
    return { allowed: false, configured, email: "", supabase: null };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = user?.email?.toLowerCase() ?? "";

  if (!email) {
    return { allowed: false, configured, email, supabase };
  }

  return { allowed: email === bulletinManagerEmail, configured, email, supabase };
}

function validateBulletin(body: unknown): WeeklyBulletin | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const bulletin = body as Partial<WeeklyBulletin>;

  if (!clean(bulletin.slug) || !clean(bulletin.dateRange) || !clean(bulletin.title)) {
    return null;
  }

  if (!bulletin.pastor?.note || !bulletin.focus?.body) {
    return null;
  }

  return bulletin as WeeklyBulletin;
}

export async function GET() {
  return NextResponse.json({ bulletin: await getCurrentBulletin() });
}

export async function POST(request: Request) {
  const bulletin = validateBulletin(await request.json().catch(() => null));

  if (!bulletin) {
    return NextResponse.json(
      { message: "Please complete the bulletin title, slug, date range, pastor note, and focus." },
      { status: 400 },
    );
  }

  const { allowed, configured, email, supabase } = await canManageBulletin(request);

  if (!configured) {
    return NextResponse.json(
      { message: "Supabase is not configured, so the bulletin cannot be published from the admin form yet." },
      { status: 500 },
    );
  }

  if (!allowed || !supabase) {
    return NextResponse.json(
      { message: "Only bulletin managers and admins can publish bulletins." },
      { status: 403 },
    );
  }

  const payload = {
    slug: bulletin.slug,
    content: bulletin,
    is_published: true,
    published_at: new Date().toISOString(),
    updated_by: email,
  };

  const { error } = await supabase
    .from("bulletin_issues")
    .upsert(payload, { onConflict: "slug" })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  revalidatePath("/bulletin");

  return NextResponse.json({
    message: "Bulletin published.",
    bulletinUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://davidstemple.app"}/bulletin`,
  });
}
