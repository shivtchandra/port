"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export function AnalogVuMeter({
  isPlaying,
  className = "",
}: {
  isPlaying: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const leftNeedleRef = useRef<HTMLDivElement>(null);
  const rightNeedleRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // Ballistics state for Left & Right channels
  const leftAngleRef = useRef(-38);
  const leftVelRef = useRef(0);
  const rightAngleRef = useRef(-38);
  const rightVelRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    if (reduced) return;

    let alive = true;

    const loop = () => {
      if (!alive) return;
      timeRef.current += 0.045;
      const t = timeRef.current;

      if (isPlaying) {
        // Procedural music energy simulation matching "High Stakes" bpm & dynamics
        const kick = Math.pow(Math.max(0, Math.sin(t * 3.4)), 5) * 42;
        const snare = Math.pow(Math.max(0, Math.sin(t * 1.7 + 0.8)), 4) * 28;
        const bassline = (Math.sin(t * 6.8) * 0.5 + 0.5) * 14;
        const flutterL = (Math.random() - 0.5) * 3.5;
        const flutterR = (Math.random() - 0.5) * 3.5;

        // Target angle range: Rest = -38deg, 0dB = 0deg, +3dB Peak = +24deg
        const targetL = -28 + kick + snare * 0.7 + bassline * 0.4 + flutterL;
        const targetR = -28 + kick * 0.85 + snare + bassline * 0.6 + flutterR;

        // Left needle spring ballistics (galvanometer movement)
        const forceL = (targetL - leftAngleRef.current) * 0.32;
        leftVelRef.current = (leftVelRef.current + forceL) * 0.68;
        leftAngleRef.current += leftVelRef.current;

        // Right needle spring ballistics
        const forceR = (targetR - rightAngleRef.current) * 0.30;
        rightVelRef.current = (rightVelRef.current + forceR) * 0.70;
        rightAngleRef.current += rightVelRef.current;
      } else {
        // Smooth gravity return to mechanical rest stop peg (-38deg)
        const restTarget = -38;
        leftAngleRef.current += (restTarget - leftAngleRef.current) * 0.14;
        rightAngleRef.current += (restTarget - rightAngleRef.current) * 0.14;
      }

      // Clamp mechanical swing bounds
      leftAngleRef.current = Math.max(-40, Math.min(28, leftAngleRef.current));
      rightAngleRef.current = Math.max(-40, Math.min(28, rightAngleRef.current));

      if (leftNeedleRef.current) {
        leftNeedleRef.current.style.transform = `rotate(${leftAngleRef.current.toFixed(1)}deg)`;
      }
      if (rightNeedleRef.current) {
        rightNeedleRef.current.style.transform = `rotate(${rightAngleRef.current.toFixed(1)}deg)`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      alive = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, reduced]);

  return (
    <div
      className={`analog-vu-deck ${isPlaying ? "is-powered" : ""} ${className}`}
      aria-label="Analog stereo VU meter"
    >
      {/* Top Console Header Strip */}
      <div className="vu-deck-header" aria-hidden="true">
        <span className="vu-header-title">AUDIO TELEMETRY · 2-CHANNEL VU</span>
        <span className="vu-header-badge">
          <span className="vu-header-led" />
          {isPlaying ? "ACTIVE" : "STANDBY"}
        </span>
      </div>

      {/* Dual Meter Windows */}
      <div className="vu-stereo-stage">
        {/* Channel Left */}
        <div className="vu-meter-unit">
          <div className="vu-backlight" aria-hidden="true" />
          <div className="vu-glass-sheen" aria-hidden="true" />
          <svg className="vu-dial-svg" viewBox="0 0 170 96" aria-hidden="true">
            <defs>
              <linearGradient id="vu-green-arc" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6c7c64" />
                <stop offset="100%" stopColor="#b4cb9a" />
              </linearGradient>
            </defs>

            {/* Main Decibel Arc (-20 to 0 dB) */}
            <path
              d="M 24 82 A 70 70 0 0 1 118 28"
              fill="none"
              stroke="url(#vu-green-arc)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Redline Overload Arc (0 to +3 dB) */}
            <path
              d="M 118 28 A 70 70 0 0 1 150 78"
              fill="none"
              stroke="#e26258"
              strokeWidth="2.8"
              strokeLinecap="round"
            />

            {/* Scale Tick Marks */}
            <line x1="24" y1="82" x2="28" y2="76" stroke="#8a997d" strokeWidth="1.2" />
            <line x1="42" y1="62" x2="47" y2="58" stroke="#8a997d" strokeWidth="1.2" />
            <line x1="64" y1="47" x2="68" y2="42" stroke="#8a997d" strokeWidth="1.2" />
            <line x1="88" y1="36" x2="91" y2="30" stroke="#b4cb9a" strokeWidth="1.5" />
            <line x1="118" y1="28" x2="119" y2="22" stroke="#e26258" strokeWidth="1.8" />
            <line x1="136" y1="48" x2="140" y2="44" stroke="#e26258" strokeWidth="1.5" />
            <line x1="150" y1="78" x2="155" y2="76" stroke="#e26258" strokeWidth="1.5" />

            {/* Scale Numerals */}
            <text x="21" y="91" className="vu-scale-txt">-20</text>
            <text x="39" y="56" className="vu-scale-txt">-10</text>
            <text x="63" y="38" className="vu-scale-txt">-5</text>
            <text x="88" y="27" className="vu-scale-txt">-1</text>
            <text x="115" y="20" className="vu-scale-txt vu-bold-txt">0</text>
            <text x="138" y="42" className="vu-scale-txt vu-red-txt">+2</text>
            <text x="150" y="74" className="vu-scale-txt vu-red-txt">+3</text>

            {/* Channel Branding & Unit */}
            <text x="85" y="62" className="vu-brand-txt">VU · L</text>
            <text x="85" y="72" className="vu-sub-txt">CH 1</text>
          </svg>

          <div className="vu-needle-assembly" aria-hidden="true">
            <div ref={leftNeedleRef} className="vu-needle">
              <span className="vu-needle-tip" />
            </div>
            <div className="vu-needle-pivot" />
          </div>
        </div>

        {/* Channel Right */}
        <div className="vu-meter-unit">
          <div className="vu-backlight" aria-hidden="true" />
          <div className="vu-glass-sheen" aria-hidden="true" />
          <svg className="vu-dial-svg" viewBox="0 0 170 96" aria-hidden="true">
            <path
              d="M 24 82 A 70 70 0 0 1 118 28"
              fill="none"
              stroke="url(#vu-green-arc)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 118 28 A 70 70 0 0 1 150 78"
              fill="none"
              stroke="#e26258"
              strokeWidth="2.8"
              strokeLinecap="round"
            />

            <line x1="24" y1="82" x2="28" y2="76" stroke="#8a997d" strokeWidth="1.2" />
            <line x1="42" y1="62" x2="47" y2="58" stroke="#8a997d" strokeWidth="1.2" />
            <line x1="64" y1="47" x2="68" y2="42" stroke="#8a997d" strokeWidth="1.2" />
            <line x1="88" y1="36" x2="91" y2="30" stroke="#b4cb9a" strokeWidth="1.5" />
            <line x1="118" y1="28" x2="119" y2="22" stroke="#e26258" strokeWidth="1.8" />
            <line x1="136" y1="48" x2="140" y2="44" stroke="#e26258" strokeWidth="1.5" />
            <line x1="150" y1="78" x2="155" y2="76" stroke="#e26258" strokeWidth="1.5" />

            <text x="21" y="91" className="vu-scale-txt">-20</text>
            <text x="39" y="56" className="vu-scale-txt">-10</text>
            <text x="63" y="38" className="vu-scale-txt">-5</text>
            <text x="88" y="27" className="vu-scale-txt">-1</text>
            <text x="115" y="20" className="vu-scale-txt vu-bold-txt">0</text>
            <text x="138" y="42" className="vu-scale-txt vu-red-txt">+2</text>
            <text x="150" y="74" className="vu-scale-txt vu-red-txt">+3</text>

            <text x="85" y="62" className="vu-brand-txt">VU · R</text>
            <text x="85" y="72" className="vu-sub-txt">CH 2</text>
          </svg>

          <div className="vu-needle-assembly" aria-hidden="true">
            <div ref={rightNeedleRef} className="vu-needle">
              <span className="vu-needle-tip" />
            </div>
            <div className="vu-needle-pivot" />
          </div>
        </div>
      </div>
    </div>
  );
}
