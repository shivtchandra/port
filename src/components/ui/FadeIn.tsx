"use client";

import { useEffect, useRef, useState } from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

// Reveal driven by a scroll/resize listener (rAF-throttled). IntersectionObserver
// does not fire reliably in this project (React 19 + Lenis), so we check the
// element's rect against the viewport directly — the same approach NowPlaying uses.
export function FadeIn({ children, delay = 0, className = "" }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    let raf = 0;
    let done = false;
    const check = () => {
      raf = 0;
      if (done) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 160 && rect.bottom > 0) {
        done = true;
        setShown(true);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };

    check(); // in case already in view on mount
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0.25,
        transform: shown ? "none" : "translateY(12px)",
        transition: `opacity 0.6s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s, transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
