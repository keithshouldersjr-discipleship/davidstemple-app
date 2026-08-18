import type { Metadata } from "next";
import { GuestConnectionForm } from "@/components/guest/guest-connection-form";

export const metadata: Metadata = {
  title: "Guest Connection | David's Temple",
  description: "Connect with David's Temple Missionary Baptist Church.",
};

export default function GuestPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-soft)]">
      <section className="bg-[var(--brand-navy)] text-white">
        <div className="mx-auto max-w-5xl px-4 py-10 text-center sm:px-6 sm:py-14 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
            David&apos;s Temple Missionary Baptist Church
          </p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">We&apos;re glad you&apos;re here.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
            Share a little about yourself so we can thank you for worshiping with us and help you take your next step.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <GuestConnectionForm />
      </div>
    </main>
  );
}
