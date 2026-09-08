"use client";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  type MotionStyle,
} from "framer-motion";
import { PhotoBooth } from "@/components/PhotoBooth";
import { ROOM_EASE, ROOM_SPRING } from "@/lib/room-motion";
import { Equalizer } from "@/components/ui/Equalizer";

const photos = [
  { src: "/photos/travel-01.jpg", caption: "A little further from the usual.", stamp: "FIELD RECORDING", paper: "#faf8f0" },
  { src: "/photos/coffee-01.jpg", caption: "Good coffee. No rush.", stamp: "SLOW TAKE", paper: "#f3efe4" },
  { src: "/photos/travel-02.jpg", caption: "Perspective, at cruising altitude.", stamp: "LIVE TAKE", paper: "#f7f1e6" },
  { src: "/photos/coffee-02.jpg", caption: "The quiet part of the day.", stamp: "DEMO CUT", paper: "#f1ebe0" },
  { src: "/photos/travel-03.jpg", caption: "Worth stepping away from the screen.", stamp: "B-SIDE", paper: "#f8f4ea" },
];

/** Clothesline hang poses keyed by offset from the active print (−2…2). */
const LINE = {
  [-2]: { left: "12%", y: 22, rotate: -9, scale: 0.78, opacity: 0.72, sway: 3.4, bob: 2.8, dur: 4.8 },
  [-1]: { left: "30%", y: 12, rotate: -4, scale: 0.88, opacity: 0.86, sway: 2.8, bob: 2.2, dur: 4.2 },
  [0]:  { left: "50%", y: 4,  rotate: 1.5, scale: 1, opacity: 1, sway: 2.4, bob: 2, dur: 3.8 },
  [1]:  { left: "70%", y: 14, rotate: 5.5, scale: 0.88, opacity: 0.86, sway: 2.9, bob: 2.4, dur: 4.4 },
  [2]:  { left: "88%", y: 24, rotate: 8.5, scale: 0.78, opacity: 0.72, sway: 3.6, bob: 3, dur: 5 },
} as const;

function lineOffset(i: number, active: number, len: number) {
  let d = i - active;
  if (d > len / 2) d -= len;
  if (d < -len / 2) d += len;
  return d;
}

const NOW_PLAYING = {
  title: "High Stakes",
  artist: "Jakes Bejoy, Brodha V, Muthu",
  subtitle: 'From "I\'M Game — Malayalam"',
  src: "/audio/high-stakes.mp3",
  spotifyTrack: "https://open.spotify.com/track/0GXgxx9bzxqoF74PkE3VAw",
  spotifyProfile: "https://open.spotify.com/user/5mwiefw3jc4vxqft713g2y0jl",
};

type TrailPoint = { x: number; y: number };

const TRAIL_MAX = 56;
const STAFF_OFFSETS = [-10, -5, 0, 5, 10];
const TRAIL = {
  glow: "137, 149, 124",
  line: "196, 203, 182",
  note: "211, 227, 164",
};

function PlayerHeadphonesSVG({ isPlaying, style }: { isPlaying: boolean; style?: MotionStyle }) {
  return (
    <motion.div
      className="player-headphones-container"
      style={style}
      animate={isPlaying ? { scale: [1, 1.05, 1] } : { scale: 1 }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 320 290" className="w-36 h-36 mx-auto drop-shadow-xl" aria-hidden>
        <defs>
          <linearGradient id="player-hp-metal">
            <stop stopColor="#414b42" />
            <stop offset=".35" stopColor="#d0d4c1" />
            <stop offset=".6" stopColor="#89957c" />
            <stop offset="1" stopColor="#384537" />
          </linearGradient>
          <linearGradient id="player-hp-pad" x2="1" y2="1">
            <stop stopColor="#4a5346" />
            <stop offset=".5" stopColor="#1a211a" />
            <stop offset="1" stopColor="#343d2f" />
          </linearGradient>
        </defs>
        <path d="M57 183V133C57 5 263 5 263 133V183" fill="none" stroke="#101710" strokeWidth="32" />
        <path d="M57 183V133C57 5 263 5 263 133V183" fill="none" stroke="url(#player-hp-metal)" strokeWidth="19" />
        <path d="M67 119C77 20 243 20 253 119" fill="none" stroke="#333e30" strokeWidth="26" strokeLinecap="round" />
        <path d="M71 103C97 36 227 35 250 103" fill="none" stroke="#849077" strokeWidth="2" opacity=".55" />
        <g transform="rotate(-12 64 191)">
          <rect x="33" y="141" width="51" height="100" rx="23" fill="url(#player-hp-metal)" />
          <rect x="62" y="135" width="38" height="112" rx="18" fill="url(#player-hp-pad)" stroke="#68735e" strokeWidth="2" />
          <path d="M76 147V235" stroke="#88957a" strokeWidth="2" opacity=".4" />
        </g>
        <g transform="rotate(12 258 191)">
          <rect x="235" y="141" width="51" height="100" rx="23" fill="url(#player-hp-metal)" />
          <rect x="220" y="135" width="38" height="112" rx="18" fill="url(#player-hp-pad)" stroke="#68735e" strokeWidth="2" />
          <path d="M244 147V235" stroke="#88957a" strokeWidth="2" opacity=".4" />
        </g>
        <path d="M266 240C292 293 158 256 126 282" fill="none" stroke="#839273" strokeWidth="4" />
        <text x="160" y="76" textAnchor="middle" fill="#c4cbb6" fontSize="9" letterSpacing="4">SIDE B</text>
      </svg>
    </motion.div>
  );
}

function chaikin(points: TrailPoint[], iterations = 2): TrailPoint[] {
  let pts = points;
  for (let n = 0; n < iterations; n++) {
    if (pts.length < 3) break;
    const next: TrailPoint[] = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const p = pts[i];
      const q = pts[i + 1];
      next.push(
        { x: p.x * 0.75 + q.x * 0.25, y: p.y * 0.75 + q.y * 0.25 },
        { x: p.x * 0.25 + q.x * 0.75, y: p.y * 0.25 + q.y * 0.75 },
      );
    }
    next.push(pts[pts.length - 1]);
    pts = next;
  }
  return pts;
}

function buildSmoothStroke(points: TrailPoint[]): Path2D {
  const path = new Path2D();
  const pts = chaikin(points, 2);
  if (!pts.length) return path;
  path.moveTo(pts[0].x, pts[0].y);
  if (pts.length === 1) return path;
  if (pts.length === 2) {
    path.lineTo(pts[1].x, pts[1].y);
    return path;
  }

  // Catmull-Rom → cubic Bezier for a continuous ribbon
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }
  return path;
}

function offsetRibbon(points: TrailPoint[], offset: number): TrailPoint[] {
  if (points.length < 2) return points;
  const out: TrailPoint[] = [];
  let px = 0;
  let py = -1;
  for (let i = 0; i < points.length; i++) {
    const a = points[Math.max(0, i - 1)];
    const b = points[Math.min(points.length - 1, i + 1)];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    if (len > 0.001) {
      const nx = -dy / len;
      const ny = dx / len;
      px = px * 0.82 + nx * 0.18;
      py = py * 0.82 + ny * 0.18;
      const nlen = Math.hypot(px, py) || 1;
      px /= nlen;
      py /= nlen;
    }
    out.push({ x: points[i].x + px * offset, y: points[i].y + py * offset });
  }
  return out;
}

function relaxTrail(points: TrailPoint[], amount = 0.22) {
  if (points.length < 3) return;
  // keep endpoints; average interiors toward neighbors
  const copy = points.map((p) => ({ ...p }));
  for (let i = 1; i < points.length - 1; i++) {
    const prev = copy[i - 1];
    const next = copy[i + 1];
    points[i].x += ((prev.x + next.x) * 0.5 - points[i].x) * amount;
    points[i].y += ((prev.y + next.y) * 0.5 - points[i].y) * amount;
  }
}

function drawNote(ctx: CanvasRenderingContext2D, x: number, y: number, ang: number, alpha: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = `rgb(${TRAIL.note})`;
  ctx.strokeStyle = `rgb(${TRAIL.note})`;
  ctx.lineWidth = 1.25;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.ellipse(0, 0, 3.2, 2.3, 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(2.1, -0.7);
  ctx.lineTo(2.1, -12);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(2.1, -12);
  ctx.quadraticCurveTo(8, -9.5, 7, -4.5);
  ctx.stroke();
  ctx.restore();
}

export function PersonalChapter() {
  const ref = useRef<HTMLElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const trailRef = useRef<TrailPoint[]>([]);
  const pointerRef = useRef<{ x: number; y: number; inside: boolean }>({ x: 0, y: 0, inside: false });
  const headRef = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);
  const lastSampleRef = useRef(0);
  const fadeRef = useRef(0);
  const rafRef = useRef(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "start 25%"] });
  const flip = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const paper = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [side, setSide] = useState<"a" | "b">("a");
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const current = photos[index];
  const [listening, setListening] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 420, damping: 28, mass: 0.35 });
  const springY = useSpring(mouseY, { stiffness: 420, damping: 28, mass: 0.35 });
  const headphonesRotate = useTransform(springX, [-36, 36], [-14, 14]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setSide(v > 0.55 ? "b" : "a");
  });

  const cue = (delta: number) => {
    setDir(delta > 0 ? 1 : -1);
    setIndex((i) => (i + delta + photos.length) % photos.length);
  };

  const hangPrint = (i: number) => {
    let d = i - index;
    if (d > photos.length / 2) d -= photos.length;
    if (d < -photos.length / 2) d += photos.length;
    if (d === 0) return;
    cue(d);
  };

  useEffect(() => {
    const band = bandRef.current;
    const canvas = canvasRef.current;
    if (!band || !canvas) return;

    const resize = () => {
      const rect = band.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(band);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) return;
    let alive = true;

    const loop = (now: number) => {
      if (!alive) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      const pointer = pointerRef.current;
      if (pointer.inside) {
        fadeRef.current += (1 - fadeRef.current) * 0.14;
        if (!headRef.current) {
          headRef.current = { x: pointer.x, y: pointer.y, vx: 0, vy: 0 };
        } else {
          const head = headRef.current;
          const stiffness = 0.16;
          const damping = 0.78;
          head.vx = (head.vx + (pointer.x - head.x) * stiffness) * damping;
          head.vy = (head.vy + (pointer.y - head.y) * stiffness) * damping;
          head.x += head.vx;
          head.y += head.vy;
        }

        const head = headRef.current!;
        const trail = trailRef.current;
        const last = trail[trail.length - 1];
        const moved = last ? Math.hypot(head.x - last.x, head.y - last.y) : 99;
        if (moved > 2.4 || now - lastSampleRef.current > 20) {
          trail.push({ x: head.x, y: head.y });
          if (trail.length > TRAIL_MAX) trail.shift();
          lastSampleRef.current = now;
        }
        relaxTrail(trail, 0.18);
      } else if (trailRef.current.length || fadeRef.current > 0.01) {
        // Smooth close-out: fade + collapse the ribbon toward its tip
        fadeRef.current += (0 - fadeRef.current) * 0.07;
        const trail = trailRef.current;
        relaxTrail(trail, 0.32);
        for (let i = 0; i < trail.length - 1; i++) {
          trail[i].x += (trail[i + 1].x - trail[i].x) * 0.14;
          trail[i].y += (trail[i + 1].y - trail[i].y) * 0.14;
        }
        // drop near-duplicates created by the collapse
        for (let i = trail.length - 2; i >= 0; i--) {
          if (Math.hypot(trail[i].x - trail[i + 1].x, trail[i].y - trail[i + 1].y) < 1.2) {
            trail.splice(i, 1);
          }
        }
        if (fadeRef.current < 0.03 || trail.length < 2) {
          trailRef.current = [];
          fadeRef.current = 0;
          headRef.current = null;
        }
      }

      const points = trailRef.current;
      const fade = fadeRef.current;
      if (points.length >= 2 && fade > 0.01) {
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        ctx.shadowColor = `rgba(${TRAIL.glow}, 0.22)`;
        ctx.shadowBlur = 16;
        ctx.strokeStyle = `rgba(${TRAIL.glow}, 0.16)`;
        ctx.lineWidth = 26;
        ctx.stroke(buildSmoothStroke(points));
        ctx.shadowBlur = 0;

        for (const offset of STAFF_OFFSETS) {
          ctx.strokeStyle = `rgba(${TRAIL.line}, 0.36)`;
          ctx.lineWidth = 1.05;
          ctx.stroke(buildSmoothStroke(offsetRibbon(points, offset)));
        }

        let travelled = 0;
        let nextAt = 40;
        for (let i = 1; i < points.length - 1; i++) {
          const a = points[i - 1];
          const b = points[i];
          const seg = Math.hypot(b.x - a.x, b.y - a.y) || 0.0001;
          const ang = Math.atan2(b.y - a.y, b.x - a.x);
          travelled += seg;
          while (travelled >= nextAt) {
            const over = travelled - nextAt;
            const u = 1 - over / seg;
            const x = a.x + (b.x - a.x) * u;
            const y = a.y + (b.y - a.y) * u;
            const line = ((nextAt / 40) | 0) % 5;
            const ribbon = offsetRibbon([a, { x, y }, b], STAFF_OFFSETS[line]);
            const age = i / (points.length - 1);
            drawNote(ctx, ribbon[1].x, ribbon[1].y, ang - Math.PI / 2, 0.18 + age * 0.5);
            nextAt += 34 + (((nextAt / 40) | 0) % 2) * 6;
          }
        }
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      alive = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  const handleBandPointerMove = (e: React.PointerEvent) => {
    const band = bandRef.current;
    if (!band || reduced) return;
    const rect = band.getBoundingClientRect();
    pointerRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      inside: true,
    };
  };

  const handleBandPointerLeave = () => {
    pointerRef.current = { ...pointerRef.current, inside: false };
  };

  const handleStageMouseMove = (e: React.MouseEvent) => {
    if (!stageRef.current || reduced) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x * 40);
    mouseY.set(y * 40);
  };

  const handleStageMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    const audio = new Audio(NOW_PLAYING.src);
    audio.preload = "auto";
    audio.loop = true;
    audioRef.current = audio;

    const onPlay = () => setListening(true);
    const onPause = () => setListening(false);
    const onEnded = () => setListening(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, []);

  const handlePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().catch(() => setListening(false));
    } else {
      audio.pause();
    }
  };

  return (
    <section id="side-b" ref={ref} className="personal-chapter">
      <div className="side-flip" data-side={reduced ? "b" : side}>
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

      <div
        id="music-corner"
        ref={bandRef}
        className="headphones-band"
        onPointerMove={handleBandPointerMove}
        onPointerLeave={handleBandPointerLeave}
      >
        <canvas ref={canvasRef} className="headphones-music-band" aria-hidden />

        <div className="headphones-band-container">
          <div className="headphones-band-intro">
            <p className="room-eyebrow">Side B / Soundtrack</p>
            <h2>Less screen time.<br /><em>More stories.</em></h2>
            <p>
              I travel to find new perspectives, pause for coffee, and build playlists for whatever comes next.
              Put on these headphones to hear what’s playing in mine.
            </p>
            <div className="headphones-band-links">
              <a className="room-link" href={NOW_PLAYING.spotifyProfile} target="_blank" rel="noreferrer">
                Open Spotify profile ↗
              </a>
            </div>
            <p className="personal-note">Best enjoyed with a window seat.</p>
          </div>

          <div className="headphones-band-player">
            <div className="hifi-player-deck">
              <div className="hifi-display">
                <div className="hifi-display-kicker">NOW PLAYING · SIDE B</div>
                <div className="hifi-display-title">{NOW_PLAYING.title}</div>
                <div className="hifi-display-artist">{NOW_PLAYING.artist}</div>
                <div className="hifi-display-status">
                  {listening ? "● PLAYING" : "■ READY"}
                </div>
              </div>

              <div
                ref={stageRef}
                className="hifi-visual-stage"
                onMouseMove={handleStageMouseMove}
                onMouseLeave={handleStageMouseLeave}
              >
                <PlayerHeadphonesSVG
                  isPlaying={listening}
                  style={{ x: springX, y: springY, rotate: headphonesRotate }}
                />
              </div>

              <div className="hifi-controls">
                <button
                  type="button"
                  className={`hifi-play-btn ${listening ? "is-listening" : ""}`}
                  onClick={handlePlay}
                  aria-label={listening ? "Pause High Stakes" : "Play High Stakes"}
                >
                  {listening ? (
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                      <rect x="6" y="5" width="4" height="14" fill="currentColor" />
                      <rect x="14" y="5" width="4" height="14" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
                      <polygon points="8,5 19,12 8,19" fill="currentColor" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="hifi-eq-container">
                <Equalizer
                  bars={16}
                  className="h-6"
                  barClassName="!bg-[#a45a38]"
                  style={listening ? { opacity: 1 } : { opacity: 0.35 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="beyond-code" className="personal-content">
        <div className="photo-collection" aria-label="Side B photo line">
          <div className="crate-header">
            <span>SIDE B · ON THE LINE</span>
            <span>{String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span>
          </div>

          <div
            className="photo-line"
            tabIndex={0}
            role="group"
            aria-label="Photo line. Click a print or use arrow keys."
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") { e.preventDefault(); cue(-1); }
              if (e.key === "ArrowRight") { e.preventDefault(); cue(1); }
            }}
          >
            <div className="line-posts" aria-hidden>
              <span className="line-post" />
              <span className="line-post" />
            </div>
            <svg className="clothes-thread" viewBox="0 0 400 56" preserveAspectRatio="none" aria-hidden>
              <path
                className="thread-shadow"
                d="M4 22 C 110 48, 290 48, 396 22"
                fill="none"
                stroke="#8a776055"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                className="thread-wire"
                d="M4 20 C 110 46, 290 46, 396 20"
                fill="none"
                stroke="#3a3127"
                strokeWidth="1.35"
                strokeLinecap="round"
              />
            </svg>

            <div className="line-prints">
              {photos.map((photo, i) => {
                const offset = lineOffset(i, index, photos.length);
                if (Math.abs(offset) > 2) return null;
                const pose = LINE[offset as keyof typeof LINE];
                const isActive = offset === 0;
                return (
                  <motion.button
                    key={photo.src}
                    type="button"
                    className={`line-hang${isActive ? " is-active" : ""}`}
                    aria-label={`${photo.stamp}: ${photo.caption}`}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => hangPrint(i)}
                    data-offset={offset}
                    style={{ left: pose.left, zIndex: isActive ? 8 : 5 - Math.abs(offset) }}
                    initial={false}
                    animate={
                      reduced
                        ? { x: "-50%", y: 8, rotate: 0, scale: isActive ? 1 : 0.9, opacity: isActive ? 1 : 0.8 }
                        : {
                            x: "-50%",
                            y: pose.y,
                            rotate: pose.rotate,
                            scale: pose.scale,
                            opacity: pose.opacity,
                          }
                    }
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 220, damping: 18, mass: 0.7, delay: Math.abs(offset) * 0.03 }
                    }
                    whileHover={
                      reduced
                        ? undefined
                        : { y: pose.y - 6, scale: pose.scale * 1.04, transition: { type: "spring", stiffness: 320, damping: 18 } }
                    }
                    whileTap={reduced ? undefined : { scale: pose.scale * 0.97 }}
                  >
                    <motion.div
                      className="line-sway"
                      key={`sway-${photo.src}-${isActive ? index : "side"}`}
                      initial={
                        reduced
                          ? false
                          : isActive
                            ? { rotate: dir * -3.5, y: -2 }
                            : false
                      }
                      animate={
                        reduced
                          ? { rotate: 0, y: 0 }
                          : {
                              rotate: [0, pose.sway, -pose.sway * 0.7, pose.sway * 0.3, 0],
                              y: [0, pose.bob, pose.bob * 0.35, pose.bob * 0.7, 0],
                            }
                      }
                      transition={
                        reduced
                          ? { duration: 0 }
                          : {
                              duration: pose.dur,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: i * 0.35,
                            }
                      }
                    >
                      <span className="line-clip" aria-hidden>
                        <svg viewBox="0 0 18 28" width="14" height="22">
                          <path d="M9 2 C5 2 3 5 3 8 C3 12 7 14 7 18 V22" fill="none" stroke="#5c5143" strokeWidth="1.6" strokeLinecap="round" />
                          <path d="M9 2 C13 2 15 5 15 8 C15 12 11 14 11 18 V22" fill="none" stroke="#5c5143" strokeWidth="1.6" strokeLinecap="round" />
                          <circle cx="9" cy="8" r="2.2" fill="#c4b49a" stroke="#5c5143" strokeWidth="1" />
                        </svg>
                      </span>
                      <span className="line-twine" aria-hidden />
                      <figure style={{ background: photo.paper }}>
                        <span className="photo-track">{String(i + 1).padStart(2, "0")}</span>
                        <span className="photo-stamp">{photo.stamp}</span>
                        <img src={photo.src} alt="" loading="lazy" draggable={false} />
                        {isActive && <figcaption>{photo.caption}</figcaption>}
                      </figure>
                    </motion.div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="photo-controls">
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
                <small>HUNG TO DRY · SIDE B</small>
                <strong>{String(index + 1).padStart(2, "0")} — {current.caption}</strong>
                <em>{current.stamp}</em>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="personal-intro">
          <p className="room-eyebrow">Side B / Photo Crate</p>
          <h2>Proof of a<br /><em>good day.</em></h2>
          <p>
            Photos are the proof—not that that day existed, but that good memories can change your day.
          </p>
          <p className="personal-note">Captured on film and digital leftovers.</p>
        </div>
      </div>

      <div className="booth-chapter" id="playground"><PhotoBooth /></div>
    </section>
  );
}
