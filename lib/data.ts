import {
  churchInfo as mockChurchInfo,
  events as mockEvents,
  ministryContacts as mockMinistryContacts,
} from "@/lib/mock-data";
import {
  createSupabaseServerClient,
  type SupabaseChurchInfoRow,
  type SupabaseEventRow,
  type SupabaseMinistryContactRow,
} from "@/lib/supabase";
import type { ChurchInfo, Event, MinistryContact } from "@/lib/types";

function formatEventDate(date: string) {
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

function eventSortValue(event: Event) {
  const parsed = new Date(`${event.date} 12:00:00`);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

export async function getEvents(): Promise<Event[]> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return mockEvents;
  }

  const { data, error } = await supabase
    .from("events")
    .select("id,title,description,date,time,location,registration_url,flyer_url")
    .gte("date", new Date().toISOString().slice(0, 10))
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error || !data) {
    if (error?.code === "42703") {
      const { data: legacyData, error: legacyError } = await supabase
        .from("events")
        .select("id,title,description,date,time,location,registration_url")
        .gte("date", new Date().toISOString().slice(0, 10))
        .order("date", { ascending: true })
        .order("time", { ascending: true });

      if (!legacyError && legacyData) {
        return (legacyData as Omit<SupabaseEventRow, "flyer_url">[]).map((event) => ({
          id: event.id,
          title: event.title,
          description: event.description ?? "David's Temple church event.",
          date: formatEventDate(event.date),
          time: event.time ?? "Time to be announced",
          location: event.location ?? "Location to be announced",
          registrationUrl: event.registration_url ?? undefined,
        }));
      }
    }

    console.error("Unable to load Supabase events", error);
    return mockEvents;
  }

  return (data as SupabaseEventRow[]).map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description ?? "David's Temple church event.",
    date: formatEventDate(event.date),
    time: event.time ?? "Time to be announced",
    location: event.location ?? "Location to be announced",
    registrationUrl: event.registration_url ?? undefined,
    flyerUrl: event.flyer_url ?? undefined,
  }));
}

export async function getChurchInfo(): Promise<ChurchInfo[]> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return mockChurchInfo;
  }

  const { data, error } = await supabase
    .from("church_info")
    .select("id,topic,question,answer,source_url,last_updated")
    .order("topic", { ascending: true });

  if (error || !data) {
    console.error("Unable to load Supabase church info", error);
    return mockChurchInfo;
  }

  return (data as SupabaseChurchInfoRow[]).map((item) => ({
    id: item.id,
    topic: item.topic,
    question: item.question,
    answer: item.answer,
    sourceUrl: item.source_url ?? undefined,
    lastUpdated: item.last_updated,
  }));
}

function toMinistryCategory(category: string): MinistryContact["category"] {
  const allowedCategories: MinistryContact["category"][] = [
    "Discipleship",
    "Care",
    "Worship",
    "Hospitality",
    "Media",
    "Youth",
    "Men",
    "Women",
  ];

  return allowedCategories.includes(category as MinistryContact["category"])
    ? (category as MinistryContact["category"])
    : "Care";
}

export async function getMinistryContacts(): Promise<MinistryContact[]> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return mockMinistryContacts;
  }

  const { data, error } = await supabase
    .from("ministry_contacts")
    .select("id,ministry_name,leader_name,phone,description,category,is_active,sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("ministry_name", { ascending: true });

  if (error || !data) {
    console.error("Unable to load Supabase ministry contacts", error);
    return mockMinistryContacts;
  }

  return (data as SupabaseMinistryContactRow[]).map((contact) => ({
    id: contact.id,
    ministryName: contact.ministry_name,
    leaderName: contact.leader_name,
    phone: contact.phone,
    description: contact.description ?? undefined,
    category: toMinistryCategory(contact.category),
    isActive: contact.is_active,
    sortOrder: contact.sort_order,
  }));
}

export async function getUpcomingEventsForAssistant(limit = 5) {
  const events = await getEvents();

  return [...events].sort((a, b) => eventSortValue(a) - eventSortValue(b)).slice(0, limit);
}
