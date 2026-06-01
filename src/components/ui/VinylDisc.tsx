"use client";

import { useEffect, useState } from "react";
import { lenisRef } from "@/components/SmoothScroll";

const OPACITY_FULL = 1;
const OPACITY_FLOOR = 0.32;
const OPACITY_MOBILE_FLOOR = 0.28;

function opacityForScroll(scrollY: number, heroHeight: number, isMobile: boolean): number {
  if (heroHeight <= 0) return OPACITY_FLOOR;
  const fadeEnd = heroHeight * 1.4;
  const t = Math.min(1, Math.max(0, scrollY / fadeEnd));
  const eased = t * t * (3 - 2 * t);
  const opacity = OPACITY_FULL - eased * (OPACITY_FULL - OPACITY_FLOOR);
  const floor = isMobile ? OPACITY_MOBILE_FLOOR : OPACITY_FLOOR;
  return Math.max(floor, opacity);
}

/**
 * Site-wide spinning vinyl — fixed behind content. Full presence on Hero,
 * scroll-dimmed on downstream tracks. Pure CSS spin; no audio.
 */
export function VinylDisc() {
  const [opacity, setOpacity] = useState(OPACITY_FULL);
  const [parallaxY, setParallaxY] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMq = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onMq);

    let raf = 0;
    const update = () => {
      raf = 0;
      const hero = document.getElementById("hero");
      const heroHeight = hero?.offsetHeight ?? window.innerHeight;
      const scrollY = lenisRef.current?.scroll ?? window.scrollY;
      const isMobile = window.innerWidth < 768;

      if (mq.matches) {
        setOpacity(isMobile ? OPACITY_MOBILE_FLOOR : OPACITY_FLOOR);
        setParallaxY(0);
        return;
      }

      setOpacity(opacityForScroll(scrollY, heroHeight, isMobile));
      setParallaxY(scrollY * 0.06);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    let lenisCleanup: (() => void) | undefined;
    const bindLenis = () => {
      const lenis = lenisRef.current;
      if (!lenis) return;
      lenis.on("scroll", update);
      lenisCleanup = () => lenis.off("scroll", update);
    };
    bindLenis();
    const lenisPoll = window.setInterval(() => {
      if (lenisRef.current) {
        clearInterval(lenisPoll);
        lenisCleanup?.();
        bindLenis();
        update();
      }
    }, 50);

    return () => {
      clearInterval(lenisPoll);
      lenisCleanup?.();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  return (
    <div
      className="vinyl-layer fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden
      style={{
        opacity,
        transform: reducedMotion ? undefined : `translate3d(0, ${parallaxY}px, 0)`,
        transition: "opacity 0.35s ease-out",
      }}
    >
      <div className="vinyl-wrap">
        <div className="vinyl-disc">
          <div className="vinyl-sheen" />
          <div className="vinyl-label">
            <div className="vinyl-hole" />
          </div>
        </div>
      </div>
    </div>
  );
}
