"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./project-lens.css";

const studies = {
  resumit: {
    image: "/projects/resumit.png", name: "Resumit", portrait: false,
    note: "Existing product screenshot. The match score and keyword bars are illustrative content shown in the interface, not measured portfolio results.",
    points: [
      { title: "An explicit first step", x: 19, y: 70, body: "Run Free Analysis and Match & Fix expose two clear starting points. The React interface connects resume assessment to the Python and OpenAI processing behind the product.", detail: "Interface → processing" },
      { title: "A score with context", x: 84, y: 47, body: "The match snapshot places a score beside keyword coverage. The assessment is presented with specific gaps rather than an isolated number.", detail: "Assessment → explanation" },
      { title: "Feedback that points forward", x: 76, y: 68, body: "The improvement summary sits alongside the assessment. Scoring, improvement suggestions, and template recommendations are parts of the product I built end to end.", detail: "Feedback → next action" },
    ],
  },
  cybersealtrain: {
    image: "/projects/cyberseal-train.png", name: "CyberSealTrain", portrait: false,
    note: "Existing public-facing platform screenshot. Administrative exports and certificate generation are described in the project material; they are not pictured here.",
    points: [
      { title: "One connected learning platform", x: 45, y: 5, body: "Courses, certifications, career guidance, and placements share the same navigation. I delivered the React and Firebase platform from requirements through deployment.", detail: "Discovery → learning journey" },
      { title: "Useful information before the click", x: 21, y: 56, body: "Duration, level, and price sit with the featured course description. The course entry gives a learner concrete information before opening the detail page.", detail: "Course context → decision" },
      { title: "A route into the course", x: 16, y: 69, body: "The featured course has a visible Know More action. Course discovery is the public-facing entry to a platform that also supports trainers, certifications, and operational exports.", detail: "Public interface → platform operations" },
    ],
  },
  "golden-hour": {
    image: "/apps/golden-hour/01.png", name: "Golden Hour", portrait: true,
    note: "Existing app promotional artwork. The separate browser preview below demonstrates the idea with CSS filters; it does not reproduce the mobile color-grading pipeline.",
    points: [
      { title: "Film has a personality", x: 63, y: 63, body: "The film card names the stock and describes its character. The Flutter app makes choosing a look part of the camera experience, with 30 cameras and real-time capture.", detail: "Film choice → visual intention" },
      { title: "Make capture the obvious action", x: 54, y: 81, body: "Capture sits at the bottom of the active film card. The interface brings the current look and the next action into the same place.", detail: "Selected look → capture" },
      { title: "Come back to the photograph", x: 52, y: 74, body: "Open Develop offers a way back to the look after shooting. The product was built and shipped as a solo Flutter, Dart, and Firebase app on Android.", detail: "Capture → develop" },
    ],
  },
  drivescope: {
    image: "/projects/drivescope-hero.png", name: "DriveScope", portrait: false,
    note: "Existing product artwork from the live DriveScope experience. Vehicle counts and modeled costs refer to the shipped dataset and calculators, not third-party audited results.",
    points: [
      { title: "Ask in plain language", x: 28, y: 42, body: "The hero finder takes a real need — budget, family use, city driving — and turns it into a shortlist. The product starts from life context, not a vague segment.", detail: "Question → shortlist" },
      { title: "Compare on the same terms", x: 72, y: 55, body: "Explore and Compare keep trims side by side on structured Indian specs and prices, so rivals are judged on equal footing instead of scattered tabs.", detail: "Specs → comparable decision" },
      { title: "Ownership stays visible", x: 48, y: 78, body: "Cost modeling keeps EMI, fuel, and five-year pressure next to the recommendation. The expensive surprises show up before the dealer conversation.", detail: "Shortlist → ownership cost" },
    ],
  },
  "mapping-hyd": {
    image: "/projects/mapping-hyd.jpg", name: "Mapping HYD", portrait: false,
    note: "Existing Mapping HYD hub artwork. Layer statuses reflect the live atlas at mapmyhyd.com and the startup map at startups.mapmyhyd.com.",
    points: [
      { title: "One city, named layers", x: 30, y: 38, body: "The hub presents Hyderabad as a series of maps — startups live first, with eateries and heritage in progress — so each layer is a clear product, not a dumped directory.", detail: "Atlas → layer" },
      { title: "Tell why it exists", x: 68, y: 52, body: "The story section makes the gap explicit: other cities had interactive layers; Hyderabad’s substance was not the missing piece — a visible digital layer was.", detail: "Motivation → series" },
      { title: "Send people into the map", x: 42, y: 74, body: "Each row links into a dedicated map experience. The hub introduces; the startup map delivers companies, funding, and jobs on a live Leaflet canvas.", detail: "Hub → live map" },
    ],
  },
};

export function ProjectLens({ slug }: { slug: string }) {
  const [selected, setSelected] = useState(0);
  const reduced = useReducedMotion();
  const study = studies[slug as keyof typeof studies];
  if (!study) return null;
  const point = study.points[selected];
  return <section className={`project-lens ${study.portrait ? "lens-portrait" : ""}`}>
    <header><p className="room-eyebrow">Look closer / Interface notes</p><h2>The decisions,<br /><em>right there on screen.</em></h2><p>Select a numbered detail to explore it.</p></header>
    <div className="lens-layout">
      <figure className="lens-visual"><img src={study.image} alt={`${study.name} product artwork with three annotated details`} loading="lazy" />{study.points.map((item, index) => <button key={item.title} style={{ left: `${item.x}%`, top: `${item.y}%` }} aria-label={`Detail ${index + 1}: ${item.title}`} aria-pressed={selected === index} aria-controls={`lens-detail-${slug}`} onClick={() => setSelected(index)}>{index + 1}</button>)}</figure>
      <div className="lens-reading"><div className="lens-index" aria-label="Interface details">{study.points.map((item, index) => <button key={item.title} onClick={() => setSelected(index)} aria-pressed={selected === index}>0{index + 1}<span>{item.title}</span><span aria-hidden>↗</span></button>)}</div><motion.div id={`lens-detail-${slug}`} className="lens-detail" key={selected} initial={reduced ? false : { opacity: .4 }} animate={{ opacity: 1 }} transition={{ duration: .16 }} aria-live="polite"><span>{point.detail}</span><h3>{point.title}</h3><p>{point.body}</p></motion.div></div>
    </div><p className="lens-note">{study.note}</p>
  </section>;
}
