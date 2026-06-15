import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

type InterestBody = {
  name?: string;
  email?: string;
  phone?: string;
  preferredContact?: string;
  interestArea?: string;
  sourceType?: string;
  sourceTitle?: string;
  sourceId?: string;
  message?: string;
  supportNeeded?: string[];
};

function clean(value?: string) {
  return value?.trim() ?? "";
}

function parseEmailRecipients(value?: string) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const recipients = (value ?? "")
    .split(/[;,]/)
    .map((email) => email.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);

  return {
    validRecipients: recipients.filter((email) => emailPattern.test(email)),
    invalidRecipients: recipients.filter((email) => !emailPattern.test(email)),
  };
}

async function sendInterestEmail(request: Required<Pick<InterestBody, "name" | "interestArea" | "sourceType" | "sourceTitle">> & InterestBody) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EVENT_REQUEST_FROM ?? "David's Temple App <onboarding@resend.dev>";
  const recipientConfig = process.env.CONNECTION_REQUEST_RECIPIENTS ?? process.env.EVENT_REQUEST_RECIPIENTS;
  const { validRecipients, invalidRecipients } = parseEmailRecipients(recipientConfig);

  if (!apiKey) {
    console.warn("Connection request email skipped: RESEND_API_KEY is not configured.");
    return;
  }

  if (invalidRecipients.length) {
    console.warn("Connection request email has invalid recipients", { invalidRecipients });
  }

  if (!validRecipients.length) {
    console.warn("Connection request email skipped: no recipients are configured.");
    return;
  }

  const subject = `Connection request: ${request.name}`;
  const text = [
    subject,
    "",
    `Name: ${request.name}`,
    `Email: ${request.email || "Not provided"}`,
    `Phone: ${request.phone || "Not provided"}`,
    `Preferred contact: ${request.preferredContact || "Not provided"}`,
    `Interest: ${request.interestArea}`,
    `Source: ${request.sourceType} - ${request.sourceTitle}`,
    "",
    "Support areas:",
    request.supportNeeded?.length ? request.supportNeeded.join(", ") : "Not provided",
    "",
    "Message:",
    request.message || "Not provided",
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: validRecipients,
      subject,
      text,
    }),
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as unknown;
    console.error("Resend rejected connection request email", {
      status: response.status,
      recipientCount: validRecipients.length,
      result,
    });
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as InterestBody;
  const name = clean(body.name);
  const email = clean(body.email);
  const phone = clean(body.phone);
  const preferredContact = clean(body.preferredContact);
  const interestArea = clean(body.interestArea);
  const sourceType = clean(body.sourceType);
  const sourceTitle = clean(body.sourceTitle);
  const sourceId = clean(body.sourceId);
  const message = clean(body.message);
  const supportNeeded = body.supportNeeded?.map((item) => clean(item)).filter(Boolean) ?? [];

  if (!name || (!email && !phone) || !interestArea) {
    return NextResponse.json(
      { message: "Please share your name, one way to contact you, and what you are interested in." },
      { status: 400 },
    );
  }

  const payload = {
    name,
    email: email || null,
    phone: phone || null,
    preferred_contact: preferredContact || null,
    interest_area: interestArea,
    source_type: sourceType || "general",
    source_title: sourceTitle || "David's Temple app",
    source_id: sourceId || null,
    message: message || null,
    support_needed: supportNeeded,
  };

  const supabase = createSupabaseServerClient();

  if (supabase) {
    const { error } = await supabase.from("connection_requests").insert(payload);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }

  await sendInterestEmail({
    name,
    email,
    phone,
    preferredContact,
    interestArea,
    sourceType: payload.source_type,
    sourceTitle: payload.source_title,
    sourceId,
    message,
    supportNeeded,
  }).catch((error) => {
    console.error("Unable to send connection request email", error);
  });

  return NextResponse.json({
    message: "Thanks for reaching out. Someone from David's Temple will follow up with you soon.",
  });
}
