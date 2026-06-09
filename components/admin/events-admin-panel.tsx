"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, FileUp, Loader2, Plus, Printer, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  createSupabaseBrowserClient,
  type SupabaseEventRequestRow,
  type SupabaseEventRow,
} from "@/lib/supabase";

type EventFormState = {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  ministry: string;
  location: string;
  registrationUrl: string;
  flyerUrl: string;
};

const emptyEventForm: EventFormState = {
  title: "",
  description: "",
  date: "",
  time: "",
  ministry: "",
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
    ministry: row.ministry ?? "",
    location: row.location ?? "",
    registrationUrl: row.registration_url ?? "",
    flyerUrl: row.flyer_url ?? "",
  };
}

export function EventsAdminPanel({ canManageAll }: EventsAdminPanelProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [events, setEvents] = useState<SupabaseEventRow[]>([]);
  const [eventRequests, setEventRequests] = useState<SupabaseEventRequestRow[]>([]);
  const [approvedEventRequests, setApprovedEventRequests] = useState<SupabaseEventRequestRow[]>([]);
  const [form, setForm] = useState<EventFormState>(emptyEventForm);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(supabase));
  const [isSaving, setIsSaving] = useState(false);
  const [approvingRequestId, setApprovingRequestId] = useState<string | null>(null);
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [eventMinistryFilter, setEventMinistryFilter] = useState("all");
  const [eventDateFilter, setEventDateFilter] = useState("");

  const currentMonthRange = useMemo(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    return {
      start: start.toISOString(),
      end: end.toISOString(),
      label: new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(start),
    };
  }, []);

  const ministryOptions = useMemo(() => {
    const values = [...events, ...eventRequests]
      .map((event) => event.ministry)
      .filter((value): value is string => Boolean(value));

    return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
  }, [events, eventRequests]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesMinistry = eventMinistryFilter === "all" || event.ministry === eventMinistryFilter;
      const matchesDate = !eventDateFilter || event.date === eventDateFilter;

      return matchesMinistry && matchesDate;
    });
  }, [events, eventDateFilter, eventMinistryFilter]);

  const loadEvents = useCallback(async () => {
    if (!supabase) return;

    setIsLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("events")
      .select("id,title,description,date,time,ministry,location,registration_url,flyer_url")
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

  const loadEventRequests = useCallback(async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("event_requests")
      .select("id,title,date,time,ministry,location,description,status,approved_event_id,approved_by,approved_at,created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("I could not load pending event requests. Make sure events-admin.sql has been run in Supabase.");
      setEventRequests([]);
    } else {
      setEventRequests(data as SupabaseEventRequestRow[]);
    }
  }, [supabase]);

  const loadApprovedEventRequests = useCallback(async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("event_requests")
      .select("id,title,date,time,ministry,location,description,status,approved_event_id,approved_by,approved_at,created_at")
      .eq("status", "approved")
      .gte("approved_at", currentMonthRange.start)
      .lt("approved_at", currentMonthRange.end)
      .order("approved_at", { ascending: false });

    if (error) {
      setMessage("I could not load approved event requests. Make sure events-admin.sql has been run in Supabase.");
      setApprovedEventRequests([]);
    } else {
      setApprovedEventRequests(data as SupabaseEventRequestRow[]);
    }
  }, [currentMonthRange.end, currentMonthRange.start, supabase]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadEvents();
      void loadEventRequests();
      void loadApprovedEventRequests();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadApprovedEventRequests, loadEventRequests, loadEvents]);

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
      ministry: form.ministry.trim() || null,
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

  async function approveEventRequest(request: SupabaseEventRequestRow) {
    if (!supabase || !canManageAll) return;

    setApprovingRequestId(request.id);
    setMessage("");
    const { data: userData } = await supabase.auth.getUser();
    const approvedBy = userData.user?.email?.toLowerCase() ?? "Unknown approver";
    const approvedAt = new Date().toISOString();

    const eventId = `${slugify(request.title)}-${request.date}`;
    const payload = {
      id: eventId,
      title: request.title,
      description: request.description,
      date: request.date,
      time: request.time,
      ministry: request.ministry,
      location: request.location,
      registration_url: null,
      flyer_url: null,
    };

    const { error: eventError } = await supabase.from("events").upsert(payload).select("id").single();

    if (eventError) {
      setMessage(eventError.message);
      setApprovingRequestId(null);
      return;
    }

    const { error: requestError } = await supabase
      .from("event_requests")
      .update({
        status: "approved",
        approved_event_id: eventId,
        approved_by: approvedBy,
        approved_at: approvedAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", request.id);

    if (requestError) {
      setMessage(requestError.message);
    } else {
      await Promise.all([loadEvents(), loadEventRequests(), loadApprovedEventRequests()]);
    }

    setApprovingRequestId(null);
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
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-[var(--brand-border)]">
          <CardTitle>Pending event requests</CardTitle>
          <p className="text-sm text-[var(--brand-muted)]">
            Review submitted events and approve them for the public calendar.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-80 overflow-y-auto">
            {eventRequests.length ? (
              eventRequests.map((request) => (
                <div key={request.id} className="grid gap-3 border-b border-[var(--brand-border)] p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div className="space-y-1">
                    <p className="font-semibold text-[var(--brand-navy)]">{request.title}</p>
                    <p className="text-sm text-[var(--brand-muted)]">
                      {formatDisplayDate(request.date)} · {request.time ?? "Time to be announced"} · {request.ministry ?? "Ministry not listed"} · {request.location ?? "Location to be announced"}
                    </p>
                    <p className="text-sm leading-6 text-[var(--brand-muted)]">{request.description}</p>
                  </div>
                  <Button type="button" onClick={() => approveEventRequest(request)} disabled={approvingRequestId === request.id}>
                    {approvingRequestId === request.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Approve
                  </Button>
                </div>
              ))
            ) : (
              <p className="p-5 text-sm text-[var(--brand-muted)]">There are no pending event requests.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-[var(--brand-border)]">
          <CardTitle>Approved this month</CardTitle>
          <p className="text-sm text-[var(--brand-muted)]">
            Event requests approved in {currentMonthRange.label}, including the communications manager who approved them.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-80 overflow-x-auto overflow-y-auto">
            {approvedEventRequests.length ? (
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="sticky top-0 bg-[var(--brand-soft)] text-xs uppercase tracking-wide text-[var(--brand-muted)]">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Event</th>
                    <th className="px-5 py-3 font-semibold">Event date</th>
                    <th className="px-5 py-3 font-semibold">Ministry</th>
                    <th className="px-5 py-3 font-semibold">Approved by</th>
                    <th className="px-5 py-3 font-semibold">Approved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--brand-border)]">
                  {approvedEventRequests.map((request) => (
                    <tr key={request.id} className="align-top">
                      <td className="px-5 py-4 font-medium text-[var(--brand-navy)]">{request.title}</td>
                      <td className="px-5 py-4 text-[var(--brand-muted)]">
                        {formatDisplayDate(request.date)}
                        {request.time ? ` · ${request.time}` : ""}
                      </td>
                      <td className="px-5 py-4 text-[var(--brand-muted)]">{request.ministry ?? "Ministry not listed"}</td>
                      <td className="px-5 py-4 text-[var(--brand-muted)]">{request.approved_by ?? "Unknown approver"}</td>
                      <td className="px-5 py-4 text-[var(--brand-muted)]">
                        {request.approved_at ? formatDisplayDate(request.approved_at.slice(0, 10)) : "Not recorded"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="p-5 text-sm text-[var(--brand-muted)]">
                No event requests have been approved yet in {currentMonthRange.label}.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

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
              <Input value={form.ministry} onChange={(e) => setForm({ ...form, ministry: e.target.value })} placeholder="Ministry" />
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
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <CardTitle>Events</CardTitle>
                <p className="text-sm text-[var(--brand-muted)]">Filter, print, or select an upcoming event to update details.</p>
              </div>
              <Button type="button" variant="secondary" onClick={() => window.print()}>
                <Printer className="h-4 w-4" />
                Print/export
              </Button>
            </div>
            <div className="grid gap-3 pt-3 sm:grid-cols-2">
              <select
                value={eventMinistryFilter}
                onChange={(event) => setEventMinistryFilter(event.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-[var(--brand-navy)] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="all">All ministries</option>
                {ministryOptions.map((ministry) => (
                  <option key={ministry} value={ministry}>
                    {ministry}
                  </option>
                ))}
              </select>
              <Input type="date" value={eventDateFilter} onChange={(event) => setEventDateFilter(event.target.value)} />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[35rem] overflow-y-auto">
              {isLoading ? (
                <p className="p-5 text-sm text-[var(--brand-muted)]">Loading events...</p>
              ) : filteredEvents.length ? (
                filteredEvents.map((event) => (
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
                      {formatDisplayDate(event.date)} · {event.time ?? "Time to be announced"} · {event.ministry ?? "Ministry not listed"} · {event.location ?? "Location to be announced"}
                    </span>
                    <span className="inline-flex items-center gap-2 text-xs font-medium text-[var(--brand-burgundy)]">
                      <SquarePen className="h-3.5 w-3.5" />
                      Edit details
                    </span>
                  </button>
                ))
              ) : (
                <p className="p-5 text-sm text-[var(--brand-muted)]">No upcoming events match these filters.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
