import { ShepherdingDashboard } from "@/components/admin/shepherding-dashboard";

export default function ShepherdingDashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="admin-no-print mb-8 max-w-3xl space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-[var(--brand-burgundy)]">
          Pastor only
        </p>
        <h1 className="text-4xl font-semibold text-[var(--brand-navy)]">
          Shepherding dashboard
        </h1>
        <p className="text-lg leading-8 text-[var(--brand-muted)]">
          A simple pastoral view for deacon meetings, ministry leader meetings,
          prayer, follow-up, and healthy member data.
        </p>
      </div>
      <ShepherdingDashboard />
    </main>
  );
}
