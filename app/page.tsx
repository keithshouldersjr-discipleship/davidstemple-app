import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, Church, Compass, MessageCircle } from "lucide-react";
import { ChatPanel } from "@/components/assistant/chat-panel";
import { ResourceCard } from "@/components/resources/resource-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { events, resources } from "@/lib/mock-data";

export default function Home() {
  const featuredResources = resources.slice(0, 6);
  const monthlyEvents = events.slice(0, 3);

  return (
    <main>
      <section className="relative overflow-hidden bg-[var(--brand-navy)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_28rem)]" />
        <div className="pointer-events-none absolute -right-12 top-12 text-[18rem] font-bold leading-none text-white/[0.035] sm:text-[26rem]">
          +
        </div>
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1fr_0.86fr] md:items-center lg:px-8 lg:py-20">
          <div className="space-y-8">
            <Image
              src="/davids-temple-logo-white.png"
              alt="David's Temple Missionary Baptist Church"
              width={3600}
              height={3600}
              priority
              className="h-18 w-64 object-cover object-[center_62%] sm:h-20 sm:w-80"
            />
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white">
              <Church className="h-4 w-4" />
              davidstemple.app
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
                Ask. Find. Stay connected.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-white/80">
                A simple digital hub for David&apos;s Temple members, visitors, and ministry
                leaders.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/ask">
                <Button size="lg">
                  <MessageCircle className="h-5 w-5" />
                  Ask a question
                </Button>
              </Link>
              <Link href="/resources">
                <Button variant="light" size="lg">
                  <Compass className="h-5 w-5" />
                  Browse resources
                </Button>
              </Link>
            </div>
          </div>
          <ChatPanel compact />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-[var(--brand-burgundy)]">
              Helpful Links
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--brand-navy)]">Resources at a glance</h2>
          </div>
          <Link href="/resources" className="hidden text-sm font-medium text-[var(--brand-burgundy)] sm:inline-flex">
            View all resources
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-2 lg:px-8">
        <Card>
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-navy)]/8 text-[var(--brand-navy)]">
              <Church className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl">New to David&apos;s Temple?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="leading-7 text-[var(--brand-muted)]">
              We are glad you are here. Find visit information, Sunday School details,
              service times, care contacts, and simple next steps for getting connected.
            </p>
            <Link href="/resources">
              <Button variant="secondary">
                Start here
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-burgundy-soft)] text-[var(--brand-burgundy)]">
              <CalendarDays className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl">This Month at DT</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyEvents.map((event) => (
                <div key={event.id} className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-soft)] p-4">
                  <p className="font-medium text-[var(--brand-navy)]">{event.title}</p>
                  <p className="mt-1 text-sm text-[var(--brand-muted)]">
                    {event.date} at {event.time}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
