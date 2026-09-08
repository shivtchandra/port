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
  const leftAngleRef = useRef(-42);
  const leftVelRef = useRef(0);
  const rightAngleRef = useRef(-42);
  const rightVelRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    if (reduced) return;

    let alive = true;

    const loop = () => {
      if (!alive) return;
      timeRef.current += 0.05;
      const t = timeRef.current;

      if (isPlaying) {
        // Procedural music energy simulation matching "High Stakes" bpm & dynamics
        const beat1 = Math.pow(Math.max(0, Math.sin(t * 3.8)), 4);
        const beat2 = Math.pow(Math.max(0, Math.sin(t * 1.9 + 0.4)), 3) * 0.7;
        const flutterL = (Math.random() - 0.5) * 4;
        const flutterR = (Math.random() - 0.5) * 4;

        // Target angle range: Rest = -42deg, 0dB = 0deg, +3dB Redline = +26deg
        const targetL = -32 + (beat1 * 44) + (beat2 * 18) + flutterL;
        const targetR = -32 + (beat1 * 40) + (beat2 * 22) + flutterR;

        // Left needle spring physics
        const forceL = (targetL - leftAngleRef.current) * 0.28;
        leftVelRef.current = (leftVelRef.current + forceL) * 0.72;
        leftAngleRef.current += leftVelRef.current;

        // Right needle spring physics
        const forceR = (targetR - rightAngleRef.current) * 0.26;
        rightVelRef.current = (rightVelRef.current + forceR) * 0.74;
        rightAngleRef.current += rightVelRef.current;
      } else {
        // Smooth gravity return to mechanical rest peg (-42deg)
        const restTarget = -42;
        leftAngleRef.current += (restTarget - leftAngleRef.current) * 0.12;
        rightAngleRef.current += (restTarget - rightAngleRef.current) * 0.12;
      }

      // Clamp needle angles
      leftAngleRef.current = Math.max(-44, Math.min(32, leftAngleRef.current));
      rightAngleRef.current = Math.max(-44, Math.min(32, rightAngleRef.current));

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
      {/* Stereo Channel Meters */}
      <div className="vu-stereo-stage">
        {/* Channel Left */}
        <div className="vu-meter-unit">
          <div className="vu-backlight" aria-hidden="true" />
          <svg className="vu-dial-svg" viewBox="0 0 160 90" aria-hidden="true">
            {/* Decibel Arc Scale */}
            <path
              d="M 22 75 A 65 65 0 0 1 108 26"
              fill="none"
              stroke="#8a997d"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Redline Overload Arc (+0 to +3 dB) */}
            <path
              d="M 108 26 A 65 65 0 0 1 138 75"
              fill="none"
              stroke="#e57373"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Tick Marks & Text */}
            <text x="20" y="86" className="vu-scale-txt">-20</text>
            <text x="50" y="52" className="vu-scale-txt">-10</text>
            <text x="75" y="36" className="vu-scale-txt">-5</text>
            <text x="104" y="32" className="vu-scale-txt">0</text>
            <text x="134" y="52" className="vu-scale-txt vu-red-txt">+3</text>
            <text x="80" y="70" className="vu-brand-txt">VU · L</text>
          </svg>
          <div className="vu-needle-assembly" aria-hidden="true">
            <div ref={leftNeedleRef} className="vu-needle" />
            <div className="vu-needle-pivot" />
          </div>
        </div>

        {/* Channel Right */}
        <div className="vu-meter-unit">
          <div className="vu-backlight" aria-hidden="true" />
          <svg className="vu-dial-svg" viewBox="0 0 160 90" aria-hidden="true">
            <path
              d="M 22 75 A 65 65 0 0 1 108 26"
              fill="none"
              stroke="#8a997d"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M 108 26 A 65 65 0 0 1 138 75"
              fill="none"
              stroke="#e57373"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <text x="20" y="86" className="vu-scale-txt">-20</text>
            <text x="50" y="52" className="vu-scale-txt">-10</text>
            <text x="75" y="36" className="vu-scale-txt">-5</text>
            <text x="104" y="32" className="vu-scale-txt">0</text>
            <text x="134" y="52" className="vu-scale-txt vu-red-txt">+3</text>
            <text x="80" y="70" className="vu-brand-txt">VU · R</text>
          </svg>
          <div className="vu-needle-assembly" aria-hidden="true">
            <div ref={rightNeedleRef} className="vu-needle" />
            <div className="vu-needle-pivot" />
          </div>
        </div>
      </div>
    </div>
  );
}
