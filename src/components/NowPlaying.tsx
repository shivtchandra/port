"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause } from "lucide-react";
import { Equalizer } from "@/components/ui/Equalizer";
import {
  scrollToSection,
  scrollToSide,
  stopGuidedTour,
  subscribeTour,
  startGuidedTour,
  lenisRef,
} from "@/components/SmoothScroll";
import { TRACKS, type AlbumSide } from "@/lib/tracks";

function getScrollY() {
  return lenisRef.current?.scroll ?? window.scrollY;
}

export default function NowPlaying() {
  const [active, setActive] = useState(0);
  const [tourPlaying, setTourPlaying] = useState(false);
  const [activeSide, setActiveSide] = useState<AlbumSide>("a");

  // Direct DOM refs — progress bars and dots update without React re-renders
  const topBarRef = useRef<HTMLDivElement>(null);
  const scrubLineRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const activeRef = useRef(0);
  const nativeRafRef = useRef(0);

  useEffect(() => subscribeTour(setTourPlaying), []);

  const update = useCallback(() => {
    const scrollY = getScrollY();
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const prog = max > 0 ? Math.min(1, scrollY / max) : 0;

    // Update progress bars instantly — no CSS transition
    const pct = `${prog * 100}%`;
    if (topBarRef.current) topBarRef.current.style.width = pct;
    if (scrubLineRef.current) scrubLineRef.current.style.width = pct;

    // Determine active track — last whose top edge is above 45% of viewport
    const threshold = window.innerHeight * 0.45;
    let current = 0;
    for (let i = 0; i < TRACKS.length; i++) {
      const el = document.getElementById(TRACKS[i].id);
      if (el && el.getBoundingClientRect().top <= threshold) current = i;
    }

    // Update dots directly — instant, no transition
    dotRefs.current.forEach((dot, i) => {
      if (!dot) return;
      if (i < current) {
        dot.className = "block w-2 h-2 rounded-full border bg-text border-text scale-100";
      } else if (i === current) {
        dot.className = "block w-2 h-2 rounded-full border bg-text border-text scale-150";
      } else {
        dot.className = "block w-2 h-2 rounded-full border bg-transparent border-white/30";
      }
    });

    // Only fire React setState when the active track actually changes
    if (current !== activeRef.current) {
      activeRef.current = current;
      setActive(current);
    }

    // Side detection
    const sideBEl = document.getElementById("side-b");
    const newSide: AlbumSide =
      sideBEl && sideBEl.getBoundingClientRect().top <= threshold ? "b" : "a";
    setActiveSide((prev) => (prev === newSide ? prev : newSide));
  }, []);

  useEffect(() => {
    // Native scroll: deduplicate with cancelable RAF
    const onNativeScroll = () => {
      if (nativeRafRef.current) cancelAnimationFrame(nativeRafRef.current);
      nativeRafRef.current = requestAnimationFrame(() => {
        nativeRafRef.current = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    window.addEventListener("resize", onNativeScroll);

    // Lenis: fire update directly — Lenis already runs inside RAF
    let lenisCleanup: (() => void) | undefined;
    const bindLenis = () => {
      const lenis = lenisRef.current;
      if (!lenis) return;
      lenis.on("scroll", update);
      lenisCleanup = () => lenis.off("scroll", update);
    };
    bindLenis();
    const poll = window.setInterval(() => {
      if (lenisRef.current) {
        clearInterval(poll);
        lenisCleanup?.();
        bindLenis();
        update();
      }
    }, 50);

    return () => {
      clearInterval(poll);
      lenisCleanup?.();
      if (nativeRafRef.current) cancelAnimationFrame(nativeRafRef.current);
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("resize", onNativeScroll);
    };
  }, [update]);

  const track = TRACKS[active];

  const handleScrubberClick = (id: string) => {
    stopGuidedTour();
    scrollToSection(id);
  };

  const handleSideSelect = (side: AlbumSide) => {
    stopGuidedTour();
    scrollToSide(side);
  };

  const handlePlay = () => {
    if (tourPlaying) { stopGuidedTour(); return; }
    startGuidedTour("full");
  };

  const handlePlaySide = (side: AlbumSide) => {
    if (tourPlaying && activeSide === side) { stopGuidedTour(); return; }
    stopGuidedTour();
    startGuidedTour(side);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] pointer-events-none">
      {/* Top progress bar — updated via DOM ref, no CSS transition */}
      <div className="h-px w-full bg-white/10">
        <div ref={topBarRef} className="h-full bg-text" style={{ width: "0%" }} />
      </div>

      <div className="pointer-events-auto bg-bg/80 backdrop-blur-md border-t border-white/10">
        <div className="mx-auto max-w-7xl px-3 md:px-6 h-auto min-h-14 py-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 md:gap-6">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              type="button"
              onClick={handlePlay}
              aria-label={tourPlaying ? "Pause guided scroll" : "Play full album"}
              className="flex items-center gap-2 sm:gap-3 group"
            >
              <span className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/50 transition-colors">
                {tourPlaying ? (
                  <Pause size={11} className="text-text fill-text" />
                ) : (
                  <Play size={11} className="text-text fill-text translate-x-[1px]" />
                )}
              </span>
              <span className="hidden sm:block text-left leading-tight">
                <span className="block text-[9px] tracking-[0.25em] uppercase text-text-muted">
                  {tourPlaying ? "Listening" : "Now Playing"}
                </span>
                <span className="block text-xs text-text tabular-nums">
                  {track.num} · {track.name}
                </span>
              </span>
            </button>

            <div
              className="flex items-center gap-1 border border-white/15 p-0.5"
              role="group"
              aria-label="Choose album side"
            >
              <SidePill
                label="A"
                title="Side A · Technical"
                active={activeSide === "a"}
                onSelect={() => handleSideSelect("a")}
                onPlay={() => handlePlaySide("a")}
                tourPlaying={tourPlaying && activeSide === "a"}
              />
              <SidePill
                label="B"
                title="Side B · Personal"
                active={activeSide === "b"}
                onSelect={() => handleSideSelect("b")}
                onPlay={() => handlePlaySide("b")}
                tourPlaying={tourPlaying && activeSide === "b"}
              />
            </div>
          </div>

          {/* Scrubber — dots updated via DOM refs */}
          <div className="relative flex-1 h-9 flex items-center min-w-0">
            <div className="absolute inset-x-0 h-px bg-white/12" />
            <div
              ref={scrubLineRef}
              className="absolute left-0 h-px bg-text"
              style={{ width: "0%" }}
            />
            {TRACKS.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleScrubberClick(t.id)}
                aria-label={`${t.num} ${t.name}`}
                className="absolute -translate-x-1/2 group"
                style={{ left: `${(i / (TRACKS.length - 1)) * 100}%` }}
              >
                <span
                  ref={(el) => { dotRefs.current[i] = el; }}
                  className={`block w-2 h-2 rounded-full border ${
                    i < active
                      ? "bg-text border-text scale-100"
                      : i === active
                      ? "bg-text border-text scale-150"
                      : "bg-transparent border-white/30"
                  }`}
                />
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] tracking-[0.18em] uppercase text-text-muted opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {t.name}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
            <Equalizer bars={5} className="h-4 hidden md:inline-flex" />
            <span className="text-[9px] tracking-[0.25em] uppercase text-text-muted">
              Vol. 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidePill({
  label,
  title,
  active,
  onSelect,
  onPlay,
  tourPlaying,
}: {
  label: string;
  title: string;
  active: boolean;
  onSelect: () => void;
  onPlay: () => void;
  tourPlaying: boolean;
}) {
  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={onSelect}
        title={`${title} — jump`}
        aria-label={`Jump to ${title}`}
        aria-pressed={active}
        className={`min-w-[2rem] px-2 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase transition-colors ${
          active ? "bg-text text-bg" : "text-text-muted hover:text-text"
        }`}
      >
        {label}
      </button>
      <button
        type="button"
        onClick={onPlay}
        title={`${title} — play this side`}
        aria-label={`Play ${title}`}
        className={`px-1.5 py-1 border-l border-white/15 transition-colors ${
          tourPlaying ? "text-text" : "text-text-muted/60 hover:text-text"
        }`}
      >
        <Play size={9} className={tourPlaying ? "fill-text" : ""} />
      </button>
    </div>
  );
}
