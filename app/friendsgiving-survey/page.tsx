import type { Metadata } from "next";
import Image from "next/image";
import { FriendsgivingSurveyForm } from "@/components/events/friendsgiving-survey-form";

export const metadata: Metadata = {
  title: "Friendsgiving Reflection | David's Temple",
  description: "Share a brief reflection after Friendsgiving Worship at David's Temple.",
  robots: { index: false, follow: false },
};

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
        <FriendsgivingSurveyForm />
      </section>
    </main>
  );
}
