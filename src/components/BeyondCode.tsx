"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionShell } from "@/components/ui/SectionShell";
import { TrackLabel } from "@/components/ui/TrackLabel";
import { WaveformDivider } from "@/components/ui/Waveform";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Equalizer } from "@/components/ui/Equalizer";
import { NowListening, NOW_PLAYING } from "@/components/ui/NowListening";

const SPOTIFY_PROFILE =
  "https://open.spotify.com/user/5mwiefw3jc4vxqft713g2y0jl?si=80e58328902349bb";

const MUSIC_TAGS = ["Hip-Hop", "R&B", "Electronic", "Lo-Fi", "Film Scores"];
const TRAVEL_TAGS = ["Travel", "Coffee", "Tea", "Matcha", "New Perspectives"];
const TRAVEL_MEDIA = [
  { src: "/photos/travel-01.jpg", alt: "Travel moment by the coast" },
  { src: "/photos/coffee-01.jpg", alt: "Coffee ritual" },
  { src: "/photos/travel-02.jpg", alt: "Flight above clouds at sunset" },
  { src: "/photos/coffee-02.jpg", alt: "Coffee and calm break" },
  { src: "/photos/travel-03.jpg", alt: "Stadium energy while exploring" },
] as const;

function PhotoStrip({
  src,
  alt,
  fallbackGradient,
  side,
}: {
  src: string;
  alt: string;
  fallbackGradient: string;
  side: "left" | "right";
}) {
  const [errored, setErrored] = useState(false);

  return (
    <div
      className={`relative overflow-hidden ${side === "left" ? "lg:order-first" : "lg:order-last"}`}
      style={{ flex: "0 0 55%" }}
    >
      {!errored ? (
        <img
          src={src}
          alt={alt}
          onError={() => setErrored(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0" style={{ background: fallbackGradient }} />
      )}
      {/* Gradient fade toward text side */}
      {side === "left" ? (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-bg" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-bg" />
      )}
    </div>
  );
}

type TravelMediaItem = (typeof TRAVEL_MEDIA)[number];

function TravelCarousel({ items }: { items: readonly TravelMediaItem[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [items.length, paused]);

  const goPrev = () => setIndex((prev) => (prev - 1 + items.length) % items.length);
  const goNext = () => setIndex((prev) => (prev + 1) % items.length);

  return (
    <div
      className="relative w-full min-h-[420px] lg:min-h-[70vh] overflow-hidden bg-[#060606]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {items.map((item, i) => (
        <img
          key={item.src}
          src={item.src}
          alt={item.alt}
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-l from-bg/90 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />

      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {items.map((item, i) => (
            <button
              key={`${item.src}-dot`}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-white/85" : "w-1.5 bg-white/35 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            aria-label="Previous media"
            onClick={goPrev}
            className="inline-flex items-center justify-center w-8 h-8 border border-white/25 bg-black/35 text-white/85 hover:bg-black/60 hover:border-white/40 transition-colors"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            aria-label="Next media"
            onClick={goNext}
            className="inline-flex items-center justify-center w-8 h-8 border border-white/25 bg-black/35 text-white/85 hover:bg-black/60 hover:border-white/40 transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Strip({
  photoSrc,
  photoAlt,
  fallbackGradient,
  photoSide,
  label,
  headline,
  quote,
  tags,
  showEq = false,
  link,
  leftSlot,
  accentColor,
}: {
  photoSrc?: string;
  photoAlt?: string;
  fallbackGradient?: string;
  photoSide: "left" | "right";
  label: string;
  headline: string;
  quote: string;
  tags: string[];
  showEq?: boolean;
  link?: { label: string; href: string };
  leftSlot?: React.ReactNode;
  accentColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <div
      ref={ref}
      className="relative flex flex-col lg:flex-row overflow-hidden"
      style={{ minHeight: "70vh" }}
    >
      {/* Photo zone */}
      <motion.div
        className={`relative w-full lg:w-[55%] ${
          photoSide === "left" ? "lg:order-first" : "lg:order-last"
        } ${leftSlot ? "min-h-[420px] lg:min-h-[70vh] flex" : "h-[45vw] min-h-[280px] lg:h-auto"}`}
        style={leftSlot ? undefined : { y: imgY }}
      >
        {leftSlot ?? (
          photoSrc &&
          photoAlt &&
          fallbackGradient && (
            <PhotoStrip
              src={photoSrc}
              alt={photoAlt}
              fallbackGradient={fallbackGradient}
              side={photoSide}
            />
          )
        )}
      </motion.div>

      {/* Text zone */}
      <div
        className={`relative z-10 flex flex-col justify-center px-6 md:px-12 lg:px-20 py-16 lg:py-24 lg:w-[45%] ${
          photoSide === "left" ? "lg:order-last" : "lg:order-first"
        } bg-bg/95 backdrop-blur-sm`}
      >
        <FadeIn>
          <span className="flex items-center gap-3 text-text-muted text-[11px] tracking-[0.22em] uppercase font-medium mb-5">
            {label}
            {showEq && (
              <Equalizer
                bars={5}
                className="h-3"
                barClassName={accentColor ? "!bg-current" : undefined}
                style={accentColor ? { color: accentColor } : undefined}
              />
            )}
          </span>

          <h3
            className="font-display font-bold text-text leading-[0.9] tracking-tight mb-6"
            style={{ fontSize: "clamp(44px, 5.5vw, 76px)", letterSpacing: "-0.03em" }}
          >
            {headline}
          </h3>

          <p className="text-text-muted leading-relaxed text-base md:text-lg mb-8 max-w-sm">
            {quote}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-text-muted border border-white/10 px-3 py-1.5 bg-surface"
              >
                {tag}
              </span>
            ))}
          </div>

          {link && (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={
                accentColor
                  ? "group inline-flex items-center gap-2 text-sm font-medium text-text px-5 py-3 border border-[#c80708]/35 hover:bg-[#c80708] hover:border-[#c80708] hover:text-bg transition-colors"
                  : "group inline-flex items-center gap-2 text-sm font-medium text-text border border-white/25 px-5 py-3 hover:border-white/50 transition-colors"
              }
            >
              {link.label}
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          )}
        </FadeIn>
      </div>
    </div>
  );
}

export default function BeyondCode() {
  return (
    <section id="beyond-code" className="relative z-10 overflow-hidden scroll-mt-20">
      <SectionShell as="div" id="beyond-code-header" className="!pb-12 !pt-12 md:!pt-16">
        <FadeIn>
          <TrackLabel num="06" name="B-Sides" />
          <p className="text-text-muted text-base md:text-lg leading-relaxed mt-6 max-w-2xl">
            Side B — the tracks that don&apos;t ship to npm: playlists, passports, and
            the stuff that keeps the work honest.
          </p>
        </FadeIn>
      </SectionShell>

      {/* Music strip — now playing left, copy right */}
      <Strip
        photoSide="left"
        leftSlot={<NowListening />}
        accentColor={NOW_PLAYING.theme.accent}
        label="Music"
        headline="Sound & Silence"
        quote="I build playlists like I build products — with intention and flow. Music is where I find the rhythm before I write the code."
        tags={MUSIC_TAGS}
        showEq
        link={{ label: "My playlists on Spotify", href: SPOTIFY_PROFILE }}
      />

      {/* Divider */}
      <WaveformDivider className="px-6 md:px-12 lg:px-20 xl:px-24 max-w-7xl mx-auto my-2" />

      {/* Travel strip — text left, photo right */}
      <Strip
        photoSide="right"
        leftSlot={<TravelCarousel items={TRAVEL_MEDIA} />}
        label="Travel"
        headline="New Latitudes"
        quote="I love to explore — I travel often, and it keeps reshaping how I see and perceive the world. Staying cooped up in one ecosystem won't stretch your outlook; you need new context to question what you've normalized. These photos are from trips I've genuinely loved — each one leaves me more motivated than the last, like nitro for perspective, and that reset has worked for me every time."
        tags={TRAVEL_TAGS}
      />

      {/* Bottom spacing */}
      <div className="pb-12" />
    </section>
  );
}
