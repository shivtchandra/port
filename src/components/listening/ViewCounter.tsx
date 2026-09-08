"use client";

import { useEffect, useState } from "react";
import { doc, increment, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const SESSION_KEY = "portfolio_view_counted";

function OdometerDigit({ digit, delayMs = 0 }: { digit: string; delayMs?: number }) {
  const isNumber = !isNaN(parseInt(digit, 10));
  const num = isNumber ? parseInt(digit, 10) : 0;

  if (!isNumber) {
    return <span className="odometer-char">{digit}</span>;
  }

  return (
    <span className="odometer-reel" aria-hidden="true">
      <span
        className="odometer-column"
        style={{
          transform: `translateY(-${num * 10}%)`,
          transitionDelay: `${delayMs}ms`,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} className="odometer-num">
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

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
        <span className="nav-views-dot animate-pulse" />
        · · ·
      </span>
    );
  }

  const formatted = views.toLocaleString();
  const digits = formatted.split("");

  return (
    <span
      className={`nav-views-odometer ${className ?? ""}`}
      title="Total site visits — counted once per browser session"
      aria-label={`${views.toLocaleString()} site views`}
    >
      <span className="nav-views-dot" aria-hidden="true" />
      <span className="odometer-display">
        {digits.map((char, i) => (
          <OdometerDigit
            key={`${i}-${char}`}
            digit={char}
            delayMs={(digits.length - 1 - i) * 60}
          />
        ))}
      </span>
      <span className="odometer-suffix">views</span>
    </span>
  );
}
