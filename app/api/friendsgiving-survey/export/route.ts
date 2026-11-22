import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type SurveyRow = {
  submitted_at: string;
  praise: string;
  different: string;
  learned: string;
  submission_id: string;
};

function safeEqual(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);

  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

function spreadsheetSafe(value: string) {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function csvCell(value: string) {
  return `"${spreadsheetSafe(value).replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key") ?? "";
  const expectedKey = process.env.FRIENDSGIVING_SURVEY_EXPORT_KEY ?? "";
  const exportSecret = process.env.FRIENDSGIVING_SURVEY_EXPORT_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!key || !expectedKey || !safeEqual(key, expectedKey)) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  if (!exportSecret || !supabaseUrl || !supabaseKey) {
    console.error("Friendsgiving survey export is missing its secure storage configuration.");
    return NextResponse.json({ message: "The export is temporarily unavailable." }, { status: 503 });
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/friendsgiving_survey_responses?select=submitted_at,praise,different,learned,submission_id&order=submitted_at.asc`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "x-friendsgiving-secret": exportSecret,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    console.error("Friendsgiving survey export request failed", { status: response.status });
    return NextResponse.json({ message: "The export is temporarily unavailable." }, { status: 502 });
  }

  const rows = (await response.json()) as SurveyRow[];
  const lines = [
    ["Submitted at", "Praising God for", "Consider doing differently", "Learned today", "Submission ID"],
    ...rows.map((row) => [row.submitted_at, row.praise, row.different, row.learned, row.submission_id]),
  ];
  const csv = `${lines.map((line) => line.map((value) => csvCell(value)).join(",")).join("\n")}\n`;

  return new NextResponse(csv, {
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "Content-Disposition": 'inline; filename="friendsgiving-reflections.csv"',
      "Content-Type": "text/csv; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
