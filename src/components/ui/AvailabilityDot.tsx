"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

type Status = "available" | "busy" | "in-a-meeting";

const STATUS_COLORS: Record<Status, string> = {
  available: "#10b981",
  busy: "#f59e0b",
  "in-a-meeting": "#ef4444",
};

export function AvailabilityDot() {
  const [status, setStatus] = useState<Status>("available");

  useEffect(() => {
    try {
      const unsub = onSnapshot(doc(db, "site_settings", "status"), (snap) => {
        if (snap.exists()) {
          setStatus((snap.data().value as Status) ?? "available");
        }
      });
      return unsub;
    } catch {
      // Firebase unavailable — default to available
    }
  }, []);

  const color = STATUS_COLORS[status];

  return (
    <span
      className="relative inline-flex items-center justify-center h-2.5 w-2.5"
      aria-label={`Status: ${status}`}
      title={status.replace(/-/g, " ")}
    >
      <span
        className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-60"
        style={{ backgroundColor: color }}
      />
      <span
        className="relative inline-flex h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}
