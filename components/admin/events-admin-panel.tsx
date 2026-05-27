"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, Loader2, Plus, SquarePen } from "lucide-react";
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

  const loadEvents = useCallback(async () => {
    if (!supabase) return;

    setIsLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("events")
      .select("id,title,description,date,time,location,registration_url,flyer_url")
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
    const payload = {
      id: eventId,
      title: form.title.trim(),
      description: form.description.trim() || null,
      date: form.date,
      time: form.time.trim() || null,
      location: form.location.trim() || null,
      registration_url: form.registrationUrl.trim() || null,
      flyer_url: form.flyerUrl.trim() || null,
    };

    const { error } = await supabase.from("events").upsert(payload).select("id").single();

    if (error) {
      setMessage(error.message);
    } else {
      setForm(emptyEventForm);
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
            <Input value={form.flyerUrl} onChange={(e) => setForm({ ...form, flyerUrl: e.target.value })} placeholder="Flyer URL" />
            {message ? <p className="text-sm text-[var(--brand-burgundy)]">{message}</p> : null}
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Save event
              </Button>
              {form.id ? (
                <Button type="button" variant="secondary" onClick={() => setForm(emptyEventForm)}>
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
          <p className="text-sm text-[var(--brand-muted)]">Select an event to update details or add a flyer URL.</p>
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
                  onClick={() => setForm(rowToForm(event))}
                >
                  <span className="flex items-center gap-2 font-semibold text-[var(--brand-navy)]">
                    <CalendarDays className="h-4 w-4 text-[var(--brand-burgundy)]" />
                    {event.title}
                  </span>
                  <span className="text-sm text-[var(--brand-muted)]">
                    {event.date} · {event.time ?? "Time to be announced"} · {event.location ?? "Location to be announced"}
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
