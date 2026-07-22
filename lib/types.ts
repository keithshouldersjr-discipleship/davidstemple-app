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

// Shared church-data contract. public.members is canonical for all new modules;
// MemberProfile remains the temporary adapter for the legacy website directory.
export type MembershipStatus =
  | "visitor"
  | "prospect"
  | "active"
  | "inactive"
  | "transferred"
  | "deceased";

export type ChurchMember = {
  id: string;
  organizationId: string;
  externalSourceId?: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  preferredName?: string;
  birthday?: string;
  phone?: string;
  email?: string;
  address?: string;
  householdId?: string;
  membershipStatus: MembershipStatus;
  memberSince?: string;
  active: boolean;
};

export type ChurchOperationsDashboardData = {
  metrics: {
    active_members: number;
    attendance_last_30_days: number;
    first_time_guests_last_30_days: number;
    unique_servants_last_90_days: number;
    members_not_serving_last_90_days: number;
  };
  attendance_by_week: Array<{ week: string; attendance: number }>;
  upcoming_serving: Array<{
    id: string;
    member_name: string;
    role_name: string;
    scheduled_for: string;
    status: "scheduled" | "confirmed";
  }>;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};
