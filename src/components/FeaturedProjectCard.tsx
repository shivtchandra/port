"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";
import { isValidUrl, projectThumb } from "@/lib/projects";

function LinkChip({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center text-[10px] tracking-[0.2em] uppercase text-text border border-white/20 px-2.5 py-1 hover:border-white/50 transition-colors"
    >
      {label}
    </a>
  );
}

function ProjectThumb({
  project,
  className = "",
  aspect = "aspect-[16/10]",
}: {
  project: Project;
  className?: string;
  aspect?: string;
}) {
  const [errored, setErrored] = useState(false);
  const src = projectThumb(project);
  const isPortrait = Boolean(project.screenshots?.length && !project.image);

  return (
    <div
      className={`relative overflow-hidden border border-white/10 bg-surface/40 ${aspect} ${className}`}
    >
      {src && !errored ? (
        <img
          src={src}
          alt=""
          aria-hidden
          onError={() => setErrored(true)}
          className={`absolute inset-0 w-full h-full object-cover ${
            isPortrait ? "object-top" : ""
          }`}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface to-bg"
          aria-hidden
        >
          <span className="font-display text-text-muted/30 text-xs tracking-[0.25em] uppercase">
            {project.title}
          </span>
        </div>
      )}
    </div>
  );
}

export function FeaturedProjectCard({ project }: { project: Project }) {
  const demo = isValidUrl(project.links.demo) ? project.links.demo : undefined;
  const github = isValidUrl(project.github) ? project.github : undefined;
  const outcome = project.outcome ?? project.impact;
  const primaryHref = demo ?? github;

  const cardRef = useRef<HTMLDivElement>(null);
  const isFine = useRef(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, sx: 50, sy: 50, active: false });

  useEffect(() => {
    isFine.current = window.matchMedia("(pointer: fine)").matches;
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!isFine.current) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = -((y - rect.height / 2) / (rect.height / 2)) * 6;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 8;
    setTilt({ rx, ry, sx: (x / rect.width) * 100, sy: (y / rect.height) * 100, active: true });
  }

  function handleMouseLeave() {
    setTilt({ rx: 0, ry: 0, sx: 50, sy: 50, active: false });
  }

  const titleInner = (
    <h3
      className="font-display font-bold text-text leading-[0.95] group-hover:translate-x-1 transition-transform duration-300"
      style={{ fontSize: "clamp(22px, 2.5vw, 32px)", letterSpacing: "-0.02em" }}
    >
      {project.title}
    </h3>
  );

  return (
    <div
      ref={cardRef}
      className="group relative block"
      style={{
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: tilt.active
          ? "transform 0.08s linear"
          : "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Holographic sheen overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: tilt.active
            ? `radial-gradient(circle at ${tilt.sx}% ${tilt.sy}%, rgba(255,255,255,0.09), transparent 55%)`
            : "none",
        }}
      />

      {primaryHref ? (
        <a href={primaryHref} target="_blank" rel="noopener noreferrer" className="block">
          <ProjectThumb
            project={project}
            aspect={
              project.group === "mobile" ? "aspect-[4/5] max-h-[280px]" : "aspect-[16/10]"
            }
          />
        </a>
      ) : (
        <ProjectThumb
          project={project}
          aspect={
            project.group === "mobile" ? "aspect-[4/5] max-h-[280px]" : "aspect-[16/10]"
          }
        />
      )}
      <div className="mt-5">
        {outcome && (
          <p className="text-[11px] tracking-[0.22em] uppercase text-text mb-2">{outcome}</p>
        )}
        <div className="flex items-start justify-between gap-3">
          {primaryHref ? (
            <a href={primaryHref} target="_blank" rel="noopener noreferrer">
              {titleInner}
            </a>
          ) : (
            titleInner
          )}
          {primaryHref && (
            <ArrowUpRight
              size={20}
              className="shrink-0 mt-1 text-text-muted group-hover:text-text transition-colors"
            />
          )}
        </div>
        {project.role && (
          <p className="text-text-muted text-xs tracking-wide mt-1">{project.role}</p>
        )}
        <p className="text-text-muted text-sm leading-relaxed mt-3 line-clamp-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {demo && <LinkChip href={demo} label={project.group === "mobile" ? "Store" : "Live"} />}
          {github && <LinkChip href={github} label="GitHub" />}
        </div>
      </div>
    </div>
  );
}
