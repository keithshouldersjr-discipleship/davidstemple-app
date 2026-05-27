"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, FileUp, Loader2, Plus, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  createSupabaseBrowserClient,
  type SupabaseEventRow,
} from "@/lib/supabase";

type EventFormState = {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  registrationUrl: string;
  flyerUrl: string;
};

const emptyEventForm: EventFormState = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  registrationUrl: "",
  flyerUrl: "",
};

const MAX_FLYER_SIZE = 5 * 1024 * 1024;
const ALLOWED_FLYER_TYPES = ["image/jpeg", "image/png", "image/webp"];

type EventsAdminPanelProps = {
  canManageAll: boolean;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatDisplayDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function rowToForm(row: SupabaseEventRow): EventFormState {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    date: row.date,
    time: row.time ?? "",
    location: row.location ?? "",
    registrationUrl: row.registration_url ?? "",
    flyerUrl: row.flyer_url ?? "",
  };
}

export function EventsAdminPanel({ canManageAll }: EventsAdminPanelProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [events, setEvents] = useState<SupabaseEventRow[]>([]);
  const [form, setForm] = useState<EventFormState>(emptyEventForm);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(supabase));
  const [isSaving, setIsSaving] = useState(false);
  const [flyerFile, setFlyerFile] = useState<File | null>(null);

  const loadEvents = useCallback(async () => {
    if (!supabase) return;

    setIsLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("events")
      .select("id,title,description,date,time,location,registration_url,flyer_url")
      .gte("date", new Date().toISOString().slice(0, 10))
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    if (error) {
      setMessage("I could not load events. Make sure events-admin.sql has been run in Supabase.");
      setEvents([]);
    } else {
      setEvents(data as SupabaseEventRow[]);
    }

    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadEvents();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadEvents]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !canManageAll) return;

    setIsSaving(true);
    setMessage("");

    const eventId = form.id ?? `${slugify(form.title)}-${form.date}`;
    let flyerUrl = form.flyerUrl.trim() || null;

    if (flyerFile) {
      if (!ALLOWED_FLYER_TYPES.includes(flyerFile.type)) {
        setMessage("Please upload a JPG, PNG, or WebP flyer.");
        setIsSaving(false);
        return;
      }

      if (flyerFile.size > MAX_FLYER_SIZE) {
        setMessage("Flyers must be 5MB or smaller.");
        setIsSaving(false);
        return;
      }

      const extension = flyerFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const filePath = `${eventId}/${Date.now()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("event-flyers")
        .upload(filePath, flyerFile, {
          cacheControl: "31536000",
          upsert: true,
        });

      if (uploadError) {
        setMessage(uploadError.message);
        setIsSaving(false);
        return;
      }

      const { data } = supabase.storage.from("event-flyers").getPublicUrl(filePath);
      flyerUrl = data.publicUrl;
    }

    const payload = {
      id: eventId,
      title: form.title.trim(),
      description: form.description.trim() || null,
      date: form.date,
      time: form.time.trim() || null,
      location: form.location.trim() || null,
      registration_url: form.registrationUrl.trim() || null,
      flyer_url: flyerUrl,
    };

    const { error } = await supabase.from("events").upsert(payload).select("id").single();

    if (error) {
      setMessage(error.message);
    } else {
      setForm(emptyEventForm);
      setFlyerFile(null);
      await loadEvents();
    }

    setIsSaving(false);
  }

  if (!canManageAll) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="font-semibold text-[var(--brand-navy)]">Events are managed by admins.</p>
          <p className="mt-2 text-sm text-[var(--brand-muted)]">
            Leaders and members can view directory information based on their role.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader>
          <CardTitle>{form.id ? "Update event" : "Add event"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="grid gap-3">
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event title" required />
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              <Input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="Time" />
            </div>
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" />
            <Input value={form.registrationUrl} onChange={(e) => setForm({ ...form, registrationUrl: e.target.value })} placeholder="Registration URL" />
            <label className="grid gap-2 rounded-2xl border border-dashed border-[var(--brand-border)] bg-[var(--brand-soft)] p-4 text-sm text-[var(--brand-muted)]">
              <span className="flex items-center gap-2 font-medium text-[var(--brand-navy)]">
                <FileUp className="h-4 w-4 text-[var(--brand-burgundy)]" />
                Upload flyer
              </span>
              <span>JPG, PNG, or WebP. Max 5MB.</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;

                  if (!file) {
                    setFlyerFile(null);
                    return;
                  }

                  if (!ALLOWED_FLYER_TYPES.includes(file.type)) {
                    setMessage("Please upload a JPG, PNG, or WebP flyer.");
                    event.target.value = "";
                    return;
                  }

                  if (file.size > MAX_FLYER_SIZE) {
                    setMessage("Flyers must be 5MB or smaller.");
                    event.target.value = "";
                    return;
                  }

                  setMessage("");
                  setFlyerFile(file);
                }}
                className="text-sm"
              />
              {flyerFile ? <span className="font-medium text-[var(--brand-burgundy)]">{flyerFile.name}</span> : null}
            </label>
            {message ? <p className="text-sm text-[var(--brand-burgundy)]">{message}</p> : null}
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Save event
              </Button>
              {form.id ? (
                <Button type="button" variant="secondary" onClick={() => {
                  setForm(emptyEventForm);
                  setFlyerFile(null);
                }}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-[var(--brand-border)]">
          <CardTitle>Events</CardTitle>
          <p className="text-sm text-[var(--brand-muted)]">Select an upcoming event to update details or add a flyer.</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[35rem] overflow-y-auto">
            {isLoading ? (
              <p className="p-5 text-sm text-[var(--brand-muted)]">Loading events...</p>
            ) : (
              events.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  className="grid w-full gap-2 border-b border-[var(--brand-border)] px-5 py-4 text-left transition hover:bg-[var(--brand-soft)]"
                  onClick={() => {
                    setForm(rowToForm(event));
                    setFlyerFile(null);
                  }}
                >
                  <span className="flex items-center gap-2 font-semibold text-[var(--brand-navy)]">
                    <CalendarDays className="h-4 w-4 text-[var(--brand-burgundy)]" />
                    {event.title}
                  </span>
                  <span className="text-sm text-[var(--brand-muted)]">
                    {formatDisplayDate(event.date)} · {event.time ?? "Time to be announced"} · {event.location ?? "Location to be announced"}
                  </span>
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-[var(--brand-burgundy)]">
                    <SquarePen className="h-3.5 w-3.5" />
                    Edit details
                  </span>
                </button>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
