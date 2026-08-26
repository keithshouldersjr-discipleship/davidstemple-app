import type { Metadata } from "next";
import { HeartHandshake, MessageCircleHeart, ShieldCheck, Trophy } from "lucide-react";
import { PrayerMentorSignupForm } from "@/components/prayer-mentors/prayer-mentor-signup-form";

export const metadata: Metadata = {
  title: "Prayer Mentors | David's Temple",
  description: "Sign up as a prayer mentor or enroll a teen mentee at David's Temple.",
};

const programHighlights = [
  {
    icon: MessageCircleHeart,
    title: "Encourage regularly",
    description: "Pray, check in, and remind a teen that someone in their church family is cheering for them.",
  },
  {
    icon: Trophy,
    title: "Show up when possible",
    description: "Support approved extracurricular activities such as games, performances, school events, and celebrations.",
  },
  {
    icon: ShieldCheck,
    title: "Serve safely",
    description: "Mentors are matched with a teen of the same sex and follow church screening, training, and child-safety policies.",
  },
];

export default function PrayerMentorsPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-soft)]">
      <section className="relative overflow-hidden bg-[var(--brand-navy)] text-white">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/5" aria-hidden="true" />
        <div className="absolute -bottom-36 -left-20 h-96 w-96 rounded-full bg-[var(--brand-burgundy)]/30" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/12">
            <HeartHandshake className="h-7 w-7" aria-hidden="true" />
          </span>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
            David&apos;s Temple Youth Ministry
          </p>
          <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Prayer Mentors
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-white/82 sm:text-lg sm:leading-8">
            We pair teens with caring adult mentors of the same sex for prayer, encouragement, and faithful support in all of life.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {programHighlights.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-2xl border border-[var(--brand-border)] bg-white p-5 shadow-sm shadow-slate-900/5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-burgundy-soft)] text-[var(--brand-burgundy)]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-[var(--brand-navy)]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-[#F4D5DC] bg-[var(--brand-burgundy-soft)] px-5 py-4 text-sm leading-6 text-[var(--brand-text)]">
          <strong className="text-[var(--brand-burgundy)]">Before a match is made:</strong> ministry leaders review each signup, confirm member details, complete required screening steps, verify parent or guardian consent, and consider mentor capacity. A mentor may support up to three mentees.
        </div>

        <div className="mt-8">
          <PrayerMentorSignupForm />
        </div>
      </section>
    </main>
  );
}
