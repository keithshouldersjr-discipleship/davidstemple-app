import Link from "next/link";
import { ArrowRight, HeartHandshake, MessageCircle } from "lucide-react";
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
              Serve
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Serve at David&apos;s Temple
            </h1>
            <p className="text-lg leading-8 text-white/80">
              Every member has a place and a purpose. Find a ministry area, reach out
              to a leader, and take your next step in serving and growing.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-[1fr_0.8fr] lg:px-8">
        <Card className="bg-[var(--brand-burgundy)] text-white">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <CardTitle className="text-white">Not sure where to start?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm leading-6 text-white/82">
              ask.dt can help you think through ministry areas, or you can contact the
              church office for a personal next step.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/ask">
                <Button variant="light" size="sm" className="w-full sm:w-auto">
                  <MessageCircle className="h-4 w-4" />
                  Ask ask.dt
                </Button>
              </Link>
              <Link href="/resources#visit">
                <Button variant="light" size="sm" className="w-full sm:w-auto">
                  Contact the church
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Not sure what to say?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="rounded-2xl bg-[var(--brand-soft)] p-4 text-sm leading-7 text-[var(--brand-text)]">
              Hi [Leader&apos;s Name], my name is [Your Name] and I&apos;m interested
              in serving at David&apos;s Temple. I saw your name listed as the contact
              for [Ministry Name] and I&apos;d love to learn more about how I can get
              involved.
            </p>
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
