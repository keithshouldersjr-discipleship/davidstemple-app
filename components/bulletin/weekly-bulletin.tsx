import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
} from "lucide-react";
import {
  bulletinIcons,
  type BulletinIconName,
  type WeeklyBulletin,
} from "@/lib/bulletin-data";

function BulletinIcon({
  name,
  className,
}: {
  name: BulletinIconName;
  className?: string;
}) {
  const Icon = bulletinIcons[name];
  return <Icon className={className} aria-hidden="true" />;
}

function SectionTitle({
  icon,
  title,
  tone = "burgundy",
}: {
  icon: BulletinIconName;
  title: string;
  tone?: "burgundy" | "navy";
}) {
  return (
    <div
      className={`flex items-center gap-3 px-5 py-3 text-white ${
        tone === "navy"
          ? "bg-[var(--brand-navy)]"
          : "bg-[var(--brand-burgundy)]"
      }`}
    >
      <BulletinIcon name={icon} className="h-7 w-7 shrink-0" />
      <h2 className="text-xl font-black uppercase leading-none tracking-wide">
        {title}
      </h2>
    </div>
  );
}

function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`overflow-hidden rounded-lg border border-[var(--brand-border)] bg-white ${className}`}
    >
      {children}
    </section>
  );
}

function ActionLink({
  href,
  children,
  className = "",
  forceWhiteText = true,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  forceWhiteText?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[var(--brand-navy)] px-5 py-2 text-sm font-black uppercase text-white shadow-sm transition hover:bg-[var(--brand-navy-dark)] ${forceWhiteText ? "!text-white" : ""} ${className}`}
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

export function WeeklyBulletin({ bulletin }: { bulletin: WeeklyBulletin }) {
  const spotlightImage =
    bulletin.ministrySpotlight.ministry === "Social Media Team" &&
    bulletin.ministrySpotlight.image === "/church-life/community-service.png"
      ? "/church-life/social-media-spotlight.png"
      : bulletin.ministrySpotlight.image;

  return (
    <main className="bg-slate-200 py-4 sm:py-8">
      <article className="mx-auto max-w-6xl overflow-hidden bg-white shadow-2xl shadow-slate-950/15">
        <header className="grid gap-5 bg-[linear-gradient(100deg,#fff_0%,#fff_30%,rgba(255,255,255,.88)_62%,rgba(234,242,249,.9)_100%)] px-5 py-6 sm:px-8 lg:grid-cols-[290px_1fr_250px] lg:items-center">
          <div>
            <Image
              src="/davids-temple-logo-color.png"
              alt="David's Temple Missionary Baptist Church"
              width={3600}
              height={3600}
              priority
              className="h-auto w-64 max-w-full object-contain"
            />
          </div>
          <div>
            <h1 className="max-w-2xl text-5xl font-black uppercase leading-none text-[var(--brand-navy)] sm:text-6xl">
              David&apos;s Temple
              <span className="block text-[var(--brand-burgundy)]">
                Weekly Update
              </span>
            </h1>
            <p className="mt-4 text-lg font-black uppercase tracking-wide text-[var(--brand-navy)]">
              {bulletin.missionLine}
            </p>
            <p className="mt-2 text-base text-slate-950">{bulletin.subtitle}</p>
          </div>
          <div
            className="hidden h-32 rounded-lg bg-cover bg-center shadow-inner lg:block"
            style={{ backgroundImage: "url('/church-life/speaking-at-podium.png')" }}
            aria-label="David's Temple sanctuary"
          />
        </header>

        <div className="bg-[var(--brand-burgundy)] px-4 py-2 text-center text-2xl font-black uppercase tracking-wide text-white">
          {bulletin.dateRange}
        </div>

        <div className="grid gap-5 px-4 py-5 sm:px-7">
          <section className="grid gap-5 lg:grid-cols-[1.25fr_.9fr]">
            <div className="grid gap-5 sm:grid-cols-[255px_1fr] sm:items-center">
              <div className="overflow-hidden rounded-lg border border-slate-300 bg-slate-100">
                <Image
                  src={bulletin.pastor.image}
                  alt={bulletin.pastor.name}
                  width={480}
                  height={520}
                  className="aspect-[1/1.05] w-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase leading-tight text-[var(--brand-navy-dark)]">
                  {bulletin.pastor.noteTitle}
                </h2>
                <div className="mt-3 h-1 w-24 bg-[var(--brand-burgundy)]" />
                <p className="mt-4 text-base leading-7 text-slate-950">
                  {bulletin.pastor.note}
                </p>
                <p className="mt-3 text-lg font-black text-[var(--brand-burgundy)]">
                  - {bulletin.pastor.name}
                </p>
              </div>
            </div>

            <aside className="flex min-h-56 flex-col justify-center rounded-lg bg-[radial-gradient(circle_at_22%_20%,#0b4b84,#001f3f_62%)] p-7 text-white">
              <div className="flex items-center gap-4">
                <BulletinIcon name="book" className="h-12 w-12 shrink-0" />
                <div>
                  <h2 className="text-2xl font-black uppercase">
                    {bulletin.focus.title}
                  </h2>
                  <div className="mt-3 h-1 w-32 bg-[var(--brand-burgundy)]" />
                </div>
              </div>
              <p className="mt-6 whitespace-pre-line border-l-4 border-white/35 pl-5 text-lg font-semibold leading-8">
                {bulletin.focus.body}
              </p>
            </aside>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <Panel>
              <SectionTitle icon="calendar" title="This Week At A Glance" />
              <div className="px-5 py-3">
                {bulletin.weeklySchedule.map((item) => (
                  <div
                    key={`${item.label}-${item.time}`}
                    className="grid min-h-12 grid-cols-[34px_1fr_auto] items-center gap-4 border-b border-[var(--brand-border)] py-2 last:border-0"
                  >
                    <BulletinIcon
                      name={item.icon}
                      className="h-6 w-6 text-[var(--brand-burgundy)]"
                    />
                    <p className="font-black uppercase text-[var(--brand-burgundy)]">
                      {item.label}
                    </p>
                    <p className="text-right font-medium text-slate-950">
                      {item.time}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel>
              <SectionTitle icon="link" title="Important Links" tone="navy" />
              <div className="px-5 py-3">
                {bulletin.importantLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.url}
                    className="grid min-h-12 grid-cols-[34px_1fr_auto] items-center gap-4 border-b border-[var(--brand-border)] py-2 text-[var(--brand-navy-dark)] last:border-0 hover:text-[var(--brand-burgundy)]"
                  >
                    <BulletinIcon name={item.icon} className="h-6 w-6" />
                    <p className="font-black uppercase">{item.label}</p>
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </Panel>
          </section>

          <section className="overflow-hidden rounded-lg border border-[var(--brand-border)] bg-white lg:grid lg:grid-cols-[48%_1fr]">
            <div className="min-h-56 bg-cover bg-center" style={{ backgroundImage: `url('${bulletin.sundayInvite.image}')` }} />
            <div className="p-6">
              <h2 className="flex items-center gap-3 text-2xl font-black uppercase text-[var(--brand-burgundy)]">
                <BulletinIcon name="megaphone" className="h-8 w-8 shrink-0" />
                {bulletin.sundayInvite.title}
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-950">
                {bulletin.sundayInvite.body}
              </p>
              <p className="mt-2 font-black text-[var(--brand-burgundy)]">
                {bulletin.sundayInvite.emphasis}
              </p>
              <ActionLink href={bulletin.sundayInvite.buttonUrl} className="mt-4">
                {bulletin.sundayInvite.buttonLabel}
              </ActionLink>
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <Panel>
              <SectionTitle icon="calendar" title="Upcoming Events" />
              <div className="px-5 py-3">
                {bulletin.upcomingEvents.map((event) => (
                  <div
                    key={`${event.date}-${event.title}`}
                    className="grid gap-3 border-b border-[var(--brand-border)] py-3 last:border-0 sm:grid-cols-[92px_1fr]"
                  >
                    <p className="font-black uppercase text-[var(--brand-burgundy)]">
                      {event.date}
                    </p>
                    <div>
                      <p className="font-black text-slate-950">{event.title}</p>
                      <p className="text-sm text-slate-800">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel>
              <SectionTitle icon="users" title={bulletin.serve.title} tone="navy" />
              <div className="px-5 py-4">
                <p className="text-slate-950">{bulletin.serve.intro}</p>
                <ul className="mt-3 grid gap-2">
                  {bulletin.serve.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 font-bold">
                      <CheckCircle2 className="h-5 w-5 text-[var(--brand-navy)]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 font-black uppercase text-[var(--brand-navy)]">
                  {bulletin.serve.callout}
                </p>
              </div>
            </Panel>
          </section>

          <section className="grid gap-5 lg:grid-cols-3">
            <Panel>
              <SectionTitle icon="star" title={bulletin.ministrySpotlight.title} />
              <div className="grid gap-4 p-4 sm:grid-cols-[135px_1fr] lg:grid-cols-1 xl:grid-cols-[135px_1fr]">
                <div>
                  <Image
                    src={spotlightImage}
                    alt={bulletin.ministrySpotlight.ministry}
                    width={360}
                    height={240}
                    className="h-24 w-full rounded-md object-cover"
                  />
                  <ActionLink
                    href={bulletin.ministrySpotlight.buttonUrl}
                    className="mt-3 w-full"
                  >
                    {bulletin.ministrySpotlight.buttonLabel}
                  </ActionLink>
                </div>
                <div>
                  <p className="font-black uppercase text-[var(--brand-burgundy)]">
                    {bulletin.ministrySpotlight.ministry}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-950">
                    {bulletin.ministrySpotlight.body}
                  </p>
                </div>
              </div>
            </Panel>

            <Panel>
              <SectionTitle icon="hands" title={bulletin.prayerCare.title} tone="navy" />
              <div className="p-5">
                <p className="text-sm text-slate-950">{bulletin.prayerCare.intro}</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm font-medium text-slate-950">
                  {bulletin.prayerCare.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="mt-4 border-t border-[var(--brand-border)] pt-3">
                  <ActionLink
                    href={bulletin.prayerCare.contactUrl}
                    className="bg-white px-0 text-[var(--brand-navy)] shadow-none hover:bg-white hover:text-[var(--brand-burgundy)]"
                    forceWhiteText={false}
                  >
                    {bulletin.prayerCare.contactLabel}
                  </ActionLink>
                </div>
              </div>
            </Panel>

            <Panel>
              <SectionTitle icon="users" title={bulletin.stayConnected.title} />
              <div className="p-5">
                <p className="text-sm text-slate-950">{bulletin.stayConnected.intro}</p>
                <ol className="mt-3 space-y-2 text-sm font-bold text-slate-950">
                  {bulletin.stayConnected.items.map((item, index) => (
                    <li key={item} className="flex gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--brand-burgundy)] text-xs text-white">
                        {index + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
                <p className="mt-4 font-serif text-2xl italic text-[var(--brand-burgundy)]">
                  {bulletin.stayConnected.closing}
                </p>
              </div>
            </Panel>
          </section>
        </div>

        <footer className="grid gap-4 bg-[var(--brand-navy-dark)] px-6 py-4 text-sm font-medium uppercase text-white md:grid-cols-[1fr_1.2fr_1fr] md:items-center md:px-10">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[var(--brand-burgundy)]">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>{bulletin.footer.address}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[var(--brand-navy)]">
              <Clock3 className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>{bulletin.footer.serviceTimes.join(" | ")}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href={bulletin.footer.websiteUrl} className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[var(--brand-navy)]">
                <BulletinIcon name="globe" className="h-5 w-5" />
              </span>
              <span>{bulletin.footer.websiteLabel}</span>
            </Link>
            <Link href={bulletin.footer.facebookUrl} aria-label="Facebook">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-sm font-black text-[var(--brand-navy)]">
                f
              </span>
            </Link>
            <Link href={bulletin.footer.instagramUrl} aria-label="Instagram">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-sm font-black text-[var(--brand-navy)]">
                IG
              </span>
            </Link>
          </div>
        </footer>
      </article>
    </main>
  );
}
