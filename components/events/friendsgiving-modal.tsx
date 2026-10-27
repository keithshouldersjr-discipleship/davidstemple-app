"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import styles from "./friendsgiving.module.css";

const dismissalKey = "friendsgiving-2026-dismissed";

function rememberDismissal() {
  try { sessionStorage.setItem(dismissalKey, "true"); } catch { /* The invitation also works when browser storage is unavailable. */ }
}

export function FriendsgivingModal({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    try { if (sessionStorage.getItem(dismissalKey)) return; } catch { /* Show the invitation without requiring storage. */ }
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    function restoreScroll() { document.body.style.overflow = previousOverflow; }
    dialog.addEventListener("close", restoreScroll);
    return () => {
      dialog.removeEventListener("close", restoreScroll);
      dialog.close();
      restoreScroll();
    };
  }, []);

  function dismiss() {
    rememberDismissal();
    dialogRef.current?.close();
  }

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="friendsgiving-title" onCancel={rememberDismissal}>
      <div className={styles.modalBar}>
        <span>YOU&apos;RE INVITED</span>
        <button type="button" onClick={dismiss} aria-label="Close Friendsgiving invitation"><X size={22} aria-hidden="true" /></button>
      </div>
      <div className={styles.modalScroll}>{children}</div>
    </dialog>
  );
}

export function FriendsgivingWebsiteLink() {
  return <Link href="/" className={styles.websiteLink} onClick={rememberDismissal} aria-label="Close invitation and visit the church website">Church website <X size={20} aria-hidden="true" /></Link>;
}
