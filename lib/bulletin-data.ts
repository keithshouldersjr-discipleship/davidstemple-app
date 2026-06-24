import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  CalendarDays,
  Church,
  Cross,
  Globe,
  HandHeart,
  Heart,
  LinkIcon,
  Megaphone,
  Phone,
  Sparkles,
  Star,
  Target,
  Users,
} from "lucide-react";
import bulletinContent from "@/content/bulletin.current.json";

export type BulletinIconName =
  | "book"
  | "calendar"
  | "church"
  | "cross"
  | "globe"
  | "hands"
  | "heart"
  | "link"
  | "megaphone"
  | "phone"
  | "sparkles"
  | "star"
  | "target"
  | "users";

export type BulletinLink = {
  label: string;
  url: string;
  icon: BulletinIconName;
};

export type BulletinScheduleItem = {
  label: string;
  time: string;
  icon: BulletinIconName;
};

export type BulletinEvent = {
  date: string;
  title: string;
  description: string;
};

export type WeeklyBulletin = {
  slug: string;
  dateRange: string;
  title: string;
  subtitle: string;
  missionLine: string;
  pastor: {
    name: string;
    image: string;
    noteTitle: string;
    note: string;
  };
  focus: {
    title: string;
    body: string;
  };
  weeklySchedule: BulletinScheduleItem[];
  importantLinks: BulletinLink[];
  sundayInvite: {
    title: string;
    image: string;
    body: string;
    emphasis: string;
    buttonLabel: string;
    buttonUrl: string;
  };
  upcomingEvents: BulletinEvent[];
  serve: {
    title: string;
    intro: string;
    items: string[];
    callout: string;
  };
  ministrySpotlight: {
    title: string;
    ministry: string;
    image: string;
    body: string;
    buttonLabel: string;
    buttonUrl: string;
  };
  prayerCare: {
    title: string;
    intro: string;
    items: string[];
    contactLabel: string;
    contactUrl: string;
  };
  stayConnected: {
    title: string;
    intro: string;
    items: string[];
    closing: string;
  };
  footer: {
    address: string;
    serviceTimes: string[];
    websiteLabel: string;
    websiteUrl: string;
    facebookUrl: string;
    instagramUrl: string;
  };
};

export const bulletinIcons: Record<BulletinIconName, LucideIcon> = {
  book: BookOpen,
  calendar: CalendarDays,
  church: Church,
  cross: Cross,
  globe: Globe,
  hands: HandHeart,
  heart: Heart,
  link: LinkIcon,
  megaphone: Megaphone,
  phone: Phone,
  sparkles: Sparkles,
  star: Star,
  target: Target,
  users: Users,
};

export const currentBulletin = bulletinContent as WeeklyBulletin;
