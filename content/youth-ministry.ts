import type { Announcement } from "@/lib/types";

export type TeacherAssignment = {
  name?: string;
  lead?: boolean;
};

export type TeachingSchedule = {
  id: string;
  title: string;
  description: string;
  rows: Array<{
    ageGroup: string;
    assignments: TeacherAssignment[];
  }>;
  note?: string;
};

export const scheduleWeeks = ["1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week"];

export const youthMinistryAnnouncements: Announcement[] = [
  {
    id: "youth-teaching-schedule-published",
    title: "Teaching schedule now available",
    body: "Youth ministry teachers can review current Youth Church, Sunday School, and Bible Study assignments below. Assignments remain tentative and may change as teacher input is received.",
    audience: "leaders",
    startDate: "2026-09-07",
  },
];

export const teachingSchedules: TeachingSchedule[] = [
  {
    id: "youth-church",
    title: "Youth Church",
    description: "Monthly teaching rotation for nursery through grade 12.",
    rows: [
      {
        ageGroup: "Nursery",
        assignments: [
          { name: "Rose Allen" },
          { name: "Earnestine Cox" },
          { name: "Koleceia Shoulders", lead: true },
          {},
          { name: "TBD" },
        ],
      },
      {
        ageGroup: "PreK - 3",
        assignments: [
          { name: "Michelle Jones", lead: true },
          { name: "Rowena Davis" },
          { name: "Jamie Salter" },
          {},
          { name: "TBD" },
        ],
      },
      {
        ageGroup: "4-6",
        assignments: [
          { name: "Pam McDonald", lead: true },
          { name: "Patricia Peoples" },
          { name: "Shirley McDonald" },
          {},
          { name: "TBD" },
        ],
      },
      {
        ageGroup: "7-12",
        assignments: [
          { name: "Jimmy & Nicole", lead: true },
          { name: "Jimmy & Nicole" },
          { name: "Jimmy & Nicole" },
          {},
          { name: "TBD" },
        ],
      },
    ],
    note: "Lead teachers are identified in the schedule.",
  },
  {
    id: "sunday-school",
    title: "Sunday School",
    description: "Weekly teaching assignments by grade group.",
    rows: [
      { ageGroup: "Nursery", assignments: [{}, {}, {}, {}, {}] },
      { ageGroup: "PreK - 3", assignments: [{}, {}, {}, {}, {}] },
      { ageGroup: "4-5", assignments: [{}, {}, {}, {}, {}] },
      {
        ageGroup: "6-8",
        assignments: [
          { name: "Jennifer Wicks" },
          { name: "Dorothy Shoulders" },
          { name: "Dorothy Shoulders" },
          { name: "Jennifer Wicks" },
          {},
        ],
      },
      {
        ageGroup: "9-12",
        assignments: [
          { name: "KJ & Liv" },
          { name: "Erica Alexander" },
          { name: "KJ & Liv" },
          { name: "Crystal Hines" },
          {},
        ],
      },
    ],
  },
  {
    id: "bible-study",
    title: "Bible Study",
    description: "Wednesday teaching rotation for elementary students and teens.",
    rows: [
      { ageGroup: "Nursery", assignments: [{}, {}, {}, {}, {}] },
      {
        ageGroup: "1-6",
        assignments: [
          {},
          { name: "Sydney Edwards" },
          { name: "Ola Ward" },
          { name: "Erica Alexander" },
          { name: "Sydney Edwards" },
        ],
      },
      {
        ageGroup: "7-12",
        assignments: [
          {},
          { name: "Ke’Juan Wright" },
          { name: "Ke’Juan Wright" },
          { name: "Ke’Juan Wright" },
          { name: "Ke’Juan Wright" },
        ],
      },
    ],
    note: "The teens will need an advisor or supervisor to help them be student-led on Wednesdays.",
  },
];
