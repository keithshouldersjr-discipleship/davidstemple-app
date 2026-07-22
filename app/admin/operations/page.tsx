import { OperationsDashboard } from "@/components/admin/operations-dashboard";

export default function OperationsDashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-[var(--brand-burgundy)]">Church operations</p>
        <h1 className="text-4xl font-semibold text-[var(--brand-navy)]">Ministry health dashboard</h1>
        <p className="text-lg leading-8 text-[var(--brand-muted)]">One simple view of membership, attendance, guests, care, and serving participation across the church.</p>
      </div>
      <OperationsDashboard />
    </main>
  );
}
