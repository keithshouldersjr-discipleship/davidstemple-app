"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CheckCircle2, ExternalLink, Loader2, LockKeyhole, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { BulletinEvent, WeeklyBulletin } from "@/lib/bulletin-data";

type BulletinAdminPanelProps = {
  canManageBulletin: boolean;
  initialBulletin: WeeklyBulletin;
};

function makeSlug(dateRange: string) {
  return `weekly-update-${dateRange}`
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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

  function updateEvent(index: number, value: BulletinEvent) {
    setForm((current) => ({
      ...current,
      upcomingEvents: current.upcomingEvents.map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
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
            Only Keith Shoulders can publish weekly bulletins.
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
            Update the weekly editable sections, then generate the bulletin.
            The locked sections keep the same approved format.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-soft)] p-4 text-sm leading-6 text-[var(--brand-muted)]">
              <div className="flex items-start gap-3">
                <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand-navy)]" />
                <p>
                  The bulletin structure is locked to prevent accidental changes.
                  This editor only updates Pastor&apos;s note, Scripture, Upcoming
                  Events, and Ministry Spotlight.
                </p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Pastor note</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                  <CardTitle>Scripture focus</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Field label="Scripture reference">
                    <Input
                      value={form.focus.reference ?? ""}
                      onChange={(event) => updateNested("focus", "reference", event.target.value)}
                      placeholder="John 3:16-17 (KJV)"
                    />
                  </Field>
                  <Field label="Key verse / preview">
                    <Textarea
                      value={form.focus.excerpt ?? form.focus.body}
                      onChange={(value) => {
                        updateNested("focus", "excerpt", value);
                        updateNested("focus", "body", value);
                      }}
                      rows={5}
                      placeholder="Paste the key verse or short excerpt you want people to see on the bulletin."
                    />
                    <p className="text-xs leading-5 text-[var(--brand-muted)]">
                      Keep this short for readability. Line breaks will be preserved.
                    </p>
                  </Field>
                  <Field label="Full passage link">
                    <Input
                      value={form.focus.passageUrl ?? ""}
                      onChange={(event) => updateNested("focus", "passageUrl", event.target.value)}
                      placeholder="https://www.biblegateway.com/passage/?search=John+3%3A16-17&version=KJV"
                    />
                  </Field>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-2xl">
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Upcoming events</CardTitle>
                    <p className="mt-1 text-sm text-[var(--brand-muted)]">
                      Choose the events you want to emphasize in this bulletin.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        upcomingEvents: [
                          ...current.upcomingEvents,
                          { date: "", title: "", description: "" },
                        ],
                      }))
                    }
                  >
                    <Plus className="h-4 w-4" />
                    Add event
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {form.upcomingEvents.map((item, index) => (
                  <div
                    key={index}
                    className="grid gap-3 rounded-2xl border border-[var(--brand-border)] p-3 lg:grid-cols-[150px_1fr_1.5fr_auto]"
                  >
                    <Input
                      value={item.date}
                      onChange={(event) =>
                        updateEvent(index, { ...item, date: event.target.value })
                      }
                      placeholder="July 6"
                    />
                    <Input
                      value={item.title}
                      onChange={(event) =>
                        updateEvent(index, { ...item, title: event.target.value })
                      }
                      placeholder="Communion Sunday"
                    />
                    <Input
                      value={item.description}
                      onChange={(event) =>
                        updateEvent(index, { ...item, description: event.target.value })
                      }
                      placeholder="Join us as we remember..."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-[var(--brand-burgundy)]"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          upcomingEvents: current.upcomingEvents.filter(
                            (_, itemIndex) => itemIndex !== index,
                          ),
                        }))
                      }
                      aria-label="Remove event"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Ministry spotlight</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-2">
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
