import { NextResponse } from "next/server";
import { getChurchInfo, getMinistryContacts, getUpcomingEventsForAssistant } from "@/lib/data";
import { ASK_DT_SYSTEM_INSTRUCTION, getMockAssistantResponse } from "@/lib/mock-data";
import type { ChurchInfo, MinistryContact } from "@/lib/types";

function scoreChurchInfoMatch(message: string, item: ChurchInfo) {
  const words = message
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 2);
  const haystack = `${item.topic} ${item.question} ${item.answer}`.toLowerCase();

  return words.reduce((score, word) => (haystack.includes(word) ? score + 1 : score), 0);
}

function scoreMinistryContactMatch(message: string, contact: MinistryContact) {
  const words = message
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 2);
  const haystack =
    `${contact.ministryName} ${contact.leaderName} ${contact.category} ${contact.description ?? ""}`.toLowerCase();

  return words.reduce((score, word) => (haystack.includes(word) ? score + 1 : score), 0);
}

async function getAssistantResponse(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("event") || normalized.includes("calendar") || normalized.includes("coming up")) {
    const upcomingEvents = await getUpcomingEventsForAssistant(5);
    const eventSummary = upcomingEvents
      .map((event) => `${event.title} on ${event.date}`)
      .join(", ");

    if (eventSummary) {
      return `The next events listed are ${eventSummary}. You can view the full calendar on the Events page.`;
    }
  }

  if (
    normalized.includes("serve") ||
    normalized.includes("ministry") ||
    normalized.includes("contact") ||
    normalized.includes("choir") ||
    normalized.includes("usher")
  ) {
    const ministryContacts = await getMinistryContacts();
    const bestContact = ministryContacts
      .map((contact) => ({ contact, score: scoreMinistryContactMatch(message, contact) }))
      .sort((a, b) => b.score - a.score)[0];

    if (bestContact && bestContact.score > 0) {
      return `${bestContact.contact.ministryName} is connected with ${bestContact.contact.leaderName}. You can call or text ${bestContact.contact.phone}. You can also visit the Serve page for the full ministry contact list.`;
    }

    if (ministryContacts.length > 0) {
      const contactSummary = ministryContacts
        .slice(0, 4)
        .map((contact) => contact.ministryName)
        .join(", ");

      return `You can visit the Serve page to find ministry contacts. Some listed areas include ${contactSummary}.`;
    }
  }

  const churchInfo = await getChurchInfo();
  const bestMatch = churchInfo
    .map((item) => ({ item, score: scoreChurchInfoMatch(message, item) }))
    .sort((a, b) => b.score - a.score)[0];

  if (bestMatch && bestMatch.score > 0) {
    return bestMatch.item.answer;
  }

  return getMockAssistantResponse(message);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { message?: string };
  const message = body.message ?? "";

  return NextResponse.json({
    assistant: "ask.dt",
    systemInstruction: ASK_DT_SYSTEM_INSTRUCTION,
    message: await getAssistantResponse(message),
  });
}
