"use client";

import { useEffect, useState } from "react";
import { doc, increment, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const SESSION_KEY = "portfolio_view_counted";

export function ViewCounter({ className }: { className?: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const ref = doc(db, "stats", "site");

    if (typeof window !== "undefined" && !sessionStorage.getItem(SESSION_KEY)) {
      sessionStorage.setItem(SESSION_KEY, "1");
      void setDoc(ref, { views: increment(1) }, { merge: true }).catch(() => {
        /* Firestore rules or network — counter still tries to read */
      });
    }

    const unsub = onSnapshot(
      ref,
      (snap) => {
        const value = snap.data()?.views;
        setViews(typeof value === "number" ? value : 0);
      },
      () => setViews(null),
    );

    return unsub;
  }, []);

  if (views === null) {
    return (
      <span className={className} aria-hidden>
        · · ·
      </span>
    );
  }

  return (
    <span
      className={className}
      title="Total site visits — counted once per browser session"
      aria-label={`${views.toLocaleString()} site views`}
    >
      <span className="nav-views-dot" aria-hidden />
      {views.toLocaleString()} views
    </span>
  );
}
