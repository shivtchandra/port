"use client";
import { useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ROOM_SPRING } from "@/lib/room-motion";
import "./personal-opening.css";

export function PersonalOpening() {
  const [flipped, setFlipped] = useState(false);
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const canDrag = !reduced;

  const markPointerDown = () => { moved.current = false; };
  const markMoved = (_: unknown, info: { offset: { x: number; y: number } }) => {
    if (Math.hypot(info.offset.x, info.offset.y) > 6) moved.current = true;
  };
  const suppressIfDragged = (event: MouseEvent | PointerEvent) => {
    if (!moved.current) return false;
    event.preventDefault();
    event.stopPropagation();
    moved.current = false;
    return true;
  };

  const sharedDrag = {
    drag: canDrag as boolean,
    dragConstraints: stage,
    dragElastic: 0.18,
    dragMomentum: false,
    dragPropagation: false,
    whileDrag: canDrag ? { scale: 1.06, zIndex: 40, cursor: "grabbing" as const } : undefined,
    transition: ROOM_SPRING,
    onPointerDown: markPointerDown,
    onDrag: markMoved,
  };

  return (
    <section className="personal-opening" id="hero">
      <div className="opening-kicker">
        <span>WELCOME TO MY LISTENING ROOM</span>
        <a href="#contact"><i aria-hidden /> Open to AI & full-stack roles ↗</a>
      </div>
      <div className="opening-composition">
        <div className="opening-identity">
          <h1>SHIVA<br /><span>CHANDRA</span><b aria-hidden>.</b></h1>
          <p className="opening-role">AI & full-stack engineer</p>
          <p className="opening-intro">I build useful things.<br /><em>Usually with music on.</em></p>
          <div className="opening-actions">
            <a className="room-button" href="#selected-work">View selected work <span aria-hidden>↗</span></a>
            <a className="room-link" href="#contact">Let’s talk ↗</a>
          </div>
          <p className="opening-location">HYDERABAD, INDIA · IDEAS TO INTERFACES TO LAUNCH</p>
        </div>

        <div className="opening-objects" ref={stage}>
          <motion.a
            className="headphone-object sticker-drag sticker-headphones"
            href="#music-corner"
            aria-label="Open my music corner"
            draggable={false}
            style={{ rotate: reduced ? 0 : 17, zIndex: 6 }}
            {...sharedDrag}
            onClick={(event) => { suppressIfDragged(event); }}
          >
            <svg viewBox="0 0 320 290" aria-hidden>
              <defs>
                <linearGradient id="headphone-metal">
                  <stop stopColor="#414b42" />
                  <stop offset=".35" stopColor="#d0d4c1" />
                  <stop offset=".6" stopColor="#89957c" />
                  <stop offset="1" stopColor="#384537" />
                </linearGradient>
                <linearGradient id="headphone-pad" x2="1" y2="1">
                  <stop stopColor="#4a5346" />
                  <stop offset=".5" stopColor="#1a211a" />
                  <stop offset="1" stopColor="#343d2f" />
                </linearGradient>
              </defs>
              <path d="M57 183V133C57 5 263 5 263 133V183" fill="none" stroke="#101710" strokeWidth="32" />
              <path d="M57 183V133C57 5 263 5 263 133V183" fill="none" stroke="url(#headphone-metal)" strokeWidth="19" />
              <path d="M67 119C77 20 243 20 253 119" fill="none" stroke="#333e30" strokeWidth="26" strokeLinecap="round" />
              <path d="M71 103C97 36 227 35 250 103" fill="none" stroke="#849077" strokeWidth="2" opacity=".55" />
              <g transform="rotate(-12 64 191)">
                <rect x="33" y="141" width="51" height="100" rx="23" fill="url(#headphone-metal)" />
                <rect x="62" y="135" width="38" height="112" rx="18" fill="url(#headphone-pad)" stroke="#68735e" strokeWidth="2" />
                <path d="M76 147V235" stroke="#88957a" strokeWidth="2" opacity=".4" />
              </g>
              <g transform="rotate(12 258 191)">
                <rect x="235" y="141" width="51" height="100" rx="23" fill="url(#headphone-metal)" />
                <rect x="220" y="135" width="38" height="112" rx="18" fill="url(#headphone-pad)" stroke="#68735e" strokeWidth="2" />
                <path d="M244 147V235" stroke="#88957a" strokeWidth="2" opacity=".4" />
              </g>
              <path d="M266 240C292 293 158 256 126 282" fill="none" stroke="#839273" strokeWidth="4" />
              <text x="160" y="76" textAnchor="middle" fill="#c4cbb6" fontSize="9" letterSpacing="4">SIDE B</text>
            </svg>
            <span>What’s in my headphones? ↗</span>
          </motion.a>

          <motion.a
            className="resume-ticket sticker-drag sticker-ticket"
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Shiva Chandra’s resume"
            draggable={false}
            style={{ rotate: reduced ? 0 : -9, zIndex: 7 }}
            {...sharedDrag}
            onClick={(event) => { suppressIfDragged(event); }}
          >
            <span className="ticket-small">ADMIT ONE / YOUR NEXT ENGINEER</span>
            <strong>THE RESUME</strong>
            <span className="ticket-bottom">
              <span>SHIVA CHANDRA<br /><small>AI & FULL-STACK</small></span>
              <b aria-hidden>↗</b>
            </span>
            <span className="ticket-stub" aria-hidden>SC—2026</span>
          </motion.a>

          <motion.button
            className="opening-photo sticker-drag sticker-photo"
            type="button"
            aria-label={flipped ? "Turn photo back to photograph" : "Turn photo over to meet Shiva"}
            aria-pressed={flipped}
            style={{ zIndex: 8 }}
            {...sharedDrag}
            animate={{ rotate: reduced ? 0 : flipped ? -4 : 7 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            onClick={(event) => {
              if (suppressIfDragged(event)) return;
              setFlipped(!flipped);
            }}
          >
            <motion.span
              className="opening-photo-face"
              aria-hidden={flipped}
              animate={{ opacity: flipped ? 0 : 1, rotateY: reduced ? 0 : flipped ? 90 : 0 }}
              transition={{ duration: reduced ? 0 : 0.24 }}
            >
              <img src="/photos/about.jpg" alt="Shiva by the sea" draggable={false} />
              <span>Away from the keyboard.<br /><em>Turn me over ↻</em></span>
            </motion.span>
            <motion.span
              className="opening-photo-face photo-message"
              aria-hidden={!flipped}
              animate={{ opacity: flipped ? 1 : 0, rotateY: reduced ? 0 : flipped ? 0 : -90 }}
              transition={{ duration: reduced ? 0 : 0.24 }}
            >
              <strong>Hey, I’m Shiva.</strong>
              <span>I build AI tools, web platforms, and mobile apps. Off the clock: new places, good coffee, and a playlist for the journey.</span>
              <em>Back to the photograph ↻</em>
            </motion.span>
          </motion.button>

          <span className="objects-note">Drag the stickers.<br /><em>Click when you mean it.</em><b aria-hidden>↗</b></span>
        </div>
      </div>
      <div className="opening-footer">
        <span>SIDE A — THE THINGS I’VE BUILT</span>
        <a href="#selected-work">Pick a record. Get into the build. ↓</a>
      </div>
    </section>
  );
}
