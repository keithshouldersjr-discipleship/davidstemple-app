"use client";

import Link from "next/link";
import { CalendarDays, Mail, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const visitSections = [
  {
    title: "What Should I Wear?",
    body: [
      "Come as you are.",
      "At David's Temple, you will see a little bit of everything. Some people dress up, and others dress more casually. We care far more about your presence than your outfit. We simply want you to feel welcome as you worship with us.",
    ],
  },
  {
    title: "Where Do I Park?",
    body: [
      "When you arrive, our parking attendants will help direct you to an available space. We are currently working to expand our parking, so we encourage guests to arrive a few minutes early.",
      "If this is your first time visiting, let one of our parking attendants know. We will be glad to help you find your way from the parking lot to the sanctuary.",
    ],
  },
  {
    title: "Where Do I Go When I Arrive?",
    body: [
      "Once you enter, one of our greeters or ushers will welcome you and help you find the sanctuary, restrooms, children's area, or anywhere else you need to go.",
      "You do not have to know your way around. We will help you.",
    ],
  },
  {
    title: "Where Do I Sit?",
    body: [
      "You are welcome to sit anywhere in the sanctuary. There are no assigned seats.",
      "If the sanctuary is full or you need help finding a comfortable place to sit, one of our ushers will gladly assist you.",
    ],
  },
  {
    title: "What Is Worship Like?",
    body: [
      "Our worship service includes prayer, singing, Scripture, giving, and preaching from God's Word. You can expect a warm church family, heartfelt worship, and a message that helps you understand and apply the Bible to your life.",
      "Our goal is not to put on a performance, but to worship God together and help people grow in faith.",
    ],
  },
  {
    title: "What About My Kids?",
    body: [
      "We love children and families.",
      "David's Temple offers nursery and youth church ministry for children from 0-14 years old. These ministries provide a safe, caring, and age-appropriate space where children can learn about Jesus and be encouraged in their faith.",
      "When you arrive, ask an usher or greeter about youth church or the nursery. They will help your family get checked in and answer any questions you may have.",
    ],
  },
  {
    title: "Will I Be Singled Out?",
    body: [
      "No. We want to welcome you, but we will not embarrass you.",
      "You may be greeted warmly by our members, but we do not want you to feel pressured or put on the spot. We are simply grateful that you chose to worship with us.",
    ],
  },
];

export function PlanVisitButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button type="button" size="lg" className="w-full whitespace-nowrap sm:w-auto" onClick={() => setIsOpen(true)}>
        <CalendarDays className="h-5 w-5" />
        Plan a Visit
      </Button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-3 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="plan-visit-title"
          onClick={() => setIsOpen(false)}
        >
          <Card className="max-h-[90vh] w-full max-w-3xl overflow-hidden" onClick={(event) => event.stopPropagation()}>
            <div className="relative min-h-44 bg-cover bg-center" style={{ backgroundImage: "url('/church-life/children-playing.png')" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-navy)]/92 via-[var(--brand-navy)]/68 to-transparent" />
              <div className="relative flex h-full min-h-44 items-start justify-between gap-4 p-6 text-white">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/75">Plan a Visit</p>
                  <h2 id="plan-visit-title" className="mt-3 max-w-xl text-3xl font-semibold leading-tight">
                    You&apos;re welcome at David&apos;s Temple.
                  </h2>
                </div>
                <button
                  type="button"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/50 bg-white/10 text-white hover:bg-white/20"
                  aria-label="Close plan a visit"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <CardContent className="max-h-[62vh] space-y-6 overflow-y-auto p-5">
              <div className="rounded-2xl bg-[var(--brand-soft)] p-5">
                <CardTitle className="text-2xl">Plan Your Visit to David&apos;s Temple</CardTitle>
                <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
                  We know visiting a church for the first time can feel like a big step. At David&apos;s Temple, we want your first visit to be simple, welcoming, and meaningful. Whether you have been in church all your life or you are just beginning to explore faith, there is a place for you here.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_0.9fr]">
                <div className="rounded-2xl border border-[var(--brand-border)] p-5">
                  <CardTitle className="text-xl">Worship Time and Location</CardTitle>
                  <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
                    Join us for worship on Sunday mornings at <span className="font-semibold text-[var(--brand-navy)]">9:30 AM</span>.
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[var(--brand-text)]">
                    David&apos;s Temple Missionary Baptist Church<br />
                    11273 Stewart Road<br />
                    Tanner, AL 35671
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[var(--brand-muted)]">
                    When you arrive, our greeters, ushers, and parking attendants will be ready to help you find your way.
                  </p>
                </div>
                <div className="rounded-2xl bg-[var(--brand-navy)] p-5 text-white">
                  <p className="flex items-center gap-2 font-semibold">
                    <MapPin className="h-4 w-4" />
                    Guest arrival
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/80">
                    If this is your first time visiting, tell a parking attendant, greeter, or usher. We will gladly help you from the parking lot to the sanctuary.
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                {visitSections.map((section) => (
                  <section key={section.title} className="rounded-2xl border border-[var(--brand-border)] bg-white p-5">
                    <h3 className="text-lg font-semibold text-[var(--brand-navy)]">{section.title}</h3>
                    <div className="mt-3 space-y-3">
                      {section.body.map((paragraph) => (
                        <p key={paragraph} className="text-sm leading-7 text-[var(--brand-muted)]">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <section className="rounded-2xl bg-[var(--brand-burgundy-soft)] p-5">
                <h3 className="text-lg font-semibold text-[var(--brand-navy)]">Have Questions Before You Come?</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
                  We would love to help make your visit easier. Contact us before your visit, or let us know you are coming so we can be ready to welcome you.
                </p>
              </section>

              <Link href="mailto:keithshouldersjr@gmail.com?subject=Guest%20Inquiry" className="block">
                <Button size="lg" className="w-full">
                  <Mail className="h-5 w-5" />
                  Connect With a Leader
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
}
