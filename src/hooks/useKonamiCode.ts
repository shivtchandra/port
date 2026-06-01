"use client";

import { useEffect } from "react";

const SEQUENCE = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a",
];

export function useKonamiCode(onSuccess: () => void) {
  useEffect(() => {
    let pos = 0;

    const handler = (e: KeyboardEvent) => {
      if (e.key === SEQUENCE[pos]) {
        pos++;
        if (pos === SEQUENCE.length) {
          pos = 0;
          onSuccess();
        }
      } else {
        pos = e.key === SEQUENCE[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSuccess]);
}
