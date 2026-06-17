import { ResourceGrid } from "@/components/resources/resource-grid";
import { resources } from "@/lib/mock-data";

export default function ResourcesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-[var(--brand-burgundy)]">
          Resources
        </p>
        <h1 className="text-4xl font-semibold text-[var(--brand-navy)]">Helpful church links</h1>
        <p className="text-lg leading-8 text-[var(--brand-muted)]">
          Browse visit information, growth opportunities, serving pathways, care
          resources, and ministry updates.
        </p>
      </div>
      <ResourceGrid resources={resources} />
    </main>
  );
}
