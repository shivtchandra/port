"use client";

import { useEffect, useRef, useState } from "react";

// Deterministic pseudo-random bar height in [min, 1]
function barHeight(i: number, min = 0.18) {
  const v = Math.abs(Math.sin(i * 12.9898) * 43758.5453);
  return min + (v - Math.floor(v)) * (1 - min);
}

/** Static row of waveform bars — texture use (e.g. inside a project row). */
export function Waveform({
  bars = 28,
  className = "",
  height = 24,
}: {
  bars?: number;
  className?: string;
  height?: number;
}) {
  return (
    <span
      className={`inline-flex items-center gap-[2px] ${className}`}
      style={{ height }}
      aria-hidden
    >
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="w-[2px] rounded-full bg-current"
          style={{ height: `${(barHeight(i) * 100).toFixed(2)}%` }}
        />
      ))}
    </span>
  );
}

/** Full-width waveform line that "draws" itself as it scrolls into view. */
export function WaveformDivider({ className = "" }: { className?: string }) {
  const W = 1200;
  const H = 40;
  const mid = H / 2;
  const steps = 90;
  let d = `M 0 ${mid}`;
  for (let i = 1; i <= steps; i++) {
    const x = (i / steps) * W;
    const amp = (barHeight(i, 0.05) - 0.5) * (H - 6);
    d += ` L ${x.toFixed(1)} ${(mid + amp).toFixed(1)}`;
  }

  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const path = pathRef.current;
    const wrap = wrapRef.current;
    if (!path || !wrap) return;
    setLen(path.getTotalLength());

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      return;
    }

    let raf = 0;
    let done = false;
    const check = () => {
      raf = 0;
      if (done) return;
      const rect = wrap.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60 && rect.bottom > 0) {
        done = true;
        setDrawn(true);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`w-full overflow-hidden ${className}`} aria-hidden>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full h-8 text-white/15"
      >
        <path
          ref={pathRef}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          style={{
            strokeDasharray: len || undefined,
            strokeDashoffset: drawn ? 0 : len || undefined,
            opacity: len ? 1 : 0,
            transition: "stroke-dashoffset 1.4s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
        />
      </svg>
    </div>
  );
}
