"use client";

import { FormEvent, useMemo, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { SuggestedPrompts } from "@/components/assistant/suggested-prompts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

const introMessage =
  "Welcome to ask.dt. Ask me about service times, Sunday School, church events, serving opportunities, care requests, giving, or how to get connected at David's Temple.";

type ChatPanelProps = {
  compact?: boolean;
};

export function ChatPanel({ compact = false }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "intro", role: "assistant", content: introMessage },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messageList = useMemo(() => messages, [messages]);

  async function submitMessage(message: string) {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = (await response.json()) as { message?: string };

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            data.message ??
            "I do not have that information yet. Please contact the church office or check official David's Temple resources.",
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "I could not answer just now. Please try again or contact the church office for help.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitMessage(input);
  }

  return (
    <Card className="overflow-hidden border-[var(--brand-navy)]/15 bg-[var(--brand-navy)] text-white shadow-xl shadow-slate-900/15">
      <div className="border-b border-white/10 bg-white/[0.06] p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-white">ask.dt</p>
            <p className="text-sm text-white/72">David&apos;s Temple information assistant</p>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "space-y-4 overflow-y-auto p-5",
          compact ? "max-h-[360px]" : "min-h-[430px] max-h-[560px]",
        )}
      >
        {messageList.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[86%] rounded-3xl px-4 py-3 text-sm leading-6",
                message.role === "user"
                  ? "bg-[var(--brand-burgundy)] text-white"
                  : "bg-white text-[var(--brand-text)]",
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading ? (
          <div className="text-sm text-white/70">ask.dt is preparing a helpful reply...</div>
        ) : null}
      </div>
      <div className="space-y-4 border-t border-white/10 bg-white/[0.04] p-5">
        {!compact ? <SuggestedPrompts onSelect={submitMessage} /> : null}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about service times, events, serving, care, or next steps..."
            aria-label="Ask ask.dt a question"
          />
          <Button
            type="submit"
            className="h-11 w-11 shrink-0 px-0"
            disabled={isLoading}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
