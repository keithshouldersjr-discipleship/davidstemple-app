"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import styles from "./friendsgiving.module.css";

export function FriendsgivingShare() {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  async function share() {
    const url = "https://davidstemple.app/friendsgiving";
    setFailed(false);
    try {
      if (navigator.share) {
        await navigator.share({ title: "Friendsgiving Worship", text: "Join us November 22 for worship, fellowship, and a Thanksgiving-style meal at David’s Temple. All are welcome!", url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setFailed(true);
    }
  }

  return (
    <div className={styles.share}>
      <button type="button" onClick={share}>{copied ? <Check size={18} aria-hidden="true" /> : <Share2 size={18} aria-hidden="true" />}{copied ? "Invitation link copied" : "Share an invitation"}</button>
      <a href="/events/friendsgiving-worship.png" download="Friendsgiving-Worship.png"><Copy size={17} aria-hidden="true" /> Download the flyer</a>
      <span role="status" className={styles.shareStatus}>{copied ? "Ready to paste into a message to a friend." : failed ? "Share this link: davidstemple.app/friendsgiving" : ""}</span>
    </div>
  );
}
