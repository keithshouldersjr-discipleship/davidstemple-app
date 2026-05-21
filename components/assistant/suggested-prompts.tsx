"use client";

import { Button } from "@/components/ui/button";

export const suggestedPrompts = [
  "What time is Sunday School?",
  "What events are coming up?",
  "How can I serve?",
  "How do I submit a prayer or care request?",
  "How can I get connected?",
];

type SuggestedPromptsProps = {
  onSelect: (prompt: string) => void;
};

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestedPrompts.map((prompt) => (
        <Button
          key={prompt}
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => onSelect(prompt)}
          className="rounded-2xl"
        >
          {prompt}
        </Button>
      ))}
    </div>
  );
}
