"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { doc, increment, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const SESSION_KEY = "portfolio_view_counted";

// 20-digit tumbler reel (0-9 repeated twice) for a full mechanical spin cycle
const TUMBLER_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function OdometerDigit({
  digit,
  indexFromRight = 0,
  reduced = false,
}: {
  digit: string;
  indexFromRight?: number;
  reduced?: boolean;
}) {
  const isNumber = !isNaN(parseInt(digit, 10));
  const num = isNumber ? parseInt(digit, 10) : 0;

  if (!isNumber) {
    return <span className="odometer-char">{digit}</span>;
  }

  // If reduced motion is preferred, jump straight to target without tumbling
  if (reduced) {
    return (
      <span className="odometer-reel" aria-hidden="true">
        <span
          className="odometer-column"
          style={{ transform: `translateY(-${((10 + num) / TUMBLER_DIGITS.length) * 100}%)` }}
        >
          {TUMBLER_DIGITS.map((n, idx) => (
            <span key={idx} className="odometer-num">
              {n}
            </span>
          ))}
        </span>
      </span>
    );
  }

  // Calculate target offset: roll past first 10 digits into the second cycle
  const targetPercent = -((10 + num) / TUMBLER_DIGITS.length) * 100;
  const delay = indexFromRight * 0.08 + 0.15; // Stagger from left to right or right to left

  return (
    <span className="odometer-reel" aria-hidden="true">
      <motion.span
        className="odometer-column"
        initial={{ y: "0%" }}
        animate={{ y: `${targetPercent}%` }}
        transition={{
          duration: 1.6 + indexFromRight * 0.12,
          ease: [0.16, 1, 0.3, 1], // High momentum mechanical settle
          delay,
        }}
      >
        {TUMBLER_DIGITS.map((n, idx) => (
          <span key={idx} className="odometer-num">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export function ViewCounter({ className }: { className?: string }) {
  const [views, setViews] = useState<number | null>(null);
  const reduced = useReducedMotion();

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
      <span className={`nav-views ${className ?? ""}`} aria-hidden>
        <span className="nav-views-dot animate-pulse" />
        <span className="opacity-60">··· views</span>
      </span>
    );
  }

  const formatted = views.toLocaleString();
  const chars = formatted.split("");

  return (
    <span
      className={`nav-views nav-views-odometer ${className ?? ""}`}
      title="Total site visits — counted once per browser session"
      aria-label={`${views.toLocaleString()} site views`}
    >
      <span className="nav-views-dot" aria-hidden="true" />
      <span className="odometer-display">
        {chars.map((char, i) => (
          <OdometerDigit
            key={`${i}-${char}`}
            digit={char}
            indexFromRight={chars.length - 1 - i}
            reduced={!!reduced}
          />
        ))}
      </span>
      <span className="odometer-suffix">views</span>
    </span>
  );
}
