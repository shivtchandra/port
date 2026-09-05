"use client";
import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";
import { ROOM_EASE, ROOM_SPRING } from "@/lib/room-motion";
import { ProjectLens } from "./ProjectLens";
import { useRecordPlayer } from "./useRecordPlayer";
import "./playable-projects.css";

function Artwork({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? <div className="artwork-retry"><span>Artwork couldn’t load. The project story is still here.</span><button onClick={() => setFailed(false)}>Retry image ↗</button></div> : <img src={src} alt={alt} draggable={false} onError={() => setFailed(true)} loading="lazy" />;
}

function Vinyl({ project }: { project?: Project }) {
  return <div className="playable-vinyl"><div className="vinyl-label" style={{ background: project?.playback?.color ?? "#dbe5a3" }}><span>SHIVA CHANDRA / ORIGINAL WORK</span><strong>{project?.title ?? "SIDE A"}</strong><i /><small>{project?.playback?.edition ?? "SELECTED RECORDINGS"}</small></div></div>;
}

export function PlayableProjects({ projects }: { projects: Project[] }) {
  const slugs = useMemo(() => projects.map(p => p.slug!), [projects]);
  const { bindScope, bindPlatter, bindChapter, bindSleeve, ...player } = useRecordPlayer(slugs);
  const [tracks, setTracks] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, boolean>>({});
  const scratchPoint = useRef<number | null>(null);
  const disc = projects.find(p => p.slug === player.loaded);
  const flightProject = projects.find(p => p.slug === player.flight?.slug);
  return <div className="playable-projects" ref={bindScope} data-phase={player.phase}>
    <aside className="player-column" aria-label="Project record player">
      <div className="turntable">
        <div className="deck-brand"><strong>SC / AUDIO LAB</strong><span>THE WORK, ON RECORD.</span></div>
        <div className="deck-mechanism">
          <div className="deck-platter" ref={bindPlatter}>
            <div className="empty-platter" aria-hidden><span>33⅓</span></div>
            {disc && <div className={`spinning-disc ${player.spinning ? "is-spinning" : ""}`} role="button" tabIndex={0} aria-label={`Scratch ${disc.title} record`} aria-description="Drag the record, or press left and right arrows. Sound is optional."
              onPointerDown={e => { scratchPoint.current = e.clientX; e.currentTarget.setPointerCapture(e.pointerId); }}
              onPointerMove={e => { if (scratchPoint.current !== null && Math.abs(e.clientX - scratchPoint.current) > 5) { player.scratch(); scratchPoint.current = e.clientX; } }}
              onPointerUp={() => { scratchPoint.current = null; }} onPointerCancel={() => { scratchPoint.current = null; }}
              onKeyDown={e => { if (["ArrowLeft", "ArrowRight", "Enter", " "].includes(e.key)) { e.preventDefault(); player.scratch(); } }}><Vinyl project={disc} /></div>}
            <i className="deck-spindle" aria-hidden />
          </div>
          <div className={`tonearm ${player.phase === "playing" || player.phase === "lowering" ? "arm-down" : ""}`} aria-hidden><span className="arm-pivot" /><span className="arm-shaft" /><span className="arm-head" /></div>
          <div className="speed-selector" aria-hidden><span>33</span><i /><span>45</span></div>
        </div>
        <div className="deck-display" role="status" aria-live="polite"><span className={player.loaded ? "deck-led active" : "deck-led"} /><div><small>{player.phase === "playing" ? player.paused ? "ROTATION PAUSED" : "NOW PLAYING" : player.phase === "idle" ? "READY WHEN YOU ARE" : "CHANGING THE RECORD"}</small><strong>{disc?.title ?? (player.phase === "idle" ? "Pick a project" : "One moment…")}</strong></div><span className="deck-counter">{disc ? `0${projects.indexOf(disc) + 1}` : "—"}</span></div>
        <div className="deck-controls"><button aria-pressed={player.paused} onClick={() => player.setPaused(!player.paused)}>{player.paused ? "▶ Resume rotation" : "Ⅱ Pause rotation"}</button><button onClick={player.eject} disabled={player.phase === "idle"}>⏏ Eject</button><button aria-pressed={player.sound} onClick={() => player.setSound(!player.sound)}>{player.sound ? "Sound off" : "Sound on"}</button></div>
        <p className="deck-footnote">Scroll to change the record. Stay for the details.</p>
      </div>
    </aside>
    <div className="record-chapters">{projects.map((project, index) => {
      const slug = project.slug!, presentation = project.playback!, track = tracks[slug] ?? 0;
      const onDeck = player.loaded === slug;
      return <article className={`record-chapter chapter-${slug}`} id={`record-${slug}`} key={slug} ref={el => bindChapter(slug, el)} data-active={player.active === slug}>
        <header className="chapter-header"><span>0{index + 1} / {project.category}</span><span>{onDeck ? "● On the turntable" : "○ In the collection"}</span></header>
        <div className="chapter-record-row">
          <div className="sleeve-origin" ref={el => bindSleeve(slug, el)}>
            <div className={`sleeve-peeking-disc ${onDeck || player.flight?.slug === slug ? "record-away" : ""}`} aria-hidden><Vinyl project={project} /></div>
            <motion.div className="project-jacket" style={{ background: presentation.color }} drag={player.reduced ? false : true} dragSnapToOrigin dragElastic={.12} dragMomentum={false} transition={ROOM_SPRING}
              onDragEnd={(_, info) => {
                if (player.isOnPlatter(info.point.x - window.scrollX, info.point.y - window.scrollY)) player.play(slug, false);
              }}>
              <span className="jacket-edition">{presentation.edition} <span>SC.</span></span>
              <h3>{project.title === "CyberSealTrain" ? <>CyberSeal<br />Train</> : project.title}</h3>
              <span className="jacket-category">{project.slug === "drivescope" ? "Built for Indian car decisions." : project.slug === "mapping-hyd" ? "Hyderabad, one layer at a time." : project.group === "mobile" ? "A little film. A lot of feeling." : project.group === "personal" ? "Intelligence, with intention." : "Built to bring it together."}</span>
              {notes[slug] ? <p className="jacket-liner">{project.caseStudy?.ownership}</p> : <div className="jacket-art"><Artwork key={presentation.tracks[0].image} src={presentation.tracks[0].image} alt={`${project.title} cover artwork`} /></div>}
              <button className="liner-toggle" onClick={() => setNotes(s => ({ ...s, [slug]: !s[slug] }))} aria-expanded={!!notes[slug]}>{notes[slug] ? "Return to artwork" : "Read the liner notes"} ↻</button>
            </motion.div>
          </div>
          <div className="chapter-intro"><p>{presentation.tracks[0].body}</p><span>{project.role} · {project.year}</span><button className="room-button" onClick={() => player.play(slug)}>▶ Play project</button><a className="room-link" href={`/work/${slug}`}>Open full case study ↗</a><small className="drag-hint">Or drag the sleeve onto the platter ↗</small></div>
        </div>
        <div className="chapter-tracklist" aria-label={`${project.title} story tracks`}>{presentation.tracks.map((item, n) => <button key={item.title} aria-pressed={track === n} aria-controls={`track-${slug}`} onClick={() => setTracks(s => ({ ...s, [slug]: n }))}><span>0{n + 1}</span>{item.title}</button>)}</div>
        <motion.div className="chapter-panel" id={`track-${slug}`} key={track} initial={player.reduced ? false : { opacity: .2 }} animate={{ opacity: 1 }} transition={{ duration: .16 }}>
          {track === 2 ? <ProjectLens slug={slug} /> : <><div className="track-copy"><span>0{track + 1} / {presentation.tracks[track].title}</span><p>{presentation.tracks[track].body}</p>{track === 1 && <small>{project.stack.join(" / ")}</small>}</div><div className={`track-art ${project.group === "mobile" ? "portrait-track" : ""}`}><Artwork key={presentation.tracks[track].image} src={presentation.tracks[track].image} alt={`${project.title}: ${presentation.tracks[track].title}`} /></div></>}
        </motion.div>
      </article>;
    })}</div>
    {player.flight && createPortal(<motion.div key={`${player.flight.id}-${player.flight.returning}`} className="disc-flight" aria-hidden initial={{ x: player.flight.from.x, y: player.flight.from.y, width: player.flight.from.size, height: player.flight.from.size, rotate: player.flight.returning ? 30 : -12 }} animate={{ x: [player.flight.from.x, player.flight.from.x + (player.flight.returning ? -15 : 32), player.flight.to.x], y: [player.flight.from.y, player.flight.from.y - 12, player.flight.to.y], width: player.flight.to.size, height: player.flight.to.size, rotate: player.flight.returning ? -12 : 30 }} transition={{ duration: player.flight.duration, ease: ROOM_EASE }}><Vinyl project={flightProject} /></motion.div>, document.body)}
  </div>;
}
