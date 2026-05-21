import { NextResponse } from "next/server";
import { getChurchInfo, getUpcomingEventsForAssistant } from "@/lib/data";
import { ASK_DT_SYSTEM_INSTRUCTION, getMockAssistantResponse } from "@/lib/mock-data";
import type { ChurchInfo } from "@/lib/types";

function scoreChurchInfoMatch(message: string, item: ChurchInfo) {
  const words = message
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 2);
  const haystack = `${item.topic} ${item.question} ${item.answer}`.toLowerCase();

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
