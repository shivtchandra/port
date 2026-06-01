"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { Equalizer } from "@/components/ui/Equalizer";
import { WaveformDivider } from "@/components/ui/Waveform";
import { scrollToSide, startGuidedTour } from "@/components/SmoothScroll";
import type { AlbumSide } from "@/lib/tracks";

const SIDE_COPY = {
  a: {
    id: "side-a",
    eyebrow: "Side A",
    title: "Technical",
    subtitle: "What I build and where I've worked.",
  },
  b: {
    id: "side-b",
    eyebrow: "Side B",
    title: "Personal",
    subtitle: "Music, travel, and life outside the commit log.",
  },
} as const;

export function SideMarker({ side }: { side: "a" | "b" }) {
  const copy = SIDE_COPY[side];

  return (
    <section
      id={copy.id}
      className="relative z-10 scroll-mt-20 border-y border-white/10 bg-bg/50"
      aria-label={`${copy.eyebrow} — ${copy.title}`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 xl:px-24 py-14 md:py-20">
        <FadeIn>
          <div className="flex items-center gap-3 mb-5">
            <span className="track-num text-sm" style={{ opacity: 0.5 }}>
              {copy.eyebrow}
            </span>
            <span className="h-px flex-1 max-w-[120px] bg-white/20" />
            <Equalizer bars={5} className="h-3" />
          </div>
          <h2
            className="font-display font-bold text-text leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(36px, 5vw, 64px)", letterSpacing: "-0.03em" }}
          >
            {copy.title}
          </h2>
          <p className="text-text-muted text-base md:text-lg mt-4 max-w-xl">
            {copy.subtitle}
          </p>
          <SideActions side={side} />
          <div className="mt-10 text-white/10">
            <WaveformDivider />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function SideActions({ side }: { side: AlbumSide }) {
  return (
    <div className="flex flex-wrap gap-3 mt-8">
      <button
        type="button"
        onClick={() => scrollToSide(side)}
        className="px-5 py-2.5 bg-accent text-bg text-xs font-semibold tracking-wide hover:bg-accent/90 transition-colors"
      >
        Enter Side {side.toUpperCase()}
      </button>
      <button
        type="button"
        onClick={() => startGuidedTour(side)}
        className="px-5 py-2.5 border border-white/25 text-text text-xs tracking-wide hover:border-white/50 transition-colors"
      >
        Play Side {side.toUpperCase()}
      </button>
    </div>
  );
}

export function EndOfSideA() {
  return (
    <FadeIn className="mt-16 md:mt-24 pt-8 border-t border-white/10">
      <div className="text-white/10">
        <WaveformDivider />
      </div>
      <p className="mt-6 text-center text-[10px] tracking-[0.3em] uppercase text-text-muted/60">
        End of Side A · flip the record
      </p>
    </FadeIn>
  );
}
