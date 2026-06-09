import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

type EventRequestBody = {
  title?: string;
  date?: string;
  time?: string;
  ministry?: string;
  location?: string;
  description?: string;
};

function clean(value?: string) {
  return value?.trim() ?? "";
}

async function sendEventRequestEmail(request: EventRequestBody & {
  title: string;
  date: string;
  time: string;
  ministry: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EVENT_REQUEST_FROM ?? "David's Temple App <onboarding@resend.dev>";
  const recipients = process.env.EVENT_REQUEST_RECIPIENTS?.split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (!apiKey) {
    console.warn("Event request email skipped: RESEND_API_KEY is not configured.");
    return;
  }

  if (!recipients?.length) {
    console.warn("Event request email skipped: EVENT_REQUEST_RECIPIENTS is not configured.");
    return;
  }

  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://davidstemple.app"}/admin?tab=events`;
  const subject = `New David's Temple Event: ${request.title}`;
  const text = [
    subject,
    "",
    `Title: ${request.title}`,
    `Date: ${request.date}`,
    `Time: ${request.time || "Not provided"}`,
    `Ministry: ${request.ministry || "Not provided"}`,
    `Location: ${request.location || "Not provided"}`,
    "",
    "Description:",
    request.description || "Not provided",
    "",
    `Review and approve this event in the admin portal: ${adminUrl}`,
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: recipients,
      subject,
      text,
    }),
  });

  const result = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    console.error("Resend rejected event request email", {
      status: response.status,
      from,
      recipientCount: recipients.length,
      result,
    });
    return;
  }

  console.info("Event request email accepted by Resend", {
    recipientCount: recipients.length,
    result,
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as EventRequestBody;
  const title = clean(body.title);
  const date = clean(body.date);
  const time = clean(body.time);
  const ministry = clean(body.ministry);
  const location = clean(body.location);
  const description = clean(body.description);

  if (!title || !date || !time || !ministry) {
    return NextResponse.json(
      { message: "Please complete the title, date, time, and ministry fields." },
      { status: 400 },
    );
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json(
      { message: "Event requests are not configured yet." },
      { status: 500 },
    );
  }

  const payload = { title, date, time, ministry, location, description };
  const { error } = await supabase.from("event_requests").insert(payload);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  await sendEventRequestEmail(payload).catch((error) => {
    console.error("Unable to send event request email", error);
  });

  return NextResponse.json({
    message: "Your event request has been submitted for review.",
  });
}
