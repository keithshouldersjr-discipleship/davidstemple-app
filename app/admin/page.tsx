import { MemberDirectoryDashboard } from "@/components/admin/member-directory-dashboard";
import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="admin-no-print mb-8 max-w-3xl space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-[var(--brand-burgundy)]">
          Admin
        </p>
        <h1 className="text-4xl font-semibold text-[var(--brand-navy)]">
          Church directory dashboard
        </h1>
        <p className="text-lg leading-8 text-[var(--brand-muted)]">
          Sign in to manage member profiles, update contact information, filter
          the directory, and prepare a clean printable directory view.
        </p>
        <Link className="inline-flex rounded-full border border-[var(--brand-navy)]/15 bg-white px-5 py-2.5 text-sm font-medium text-[var(--brand-navy)] transition hover:border-[var(--brand-burgundy)]/35 hover:bg-[var(--brand-burgundy-soft)]" href="/admin/operations">
          Open ministry health dashboard
        </Link>
      </div>
      <MemberDirectoryDashboard />
    </main>
  );
}
