"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { lenisRef } from "@/components/SmoothScroll";

export type PlayerPhase = "idle" | "lifting" | "returning" | "inserting" | "lowering" | "playing";
export type DiscFlight = { id: number; slug: string; from: { x: number; y: number; size: number }; to: { x: number; y: number; size: number }; returning: boolean; duration: number };

function texture() {
  try {
    const context = new AudioContext();
    const buffer = context.createBuffer(1, context.sampleRate * .12, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * .17));
    const source = context.createBufferSource(); source.buffer = buffer;
    const gain = context.createGain(); gain.gain.value = .035;
    source.connect(gain); gain.connect(context.destination);
    source.onended = () => { void context.close(); };
    void context.resume().then(() => source.start()).catch(() => context.close());
  } catch { /* Audio never blocks the visual interaction. */ }
}

export function useRecordPlayer(slugs: string[]) {
  const reduced = useReducedMotion();
  const scope = useRef<HTMLDivElement>(null);
  const platter = useRef<HTMLDivElement>(null);
  const sleeves = useRef(new Map<string, HTMLDivElement>());
  const chapters = useRef(new Map<string, HTMLElement>());
  const [active, setActive] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<string | null>(null);
  const [phase, setPhase] = useState<PlayerPhase>("idle");
  const [flight, setFlight] = useState<DiscFlight | null>(null);
  const [paused, setPaused] = useState(false);
  const [sound, setSound] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  const activeRef = useRef<string | null>(null);
  const loadedRef = useRef<string | null>(null);
  const targetRef = useRef<string | null>(null);
  const suppressed = useRef<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const serial = useRef(0);
  const manualUntil = useRef(0);
  const soundRef = useRef(false);
  const lastScratch = useRef(0);

  // Velocity-Aware Settle tracking
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(0);
  const scrollVelocity = useRef(0);

  useEffect(() => { soundRef.current = sound; }, [sound]);

  const stopTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    serial.current++;
  }, []);

  const settle = useCallback(() => {
    stopTimers();
    setFlight(null);
    loadedRef.current = targetRef.current;
    setLoaded(targetRef.current);
    setPhase(targetRef.current ? "playing" : "idle");
  }, [stopTimers]);

  const request = useCallback((slug: string | null, manual = false) => {
    stopTimers();
    const token = serial.current;
    targetRef.current = slug;
    setFlight(null);

    if (reduced || document.hidden) {
      loadedRef.current = slug;
      setLoaded(slug);
      setPhase(slug ? "playing" : "idle");
      return;
    }

    const small = window.innerWidth < 1024;
    const destination = () => {
      const r = platter.current?.getBoundingClientRect();
      return r ? { x: r.left, y: r.top, size: r.width } : null;
    };

    const origin = (id: string) => {
      const r = sleeves.current.get(id)?.getBoundingClientRect();
      const dest = destination();
      if (!r || !dest) return dest;
      if (small) return { ...dest, y: dest.y - 25 };
      return { x: r.left + r.width * .35, y: Math.max(90, Math.min(innerHeight - r.width, r.top + 10)), size: r.width * .78 };
    };

    const later = (ms: number, fn: () => void) => {
      timers.current.push(setTimeout(() => { if (serial.current === token) fn(); }, ms));
    };

    const incoming = () => {
      if (!slug) { setPhase("idle"); return; }
      const from = origin(slug), to = destination();
      setPhase("inserting");
      if (from && to) setFlight({ id: token, slug, from, to, returning: false, duration: .42 });
      later(420, () => {
        setFlight(null);
        loadedRef.current = slug;
        setLoaded(slug);
        setPhase("lowering");
        later(160, () => {
          setPhase("playing");
          if (manual && soundRef.current) texture();
        });
      });
    };

    const outgoing = loadedRef.current;
    if (outgoing === slug && outgoing) {
      setPhase("playing");
      return;
    }

    if (outgoing) {
      setPhase("lifting");
      later(180, () => {
        const from = destination(), to = origin(outgoing);
        loadedRef.current = null;
        setLoaded(null);
        setPhase("returning");
        if (from && to) setFlight({ id: token, slug: outgoing, from, to, returning: true, duration: .24 });
        later(240, () => {
          setFlight(null);
          incoming();
        });
      });
    } else {
      incoming();
    }
  }, [reduced, stopTimers]);

  const play = useCallback((slug: string, align = true) => {
    suppressed.current = null;
    activeRef.current = slug;
    setActive(slug);
    // Hold scroll-spy while the disc lands and 01→02→03 opens into view.
    manualUntil.current = performance.now() + 5000;
    if (align) {
      const el = chapters.current.get(slug);
      const offset = window.innerWidth < 1024 ? 220 : 112;
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        if (lenisRef.current) lenisRef.current.scrollTo(top, { immediate: true });
        else window.scrollTo({ top, behavior: "instant" });
      }
    }
    request(slug, true);
  }, [request]);

  const eject = () => {
    suppressed.current = activeRef.current;
    request(null, true);
  };

  const scratch = () => {
    if (soundRef.current && loadedRef.current && performance.now() - lastScratch.current > 160) {
      texture();
      lastScratch.current = performance.now();
    }
  };

  useEffect(() => {
    let raf = 0;
    let pending: ReturnType<typeof setTimeout> | undefined;
    let candidate: string | null = null;

    const inspect = () => {
      raf = 0;
      if (document.hidden || performance.now() < manualUntil.current) return;

      const nav = innerWidth < 768 ? 72 : 84;
      const reserved = nav + (innerWidth < 1024 ? 120 : 0);
      const line = reserved + (innerHeight - reserved) * .45;
      const bounds = scope.current?.getBoundingClientRect();
      if (!bounds || bounds.top > line || bounds.bottom < reserved) return;

      let index = 0;
      slugs.forEach((slug, i) => {
        if ((chapters.current.get(slug)?.getBoundingClientRect().top ?? Infinity) <= line) {
          index = i;
        }
      });

      const previous = activeRef.current ? slugs.indexOf(activeRef.current) : -1;
      if (previous >= 0 && index > previous && (chapters.current.get(slugs[index])?.getBoundingClientRect().top ?? 0) > line - 48) {
        index = previous;
      }
      if (previous >= 0 && index < previous && (chapters.current.get(slugs[previous])?.getBoundingClientRect().top ?? 0) < line + 48) {
        index = previous;
      }

      const next = slugs[index];

      // Update active chapter UI state immediately for responsive feedback
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }

      // If already loaded or queued for this project, no need to trigger a flight
      if (next === loadedRef.current && next === targetRef.current) {
        clearTimeout(pending);
        candidate = null;
        return;
      }

      if (candidate === next) return;
      clearTimeout(pending);
      candidate = next;

      // Velocity-Aware Settle:
      // If scrolling quickly past projects (> 0.4px/ms), wait 260ms for scroll deceleration.
      // If scrolling at calm reading pace, swap after a brief 140ms settle.
      const isFastScroll = scrollVelocity.current > 0.4;
      const settleDelay = isFastScroll ? 260 : 140;

      pending = setTimeout(() => {
        candidate = null;
        if (suppressed.current !== next && targetRef.current !== next) {
          suppressed.current = null;
          request(next);
        }
      }, settleDelay);
    };

    const handleScroll = () => {
      const now = performance.now();
      const currentY = window.scrollY;
      const dt = Math.max(1, now - (lastScrollTime.current || now));
      const dy = Math.abs(currentY - lastScrollY.current);
      
      // Calculate instantaneous velocity in px/ms
      scrollVelocity.current = dy / dt;
      lastScrollY.current = currentY;
      lastScrollTime.current = now;

      if (!raf) raf = requestAnimationFrame(inspect);
    };

    const resize = () => {
      clearTimeout(pending);
      candidate = null;
      manualUntil.current = 0;
      settle();
      handleScroll();
    };

    const visibility = () => {
      clearTimeout(pending);
      candidate = null;
      setPageVisible(!document.hidden);
      settle();
      if (!document.hidden) handleScroll();
    };

    const interrupt = () => {
      manualUntil.current = 0;
    };

    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (platter.current) observer.observe(platter.current);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("wheel", interrupt, { passive: true });
    window.addEventListener("touchstart", interrupt, { passive: true });
    document.addEventListener("visibilitychange", visibility);

    const restore = setTimeout(() => {
      settle();
      inspect();
    }, 250);

    return () => {
      clearTimeout(restore);
      clearTimeout(pending);
      cancelAnimationFrame(raf);
      observer.disconnect();
      stopTimers();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resize);
      window.removeEventListener("wheel", interrupt);
      window.removeEventListener("touchstart", interrupt);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [slugs, request, settle, stopTimers]);

  const bindScope = useCallback((el: HTMLDivElement | null) => { scope.current = el; }, []);
  const bindPlatter = useCallback((el: HTMLDivElement | null) => { platter.current = el; }, []);
  const bindSleeve = (slug: string, el: HTMLDivElement | null) => { if (el) sleeves.current.set(slug, el); else sleeves.current.delete(slug); };
  const bindChapter = (slug: string, el: HTMLElement | null) => { if (el) chapters.current.set(slug, el); else chapters.current.delete(slug); };
  const isOnPlatter = (x: number, y: number) => { const r = platter.current?.getBoundingClientRect(); return !!r && x >= r.left - 24 && x <= r.right + 24 && y >= r.top - 24 && y <= r.bottom + 24; };

  return {
    bindScope,
    bindPlatter,
    bindSleeve,
    bindChapter,
    isOnPlatter,
    active,
    loaded,
    phase,
    flight,
    paused,
    setPaused,
    sound,
    setSound,
    play,
    eject,
    scratch,
    reduced,
    spinning: !!loaded && phase === "playing" && !paused && visible && pageVisible && !reduced
  };
}
