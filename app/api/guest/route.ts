import { NextResponse } from "next/server";

type GuestBody = {
  firstName?: unknown;
  lastName?: unknown;
  mobile?: unknown;
  email?: unknown;
  firstVisit?: unknown;
  textOptIn?: unknown;
  prayerRequest?: unknown;
  interests?: unknown;
  howHeard?: unknown;
  website?: unknown;
};

const interestOptions = new Set([
  "Membership",
  "Baptism",
  "Children & Youth",
  "Serving",
  "Sunday School / Bible Study",
  "Speaking with the Pastor",
]);

const heardOptions = new Set([
  "Friend / Family",
  "Social Media",
  "Website",
  "Community Event",
  "Drive By / Sign",
  "Other",
]);

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as GuestBody;

  if (clean(body.website, 200)) {
    return NextResponse.json({ message: "Thank you." });
  }

  const firstName = clean(body.firstName, 80);
  const lastName = clean(body.lastName, 80);
  const mobile = clean(body.mobile, 30);
  const email = clean(body.email, 160).toLowerCase();
  const firstVisit = clean(body.firstVisit, 3);
  const textOptIn = clean(body.textOptIn, 3);
  const prayerRequest = clean(body.prayerRequest, 1_500);
  const howHeard = clean(body.howHeard, 80);
  const interests = Array.isArray(body.interests)
    ? [...new Set(body.interests.map((item) => clean(item, 80)).filter((item) => interestOptions.has(item)))]
    : [];

  if (!firstName || !lastName || !mobile || !["Yes", "No"].includes(firstVisit) || !["Yes", "No"].includes(textOptIn)) {
    return NextResponse.json({ message: "Please complete all required fields." }, { status: 400 });
  }

  if (mobile.replace(/\D/g, "").length < 10) {
    return NextResponse.json({ message: "Please enter a complete mobile number." }, { status: 400 });
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  if (howHeard && !heardOptions.has(howHeard)) {
    return NextResponse.json({ message: "Please choose a valid referral option." }, { status: 400 });
  }

  const webhookUrl = process.env.GUEST_SHEET_WEBHOOK_URL;
  const webhookSecret = process.env.GUEST_SHEET_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    console.error("Guest form is missing its spreadsheet webhook configuration.");
    return NextResponse.json(
      { message: "The guest form is temporarily unavailable. Please try again shortly." },
      { status: 503 },
    );
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      secret: webhookSecret,
      submissionId: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      firstName,
      lastName,
      mobile,
      email,
      firstVisit,
      textOptIn,
      prayerRequest,
      interests,
      howHeard,
    }),
    cache: "no-store",
  }).catch((error) => {
    console.error("Guest spreadsheet webhook request failed", error);
    return null;
  });

  if (!response?.ok) {
    console.error("Guest spreadsheet webhook rejected the submission", { status: response?.status });
    return NextResponse.json({ message: "We couldn't save your information. Please try again." }, { status: 502 });
  }

  const result = (await response.json().catch(() => null)) as { ok?: boolean } | null;
  if (!result?.ok) {
    return NextResponse.json({ message: "We couldn't save your information. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ message: "Your information was received successfully." });
}
