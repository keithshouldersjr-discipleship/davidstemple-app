export type ResourceCategory =
  | "Visit"
  | "Grow"
  | "Serve"
  | "Care"
  | "Give"
  | "Ministry Updates";

export type Resource = {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  url: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
};

export type ChurchInfo = {
  id: string;
  topic: string;
  question: string;
  answer: string;
  sourceUrl?: string;
  lastUpdated: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  audience: "members" | "visitors" | "leaders" | "all";
  startDate: string;
  endDate?: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  registrationUrl?: string;
};

export type MinistryContact = {
  id: string;
  ministryName: string;
  leaderName: string;
  phone: string;
  description?: string;
  category: "Discipleship" | "Care" | "Worship" | "Hospitality" | "Media" | "Youth" | "Men" | "Women";
  isActive: boolean;
  sortOrder: number;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};
