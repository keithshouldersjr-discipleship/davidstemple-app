export type YouthMinistryOrganization = {
  id: string;
  name: string;
  role: string;
};

export type EducationClass = {
  id: string;
  name: string;
  group_type: "class" | "bible_study" | "small_group";
  audience: string | null;
  meeting_pattern: string | null;
  meeting_weekday: number | null;
  meeting_time: string | null;
  meeting_room: string | null;
  roster_count: number;
};

export type ClassAttendanceRosterMember = {
  member_id: string;
  display_name: string;
  present: boolean;
};

export type ClassAttendanceSummary = {
  session_id: string;
  present_count: number;
  visitor_count: number;
  headcount: number;
  submitted_at: string | null;
};

export type YouthAttendanceSession = {
  id: string;
  group_id: string;
  session_date: string | null;
  starts_at: string;
  headcount: number | null;
  visitor_count: number;
  submitted_at: string | null;
};

export type AttendanceWeekSummary = {
  week: number;
  attendance: number;
  visitors: number;
  sessions: number;
};

export type AttendanceMonthSummary = {
  month: number;
  attendance: number;
  visitors: number;
  sessions: number;
};

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const youthClassLanguage = /\b(youth|young (?:person|people)|child|children|teen|student|nursery|pre-?k|preschool|elementary|middle school|high school|grade|grades|age|ages)\b/i;

export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isValidDateKey(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const candidate = new Date(year, month - 1, day, 12);
  return (
    candidate.getFullYear() === year &&
    candidate.getMonth() === month - 1 &&
    candidate.getDate() === day
  );
}

export function formatDateKey(value: string, options?: Intl.DateTimeFormatOptions) {
  if (!isValidDateKey(value)) return value;
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", options ?? {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day, 12));
}

export function sessionDateKey(session: YouthAttendanceSession) {
  return session.session_date ?? session.starts_at.slice(0, 10);
}

export function weekOfMonth(dateKey: string) {
  const day = Number(dateKey.slice(8, 10));
  return Math.ceil(day / 7);
}

export function summarizeWeeks(
  sessions: YouthAttendanceSession[],
  year: number,
  month: number,
) {
  const matchingSessions = sessions.filter((session) => {
    const dateKey = sessionDateKey(session);
    return Number(dateKey.slice(0, 4)) === year && Number(dateKey.slice(5, 7)) === month + 1;
  });
  const weekCount = matchingSessions.some((session) => weekOfMonth(sessionDateKey(session)) === 5) ? 5 : 4;

  return Array.from({ length: weekCount }, (_, index): AttendanceWeekSummary => {
    const week = index + 1;
    const weekSessions = matchingSessions.filter(
      (session) => weekOfMonth(sessionDateKey(session)) === week,
    );
    return {
      week,
      attendance: weekSessions.reduce((total, session) => total + (session.headcount ?? 0), 0),
      visitors: weekSessions.reduce((total, session) => total + session.visitor_count, 0),
      sessions: weekSessions.length,
    };
  });
}

export function summarizeMonths(sessions: YouthAttendanceSession[], year: number) {
  return Array.from({ length: 12 }, (_, month): AttendanceMonthSummary => {
    const monthSessions = sessions.filter((session) => {
      const dateKey = sessionDateKey(session);
      return Number(dateKey.slice(0, 4)) === year && Number(dateKey.slice(5, 7)) === month + 1;
    });
    return {
      month,
      attendance: monthSessions.reduce((total, session) => total + (session.headcount ?? 0), 0),
      visitors: monthSessions.reduce((total, session) => total + session.visitor_count, 0),
      sessions: monthSessions.length,
    };
  });
}

export function formatRole(role: string) {
  return role.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function youthEducationClasses(classes: EducationClass[]) {
  const youthClasses = classes.filter((educationClass) =>
    youthClassLanguage.test(`${educationClass.name} ${educationClass.audience ?? ""}`),
  );

  // Assigned teachers may only see one class whose local name does not contain
  // an age marker. In that case their authorized Watch Care list is the safest fallback.
  return youthClasses.length ? youthClasses : classes;
}
