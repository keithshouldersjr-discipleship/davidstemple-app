import type { Announcement, ChurchInfo, Event, Resource } from "@/lib/types";

export const ASK_DT_SYSTEM_INSTRUCTION =
  "You are ask.dt, the official information assistant for David's Temple Missionary Baptist Church. Answer clearly, warmly, and briefly. Use only approved church information. Do not invent details about events, times, ministries, giving, or church policies. If you do not know the answer, say that you do not have that information yet and direct the user to contact the church office or check the official church resources.";

export const resources: Resource[] = [
  {
    id: "plan-your-visit",
    title: "Plan Your Visit",
    description: "Service details, what to expect, and ways to feel at home before you arrive.",
    category: "Visit",
    url: "/resources#visit",
    icon: "MapPin",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "sunday-school",
    title: "Sunday School",
    description: "Find Sunday School information for children, youth, and adults.",
    category: "Grow",
    url: "/events",
    icon: "BookOpen",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "upcoming-events",
    title: "Upcoming Events",
    description: "See what is coming up this month across worship, study, and ministry life.",
    category: "Ministry Updates",
    url: "/events",
    icon: "CalendarDays",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "serve",
    title: "Serve at David's Temple",
    description: "Explore opportunities to use your gifts and support the work of ministry.",
    category: "Serve",
    url: "/resources#serve",
    icon: "HeartHandshake",
    isActive: true,
    sortOrder: 4,
  },
  {
    id: "give-online",
    title: "Give Online",
    description: "A simple path to support the mission and ministries of David's Temple.",
    category: "Give",
    url: "/resources#give",
    icon: "HandCoins",
    isActive: true,
    sortOrder: 5,
  },
  {
    id: "prayer-request",
    title: "Submit a Prayer Request",
    description: "Let the church know how we can pray for you and care for your family.",
    category: "Care",
    url: "/resources#care",
    icon: "Heart",
    isActive: true,
    sortOrder: 6,
  },
  {
    id: "contact",
    title: "Contact the Church",
    description: "Reach the church office for questions, care needs, or next steps.",
    category: "Visit",
    url: "/resources#visit",
    icon: "Phone",
    isActive: true,
    sortOrder: 7,
  },
  {
    id: "cdc",
    title: "Child Development Center",
    description: "Helpful information for families connected to the Child Development Center.",
    category: "Care",
    url: "/resources#care",
    icon: "School",
    isActive: true,
    sortOrder: 8,
  },
  {
    id: "sermons",
    title: "Sermons and Bible Studies",
    description: "Grow through preaching, teaching, and Bible study resources.",
    category: "Grow",
    url: "/resources#grow",
    icon: "Mic",
    isActive: true,
    sortOrder: 9,
  },
  {
    id: "vision",
    title: "Church Vision and Initiatives",
    description: "Learn more about shared priorities and ministry initiatives.",
    category: "Ministry Updates",
    url: "/resources#ministry-updates",
    icon: "Sparkles",
    isActive: true,
    sortOrder: 10,
  },
];

export const events: Event[] = [
  {
    id: "sunday-school",
    title: "Sunday School",
    description: "A weekly time for learning, discussion, and spiritual formation.",
    date: "Every Sunday",
    time: "9:00 AM",
    location: "David's Temple Campus",
  },
  {
    id: "sunday-worship",
    title: "Sunday Worship",
    description: "Gather with the church family for worship, preaching, and fellowship.",
    date: "Every Sunday",
    time: "10:30 AM",
    location: "Main Sanctuary",
  },
  {
    id: "wednesday-bible-study",
    title: "Wednesday Bible Study",
    description: "Midweek Bible study for encouragement, teaching, and connection.",
    date: "Wednesdays",
    time: "6:30 PM",
    location: "Fellowship Hall",
  },
  {
    id: "deacon-training",
    title: "Deacon Training",
    description: "Leadership training and preparation for deacon ministry.",
    date: "May 24, 2026",
    time: "9:00 AM",
    location: "Conference Room",
  },
  {
    id: "mission-day",
    title: "Sunday School Mission Day",
    description: "A special Sunday School gathering focused on mission, service, and outreach.",
    date: "May 31, 2026",
    time: "9:00 AM",
    location: "Education Wing",
  },
];

export const churchInfo: ChurchInfo[] = [
  {
    id: "info-sunday-school",
    topic: "Sunday School",
    question: "What time is Sunday School?",
    answer: "Sunday School is listed in this first version as Sundays at 9:00 AM.",
    lastUpdated: "2026-05-21",
  },
  {
    id: "info-serving",
    topic: "Serving",
    question: "How can I serve?",
    answer:
      "You can start by sharing your area of interest with the church office or a ministry leader.",
    lastUpdated: "2026-05-21",
  },
  {
    id: "info-care",
    topic: "Care",
    question: "How do I submit a prayer or care request?",
    answer:
      "For now, contact the church office so the care team can receive your request.",
    lastUpdated: "2026-05-21",
  },
];

export const announcements: Announcement[] = [
  {
    id: "welcome",
    title: "Welcome to David's Temple App",
    body: "This first version helps members and visitors ask questions, find resources, and stay connected.",
    audience: "all",
    startDate: "2026-05-21",
  },
];

export function getMockAssistantResponse(prompt: string) {
  const normalized = prompt.toLowerCase();

  if (normalized.includes("sunday school")) {
    return "Sunday School is listed as Sundays at 9:00 AM. Please check official church updates for any schedule changes.";
  }

  if (normalized.includes("event")) {
    return "You can view upcoming events on the Events page, including Sunday School, Sunday Worship, Wednesday Bible Study, Deacon Training, and Sunday School Mission Day.";
  }

  if (normalized.includes("serve")) {
    return "A good next step is to visit the Resources page and look for Serve at David's Temple. A ministry leader or the church office can help you find the right opportunity.";
  }

  if (normalized.includes("prayer") || normalized.includes("care")) {
    return "For prayer or care requests, please contact the church office. Future versions can include a direct request form.";
  }

  if (normalized.includes("connected")) {
    return "Start with the Resources page for visit details, ministry updates, care, serving, and giving links. You can also contact the church office for personal next steps.";
  }

  return "I do not have that information yet. Please contact the church office or check official David's Temple resources for the most current details.";
}
