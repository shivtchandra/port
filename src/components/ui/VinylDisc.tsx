"use client";

import { useEffect, useRef, useState } from "react";
import { lenisRef } from "@/components/SmoothScroll";

const OPACITY_FULL = 1;
const OPACITY_FLOOR = 0.32;
const OPACITY_MOBILE_FLOOR = 0.28;
const SPIN_SPEED = 360 / 16000; // degrees per ms

function opacityForScroll(scrollY: number, heroHeight: number, isMobile: boolean): number {
  // On mobile the vinyl is a background texture — cap it lower so it doesn't compete with text
  const opacityFull = isMobile ? 0.48 : OPACITY_FULL;
  if (heroHeight <= 0) return OPACITY_FLOOR;
  const fadeEnd = heroHeight * 1.4;
  const t = Math.min(1, Math.max(0, scrollY / fadeEnd));
  const eased = t * t * (3 - 2 * t);
  const opacity = opacityFull - eased * (opacityFull - OPACITY_FLOOR);
  const floor = isMobile ? OPACITY_MOBILE_FLOOR : OPACITY_FLOOR;
  return Math.max(floor, opacity);
}

function playVinylScratch() {
  try {
    const ctx = new AudioContext();
    const rate = ctx.sampleRate;
    const buf = ctx.createBuffer(1, rate * 0.25, rate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.35));
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    src.onended = () => ctx.close();
  } catch {
    // AudioContext unavailable — silent
  }
}

export function VinylDisc() {
  const [opacity, setOpacity] = useState(OPACITY_FULL);
  const [parallaxY, setParallaxY] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isScratching, setIsScratching] = useState(false);

  const discRef = useRef<HTMLDivElement>(null);
  const rotDeg = useRef(0);
  const scratchRef = useRef(false);
  const pointerStart = useRef({ angle: 0, rotation: 0 });
  const lastTimestamp = useRef<number | null>(null);
  const spinRaf = useRef(0);

  // Opacity / parallax on scroll
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

  // JS-driven spin (replaces CSS animation for scratchability)
  useEffect(() => {
    if (reducedMotion) return;

    const spin = (timestamp: number) => {
      if (!scratchRef.current) {
        const dt = lastTimestamp.current !== null ? timestamp - lastTimestamp.current : 0;
        rotDeg.current += SPIN_SPEED * dt;
        if (discRef.current) {
          discRef.current.style.transform = `translateY(-50%) rotate(${rotDeg.current}deg)`;
        }
      }
      lastTimestamp.current = timestamp;
      spinRaf.current = requestAnimationFrame(spin);
    };

    spinRaf.current = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(spinRaf.current);
  }, [reducedMotion]);

  // Pointer scratch interaction
  useEffect(() => {
    if (reducedMotion) return;

    const getAngle = (clientX: number, clientY: number) => {
      const disc = discRef.current;
      if (!disc) return 0;
      const rect = disc.getBoundingClientRect();
      return (
        Math.atan2(clientY - (rect.top + rect.height / 2), clientX - (rect.left + rect.width / 2)) *
        (180 / Math.PI)
      );
    };

    const onMove = (e: PointerEvent) => {
      if (!scratchRef.current) return;
      const newAngle = getAngle(e.clientX, e.clientY);
      const delta = newAngle - pointerStart.current.angle;
      rotDeg.current = pointerStart.current.rotation + delta;
      if (discRef.current) {
        discRef.current.style.transform = `translateY(-50%) rotate(${rotDeg.current}deg)`;
      }
    };

    const onUp = () => {
      if (!scratchRef.current) return;
      scratchRef.current = false;
      lastTimestamp.current = null; // reset dt so no jump on resume
      setIsScratching(false);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [reducedMotion]);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    e.preventDefault();
    const disc = discRef.current;
    if (!disc) return;
    const rect = disc.getBoundingClientRect();
    const startAngle =
      Math.atan2(
        e.clientY - (rect.top + rect.height / 2),
        e.clientX - (rect.left + rect.width / 2)
      ) *
      (180 / Math.PI);
    pointerStart.current = { angle: startAngle, rotation: rotDeg.current };
    scratchRef.current = true;
    setIsScratching(true);
    playVinylScratch();
  }

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
        <div
          ref={discRef}
          className="vinyl-disc"
          style={{
            // JS controls rotation — disable CSS animation
            animation: reducedMotion ? undefined : "none",
            pointerEvents: reducedMotion ? "none" : "auto",
            cursor: reducedMotion ? undefined : isScratching ? "grabbing" : "grab",
          }}
          onPointerDown={reducedMotion ? undefined : handlePointerDown}
        >
          <div className="vinyl-sheen" />
          <div className="vinyl-label">
            <div className="vinyl-hole" />
          </div>
        </div>
      </div>
    </div>
  );
}
