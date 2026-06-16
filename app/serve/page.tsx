import Link from "next/link";
import { ArrowRight, HeartHandshake } from "lucide-react";
import { MinistryContactCard } from "@/components/serve/ministry-contact-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMinistryContacts } from "@/lib/data";

export const revalidate = 300;

export default async function ServePage() {
  const contacts = await getMinistryContacts();

  return (
    <main>
      <section className="bg-[var(--brand-navy)]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/70">
              Join A Ministry
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Join A Ministry
            </h1>
            <p className="text-lg leading-8 text-white/80">
              Every member has a place and a purpose. Find a ministry area, reach out
              to a leader, and take your next step in serving and growing.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="bg-[var(--brand-burgundy)] text-white">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <CardTitle className="text-white">Start with a ministry leader</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm leading-6 text-white/82">
              Browse the ministry contacts below, choose an area that feels close to your gifts, and use the get-involved button to take your next step.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/resources#visit">
                <Button variant="light" size="sm" className="w-full sm:w-auto">
                  Contact the church
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-6 max-w-3xl space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-[var(--brand-burgundy)]">
            Ministry Contacts
          </p>
          <h2 className="text-3xl font-semibold text-[var(--brand-navy)]">
            Find the right ministry leader
          </h2>
          <p className="text-base leading-7 text-[var(--brand-muted)]">
            Tap a card to call or text the ministry contact directly from your phone.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => (
            <MinistryContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      </section>
    </main>
  );
}
