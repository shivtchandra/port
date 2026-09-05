"use client";
import { useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import { ROOM_EASE, ROOM_SPRING } from "@/lib/room-motion";
import "./studio-scene.css";

function scratchSound() {
  try {
    const context = new AudioContext();
    const buffer = context.createBuffer(1, Math.floor(context.sampleRate * .16), context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * .25));
    const source = context.createBufferSource();
    source.buffer = buffer;
    const gain = context.createGain();
    gain.gain.setValueAtTime(.04, context.currentTime);
    source.connect(gain); gain.connect(context.destination);
    void context.resume().then(() => source.start()).catch(() => context.close());
    source.onended = () => { void context.close(); };
  } catch { /* Sound is optional. */ }
}

const recordings = [
  { name: "Resumit", kind: "AI product", slug: "resumit", image: "/projects/resumit.png", caption: "Feedback that gives you a next step.", color: "#d3e3a4" },
  { name: "CyberSealTrain", kind: "Client platform", slug: "cybersealtrain", image: "/projects/cyberseal-train.png", caption: "From courses to certificates.", color: "#c5cfda" },
  { name: "Golden Hour", kind: "Mobile app", slug: "golden-hour", image: "/apps/golden-hour/01.png", caption: "A little film. A lot of feeling.", color: "#dcb589" },
];

export function ListeningHero() {
  const reduced = useReducedMotion();
  const [sound, setSound] = useState(false);
  const [selected, setSelected] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [peek, setPeek] = useState<number | null>(null);
  const recording = recordings[selected];
  const rotation = useMotionValue(0);
  const pointer = useRef<{ id: number; x: number } | null>(null);
  const lastSound = useRef(0);
  function scratch(delta: number) {
    if (!reduced) rotation.set(rotation.get() + delta);
    if (sound && performance.now() - lastSound.current > 180) {
      scratchSound(); lastSound.current = performance.now();
    }
  }
  function selectRecord(index: number) {
    setSelected((index + recordings.length) % recordings.length);
    setShowNotes(false);
  }
  return <section id="hero" className="studio-scene">
    <div className="studio-intro"><p>Shiva Chandra <span>AI & full-stack engineer</span></p><a href="#contact"><i aria-hidden /> Open to the right opportunity ↗</a></div>
    <h1 className="studio-headline">ENGINEER<span>.</span></h1>
    <div className="studio-caption"><span>PRODUCTS WITH PURPOSE.</span><em>A little soul in the software.</em><span>HYDERABAD, IN ↗</span></div>
    <div className="studio-desk">
      <div className="studio-manifesto"><span className="studio-margin-label">01 — THE WORK / THE PERSON</span><p>I turn <em>“what if”</em><br /> into <em>“it’s live.”</em></p><div className="studio-description">AI tools, web platforms, and mobile apps. Built from the first idea to the last interaction.</div><a className="room-button" href="#selected-work">View selected work <span aria-hidden>↗</span></a><a className="room-link" href="#contact">Let’s talk ↗</a></div>
      <div className="record-crate" aria-label="Browse three selected projects">
        <p className="crate-instruction">Pick a record. Get into the build. <span aria-hidden>↘</span></p>
      <motion.div className="hero-record-stage" initial={reduced ? false : { x: -70, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: .8, ease: ROOM_EASE }}>
        <motion.div className="room-record" role="button" tabIndex={0} aria-label="Scratch the record" aria-description="Drag, tap, or use left and right arrows to scratch" style={{ rotate: reduced ? 0 : rotation }}
          onPointerDown={event => { if (event.pointerType === "touch") return; pointer.current = { id: event.pointerId, x: event.clientX }; event.currentTarget.setPointerCapture(event.pointerId); }}
          onPointerMove={event => { if (!pointer.current || pointer.current.id !== event.pointerId) return; scratch((event.clientX - pointer.current.x) * 1.4); pointer.current.x = event.clientX; }}
          onPointerUp={event => { if (event.pointerType === "touch") scratch(24); pointer.current = null; }} onPointerCancel={() => { pointer.current = null; }}
          onKeyDown={event => { if (["ArrowLeft", "ArrowRight", "Enter", " "].includes(event.key)) { event.preventDefault(); scratch(event.key === "ArrowLeft" ? -24 : 24); } }}>
          <div className="record-label" style={{ background: recording.color }}><span>{recording.kind.toUpperCase()}<br />ON REPEAT</span><i /><small>SHIVA CHANDRA · SIDE A</small></div>
        </motion.div>
      </motion.div>
        <div className="crate-sleeves">
          {recordings.map((item, index) => {
            const position = (index - selected + 3) % 3;
            const active = position === 0;
            return <motion.button key={item.slug} className={`crate-sleeve crate-${item.slug}`} aria-label={active ? `Turn ${item.name} sleeve ${showNotes ? "to artwork" : "to liner notes"}` : `Select ${item.name} record`} aria-pressed={active} data-face={active && showNotes ? "notes" : "artwork"}
              style={{ backgroundColor: item.color, zIndex: active ? 4 : position === 1 ? 2 : 1 }}
              initial={false}
              animate={{ x: active ? "0%" : position === 1 ? "27%" : "-27%", y: active ? 0 : peek === index ? 8 : 28, rotate: reduced ? 0 : active ? -5 : position === 1 ? 12 : -16, scale: active ? 1 : peek === index ? .97 : .94 }}
              transition={reduced ? { duration: 0 } : ROOM_SPRING}
              drag={active && !reduced ? "x" : false} dragConstraints={{ left: -65, right: 65 }} dragElastic={.15} dragSnapToOrigin
              onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 45) selectRecord(selected + (info.offset.x < 0 ? 1 : -1)); }}
              onHoverStart={() => setPeek(index)} onHoverEnd={() => setPeek(null)}
              onClick={() => { if (active) setShowNotes(!showNotes); else selectRecord(index); }}
              onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); selectRecord(selected + (event.key === "ArrowRight" ? 1 : -1)); } }}>
              <motion.span className="sleeve-face sleeve-front" aria-hidden={active && showNotes} animate={{ opacity: active && showNotes ? 0 : 1, rotateY: reduced ? 0 : active && showNotes ? -90 : 0 }} transition={{ duration: reduced ? 0 : .28 }}>
              <span className="crate-label"><span>SC / ORIGINAL WORK</span><span>VOL. 0{index + 1}</span></span>
              <span className="crate-title">{item.name === "CyberSealTrain" ? <>CyberSeal<br />Train</> : item.name}</span>
              <span className="crate-kind">{item.kind}</span>
              <span className="crate-window"><img src={item.image} alt={`${item.name} interface`} draggable={false} fetchPriority={index === 0 ? "high" : "auto"} /></span>
              <span className="crate-bottom"><span>{item.caption}</span><span aria-hidden>↻</span></span>
              </motion.span>
              <motion.span className="sleeve-face sleeve-notes" aria-hidden={!(active && showNotes)} animate={{ opacity: active && showNotes ? 1 : 0, rotateY: reduced ? 0 : active && showNotes ? 0 : 90 }} transition={{ duration: reduced ? 0 : .28 }}>
                <span className="crate-label"><span>LINER NOTES / VOL. 0{index + 1}</span><span>↻</span></span>
                <span className="notes-title">Behind<br /><em>the record.</em></span>
                <span className="notes-credit">WRITTEN & BUILT BY SHIVA CHANDRA</span>
                <span className="notes-body">{index === 0 ? "A resume score should come with a next step. I built the interface, AI processing, feedback, and template recommendations." : index === 1 ? "A course is only part of the journey. I delivered a platform connecting courses, trainers, certifications, and placements." : "A camera with a point of view. I built and shipped an Android film-camera app with real-time capture and 30 cameras."}</span>
                <span className="notes-stack">{index === 0 ? "React / Python / OpenAI" : index === 1 ? "React / Firebase / jsPDF" : "Flutter / Dart / Firebase"}</span>
                <span className="notes-hint">Tap to turn back · Open the story below ↓</span>
              </motion.span>
            </motion.button>;
          })}
        </div>
        <div className="crate-navigation"><button onClick={() => selectRecord(selected - 1)} aria-label="Previous record">←</button><a href={`/work/${recording.slug}`}>Inside {recording.name} <span aria-hidden>↗</span></a><button onClick={() => selectRecord(selected + 1)} aria-label="Next record">→</button></div>
        <p className="crate-status" role="status">0{selected + 1} / 03 · {recording.kind} <span>{showNotes ? "Liner notes · Tap to turn back" : "Drag to browse · Tap to turn over"}</span></p>
      </div>
      <aside className="studio-personal"><a className="desk-photo" href="#about"><img src="/photos/about.jpg" alt="Shiva by the sea" /><span>Usually building.<br />Occasionally touching grass. ↗</span></a><a className="studio-stamp" href="#side-b">A SIDE OF<br /><strong>HUMAN</strong><span>TURN TO SIDE B ↗</span></a><p className="desk-note">Good code.<br />Good records.<br /><em>Both worth a closer listen.</em></p></aside>
    </div>
    <div className="studio-bottom"><span>INDEPENDENT MIND. END-TO-END BUILDER.</span><button onClick={() => setSound(!sound)} aria-pressed={sound}>{sound ? "Sound off" : "Sound on"} <span aria-hidden>{sound ? "◖))" : "◖"}</span></button><a href="#selected-work">Drop into the collection ↓</a></div>
  </section>;
}

