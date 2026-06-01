"use client";

import { Equalizer } from "@/components/ui/Equalizer";

export function TrackLabel({
  num,
  name,
  className = "",
}: {
  num: string;
  name: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-3 mb-4 ${className}`}>
      <span className="track-num text-sm" style={{ opacity: 0.6 }}>
        {num}
      </span>
      <span className="h-px w-8 bg-white/20" />
      <span className="text-text-muted text-xs tracking-[0.25em] uppercase font-medium">
        {name}
      </span>
      <Equalizer bars={4} className="h-3 ml-1" />
    </span>
  );
}
