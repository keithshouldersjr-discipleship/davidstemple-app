"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CheckCircle2, ExternalLink, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type {
  BulletinEvent,
  BulletinIconName,
  BulletinLink,
  BulletinScheduleItem,
  WeeklyBulletin,
} from "@/lib/bulletin-data";

type BulletinAdminPanelProps = {
  canManageBulletin: boolean;
  initialBulletin: WeeklyBulletin;
};

const iconOptions: BulletinIconName[] = [
  "book",
  "calendar",
  "church",
  "cross",
  "globe",
  "hands",
  "heart",
  "link",
  "megaphone",
  "phone",
  "sparkles",
  "star",
  "target",
  "users",
];

function makeSlug(dateRange: string) {
  return `weekly-update-${dateRange}`
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinLines(value: string[]) {
  return value.join("\n");
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[var(--brand-navy)]">{label}</span>
      {children}
    </label>
  );
}

function Textarea({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 text-sm text-[var(--brand-text)] outline-none placeholder:text-[var(--brand-muted)] focus:border-[var(--brand-burgundy)]"
    />
  );
}

function IconSelect({
  value,
  onChange,
}: {
  value: BulletinIconName;
  onChange: (value: BulletinIconName) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as BulletinIconName)}
      className="h-11 w-full rounded-full border border-[var(--brand-border)] bg-white px-4 text-sm text-[var(--brand-text)] outline-none focus:border-[var(--brand-burgundy)]"
    >
      {iconOptions.map((icon) => (
        <option key={icon} value={icon}>
          {icon}
        </option>
      ))}
    </select>
  );
}

export function BulletinAdminPanel({
  canManageBulletin,
  initialBulletin,
}: BulletinAdminPanelProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [form, setForm] = useState<WeeklyBulletin>(initialBulletin);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [publishedUrl, setPublishedUrl] = useState("");

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsLoading(true);

      fetch("/api/bulletin")
        .then((response) => response.json())
        .then((data) => {
          if (data.bulletin) {
            setForm(data.bulletin as WeeklyBulletin);
          }
        })
        .catch(() => {
          setMessage("I could not load the latest saved bulletin, so the form is using the bundled bulletin.");
        })
        .finally(() => setIsLoading(false));
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [supabase]);

  function update<K extends keyof WeeklyBulletin>(key: K, value: WeeklyBulletin[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateNested<K extends keyof WeeklyBulletin, NK extends keyof WeeklyBulletin[K]>(
    key: K,
    nestedKey: NK,
    value: WeeklyBulletin[K][NK],
  ) {
    setForm((current) => ({
      ...current,
      [key]: {
        ...(current[key] as object),
        [nestedKey]: value,
      },
    }));
  }

  function updateSchedule(index: number, value: BulletinScheduleItem) {
    update(
      "weeklySchedule",
      form.weeklySchedule.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
  }

  function updateLink(index: number, value: BulletinLink) {
    update(
      "importantLinks",
      form.importantLinks.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
  }

  function updateEvent(index: number, value: BulletinEvent) {
    update(
      "upcomingEvents",
      form.upcomingEvents.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !canManageBulletin) return;

    setIsSaving(true);
    setMessage("");
    setPublishedUrl("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      setMessage("Please sign in again before publishing the bulletin.");
      setIsSaving(false);
      return;
    }

    const payload = {
      ...form,
      slug: form.slug.trim() || makeSlug(form.dateRange),
    };

    const response = await fetch("/api/bulletin", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json().catch(() => ({}))) as {
      message?: string;
      bulletinUrl?: string;
    };

    if (!response.ok) {
      setMessage(result.message ?? "I could not publish the bulletin.");
    } else {
      setForm(payload);
      setPublishedUrl(result.bulletinUrl ?? "https://davidstemple.app/bulletin");
    }

    setIsSaving(false);
  }

  if (!canManageBulletin) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="font-semibold text-[var(--brand-navy)]">Bulletin access</p>
          <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
            Only admins and communications managers can publish weekly bulletins.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Weekly bulletin builder</CardTitle>
          <p className="text-sm leading-6 text-[var(--brand-muted)]">
            Update the fields below, then generate the bulletin. The public
            page will keep the same format and use the new content.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <Field label="Bulletin slug">
                <Input
                  value={form.slug}
                  onChange={(event) => update("slug", event.target.value)}
                  placeholder="weekly-update-2026-06-30"
                  required
                />
              </Field>
              <Field label="Date range">
                <Input
                  value={form.dateRange}
                  onChange={(event) => update("dateRange", event.target.value)}
                  placeholder="June 30 - July 6, 2026"
                  required
                />
              </Field>
              <Field label="Title">
                <Input
                  value={form.title}
                  onChange={(event) => update("title", event.target.value)}
                  required
                />
              </Field>
              <Field label="Mission line">
                <Input
                  value={form.missionLine}
                  onChange={(event) => update("missionLine", event.target.value)}
                  required
                />
              </Field>
            </div>

            <Field label="Subtitle">
              <Input
                value={form.subtitle}
                onChange={(event) => update("subtitle", event.target.value)}
                required
              />
            </Field>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Pastor note</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Field label="Pastor name">
                    <Input
                      value={form.pastor.name}
                      onChange={(event) => updateNested("pastor", "name", event.target.value)}
                      required
                    />
                  </Field>
                  <Field label="Pastor image path">
                    <Input
                      value={form.pastor.image}
                      onChange={(event) => updateNested("pastor", "image", event.target.value)}
                    />
                  </Field>
                  <Field label="Section title">
                    <Input
                      value={form.pastor.noteTitle}
                      onChange={(event) => updateNested("pastor", "noteTitle", event.target.value)}
                      required
                    />
                  </Field>
                  <Field label="Pastor note">
                    <Textarea
                      value={form.pastor.note}
                      onChange={(value) => updateNested("pastor", "note", value)}
                      rows={6}
                    />
                  </Field>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Scripture and invitation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Field label="Scripture section title">
                    <Input
                      value={form.focus.title}
                      onChange={(event) => updateNested("focus", "title", event.target.value)}
                      placeholder="This Sunday's Scripture"
                      required
                    />
                  </Field>
                  <Field label="Scripture passage">
                    <Textarea
                      value={form.focus.body}
                      onChange={(value) => updateNested("focus", "body", value)}
                      rows={9}
                      placeholder={"John 3:16-17 (KJV)\n\nFor God so loved the world..."}
                    />
                    <p className="text-xs leading-5 text-[var(--brand-muted)]">
                      Paste the passage exactly as you want it displayed. Line
                      breaks will be preserved on the bulletin.
                    </p>
                  </Field>
                  <Field label="Sunday invite title">
                    <Input
                      value={form.sundayInvite.title}
                      onChange={(event) => updateNested("sundayInvite", "title", event.target.value)}
                      required
                    />
                  </Field>
                  <Field label="Sunday invite image path">
                    <Input
                      value={form.sundayInvite.image}
                      onChange={(event) => updateNested("sundayInvite", "image", event.target.value)}
                    />
                  </Field>
                  <Field label="Sunday invite body">
                    <Textarea
                      value={form.sundayInvite.body}
                      onChange={(value) => updateNested("sundayInvite", "body", value)}
                      rows={4}
                    />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Emphasis">
                      <Input
                        value={form.sundayInvite.emphasis}
                        onChange={(event) => updateNested("sundayInvite", "emphasis", event.target.value)}
                      />
                    </Field>
                    <Field label="Button label">
                      <Input
                        value={form.sundayInvite.buttonLabel}
                        onChange={(event) => updateNested("sundayInvite", "buttonLabel", event.target.value)}
                      />
                    </Field>
                  </div>
                  <Field label="Button URL">
                    <Input
                      value={form.sundayInvite.buttonUrl}
                      onChange={(event) => updateNested("sundayInvite", "buttonUrl", event.target.value)}
                    />
                  </Field>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-2xl">
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>This week at a glance</CardTitle>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      update("weeklySchedule", [
                        ...form.weeklySchedule,
                        { label: "", time: "", icon: "calendar" },
                      ])
                    }
                  >
                    <Plus className="h-4 w-4" />
                    Add row
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {form.weeklySchedule.map((item, index) => (
                  <div key={index} className="grid gap-3 rounded-2xl border border-[var(--brand-border)] p-3 lg:grid-cols-[1fr_180px_150px_auto]">
                    <Input
                      value={item.label}
                      onChange={(event) => updateSchedule(index, { ...item, label: event.target.value })}
                      placeholder="Sunday School"
                    />
                    <Input
                      value={item.time}
                      onChange={(event) => updateSchedule(index, { ...item, time: event.target.value })}
                      placeholder="8:30 AM"
                    />
                    <IconSelect
                      value={item.icon}
                      onChange={(value) => updateSchedule(index, { ...item, icon: value })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-[var(--brand-burgundy)]"
                      onClick={() => update("weeklySchedule", form.weeklySchedule.filter((_, itemIndex) => itemIndex !== index))}
                      aria-label="Remove schedule row"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>Important links</CardTitle>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      update("importantLinks", [
                        ...form.importantLinks,
                        { label: "", url: "", icon: "link" },
                      ])
                    }
                  >
                    <Plus className="h-4 w-4" />
                    Add link
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {form.importantLinks.map((item, index) => (
                  <div key={index} className="grid gap-3 rounded-2xl border border-[var(--brand-border)] p-3 lg:grid-cols-[1fr_1.2fr_150px_auto]">
                    <Input
                      value={item.label}
                      onChange={(event) => updateLink(index, { ...item, label: event.target.value })}
                      placeholder="Plan Your Visit"
                    />
                    <Input
                      value={item.url}
                      onChange={(event) => updateLink(index, { ...item, url: event.target.value })}
                      placeholder="/resources#visit"
                    />
                    <IconSelect
                      value={item.icon}
                      onChange={(value) => updateLink(index, { ...item, icon: value })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-[var(--brand-burgundy)]"
                      onClick={() => update("importantLinks", form.importantLinks.filter((_, itemIndex) => itemIndex !== index))}
                      aria-label="Remove link"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>Upcoming events</CardTitle>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      update("upcomingEvents", [
                        ...form.upcomingEvents,
                        { date: "", title: "", description: "" },
                      ])
                    }
                  >
                    <Plus className="h-4 w-4" />
                    Add event
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {form.upcomingEvents.map((item, index) => (
                  <div key={index} className="grid gap-3 rounded-2xl border border-[var(--brand-border)] p-3 lg:grid-cols-[150px_1fr_1.5fr_auto]">
                    <Input
                      value={item.date}
                      onChange={(event) => updateEvent(index, { ...item, date: event.target.value })}
                      placeholder="July 6"
                    />
                    <Input
                      value={item.title}
                      onChange={(event) => updateEvent(index, { ...item, title: event.target.value })}
                      placeholder="Communion Sunday"
                    />
                    <Input
                      value={item.description}
                      onChange={(event) => updateEvent(index, { ...item, description: event.target.value })}
                      placeholder="Join us as we remember..."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-[var(--brand-burgundy)]"
                      onClick={() => update("upcomingEvents", form.upcomingEvents.filter((_, itemIndex) => itemIndex !== index))}
                      aria-label="Remove event"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Serve</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Field label="Title">
                    <Input
                      value={form.serve.title}
                      onChange={(event) => updateNested("serve", "title", event.target.value)}
                    />
                  </Field>
                  <Field label="Intro">
                    <Textarea
                      value={form.serve.intro}
                      onChange={(value) => updateNested("serve", "intro", value)}
                      rows={3}
                    />
                  </Field>
                  <Field label="Serving items, one per line">
                    <Textarea
                      value={joinLines(form.serve.items)}
                      onChange={(value) => updateNested("serve", "items", splitLines(value))}
                      rows={6}
                    />
                  </Field>
                  <Field label="Callout">
                    <Input
                      value={form.serve.callout}
                      onChange={(event) => updateNested("serve", "callout", event.target.value)}
                    />
                  </Field>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Prayer & care</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Field label="Title">
                    <Input
                      value={form.prayerCare.title}
                      onChange={(event) => updateNested("prayerCare", "title", event.target.value)}
                    />
                  </Field>
                  <Field label="Intro">
                    <Textarea
                      value={form.prayerCare.intro}
                      onChange={(value) => updateNested("prayerCare", "intro", value)}
                      rows={3}
                    />
                  </Field>
                  <Field label="Prayer items, one per line">
                    <Textarea
                      value={joinLines(form.prayerCare.items)}
                      onChange={(value) => updateNested("prayerCare", "items", splitLines(value))}
                      rows={6}
                    />
                  </Field>
                  <Field label="Contact label">
                    <Input
                      value={form.prayerCare.contactLabel}
                      onChange={(event) => updateNested("prayerCare", "contactLabel", event.target.value)}
                    />
                  </Field>
                  <Field label="Contact URL">
                    <Input
                      value={form.prayerCare.contactUrl}
                      onChange={(event) => updateNested("prayerCare", "contactUrl", event.target.value)}
                    />
                  </Field>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Stay connected</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Field label="Title">
                    <Input
                      value={form.stayConnected.title}
                      onChange={(event) => updateNested("stayConnected", "title", event.target.value)}
                    />
                  </Field>
                  <Field label="Intro">
                    <Textarea
                      value={form.stayConnected.intro}
                      onChange={(value) => updateNested("stayConnected", "intro", value)}
                      rows={3}
                    />
                  </Field>
                  <Field label="Steps, one per line">
                    <Textarea
                      value={joinLines(form.stayConnected.items)}
                      onChange={(value) => updateNested("stayConnected", "items", splitLines(value))}
                      rows={6}
                    />
                  </Field>
                  <Field label="Closing">
                    <Input
                      value={form.stayConnected.closing}
                      onChange={(event) => updateNested("stayConnected", "closing", event.target.value)}
                    />
                  </Field>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Ministry spotlight</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-2">
                <Field label="Section title">
                  <Input
                    value={form.ministrySpotlight.title}
                    onChange={(event) => updateNested("ministrySpotlight", "title", event.target.value)}
                  />
                </Field>
                <Field label="Ministry name">
                  <Input
                    value={form.ministrySpotlight.ministry}
                    onChange={(event) => updateNested("ministrySpotlight", "ministry", event.target.value)}
                  />
                </Field>
                <Field label="Image path">
                  <Input
                    value={form.ministrySpotlight.image}
                    onChange={(event) => updateNested("ministrySpotlight", "image", event.target.value)}
                  />
                </Field>
                <Field label="Button label">
                  <Input
                    value={form.ministrySpotlight.buttonLabel}
                    onChange={(event) => updateNested("ministrySpotlight", "buttonLabel", event.target.value)}
                  />
                </Field>
                <Field label="Button URL">
                  <Input
                    value={form.ministrySpotlight.buttonUrl}
                    onChange={(event) => updateNested("ministrySpotlight", "buttonUrl", event.target.value)}
                  />
                </Field>
                <Field label="Spotlight body">
                  <Textarea
                    value={form.ministrySpotlight.body}
                    onChange={(value) => updateNested("ministrySpotlight", "body", value)}
                    rows={5}
                  />
                </Field>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Footer</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-2">
                <Field label="Address">
                  <Input
                    value={form.footer.address}
                    onChange={(event) => updateNested("footer", "address", event.target.value)}
                  />
                </Field>
                <Field label="Website label">
                  <Input
                    value={form.footer.websiteLabel}
                    onChange={(event) => updateNested("footer", "websiteLabel", event.target.value)}
                  />
                </Field>
                <Field label="Website URL">
                  <Input
                    value={form.footer.websiteUrl}
                    onChange={(event) => updateNested("footer", "websiteUrl", event.target.value)}
                  />
                </Field>
                <Field label="Facebook URL">
                  <Input
                    value={form.footer.facebookUrl}
                    onChange={(event) => updateNested("footer", "facebookUrl", event.target.value)}
                  />
                </Field>
                <Field label="Instagram URL">
                  <Input
                    value={form.footer.instagramUrl}
                    onChange={(event) => updateNested("footer", "instagramUrl", event.target.value)}
                  />
                </Field>
                <Field label="Service times, one per line">
                  <Textarea
                    value={joinLines(form.footer.serviceTimes)}
                    onChange={(value) => updateNested("footer", "serviceTimes", splitLines(value))}
                    rows={4}
                  />
                </Field>
              </CardContent>
            </Card>

            {message ? (
              <div className="rounded-2xl border border-[var(--brand-burgundy)]/20 bg-[var(--brand-burgundy-soft)] p-4 text-sm text-[var(--brand-burgundy)]">
                {message}
              </div>
            ) : null}

            <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-3xl border border-[var(--brand-border)] bg-white/95 p-4 shadow-2xl shadow-slate-950/10 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--brand-muted)]">
                Save and publish this content to the live bulletin page.
              </p>
              <Button type="submit" disabled={isLoading || isSaving} size="lg">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Generate bulletin
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {publishedUrl ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-[var(--brand-navy)]">
              Bulletin generated
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
              The live bulletin has been updated and is ready to share.
            </p>
            <a
              href={publishedUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Open live bulletin
              <ExternalLink className="h-4 w-4" />
            </a>
            <Button
              type="button"
              variant="ghost"
              className="mt-3 w-full"
              onClick={() => setPublishedUrl("")}
            >
              Continue editing
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
