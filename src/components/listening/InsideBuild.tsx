"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ROOM_EASE, ROOM_TIMING } from "@/lib/room-motion";
const layers = [
  { title: "Interface", name: "A clear place to start.", body: "The React interface brings the resume assessment and improvement workflow together. In this illustrative sample, the visitor sees their material beside the next action.", example: "Sample input: “Built a reporting dashboard.”", note: "A fixed example. Nothing is uploaded or sent to an AI service." },
  { title: "Processing", name: "Give the model a useful job.", body: "Resumit’s Python and OpenAI integration supports resume scoring, feedback, suggestions, and template recommendations. This layer represents that processing conceptually.", example: "Sample task: identify vague wording and suggest useful detail.", note: "Conceptual workflow, not a verified infrastructure diagram or a live model trace." },
  { title: "Feedback", name: "Make the next step obvious.", body: "The result combines assessment with improvement suggestions. The product gives the person something to act on alongside the score.", example: "Sample suggestion: specify who used the dashboard and what decision it supported.", note: "Illustrative feedback. Add only outcomes and metrics you can substantiate." },
];
export function InsideBuild() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  return <section className="inside-build">
    <div className="inside-heading"><p className="room-eyebrow">A little less magic. A little more engineering.</p><h2>Inside the build.</h2><p>Pull the product apart. See what each layer contributes.</p><button className="room-button" aria-expanded={open} aria-controls="build-layers" onClick={() => setOpen(!open)}>{open ? "Bring it together" : "Separate the layers"} <span aria-hidden>{open ? "−" : "+"}</span></button></div>
    <div id="build-layers" className={`build-demo ${open ? "is-separated" : ""}`}>
      <div className="build-layer-stack">{layers.map((layer, i) => <motion.button key={layer.title} className={`build-layer layer-${i} ${active === i ? "is-active" : ""}`} aria-pressed={active === i} aria-controls="layer-description" onClick={() => { setActive(i); setOpen(true); }} animate={{ y: reduced ? 0 : open ? (i - 1) * 40 : 0, rotate: reduced ? 0 : open ? (i - 1) * 6 : 0 }} transition={{ duration: reduced ? 0 : ROOM_TIMING.layer, ease: ROOM_EASE }}><span>0{i + 1}</span><strong>{layer.title}</strong><span aria-hidden>↗</span></motion.button>)}</div>
      <div className="layer-detail" id="layer-description" aria-live="polite"><motion.div key={active} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: ROOM_TIMING.detail }}><span className="room-eyebrow">Selected layer / {layers[active].title}</span><h3>{layers[active].name}</h3><p>{layers[active].body}</p><blockquote>{layers[active].example}</blockquote><small>{layers[active].note}</small></motion.div></div>
    </div>
  </section>;
}

