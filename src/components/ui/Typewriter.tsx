"use client";

import { useEffect, useRef, useState } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  showCaret?: boolean;
}

export function Typewriter({
  text,
  speed = 55,
  className = "",
  onComplete,
  showCaret = true,
}: TypewriterProps) {
  const [display, setDisplay] = useState("");
  const [finished, setFinished] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setDisplay("");
    setFinished(false);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(text);
      setFinished(true);
      onCompleteRef.current?.();
      return;
    }

    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setDisplay(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(interval);
        setFinished(true);
        onCompleteRef.current?.();
      }
    }, speed);

    return () => window.clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      {display}
      {showCaret && !finished && (
        <span className="caret-blink text-text/80" aria-hidden>
          |
        </span>
      )}
    </span>
  );
}
