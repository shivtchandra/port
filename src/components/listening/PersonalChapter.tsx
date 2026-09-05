"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { PhotoBooth } from "@/components/PhotoBooth";
import { ROOM_EASE, ROOM_SPRING } from "@/lib/room-motion";

const photos = [
  { src: "/photos/travel-01.jpg", caption: "A little further from the usual.", stamp: "FIELD RECORDING", paper: "#faf8f0" },
  { src: "/photos/coffee-01.jpg", caption: "Good coffee. No rush.", stamp: "SLOW TAKE", paper: "#f3efe4" },
  { src: "/photos/travel-02.jpg", caption: "Perspective, at cruising altitude.", stamp: "LIVE TAKE", paper: "#f7f1e6" },
  { src: "/photos/coffee-02.jpg", caption: "The quiet part of the day.", stamp: "DEMO CUT", paper: "#f1ebe0" },
  { src: "/photos/travel-03.jpg", caption: "Worth stepping away from the screen.", stamp: "B-SIDE", paper: "#f8f4ea" },
];

const CRATE = [
  { x: 0, y: 0, rotate: -2.5, scale: 1 },
  { x: 18, y: 11, rotate: 5.5, scale: 0.975 },
  { x: -16, y: 18, rotate: -7, scale: 0.95 },
];

export function PersonalChapter() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "start 20%"] });
  const flip = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const paper = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [cueId, setCueId] = useState(0);
  const current = photos[index];

  const cue = (delta: number) => {
    setDir(delta);
    setCueId((n) => n + 1);
    setIndex((i) => (i + delta + photos.length) % photos.length);
  };

  return (
    <section id="side-b" ref={ref} className="personal-chapter">
      <div className="side-flip">
        <motion.div className="flip-surface" style={{ opacity: reduced ? 1 : paper }} aria-hidden />
        <div className="side-flip-copy">
          <p className="room-eyebrow">Side B / The person behind the products</p>
          <h2>Same person.<br /><em>Different frequency.</em></h2>
          <p>Good music, new places, and the small things<br />that make coming back to work feel good.</p>
        </div>
        <div className="flip-perspective" aria-hidden>
          <motion.div className="flip-record" style={{ rotateY: reduced ? 180 : flip }}>
            <div className="flip-face"><span>SIDE<br /><b>A</b></span></div>
            <div className="flip-face flip-back"><span>SIDE<br /><b>B</b></span></div>
          </motion.div>
        </div>
      </div>

      <div id="beyond-code" className="personal-content">
        <div className="personal-intro" id="music-corner">
          <p className="room-eyebrow">Off the clock</p>
          <h2>Less screen time.<br /><em>More stories.</em></h2>
          <p>I travel to find new perspectives, pause for coffee, and build playlists for whatever comes next.</p>
          <a className="room-link" href="https://open.spotify.com/user/5mwiefw3jc4vxqft713g2y0jl" target="_blank" rel="noreferrer">What’s in my headphones ↗</a>
          <p className="personal-note">Best enjoyed with a window seat.</p>
        </div>

        <div className="photo-collection" aria-label="Side B photo crate">
          <div className="crate-header">
            <span>SIDE B · PHOTO CRATE</span>
            <span>{String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span>
          </div>

          <div className="photo-stack">
            {photos.map((photo, i) => {
              const position = (i - index + photos.length) % photos.length;
              if (position > 2) return null;
              const pose = CRATE[position];
              const isFront = position === 0;
              return (
                <motion.figure
                  key={isFront ? `${photo.src}-front-${cueId}` : photo.src}
                  className={isFront ? "is-front" : "is-back"}
                  aria-hidden={!isFront}
                  style={{ zIndex: photos.length - position, background: photo.paper }}
                  initial={
                    reduced || !isFront
                      ? false
                      : { x: dir * 18, y: dir > 0 ? -30 : 22, rotate: dir * 10, scale: 0.96, opacity: 0.75 }
                  }
                  animate={
                    reduced
                      ? { x: 0, y: position * 8, rotate: 0, scale: 1, opacity: 1 }
                      : { x: pose.x, y: pose.y, rotate: pose.rotate, scale: pose.scale, opacity: 1 }
                  }
                  transition={reduced ? { duration: 0 } : isFront ? { duration: 0.5, ease: ROOM_EASE } : ROOM_SPRING}
                >
                  <span className="photo-track">{String(i + 1).padStart(2, "0")}</span>
                  <span className="photo-stamp">{photo.stamp}</span>
                  <img src={photo.src} alt={photo.caption} loading="lazy" />
                  <figcaption>{photo.caption}</figcaption>
                </motion.figure>
              );
            })}
          </div>

          <div className="photo-controls">
            <button type="button" aria-label="Previous track" onClick={() => cue(-1)}>←</button>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.src}
                className="track-readout"
                initial={reduced ? false : { opacity: 0, y: dir * 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: dir * -6 }}
                transition={{ duration: reduced ? 0 : 0.22, ease: ROOM_EASE }}
                aria-live="polite"
              >
                <small>NOW SHOWING · SIDE B</small>
                <strong>{String(index + 1).padStart(2, "0")} — {current.caption}</strong>
                <em>{current.stamp}</em>
              </motion.div>
            </AnimatePresence>
            <button type="button" aria-label="Cue next track" onClick={() => cue(1)}>→</button>
          </div>
        </div>
      </div>

      <div className="booth-chapter" id="playground"><PhotoBooth /></div>
    </section>
  );
}
