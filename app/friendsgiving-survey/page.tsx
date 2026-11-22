import type { Metadata } from "next";
import Image from "next/image";
import { Heart, Lightbulb, MessageCircleHeart } from "lucide-react";
import { FriendsgivingSurveyForm } from "@/components/events/friendsgiving-survey-form";

export const metadata: Metadata = {
  title: "Friendsgiving Reflection | David's Temple",
  description: "Share a brief reflection after Friendsgiving Worship at David's Temple.",
  robots: { index: false, follow: false },
};

const reflectionPrompts = [
  {
    icon: Heart,
    number: "01",
    title: "Praise",
    description: "One thing you are praising God for.",
  },
  {
    icon: MessageCircleHeart,
    number: "02",
    title: "Consider",
    description: "One thing we should consider doing differently.",
  },
  {
    icon: Lightbulb,
    number: "03",
    title: "Learn",
    description: "One thing you learned from today.",
  },
];

export default function FriendsgivingSurveyPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-soft)]">
      <section className="relative overflow-hidden bg-[var(--brand-navy)] text-white">
        <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-white/5" aria-hidden="true" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-[var(--brand-burgundy)]/35" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8">
          <Image
            src="/davids-temple-logo-white.png"
            alt="David's Temple Missionary Baptist Church"
            width={3600}
            height={3600}
            priority
            className="mx-auto h-20 w-40 object-contain sm:h-24 sm:w-48"
          />
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
            Friendsgiving Worship 2026
          </p>
          <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Thank you for sharing the day with us.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/82 sm:text-lg sm:leading-8">
            Your reflection will help us celebrate what God did and learn how to serve our church family and guests even better.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {reflectionPrompts.map(({ icon: Icon, number, title, description }) => (
            <article key={title} className="rounded-2xl border border-[var(--brand-border)] bg-white p-5 shadow-sm shadow-slate-900/5">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-burgundy-soft)] text-[var(--brand-burgundy)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold tracking-[0.16em] text-slate-300">{number}</span>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-[var(--brand-navy)]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-8">
          <FriendsgivingSurveyForm />
        </div>
      </section>
    </main>
  );
}
