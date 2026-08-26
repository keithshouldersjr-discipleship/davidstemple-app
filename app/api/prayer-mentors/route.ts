import { NextResponse } from "next/server";

type SignupBody = Record<string, unknown> & {
  role?: unknown;
  website?: unknown;
};

const validPreferredContact = new Set(["Text", "Phone", "Email"]);
const validGrades = new Set(["6th", "7th", "8th", "9th", "10th", "11th", "12th", "Graduated / not in high school"]);

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  return value.replace(/\D/g, "").length >= 10;
}

function badRequest(message: string) {
  return NextResponse.json({ message }, { status: 400 });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as SignupBody;

  if (clean(body.website, 200)) {
    return NextResponse.json({ message: "Thank you." });
  }

  const role = clean(body.role, 20);
  const firstName = clean(body.firstName, 80);
  const lastName = clean(body.lastName, 80);

  if (!firstName || !lastName) {
    return badRequest("Please complete all required fields.");
  }

  let signup: Record<string, string | number>;

  if (role === "mentor") {
    const mobile = clean(body.mobile, 30);
    const email = clean(body.email, 160).toLowerCase();
    const preferredContact = clean(body.preferredContact, 20);
    const churchRelationship = clean(body.churchRelationship, 100);
    const maxMentees = Number(clean(body.maxMentees, 1));
    const adultConfirmation = clean(body.adultConfirmation, 3);
    const screeningConsent = clean(body.screeningConsent, 3);
    const mentorCommitment = clean(body.mentorCommitment, 3);

    if (!mobile || !isValidPhone(mobile)) return badRequest("Please enter a complete mobile number.");
    if (email && !isValidEmail(email)) return badRequest("Please enter a valid email address.");
    if (preferredContact === "Email" && !email) return badRequest("Please add an email address or choose another contact method.");
    if (!validPreferredContact.has(preferredContact) || !churchRelationship || ![1, 2, 3].includes(maxMentees)) {
      return badRequest("Please complete all required mentor fields.");
    }
    if (adultConfirmation !== "Yes" || screeningConsent !== "Yes" || mentorCommitment !== "Yes") {
      return badRequest("Please confirm all mentor commitments before submitting.");
    }

    signup = {
      firstName,
      lastName,
      mobile,
      email,
      preferredContact,
      churchRelationship,
      maxMentees,
      adultConfirmation,
      screeningConsent,
      mentorCommitment,
    };
  } else if (role === "mentee") {
    const age = Number(clean(body.age, 2));
    const grade = clean(body.grade, 60);
    const guardianName = clean(body.guardianName, 160);
    const guardianMobile = clean(body.guardianMobile, 30);
    const guardianEmail = clean(body.guardianEmail, 160).toLowerCase();
    const menteeMobile = clean(body.menteeMobile, 30);
    const menteeEmail = clean(body.menteeEmail, 160).toLowerCase();
    const guardianConsent = clean(body.guardianConsent, 3);
    const communicationConsent = clean(body.communicationConsent, 3);

    if (!Number.isInteger(age) || age < 12 || age > 19 || !validGrades.has(grade)) {
      return badRequest("Please enter a valid age and grade for the mentee.");
    }
    if (!guardianName || !isValidPhone(guardianMobile) || !isValidEmail(guardianEmail)) {
      return badRequest("Please complete the parent or guardian contact information and all required mentee fields.");
    }
    if (menteeMobile && !isValidPhone(menteeMobile)) return badRequest("Please enter a complete mentee mobile number or leave it blank.");
    if (menteeEmail && !isValidEmail(menteeEmail)) return badRequest("Please enter a valid mentee email address or leave it blank.");
    if (guardianConsent !== "Yes" || communicationConsent !== "Yes") {
      return badRequest("Parent or guardian consent is required for mentee enrollment.");
    }

    signup = {
      firstName,
      lastName,
      age,
      grade,
      guardianName,
      guardianMobile,
      guardianEmail,
      menteeMobile,
      menteeEmail,
      guardianConsent,
      communicationConsent,
    };
  } else {
    return badRequest("Please choose whether you are signing up a mentor or a mentee.");
  }

  const webhookUrl = process.env.PRAYER_MENTOR_SHEET_WEBHOOK_URL;
  const webhookSecret = process.env.PRAYER_MENTOR_SHEET_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    console.error("Prayer mentor form is missing its spreadsheet webhook configuration.");
    return NextResponse.json(
      { message: "The prayer mentor signup form is temporarily unavailable. Please try again shortly." },
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
      programYear: new Date().getFullYear(),
      role,
      ...signup,
    }),
    cache: "no-store",
  }).catch((error) => {
    console.error("Prayer mentor spreadsheet webhook request failed", error);
    return null;
  });

  if (!response?.ok) {
    console.error("Prayer mentor spreadsheet webhook rejected the submission", { status: response?.status });
    return NextResponse.json({ message: "We couldn't save this signup. Please try again." }, { status: 502 });
  }

  const result = (await response.json().catch(() => null)) as { ok?: boolean } | null;
  if (!result?.ok) {
    return NextResponse.json({ message: "We couldn't save this signup. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ message: "Your signup was received successfully." });
}
