export type ResourceCategory =
  | "Visit"
  | "Info"
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
  ministry?: string;
  location: string;
  registrationUrl?: string;
  leaderName?: string;
  leaderEmail?: string;
  leaderPhone?: string;
  supportNeeded?: string[];
  requestVolunteers?: boolean;
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

export type MemberStatus = "active" | "inactive" | "deceased";
export type CareStatus = "none" | "sick_shut_in" | "bereavement";

export type MemberProfile = {
  id: string;
  firstName: string;
  lastName: string;
  birthdayMonthDay?: string;
  phone?: string;
  email?: string;
  spouseName?: string;
  children: string[];
  ministryInterests: string[];
  deaconGroup?: string;
  householdLeaderId?: string;
  careStatus?: CareStatus;
  careNotes?: string;
  careUpdatedAt?: string;
  status: MemberStatus;
  notes?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};
