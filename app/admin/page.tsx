import { Database, Lock, PencilLine, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const futureTools = [
  {
    title: "Links and resources",
    body: "Update visit, care, giving, serving, and ministry links without changing code.",
    icon: PencilLine,
  },
  {
    title: "FAQs and assistant knowledge",
    body: "Manage approved answers that ask.dt can use when responding to church questions.",
    icon: Database,
  },
  {
    title: "Announcements and events",
    body: "Publish timely updates for members, visitors, and ministry leaders.",
    icon: ShieldCheck,
  },
];

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-[var(--brand-burgundy)]">
          Admin
        </p>
        <h1 className="text-4xl font-semibold text-[var(--brand-navy)]">Leadership tools coming soon</h1>
        <p className="text-lg leading-8 text-[var(--brand-muted)]">
          Future versions will allow church leadership to update links, FAQs,
          announcements, and events. Authentication is not enabled yet, but this
          page is ready for a protected admin experience later.
        </p>
      </div>
      <Card className="mb-6">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-navy)]/8 text-[var(--brand-navy)]">
            <Lock className="h-6 w-6" />
          </span>
          <div>
            <p className="font-semibold text-[var(--brand-navy)]">Auth can be added here later.</p>
            <p className="text-sm leading-6 text-[var(--brand-muted)]">
              This placeholder keeps the admin route visible while the app is still
              running on mock data.
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        {futureTools.map((tool) => (
          <Card key={tool.title}>
            <CardHeader>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-burgundy-soft)] text-[var(--brand-burgundy)]">
                <tool.icon className="h-5 w-5" />
              </span>
              <CardTitle>{tool.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-[var(--brand-muted)]">{tool.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
