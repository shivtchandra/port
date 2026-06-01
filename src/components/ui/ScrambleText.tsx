"use client";

import { useEffect, useRef, useState } from "react";

const CHARSET = "!<>-_\\/[]{}—=+*^?#@$%&0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** frames per resolved character — lower is faster (default 3) */
  speed?: number;
}

export function ScrambleText({ text, className, speed = 3 }: ScrambleTextProps) {
  const [display, setDisplay] = useState(text);
  const containerRef = useRef<HTMLSpanElement>(null);
  const hasTriggered = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          observer.disconnect();
          run();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  function run() {
    const chars = text.split("");
    const total = chars.length * speed;
    let frame = 0;

    const tick = () => {
      const solved = Math.floor(frame / speed);
      setDisplay(
        chars
          .map((c, i) =>
            c === " "
              ? " "
              : i < solved
              ? c
              : CHARSET[Math.floor(Math.random() * CHARSET.length)]
          )
          .join("")
      );
      frame++;
      if (frame <= total) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }

  return (
    <span ref={containerRef} className={className}>
      {display}
    </span>
  );
}
