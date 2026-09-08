"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "listening_boot_seen";
const BOOT_DURATION_MS = 2800;
const FADE_OUT_MS = 600;

export function ListeningBoot() {
  const [phase, setPhase] = useState<"cued" | "dropping" | "playing" | "out" | "done">("cued");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const force = new URLSearchParams(window.location.search).has("boot");

    if (reduced || (!force && sessionStorage.getItem(SESSION_KEY))) {
      setPhase("done");
      return;
    }

    document.documentElement.classList.add("boot-lock");

    // Phase 1: Arm swings over the lead-in groove
    const dropTimer = window.setTimeout(() => {
      setPhase("dropping");
    }, 450);

    // Phase 2: Stylus gently drops and settles on the vinyl microgroove
    const playTimer = window.setTimeout(() => {
      setPhase("playing");
    }, 1450);

    // Phase 3: Dissolve smoothly into the listening room
    const outTimer = window.setTimeout(() => {
      setPhase("out");
      sessionStorage.setItem(SESSION_KEY, "1");
    }, BOOT_DURATION_MS);

    // Phase 4: Unmount
    const doneTimer = window.setTimeout(() => {
      setPhase("done");
      document.documentElement.classList.remove("boot-lock");
    }, BOOT_DURATION_MS + FADE_OUT_MS);

    return () => {
      window.clearTimeout(dropTimer);
      window.clearTimeout(playTimer);
      window.clearTimeout(outTimer);
      window.clearTimeout(doneTimer);
      document.documentElement.classList.remove("boot-lock");
    };
  }, []);

  if (phase === "done") return null;

  const handleSkip = () => {
    setPhase("out");
    sessionStorage.setItem(SESSION_KEY, "1");
    window.setTimeout(() => {
      setPhase("done");
      document.documentElement.classList.remove("boot-lock");
    }, FADE_OUT_MS);
  };

  return (
    <div
      className={`listening-boot is-${phase}`}
      role="status"
      aria-live="polite"
      aria-label="Cueing the listening room"
    >
      {/* Ambient background lighting */}
      <div className="boot-ambient" aria-hidden />

      {/* Unified Turntable Stage */}
      <div className="turntable-deck" aria-hidden>
        {/* Platter & Vinyl Record */}
        <div className="turntable-platter">
          <div className="vinyl-record">
            {/* Spinning Grooves & Paper Center Label */}
            <div className="vinyl-spinning-disc">
              <div className="vinyl-grooves" />
              <div className="vinyl-label">
                <span className="label-side">SIDE A</span>
                <strong className="label-sc">sc<span className="label-sc-dot">.</span></strong>
                <span className="label-rpm">33⅓ RPM</span>
              </div>
            </div>

            {/* Stationary Specular Light Sheen (Simulates Fixed Overhead Room Light) */}
            <div className="vinyl-sheen" />

            {/* Brass Center Spindle */}
            <div className="vinyl-spindle" />
          </div>
        </div>

        {/* Precision Mechanical Tonearm */}
        <div className={`turntable-arm arm-${phase}`}>
          <div className="arm-pivot">
            <div className="arm-weight" />
          </div>
          <div className="arm-pole" />
          <div className="arm-head">
            <div className="arm-cartridge" />
            <div className="arm-needle" />
          </div>
        </div>
      </div>

      {/* Editorial Status & Badge */}
      <div className="boot-status-rack">
        <div className="boot-cue-badge">
          <span className="cue-pulse-dot" />
          <span className="cue-caption">
            {phase === "cued" && "Cueing tone arm…"}
            {phase === "dropping" && "Dropping the needle…"}
            {(phase === "playing" || phase === "out") && "Now Playing · Side A"}
          </span>
        </div>
        <p className="boot-headline">
          <em>Dropping the needle into the groove</em>
        </p>
        <button
          type="button"
          onClick={handleSkip}
          className="room-button boot-skip-btn"
          aria-label="Skip load animation and enter listening room"
        >
          <span>Enter room</span>
          <span className="btn-arrow-chip" aria-hidden>↗</span>
        </button>
      </div>
    </div>
  );
}
