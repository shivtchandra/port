import { PROJECTS, isValidUrl } from "@/lib/projects";
import { PlayableProjects } from "./PlayableProjects";
export const FLAGSHIP_SLUGS = ["resumit", "cybersealtrain", "golden-hour"];
export function WorkGallery() {
  const featured = FLAGSHIP_SLUGS.map(slug => PROJECTS.find(p => p.slug === slug)!);
  const archive = PROJECTS.filter(p => !p.slug || !FLAGSHIP_SLUGS.includes(p.slug));
  return <section id="selected-work" className="work-gallery">
    <div className="gallery-heading"><p className="room-eyebrow">Side A / Selected work</p><h2>Made to be used.<br /><em>Worth a closer look.</em></h2><p>AI products, client platforms, and a pocket film camera.<br />Three different problems. Full ownership.</p></div>
    <PlayableProjects projects={featured} />
    <details className="project-archive"><summary>More from the collection <span>{archive.length} projects +</span></summary><div className="archive-grid">{archive.map(p => <article key={p.title}><div><h3>{p.title}</h3><p>{p.category}</p></div>{isValidUrl(p.links.demo) ? <a href={p.links.demo} target="_blank" rel="noreferrer" aria-label={`Open ${p.title}`}>Visit ↗</a> : <span className="archive-status">{p.outcome}</span>}</article>)}</div></details>
  </section>;
}

