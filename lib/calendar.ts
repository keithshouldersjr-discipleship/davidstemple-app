import type { Event } from "@/lib/types";

const ALL_DAY_DURATION_MS = 24 * 60 * 60 * 1000;
const DEFAULT_EVENT_DURATION_MS = 60 * 60 * 1000;

function escapeCalendarText(value: string) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll("\n", "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
}

function formatDate(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");
}

function formatLocalDateTime(date: Date) {
  return `${formatDate(date)}T${[
    String(date.getHours()).padStart(2, "0"),
    String(date.getMinutes()).padStart(2, "0"),
    "00",
  ].join("")}`;
}

function parseTime(value: string) {
  const match = value.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);

  if (!match) {
    return null;
  }

  let hour = Number(match[1]);
  const minute = Number(match[2] ?? "0");
  const meridiem = match[3]?.toUpperCase();

  if (minute > 59 || hour > (meridiem ? 12 : 23) || hour === 0 && meridiem) {
    return null;
  }

  if (meridiem === "AM" && hour === 12) hour = 0;
  if (meridiem === "PM" && hour !== 12) hour += 12;

  return { hour, minute };
}

function parseEventTiming(event: Event) {
  const eventDate = new Date(`${event.date} 12:00:00`);

  if (Number.isNaN(eventDate.getTime())) {
    return null;
  }

  const timeParts = event.time.split(/\s+(?:-|–|—|to)\s+/i);
  const startTime = parseTime(timeParts[0]);

  if (!startTime) {
    const endDate = new Date(eventDate.getTime() + ALL_DAY_DURATION_MS);
    return {
      dateLines: [
        `DTSTART;VALUE=DATE:${formatDate(eventDate)}`,
        `DTEND;VALUE=DATE:${formatDate(endDate)}`,
      ],
      timeNote: event.time,
    };
  }

  const startDate = new Date(eventDate);
  startDate.setHours(startTime.hour, startTime.minute, 0, 0);

  const parsedEndTime = timeParts[1] ? parseTime(timeParts[1]) : null;
  const endDate = parsedEndTime
    ? new Date(eventDate)
    : new Date(startDate.getTime() + DEFAULT_EVENT_DURATION_MS);

  if (parsedEndTime) {
    endDate.setHours(parsedEndTime.hour, parsedEndTime.minute, 0, 0);
    if (endDate <= startDate) endDate.setDate(endDate.getDate() + 1);
  }

  return {
    dateLines: [
      `DTSTART:${formatLocalDateTime(startDate)}`,
      `DTEND:${formatLocalDateTime(endDate)}`,
    ],
    timeNote: null,
  };
}

export function createCalendarFile(event: Event) {
  const timing = parseEventTiming(event);

  if (!timing) {
    return null;
  }

  const description = timing.timeNote
    ? `${event.description}\nTime: ${timing.timeNote}`
    : event.description;
  const uid = `${event.id}@davidstemple.app`;
  const createdAt = new Date().toISOString().replaceAll("-", "").replaceAll(":", "").replace(/\.\d{3}Z$/, "Z");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//David's Temple Missionary Baptist Church//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${escapeCalendarText(uid)}`,
    `DTSTAMP:${createdAt}`,
    ...timing.dateLines,
    `SUMMARY:${escapeCalendarText(event.title)}`,
    `DESCRIPTION:${escapeCalendarText(description)}`,
    `LOCATION:${escapeCalendarText(event.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function calendarFileName(event: Event) {
  const safeTitle = event.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${safeTitle || "davidstemple-event"}.ics`;
}
