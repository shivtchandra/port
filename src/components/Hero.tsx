"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { TrackLabel } from "@/components/ui/TrackLabel";
import { Typewriter } from "@/components/ui/Typewriter";
import { WaveformDivider } from "@/components/ui/Waveform";
import { AvailabilityDot } from "@/components/ui/AvailabilityDot";
import { useMagnet } from "@/hooks/useMagnet";
import { scrollToSection } from "@/components/SmoothScroll";

const META = ["AI & Full-Stack Engineer", "Hyderabad, IN"];

const NAME_STYLE: React.CSSProperties = {
  fontSize: "clamp(52px, 11vw, 150px)",
  lineHeight: 0.88,
  letterSpacing: "-0.04em",
};

function reveal(done: boolean, delay?: string) {
  return {
    className: done ? "rise-in" : "opacity-0",
    style: done && delay ? { animationDelay: delay } : undefined,
  };
}

export default function Hero() {
  const [line1Done, setLine1Done] = useState(false);
  const [nameDone, setNameDone] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const playMagnet = useMagnet();
  const contactMagnet = useMagnet();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Name block drifts up and fades on scroll exit
  const nameY = useTransform(scrollYProgress, [0, 0.55], ["0%", "-22%"]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.42], [1, 0]);

  // Description + buttons exit slightly later
  const descY = useTransform(scrollYProgress, [0.04, 0.58], ["0%", "-16%"]);
  const descOpacity = useTransform(scrollYProgress, [0.06, 0.46], [1, 0]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden scroll-mt-20"
    >
      <div className="relative z-10 flex-1 flex flex-col justify-between px-6 md:px-12 lg:px-20 xl:px-24 max-w-7xl mx-auto w-full pt-16 md:pt-24 lg:pt-28 pb-20">
        <div
          className="rise-in flex items-center justify-between"
          style={{ animationDelay: "0.1s" }}
        >
          <TrackLabel num="01" name="Opening" className="!mb-0" />
          <span className="text-[11px] tracking-[0.28em] uppercase text-text-muted">
            Vol. 2026
          </span>
        </div>

        {/* Name — kinetic exit on scroll */}
        <motion.div
          className="flex-1 flex flex-col justify-center py-8"
          style={{ y: nameY, opacity: nameOpacity }}
        >
          <span
            {...reveal(nameDone, "0s")}
            className={`${reveal(nameDone).className} block text-[11px] md:text-xs tracking-[0.3em] uppercase text-text-muted mb-6`}
            style={reveal(nameDone, "0s").style}
          >
            LP · Systems That Think
          </span>
          <h1 className="font-display font-extrabold text-text min-h-[2.2em]" style={NAME_STYLE}>
            {line1Done ? (
              <span>Shiva</span>
            ) : (
              <Typewriter text="Shiva" speed={58} onComplete={() => setLine1Done(true)} />
            )}
            <br />
            {line1Done &&
              (nameDone ? (
                <span>Chandra</span>
              ) : (
                <Typewriter text="Chandra" speed={58} onComplete={() => setNameDone(true)} />
              ))}
          </h1>
        </motion.div>

        {/* Description + CTAs — kinetic exit slightly delayed */}
        <motion.div
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8"
          style={{ y: descY, opacity: descOpacity }}
        >
          <div {...reveal(nameDone, "0.1s")} className={reveal(nameDone).className}>
            <div className="max-w-md">
              <p className="text-text-muted text-base md:text-lg leading-relaxed mb-6">
                Building systems that think — from production APIs to shipped AI products.
              </p>
              <div className="flex flex-wrap items-center gap-x-7 gap-y-2 text-[11px] tracking-[0.2em] uppercase text-text-muted">
                {META.map((m) => (
                  <span key={m}>{m}</span>
                ))}
                <span className="flex items-center gap-2">
                  <AvailabilityDot />
                  Available 2026
                </span>
              </div>
            </div>
          </div>

          <div {...reveal(nameDone, "0.22s")} className={reveal(nameDone).className}>
            <div className="flex items-center gap-6 shrink-0">
              <motion.div
                ref={playMagnet.ref}
                style={{ x: playMagnet.x, y: playMagnet.y }}
                onMouseMove={playMagnet.onMouseMove}
                onMouseLeave={playMagnet.onMouseLeave}
              >
                <button
                  onClick={() => scrollToSection("selected-work")}
                  className="px-7 py-3.5 bg-accent text-bg font-semibold text-sm tracking-wide hover:bg-accent/90 transition-colors duration-200"
                >
                  Play the Hits
                </button>
              </motion.div>

              <motion.div
                ref={contactMagnet.ref}
                style={{ x: contactMagnet.x, y: contactMagnet.y }}
                onMouseMove={contactMagnet.onMouseMove}
                onMouseLeave={contactMagnet.onMouseLeave}
              >
                <button
                  onClick={() => scrollToSection("contact")}
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-text tracking-wide"
                >
                  Get in touch
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div {...reveal(nameDone, "0.34s")} className={`${reveal(nameDone).className} mt-10 text-white/10`}>
          <WaveformDivider />
        </div>
      </div>

      <button
        onClick={() => scrollToSection("selected-work")}
        {...reveal(nameDone, "0.5s")}
        className={`${reveal(nameDone).className} absolute bottom-24 left-0 right-0 mx-auto w-fit z-10 flex flex-col items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-text-muted/70`}
        style={reveal(nameDone, "0.5s").style}
      >
        Side A below
        <span className="cue-bounce">
          <ArrowDown size={16} />
        </span>
      </button>
    </section>
  );
}
