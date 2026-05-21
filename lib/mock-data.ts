import type { Announcement, ChurchInfo, Event, MinistryContact, Resource } from "@/lib/types";

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
    url: "/serve",
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
    id: "church-anniversary-2026-05-24",
    title: "Church Anniversary",
    description: "From the 2026 Ministry Events Calendar.",
    date: "May 24, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "relay-for-life-2026-05-30",
    title: "Relay For Life",
    description: "From the 2026 Ministry Events Calendar.",
    date: "May 30, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "church-carnival-2026-05-30",
    title: "Church Carnival",
    description: "From the 2026 Ministry Events Calendar.",
    date: "May 30, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "summer-camp-camp-helen-2026-06-19",
    title: "Summer Camp - Camp Helen",
    description: "From the 2026 Ministry Events Calendar.",
    date: "June 19, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "summer-camp-camp-helen-2026-06-20",
    title: "Summer Camp - Camp Helen",
    description: "From the 2026 Ministry Events Calendar.",
    date: "June 20, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "summer-camp-camp-helen-2026-06-21",
    title: "Summer Camp - Camp Helen",
    description: "From the 2026 Ministry Events Calendar.",
    date: "June 21, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "father-s-day-2026-06-21",
    title: "Father's Day",
    description: "From the 2026 Ministry Events Calendar.",
    date: "June 21, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "ricmba-junior-convention-2026-06-26",
    title: "RICMBA - Junior Convention",
    description: "From the 2026 Ministry Events Calendar.",
    date: "June 26, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "ricmba-junior-convention-2026-06-27",
    title: "RICMBA - Junior Convention",
    description: "From the 2026 Ministry Events Calendar.",
    date: "June 27, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "youth-recognition-sunday-2026-06-28",
    title: "Youth Recognition Sunday",
    description: "From the 2026 Ministry Events Calendar.",
    date: "June 28, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "david-s-temple-revival-2026-07-07",
    title: "David's Temple Revival",
    description: "From the 2026 Ministry Events Calendar.",
    date: "July 7, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "david-s-temple-revival-2026-07-08",
    title: "David's Temple Revival",
    description: "From the 2026 Ministry Events Calendar.",
    date: "July 8, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "david-s-temple-revival-2026-07-09",
    title: "David's Temple Revival",
    description: "From the 2026 Ministry Events Calendar.",
    date: "July 9, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "connect-day-2026-07-11",
    title: "Connect Day",
    description: "From the 2026 Ministry Events Calendar.",
    date: "July 11, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "ricmba-sunday-school-convention-2026-07-24",
    title: "RICMBA - Sunday School Convention",
    description: "From the 2026 Ministry Events Calendar.",
    date: "July 24, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "ricmba-sunday-school-convention-2026-07-25",
    title: "RICMBA - Sunday School Convention",
    description: "From the 2026 Ministry Events Calendar.",
    date: "July 25, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "ricmba-senior-missionary-convention-2026-08-21",
    title: "RICMBA - Senior Missionary Convention",
    description: "From the 2026 Ministry Events Calendar.",
    date: "August 21, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "ricmba-senior-missionary-convention-2026-08-22",
    title: "RICMBA - Senior Missionary Convention",
    description: "From the 2026 Ministry Events Calendar.",
    date: "August 22, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "5th-sunday-2026-08-30",
    title: "5th Sunday",
    description: "From the 2026 Ministry Events Calendar.",
    date: "August 30, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "auxiliary-day-2026-09-13",
    title: "Auxiliary Day",
    description: "From the 2026 Ministry Events Calendar.",
    date: "September 13, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "senior-missionary-bags-for-homeless-2026-09-19",
    title: "Senior Missionary Bags For Homeless",
    description: "From the 2026 Ministry Events Calendar.",
    date: "September 19, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "ricmba-general-assembly-2026-09-25",
    title: "RICMBA - General Assembly",
    description: "From the 2026 Ministry Events Calendar.",
    date: "September 25, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "ricmba-general-assembly-2026-09-26",
    title: "RICMBA - General Assembly",
    description: "From the 2026 Ministry Events Calendar.",
    date: "September 26, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "connect-day-2026-10-03",
    title: "Connect Day",
    description: "From the 2026 Ministry Events Calendar.",
    date: "October 3, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "pink-out-sunday-2026-10-17",
    title: "Pink-out Sunday",
    description: "From the 2026 Ministry Events Calendar.",
    date: "October 17, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "veteran-s-appreciation-2026-11-08",
    title: "Veteran's Appreciation",
    description: "From the 2026 Ministry Events Calendar.",
    date: "November 8, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "ricmba-executive-board-meeting-2026-11-21",
    title: "RICMBA - Executive Board Meeting",
    description: "From the 2026 Ministry Events Calendar.",
    date: "November 21, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "5th-sunday-2026-11-29",
    title: "5th Sunday",
    description: "From the 2026 Ministry Events Calendar.",
    date: "November 29, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "sister-2-sister-christmas-celebration-2026-12-05",
    title: "Sister 2 Sister Christmas Celebration",
    description: "From the 2026 Ministry Events Calendar.",
    date: "December 5, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "christmas-celebration-2026-12-20",
    title: "Christmas Celebration",
    description: "From the 2026 Ministry Events Calendar.",
    date: "December 20, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
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

export const ministryContacts: MinistryContact[] = [
  {
    id: "mens-ministry",
    ministryName: "Men's Ministry",
    leaderName: "Maurice Pryor",
    phone: "256-658-6494",
    description: "Connect with men growing in faith, fellowship, and service.",
    category: "Men",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "womens-ministry",
    ministryName: "Women's Ministry",
    leaderName: "Shellia Battles",
    phone: "256-651-5458",
    description: "Connect with women serving, encouraging, and growing together.",
    category: "Women",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "christian-education",
    ministryName: "Christian Education",
    leaderName: "Rev. Donald Wicks",
    phone: "901-598-3828",
    description: "Support teaching, learning, and discipleship opportunities.",
    category: "Discipleship",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "youth-ministry",
    ministryName: "Youth Ministry",
    leaderName: "Nicole Andrews",
    phone: "256-804-9331",
    description: "Serve young people as they grow in faith and community.",
    category: "Youth",
    isActive: true,
    sortOrder: 4,
  },
  {
    id: "media-ministry",
    ministryName: "Media Ministry",
    leaderName: "Maurice Pryor",
    phone: "256-658-6494",
    description: "Help support worship, communication, and digital ministry.",
    category: "Media",
    isActive: true,
    sortOrder: 5,
  },
  {
    id: "ushers-ministry",
    ministryName: "Ushers Ministry",
    leaderName: "Tara Lucas",
    phone: "256-431-1648",
    description: "Welcome worshipers and help create a hospitable worship experience.",
    category: "Hospitality",
    isActive: true,
    sortOrder: 6,
  },
  {
    id: "choir",
    ministryName: "Choir",
    leaderName: "Antonio Woodruff",
    phone: "256-951-3038",
    description: "Serve through music and help lead the church in worship.",
    category: "Worship",
    isActive: true,
    sortOrder: 7,
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
    const upcomingTitles = events
      .slice(0, 5)
      .map((event) => event.title)
      .join(", ");
    return `You can view upcoming events on the Events page. The next events listed are ${upcomingTitles}. Please check official church updates for times and locations.`;
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
