import { ChatPanel } from "@/components/assistant/chat-panel";

export default function AskPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-[var(--brand-burgundy)]">
          ask.dt
        </p>
        <h1 className="text-4xl font-semibold text-[var(--brand-navy)]">Ask a church question</h1>
        <p className="text-lg leading-8 text-[var(--brand-muted)]">
          Find clear next steps for service times, Sunday School, church events,
          serving, care requests, giving, and getting connected.
        </p>
      </div>
      <ChatPanel />
    </main>
  );
}
