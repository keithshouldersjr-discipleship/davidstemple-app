import Image from "next/image";
import { ArrowDown, ArrowUpRight, BookOpen, Heart, MapPin, Users, Utensils } from "lucide-react";
import { FriendsgivingShare } from "./friendsgiving-share";
import styles from "./friendsgiving.module.css";

const actions = [
  ["Invite", "Members build relationships and personally invite friends, neighbors, and family members to worship."],
  ["Pray", "We intentionally pray for those we invite, trusting God to prepare hearts and open doors."],
  ["Worship", "We prepare a meaningful, Christ-centered worship experience in which members and guests can encounter God together."],
  ["Connect", "We demonstrate genuine hospitality by welcoming guests, building relationships, and expressing sincere appreciation for their presence."],
  ["Cultivate", "We continue those relationships through prayer, encouragement, thoughtful follow-up, and opportunities for discipleship."],
];

export function FriendsgivingExperience() {
  return (
    <article className={styles.experience}>
      <section className={styles.flyerStage} aria-label="Friendsgiving Worship invitation">
        <h1 id="friendsgiving-title" className="sr-only">Friendsgiving Worship at David&apos;s Temple</h1>
        <Image
          src="/events/friendsgiving-worship.png"
          alt="Friendsgiving Worship invitation: Sunday, November 22. Sunday School at 8:30 AM, Worship Service at 9:30 AM, followed by a Thanksgiving-style meal. All are welcome at David’s Temple Missionary Baptist Church, 11273 Stewart Road, Tanner, Alabama 35671."
          width={1092}
          height={1440}
          sizes="(max-width: 640px) 94vw, 600px"
          preload
          className={styles.flyer}
        />
        <a href="#friendsgiving-details" className={styles.scrollCue}>
          <span>There&apos;s a place for you here</span>
          <span className={styles.scrollLabel}>Scroll to discover more <ArrowDown size={18} aria-hidden="true" /></span>
        </a>
      </section>

      <div id="friendsgiving-details" className={styles.details}>
        <section className={styles.welcome}>
          <p className={styles.eyebrow}>Worship. Connect. Celebrate.</p>
          <h2>Come as a friend.<br /><em>Leave as family.</em></h2>
          <p>Bring a friend, family member, or neighbor for a day of meaningful worship, genuine fellowship, and a Thanksgiving-style meal together. Whether you&apos;re visiting for the first time or coming home, you are welcome here.</p>
          <div className={styles.date}>Sunday, November 22, 2026 <span>Tanner, Alabama</span></div>
          <div className={styles.schedule}>
            <div><BookOpen aria-hidden="true" /><span>Sunday School<strong>8:30 AM</strong></span></div>
            <div><Users aria-hidden="true" /><span>Worship Service<strong>9:30 AM</strong></span></div>
            <div><Utensils aria-hidden="true" /><span>A meal together<strong>After worship</strong></span></div>
          </div>
          <a className={styles.location} href="https://www.google.com/maps/search/?api=1&query=11273+Stewart+Rd+Tanner+AL+35671" target="_blank" rel="noopener noreferrer">
            <MapPin size={22} aria-hidden="true" /><span>David&apos;s Temple Missionary Baptist Church<small>11273 Stewart Rd. · Tanner, AL 35671</small></span><ArrowUpRight size={20} aria-hidden="true" />
          </a>
        </section>

        <section className={styles.purpose}>
          <p className={styles.eyebrow}>Our central purpose</p>
          <h2>More than a gathering.<br /><em>An invitation to Jesus.</em></h2>
          <p>To connect our community to Jesus and His church through personal invitations, meaningful worship, genuine hospitality, and intentional relationships that create opportunities for salvation and discipleship.</p>
        </section>

        <section className={styles.win}>
          <span className={styles.heart}><Heart size={23} aria-hidden="true" /></span>
          <p className={styles.eyebrow}>What does a win look like?</p>
          <blockquote>A win is when a personal invitation becomes a meaningful connection that helps someone take their next step toward a lasting relationship with Jesus and His church.</blockquote>
        </section>

        <section className={styles.path}>
          <p className={styles.eyebrow}>Five intentional actions</p>
          <h2>It begins with an invitation.<br /><em>It grows through relationship.</em></h2>
          <p className={styles.pathIntro}>We will pursue this outcome through five intentional actions:</p>
          <ol>
            {actions.map(([title, description], index) => (
              <li key={title}><span className={styles.number}>0{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div></li>
            ))}
          </ol>
        </section>

        <section className={styles.closing}>
          <p className={styles.eyebrow}>Our ultimate desire</p>
          <h2>A day together.<br /><em>A connection that lasts.</em></h2>
          <p>Our ultimate desire is not simply to have guests attend Friendsgiving Worship, but to see relationships established that help people come to know Christ, grow in faith, and become connected to His church.</p>
          <FriendsgivingShare />
          <p className={styles.signature}>All are welcome. There&apos;s a place for you.</p>
        </section>
      </div>
    </article>
  );
}
