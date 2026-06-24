import type { Metadata } from "next";
import { WeeklyBulletin } from "@/components/bulletin/weekly-bulletin";
import { currentBulletin } from "@/lib/bulletin-data";

export const metadata: Metadata = {
  title: "Weekly Bulletin | David's Temple",
  description:
    "The latest David's Temple weekly bulletin with announcements, service times, events, ministry needs, and prayer care.",
  openGraph: {
    title: "David's Temple Weekly Bulletin",
    description:
      "Stay informed, connected, and engaged with this week's David's Temple bulletin.",
    url: "/bulletin",
  },
};

export default function BulletinPage() {
  return <WeeklyBulletin bulletin={currentBulletin} />;
}
