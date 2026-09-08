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


const MUSIC_GLYPHS = ["♪", "♫", "♩", "♬", "𝄞", "𝄢", "✦", "★"];
const GLOW_PALETTE = [
  "212, 231, 157", // Album Lime
  "246, 232, 184", // Warm Champagne
  "234, 160, 120", // Terracotta Rose
  "165, 214, 167", // Emerald Mint
  "255, 255, 255", // Star Glint
];

interface NoteParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  color: string;
  size: number;
  rot: number;
  vRot: number;
  life: number;
  maxLife: number;
  phase: number;
  wobbleSpeed: number;
  wobbleAmp: number;
}

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  isStar: boolean;
}



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

export function PersonalChapter() {
  const ref = useRef<HTMLElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Magical particle & ribbon pools
  const notesRef = useRef<NoteParticle[]>([]);
  const sparklesRef = useRef<SparkleParticle[]>([]);
  const pointerRef = useRef<{ x: number; y: number; inside: boolean }>({ x: 0, y: 0, inside: false });
  const lastSpawnPosRef = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const idleTimerRef = useRef(0);
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

  // Canvas resize observer
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

  // Helper to spawn notes
  const spawnNote = (x: number, y: number, customVx?: number, customVy?: number) => {
    const char = MUSIC_GLYPHS[Math.floor(Math.random() * MUSIC_GLYPHS.length)];
    const color = GLOW_PALETTE[Math.floor(Math.random() * GLOW_PALETTE.length)];
    const size = 15 + Math.random() * 12;
    const maxLife = 55 + Math.random() * 30;

    notesRef.current.push({
      x: x + (Math.random() - 0.5) * 12,
      y: y + (Math.random() - 0.5) * 12,
      vx: customVx ?? (Math.random() - 0.5) * 1.4,
      vy: customVy ?? -0.8 - Math.random() * 1.4,
      char,
      color,
      size,
      rot: (Math.random() - 0.5) * 0.5,
      vRot: (Math.random() - 0.5) * 0.04,
      life: maxLife,
      maxLife,
      phase: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.04 + Math.random() * 0.05,
      wobbleAmp: 0.7 + Math.random() * 0.8,
    });
  };

  // Helper to spawn sparkles
  const spawnSparkles = (x: number, y: number, count = 2) => {
    for (let i = 0; i < count; i++) {
      const color = GLOW_PALETTE[Math.floor(Math.random() * GLOW_PALETTE.length)];
      const maxLife = 25 + Math.random() * 25;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 2.2;

      sparklesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.4,
        size: 2 + Math.random() * 3.5,
        color,
        life: maxLife,
        maxLife,
        isStar: Math.random() > 0.4,
      });
    }
  };

  // Main animation render loop
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

      // Handle hover note breathing
      if (pointer.inside) {
        idleTimerRef.current += 1;
        if (idleTimerRef.current % 18 === 0 && notesRef.current.length < 24) {
          spawnNote(pointer.x, pointer.y);
          spawnSparkles(pointer.x, pointer.y, 1);
        }
      }

      // Update & Draw Floating Notes
      const notes = notesRef.current;
      for (let i = notes.length - 1; i >= 0; i--) {
        const p = notes[i];
        p.life -= 1;
        if (p.life <= 0) {
          notes.splice(i, 1);
          continue;
        }

        const norm = p.life / p.maxLife; // 1 -> 0
        const alpha = Math.sin(norm * Math.PI) * 0.95;
        const scale = 0.45 + Math.sin(norm * Math.PI) * 0.65;

        p.phase += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.phase) * p.wobbleAmp;
        p.y += p.vy;
        p.rot += p.vRot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.font = `bold ${Math.round(p.size * scale)}px Georgia, serif, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = `rgba(${p.color}, 0.9)`;
        ctx.shadowBlur = 14;
        ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
        ctx.fillText(p.char, 0, 0);
        ctx.restore();
      }

      // Update & Draw Stardust Sparkles
      const sparkles = sparklesRef.current;
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.life -= 1;
        if (s.life <= 0) {
          sparkles.splice(i, 1);
          continue;
        }

        const norm = s.life / s.maxLife;
        const alpha = Math.sin(norm * Math.PI) * 0.9;
        s.x += s.vx;
        s.y += s.vy;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.shadowColor = `rgba(${s.color}, 0.85)`;
        ctx.shadowBlur = 8;
        ctx.fillStyle = `rgba(${s.color}, ${alpha})`;

        if (s.isStar) {
          const r = s.size * (0.5 + norm * 0.5);
          ctx.beginPath();
          ctx.moveTo(0, -r);
          ctx.quadraticCurveTo(0, 0, r, 0);
          ctx.quadraticCurveTo(0, 0, 0, r);
          ctx.quadraticCurveTo(0, 0, -r, 0);
          ctx.quadraticCurveTo(0, 0, 0, -r);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, s.size * 0.6 * (0.5 + norm * 0.5), 0, Math.PI * 2);
          ctx.fill();
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

  // Pointer move handler with smooth note emission
  const handleBandPointerMove = (e: React.PointerEvent) => {
    const band = bandRef.current;
    if (!band || reduced) return;
    const rect = band.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    pointerRef.current = { x, y, inside: true };
    idleTimerRef.current = 0;



    // Distance check for particle emission
    const last = lastSpawnPosRef.current;
    const dist = Math.hypot(x - last.x, y - last.y);
    if (dist > 16) {
      spawnNote(x, y);
      spawnSparkles(x, y, 2);
      lastSpawnPosRef.current = { x, y };
    }
  };

  // Pointer click handler for magical chord burst
  const handleBandPointerDown = (e: React.PointerEvent) => {
    const band = bandRef.current;
    if (!band || reduced) return;
    const rect = band.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Burst 8 musical notes and 16 sparkles in all directions
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const speed = 1.4 + Math.random() * 2.2;
      spawnNote(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed - 0.8);
    }
    spawnSparkles(x, y, 16);
  };

  const handleBandPointerLeave = () => {
    pointerRef.current = { ...pointerRef.current, inside: false };
    lastSpawnPosRef.current = { x: -999, y: -999 };
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
        onPointerDown={handleBandPointerDown}
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
