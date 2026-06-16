"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { ChatPanel } from "@/components/assistant/chat-panel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AskQuestionButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button type="button" variant="light" size="lg" className="w-full whitespace-nowrap sm:w-auto" onClick={() => setIsOpen(true)}>
        <MessageCircle className="h-5 w-5" />
        Ask a Question
      </Button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-3 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ask-question-title"
          onClick={() => setIsOpen(false)}
        >
          <Card className="max-h-[90vh] w-full max-w-2xl overflow-hidden" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between gap-4 border-b border-[var(--brand-border)] p-5">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--brand-burgundy)]">ask.dt</p>
                <h2 id="ask-question-title" className="mt-1 text-2xl font-semibold text-[var(--brand-navy)]">Ask a Question</h2>
              </div>
              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--brand-border)] text-[var(--brand-muted)] hover:bg-[var(--brand-soft)]"
                aria-label="Close ask.dt"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[72vh] overflow-y-auto p-5">
              <ChatPanel compact />
            </div>
          </Card>
        </div>
      ) : null}
    </>
  );
}
