"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Equalizer } from "@/components/ui/Equalizer";

/** Palette sampled from Spotify cover art (Bloody Valentine — DC) */
const COVER_THEME = {
  accent: "#c80708",
  accentBright: "#de0000",
  accentMuted: "rgba(200, 7, 8, 0.55)",
  glow: "rgba(200, 7, 8, 0.22)",
  glowStrong: "rgba(200, 7, 8, 0.45)",
} as const;

const SPOTIFY_COVER =
  "https://image-cdn-ak.spotifycdn.com/image/ab67616d0000b2738b79e8ad37de795b27759799";

export const NOW_PLAYING = {
  title: "Bloody Valentine",
  subtitle: 'From "DC"',
  artist: "Anirudh Ravichander",
  href: "https://open.spotify.com/track/2UtxQtTo90v8HpEQwyS6Ss?si=7315e89300c446cb",
  cover: "/spotify/bloody-valentine-dc.jpg",
  coverFallback: SPOTIFY_COVER,
  theme: COVER_THEME,
};

export function NowListening() {
  const { title, subtitle, artist, href, cover, coverFallback, theme } = NOW_PLAYING;
  const [coverSrc, setCoverSrc] = useState(cover);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col items-center justify-center h-full w-full min-h-[420px] lg:min-h-[70vh] px-6 py-12 md:px-10 md:py-14 border-r border-white/10 overflow-hidden"
      style={{
        background: `radial-gradient(ellipse 90% 70% at 50% 45%, ${theme.glow} 0%, transparent 55%), linear-gradient(180deg, #0a0a0a 0%, #050505 100%)`,
      }}
    >
      {/* Ambient bleed from cover */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: `radial-gradient(circle at 50% 38%, ${theme.glowStrong} 0%, transparent 42%)`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${theme.accentMuted}, transparent)`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-[min(300px,78vw)]">
        <div className="flex items-center justify-center gap-3 mb-7 md:mb-8">
          <Equalizer bars={4} className="h-3.5" barClassName="!bg-[#c80708]" />
          <span
            className="text-[10px] tracking-[0.28em] uppercase font-medium"
            style={{ color: theme.accentMuted }}
          >
            Now listening
          </span>
        </div>

        <div
          className="relative w-full aspect-square overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.9)] transition-transform duration-500 group-hover:scale-[1.02]"
          style={{
            boxShadow: `0 0 0 1px ${theme.accentMuted}, 0 24px 80px -12px ${theme.glowStrong}`,
          }}
        >
          <img
            src={coverSrc}
            alt={`${title} — ${artist}`}
            className="absolute inset-0 w-full h-full object-cover object-center"
            onError={() => {
              if (coverSrc !== coverFallback) setCoverSrc(coverFallback);
            }}
          />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-5"
            style={{
              background: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)`,
            }}
          >
            <span
              className="text-[10px] tracking-[0.2em] uppercase font-medium"
              style={{ color: theme.accentBright }}
            >
              Open in Spotify
            </span>
          </div>
        </div>

        <div className="mt-7 md:mt-8 w-full">
          <p className="font-display font-bold text-text text-xl md:text-2xl leading-tight">
            {title}
          </p>
          <p className="text-sm mt-1.5" style={{ color: theme.accentMuted }}>
            {subtitle}
          </p>
          <p className="text-text-muted/75 text-sm mt-0.5">{artist}</p>
        </div>

        <span
          className="inline-flex items-center justify-center gap-1.5 mt-6 text-[11px] tracking-[0.18em] uppercase transition-colors group-hover:text-[#de0000]"
          style={{ color: theme.accentMuted }}
        >
          Listen on Spotify
          <ArrowUpRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </a>
  );
}
