import { NextResponse } from "next/server";
import { ASK_DT_SYSTEM_INSTRUCTION, getMockAssistantResponse } from "@/lib/mock-data";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { message?: string };
  const message = body.message ?? "";

  return NextResponse.json({
    assistant: "ask.dt",
    systemInstruction: ASK_DT_SYSTEM_INSTRUCTION,
    message: getMockAssistantResponse(message),
  });
}
