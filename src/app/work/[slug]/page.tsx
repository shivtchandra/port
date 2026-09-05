/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation enables progressive cross-document artwork transitions. */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { PROJECTS, projectThumb, isValidUrl } from "@/lib/projects";
import { InsideBuild } from "@/components/listening/InsideBuild";
import { ProjectLens } from "@/components/listening/ProjectLens";
import { PhotoBooth } from "@/components/PhotoBooth";
export function generateStaticParams() { return PROJECTS.filter(p => p.slug && p.caseStudy).map(p => ({ slug: p.slug! })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const project = PROJECTS.find(p => p.slug === slug);
  return { title: project ? `${project.title} — Shiva Chandra` : "Project not found", description: project?.description };
}
export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS.find(p => p.slug === slug && p.caseStudy);
  if (!project?.caseStudy) notFound();
  const story = project.caseStudy;
  return <main id="main-content" className={`case-page case-${slug}`}>
    <div className="case-intro"><a href="/#selected-work" className="room-link">← Back to selected work</a><p className="room-eyebrow">{project.category} / {project.year}</p><h1>{project.title}<span>.</span></h1><p className="case-lead">{story.intro}</p><div className="case-meta"><span>{project.role}</span><span>{project.stack.join(" / ")}</span>{isValidUrl(project.links.demo) && <a className="room-link" href={project.links.demo} target="_blank" rel="noreferrer">{project.group === "mobile" ? "View on Play Store" : "Open live project"} ↗</a>}</div></div>
    <div className="case-artwork" style={{ viewTransitionName: `art-${slug}` } as CSSProperties}><img src={projectThumb(project) ?? "/photos/travel-01.jpg"} alt={`${project.title} interface`} fetchPriority="high" /></div>
    <section className="case-ownership"><p className="room-eyebrow">What I owned</p><h2>From the first decision<br />to the shipped product.</h2><p>{story.ownership}</p></section>
    <ProjectLens slug={slug} />
    {slug === "resumit" && <InsideBuild />}
    <section className="case-decisions"><p className="room-eyebrow">Product decisions</p>{story.decisions.map((decision, index) => <article key={decision.title}><span>0{index + 1}</span><div><h2>{decision.title}</h2><p>{decision.body}</p></div></article>)}</section>
    <section className="case-evidence"><p className="room-eyebrow">The shipped work</p><p>{story.evidence}</p></section>
    {slug === "golden-hour" && <div className="booth-chapter"><PhotoBooth /></div>}
    <footer className="case-footer"><h2>Have a problem<br /><em>worth building for?</em></h2><a className="room-button" href="/#contact">Let’s talk ↗</a><a className="room-link" href="/#selected-work">Back to the collection ↗</a></footer>
  </main>;
}

