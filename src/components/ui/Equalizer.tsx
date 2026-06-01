"use client";

import type { CSSProperties } from "react";

const DELAYS = [0, 0.35, 0.15, 0.5, 0.25, 0.4, 0.1, 0.45];

export function Equalizer({
  bars = 5,
  className = "",
  barClassName = "",
  style,
}: {
  bars?: number;
  className?: string;
  barClassName?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={`inline-flex items-end gap-[3px] h-4 ${className}`}
      style={style}
      aria-hidden
    >
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={`eq-bar w-[2px] bg-text/70 ${barClassName}`}
          style={{ animationDelay: `${DELAYS[i % DELAYS.length]}s` }}
        />
      ))}
    </span>
  );
}
