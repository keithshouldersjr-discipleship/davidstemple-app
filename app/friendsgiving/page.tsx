import type { Metadata } from "next";
import { FriendsgivingExperience } from "@/components/events/friendsgiving-experience";
import { FriendsgivingWebsiteLink } from "@/components/events/friendsgiving-modal";
import styles from "@/components/events/friendsgiving.module.css";

const title = "Friendsgiving Worship | David’s Temple";
const description = "You’re invited! Join us Sunday, November 22, 2026 in Tanner, Alabama. Sunday School at 8:30 AM, worship at 9:30 AM, and a Thanksgiving-style meal after worship. All are welcome.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/friendsgiving" },
  openGraph: { title, description, url: "/friendsgiving", type: "website", images: [{ url: "/events/friendsgiving-worship.png", width: 1092, height: 1440, alt: "Friendsgiving Worship — November 22 at David’s Temple" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/events/friendsgiving-worship.png"] },
};

export default function FriendsgivingPage() {
  return (
    <main className={styles.page}>
      <div className={styles.pageBar}><span>DAVID&apos;S TEMPLE · FRIENDSGIVING WORSHIP</span><FriendsgivingWebsiteLink /></div>
      <div className={styles.pageContent}><FriendsgivingExperience /></div>
    </main>
  );
}
