import { NextResponse } from "next/server";

type MessageBody = {
  type?: "prayer" | "pastor";
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  anonymous?: boolean;
};

const pastorEmail = "keithshouldersjr@gmail.com";

function clean(value?: string) {
  return value?.trim() ?? "";
}

async function sendEmail({
  subject,
  text,
}: {
  subject: string;
  text: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EVENT_REQUEST_FROM ?? "David's Temple App <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn("Message email skipped: RESEND_API_KEY is not configured.");
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [pastorEmail],
      subject,
      text,
    }),
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as unknown;
    console.error("Resend rejected message email", {
      status: response.status,
      result,
    });
    throw new Error("Unable to send message.");
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as MessageBody;
  const type = body.type;
  const name = clean(body.name);
  const email = clean(body.email);
  const phone = clean(body.phone);
  const message = clean(body.message);
  const anonymous = Boolean(body.anonymous);

  if (type === "prayer") {
    if (!message) {
      return NextResponse.json(
        { message: "Please type your prayer request before submitting." },
        { status: 400 },
      );
    }

    if (!anonymous && (!name || (!email && !phone))) {
      return NextResponse.json(
        { message: "Please add your name and either a phone number or email, or choose anonymous." },
        { status: 400 },
      );
    }

    await sendEmail({
      subject: anonymous ? "Anonymous Prayer Request" : `Prayer Request from ${name}`,
      text: [
        anonymous ? "Anonymous Prayer Request" : `Prayer Request from ${name}`,
        "",
        `Name: ${anonymous ? "Anonymous" : name}`,
        `Email: ${anonymous ? "Not provided" : email || "Not provided"}`,
        `Phone: ${anonymous ? "Not provided" : phone || "Not provided"}`,
        "",
        "Prayer request:",
        message,
      ].join("\n"),
    });

    return NextResponse.json({
      message: "Thank you for sharing your prayer request. We are honored to pray with you.",
    });
  }

  if (type === "pastor") {
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { message: "Please include your name, email, phone number, and message." },
        { status: 400 },
      );
    }

    await sendEmail({
      subject: `Message for Pastor Keith from ${name}`,
      text: [
        `Message for Pastor Keith from ${name}`,
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    return NextResponse.json({
      message: "Your message has been sent to Pastor Keith.",
    });
  }

  return NextResponse.json(
    { message: "Please choose a valid message type." },
    { status: 400 },
  );
}
