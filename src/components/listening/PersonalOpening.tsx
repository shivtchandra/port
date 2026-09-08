"use client";
import { useRef, useState, useSyncExternalStore, type MouseEvent, type PointerEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ROOM_SPRING } from "@/lib/room-motion";
import "./personal-opening.css";


const desktopQuery = "(min-width: 768px)";
const subscribeDesktop = (notify: () => void) => {
  const query = window.matchMedia(desktopQuery);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};

function HeadphonesMark({ gradientId }: { gradientId: string }) {
  const silhouette = `${gradientId}-silhouette`;

  return (
    <>
      <svg viewBox="0 0 1254 1100" aria-hidden>
        <defs>
          {/* Clip the product photograph to its silhouette, including the open arch. */}
          <mask id={silhouette} maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254">
            <path fill="white" stroke="black" strokeWidth="18" strokeLinejoin="round" d="M 140 416 C 220 188 410 64 628 66 C 850 64 1037 194 1111 417 L 1140 511 L 1152 645 Q 1174 675 1154 733 C 1190 803 1170 955 1122 1088 Q 1100 1135 1034 1140 C 960 1204 822 1170 785 1115 C 745 1055 800 822 841 739 Q 882 660 966 675 Q 1045 684 1080 740 L 1121 691 L 1090 529 L 1060 460 C 958 268 803 187 628 186 C 439 184 278 294 185 461 L 155 528 L 132 682 L 174 741 Q 225 677 291 674 C 365 664 411 743 443 844 C 478 947 499 1093 462 1131 C 398 1200 280 1190 219 1140 C 149 1138 126 1100 108 1042 C 76 922 69 806 110 737 Q 84 701 103 654 L 123 513 Z" />
          </mask>
        </defs>
        <g transform="translate(0 -30) scale(1 0.88)">
          <image href="/headphones-real-v2.png" width="1254" height="1254" mask={`url(#${silhouette})`} />
          <rect x="417" y="856" width="420" height="190" rx="22" fill="#080c08" opacity="0.28" />
          <rect className="svg-room-button-bg" x="417" y="845" width="420" height="190" rx="22" fill="#d8e99f" stroke="#edf5d0" strokeWidth="2" />
          <text x="627" y="917" dominantBaseline="middle" textAnchor="middle" fill="#20271b" fontSize="46" fontWeight="600" letterSpacing="0">
            <tspan x="627">View selected</tspan>
            <tspan x="627" dy="56">work ↗</tspan>
          </text>
        </g>
      </svg>
      <span>What’s in my headphones? ↗</span>
    </>
  );
}

export function PersonalOpening() {
  const [flipped, setFlipped] = useState(false);
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const canDrag = !reduced;
  const desktop = useSyncExternalStore(subscribeDesktop, () => window.matchMedia(desktopQuery).matches, () => true);

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
    whileDrag: canDrag ? { scale: 1.05, zIndex: 40, cursor: "grabbing" as const } : undefined,
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

      <div className="opening-stage" ref={stage}>
        <div className="opening-center">
          <p className="opening-hello"><span className="name-pill">Hey — I’m <strong>Shiva</strong></span></p>
          <h1 className="opening-statement">
            An AI &amp; full-stack engineer
            <em> building useful things,</em>
            <span> usually with music on.</span>
          </h1>
          <p className="opening-support">
            Client platforms, personal tools, city maps, and car decisions —
            made to be used, not just shown.
          </p>
          <div className="opening-actions">
            <span className="cta-ledge">
              <motion.a
                className="headphone-object sticker-drag sticker-headphones"
                href="#selected-work"
                aria-label="View selected work"
                draggable={false}
                style={{
                  rotate: reduced ? 0 : -3,
                }}
                {...sharedDrag}
                onClick={(event) => { suppressIfDragged(event); }}
              >
                <HeadphonesMark gradientId="hp-desk" />
              </motion.a>
            </span>
            <a className="room-link" href="#contact">Let’s talk ↗</a>
          </div>
          <p className="opening-location">HYDERABAD, INDIA · IDEAS TO INTERFACES TO LAUNCH</p>
        </div>

        <motion.a
          className="resume-ticket sticker-drag sticker-ticket"
          href="/resume.pdf"
          target="_blank"
          rel="noreferrer"
          aria-label="Open Shiva Chandra’s resume"
          draggable={false}
          style={{ rotate: reduced ? 0 : -8, zIndex: 7 }}
          {...sharedDrag}
          drag={canDrag && !desktop}
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
          drag={canDrag && !desktop}
          animate={{ rotate: reduced ? 0 : flipped ? -4 : 6 }}
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

        <p className="objects-note">Drag the stickers.<br /><em>Click when you mean it.</em></p>
      </div>

      <div className="opening-footer">
        <span>SIDE A — THE THINGS I’VE BUILT</span>
        <a href="#selected-work">Pick a record. Get into the build. ↓</a>
      </div>
    </section>
  );
}
