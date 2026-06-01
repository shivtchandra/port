"use client";

import { useEffect, useState } from "react";
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
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [tourPlaying, setTourPlaying] = useState(false);
  const [activeSide, setActiveSide] = useState<AlbumSide | null>(null);

  useEffect(() => subscribeTour(setTourPlaying), []);

  useEffect(() => {
    const update = () => {
      const scrollY = getScrollY();
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, scrollY / max) : 0);

      const mid = window.innerHeight / 2;
      let current = 0;
      TRACKS.forEach((t, i) => {
        const el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top <= mid) current = i;
      });
      setActive(current);

      const sideBEl = document.getElementById("side-b");
      if (sideBEl && sideBEl.getBoundingClientRect().top <= mid) {
        setActiveSide("b");
      } else {
        setActiveSide("a");
      }
    };

    const onScroll = () => requestAnimationFrame(update);
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    let lenisCleanup: (() => void) | undefined;
    const bindLenis = () => {
      const lenis = lenisRef.current;
      if (!lenis) return;
      lenis.on("scroll", onScroll);
      lenisCleanup = () => lenis.off("scroll", onScroll);
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
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

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
    if (tourPlaying) {
      stopGuidedTour();
      return;
    }
    startGuidedTour("full");
  };

  const handlePlaySide = (side: AlbumSide) => {
    if (tourPlaying && activeSide === side) {
      stopGuidedTour();
      return;
    }
    stopGuidedTour();
    startGuidedTour(side);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] pointer-events-none">
      <div className="h-px w-full bg-white/10">
        <div
          className="h-full bg-text origin-left transition-[width] duration-150"
          style={{ width: `${progress * 100}%` }}
        />
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

          <div className="relative flex-1 h-9 flex items-center min-w-0">
            <div className="absolute inset-x-0 h-px bg-white/12" />
            <div
              className="absolute left-0 h-px bg-text transition-[width] duration-150"
              style={{ width: `${progress * 100}%` }}
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
                  className={`block w-2 h-2 rounded-full border transition-all duration-300 ${
                    i <= active
                      ? "bg-text border-text"
                      : "bg-transparent border-white/30 group-hover:border-white/60"
                  } ${i === active ? "scale-150" : ""}`}
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
