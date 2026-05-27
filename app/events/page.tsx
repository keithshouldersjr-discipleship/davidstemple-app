import { EventsBrowser } from "@/components/events/events-browser";
import { getEvents } from "@/lib/data";

export const revalidate = 300;

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-[var(--brand-burgundy)]">
          Events
        </p>
        <h1 className="text-4xl font-semibold text-[var(--brand-navy)]">Upcoming church events</h1>
        <p className="text-lg leading-8 text-[var(--brand-muted)]">
          A simple view of upcoming gatherings, classes, and ministry moments at
          David&apos;s Temple.
        </p>
      </div>
      <EventsBrowser events={events} />
    </main>
  );
}
