import { NextResponse } from "next/server";

type SurveyBody = {
  praise?: unknown;
  different?: unknown;
  learned?: unknown;
  website?: unknown;
};

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as SurveyBody;

  if (clean(body.website, 200)) {
    return NextResponse.json({ message: "Thank you." });
  }

  const praise = clean(body.praise, 1_000);
  const different = clean(body.different, 1_000);
  const learned = clean(body.learned, 1_000);

  if (!praise || !different || !learned) {
    return NextResponse.json({ message: "Please answer all three questions before submitting." }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const writeSecret = process.env.FRIENDSGIVING_SURVEY_WRITE_SECRET;

  if (!supabaseUrl || !supabaseKey || !writeSecret) {
    console.error("Friendsgiving survey is missing its secure storage configuration.");
    return NextResponse.json(
      { message: "The survey is temporarily unavailable. Please try again shortly." },
      { status: 503 },
    );
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/friendsgiving_survey_responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Prefer: "return=minimal",
      "x-friendsgiving-secret": writeSecret,
    },
    body: JSON.stringify({
      submission_id: crypto.randomUUID(),
      submitted_at: new Date().toISOString(),
      praise,
      different,
      learned,
    }),
    cache: "no-store",
  }).catch((error) => {
    console.error("Friendsgiving survey storage request failed", error);
    return null;
  });

  if (!response?.ok) {
    console.error("Friendsgiving survey storage rejected the submission", { status: response?.status });
    return NextResponse.json({ message: "We couldn't save your reflection. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ message: "Your reflection was received successfully." });
}
