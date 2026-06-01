"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import {
  tracksForSide,
  SIDE_A_ENTRY_ID,
  SIDE_B_ENTRY_ID,
  type AlbumSide,
} from "@/lib/tracks";

export const lenisRef: { current: Lenis | null } = { current: null };

const TOUR_SCROLL_DURATION = 4.5;
const TOUR_DWELL_MS = 1800;
const JUMP_DURATION = 2.2;

/** Match Lenis default wheel easing for consistent programmatic scrolls */
const tourEasing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

type TourListener = (running: boolean) => void;
const tourListeners = new Set<TourListener>();

export const tourRef = {
  running: false,
};

let tourCancelled = false;
let tourProgrammatic = false;
let dwellTimeout: ReturnType<typeof setTimeout> | null = null;
let userInputCleanup: (() => void) | null = null;

function notifyTour(running: boolean) {
  tourRef.running = running;
  tourListeners.forEach((cb) => cb(running));
}

export function subscribeTour(listener: TourListener): () => void {
  tourListeners.add(listener);
  listener(tourRef.running);
  return () => tourListeners.delete(listener);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    dwellTimeout = setTimeout(() => {
      dwellTimeout = null;
      resolve();
    }, ms);
  });
}

function scrollToElementAsync(
  target: HTMLElement,
  options: { duration?: number; immediate?: boolean }
): Promise<void> {
  return new Promise((resolve) => {
    const done = () => {
      tourProgrammatic = false;
      resolve();
    };

    if (lenisRef.current) {
      tourProgrammatic = true;
      lenisRef.current.scrollTo(target, {
        offset: 0,
        duration: options.immediate ? 0 : options.duration ?? TOUR_SCROLL_DURATION,
        immediate: options.immediate,
        lock: true,
        force: true,
        easing: tourEasing,
        onComplete: done,
      });
    } else {
      target.scrollIntoView({
        behavior: options.immediate ? "auto" : "smooth",
      });
      const wait = options.immediate ? 0 : (options.duration ?? TOUR_SCROLL_DURATION) * 1000;
      setTimeout(done, wait);
    }
  });
}

function onUserInterrupt() {
  if (tourProgrammatic || !tourRef.running) return;
  stopGuidedTour();
}

function attachUserInterruptListeners() {
  const opts = { passive: true } as const;
  window.addEventListener("wheel", onUserInterrupt, opts);
  window.addEventListener("touchstart", onUserInterrupt, opts);
  window.addEventListener("keydown", onUserInterrupt);

  userInputCleanup = () => {
    window.removeEventListener("wheel", onUserInterrupt);
    window.removeEventListener("touchstart", onUserInterrupt);
    window.removeEventListener("keydown", onUserInterrupt);
    userInputCleanup = null;
  };
}

export function scrollToSection(id: string, duration = JUMP_DURATION) {
  const target = document.getElementById(id);
  if (!target) return;

  if (lenisRef.current) {
    lenisRef.current.scrollTo(target, {
      offset: 0,
      duration: prefersReducedMotion() ? 0 : duration,
      immediate: prefersReducedMotion(),
      easing: tourEasing,
    });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

export function scrollToSide(side: AlbumSide) {
  stopGuidedTour();
  scrollToSection(side === "a" ? SIDE_A_ENTRY_ID : SIDE_B_ENTRY_ID);
}

export function stopGuidedTour() {
  tourCancelled = true;
  tourProgrammatic = false;
  if (dwellTimeout) {
    clearTimeout(dwellTimeout);
    dwellTimeout = null;
  }
  userInputCleanup?.();
  if (tourRef.running) {
    tourRef.running = false;
    notifyTour(false);
  }
}

export async function startGuidedTour(side: AlbumSide | "full" = "full") {
  if (tourRef.running) return;

  tourCancelled = false;
  tourRef.running = true;
  notifyTour(true);
  attachUserInterruptListeners();

  const reduced = prefersReducedMotion();
  const scrollDuration = reduced ? 0 : TOUR_SCROLL_DURATION;
  const dwell = reduced ? 400 : TOUR_DWELL_MS;
  const playlist = tracksForSide(side);

  try {
    if (side === "b" && !reduced) {
      const sideEl = document.getElementById(SIDE_B_ENTRY_ID);
      if (sideEl) {
        await scrollToElementAsync(sideEl, { duration: scrollDuration * 0.85 });
        if (tourCancelled) return;
        await delay(dwell * 0.6);
      }
    }

    for (const track of playlist) {
      if (tourCancelled) break;

      const el = document.getElementById(track.id);
      if (!el) continue;

      await scrollToElementAsync(el, {
        duration: scrollDuration,
        immediate: reduced,
      });
      if (tourCancelled) break;

      await delay(dwell);
    }
  } finally {
    userInputCleanup?.();
    tourProgrammatic = false;
    tourRef.running = false;
    notifyTour(false);
    tourCancelled = false;
  }
}

export function toggleGuidedTour(side: AlbumSide | "full" = "full") {
  if (tourRef.running) stopGuidedTour();
  else startGuidedTour(side);
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: tourEasing,
      smoothWheel: true,
      touchMultiplier: 1.6,
      syncTouch: true,
    });
    lenisRef.current = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      stopGuidedTour();
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
