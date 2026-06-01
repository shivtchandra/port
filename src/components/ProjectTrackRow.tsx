"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";
import { isValidUrl, projectThumb } from "@/lib/projects";

function Thumb({ project }: { project: Project }) {
  const [errored, setErrored] = useState(false);
  const src = projectThumb(project);
  const isPortrait = Boolean(project.screenshots?.length && !project.image);

  return (
    <div
      className={`shrink-0 overflow-hidden border border-white/10 bg-surface/30 ${
        isPortrait ? "w-[72px] h-[128px] md:w-[80px] md:h-[140px]" : "w-[100px] h-[62px] md:w-[120px] md:h-[75px]"
      }`}
    >
      {src && !errored ? (
        <img
          src={src}
          alt=""
          aria-hidden
          onError={() => setErrored(true)}
          className={`w-full h-full object-cover ${isPortrait ? "object-top" : ""}`}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-surface to-bg" />
      )}
    </div>
  );
}

export function ProjectTrackRow({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const demo = isValidUrl(project.links.demo) ? project.links.demo : undefined;
  const github = isValidUrl(project.github) ? project.github : undefined;
  const primaryHref = demo ?? github;
  const num = String(index + 1).padStart(2, "0");
  const outcome = project.outcome ?? project.impact;

  const inner = (
    <div className="flex items-start gap-4 md:gap-6 py-5 md:py-6">
      <span className="index-num text-xl md:text-2xl shrink-0 pt-2 tabular-nums">{num}</span>
      <Thumb project={project} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            {outcome && (
              <p className="text-[10px] tracking-[0.2em] uppercase text-text-muted mb-1">
                {outcome}
              </p>
            )}
            <h4
              className="font-display font-bold text-text leading-tight transition-transform duration-300 group-hover:translate-x-1"
              style={{ fontSize: "clamp(18px, 2.2vw, 28px)", letterSpacing: "-0.02em" }}
            >
              {project.title}
            </h4>
          </div>
          {primaryHref && (
            <ArrowUpRight
              size={18}
              className="shrink-0 mt-1 text-text-muted group-hover:text-text transition-colors"
            />
          )}
        </div>
        <p className="text-text-muted text-sm leading-relaxed mt-2 line-clamp-2 max-w-xl">
          {project.description}
        </p>
        <p className="text-[10px] tracking-[0.14em] uppercase text-text-muted/70 mt-3 normal-case">
          {project.stack.slice(0, 4).join(" · ")}
        </p>
      </div>
    </div>
  );

  const className =
    "group block border-t border-white/10 last:border-b transition-colors hover:bg-white/[0.02]";

  if (primaryHref) {
    return (
      <a
        href={primaryHref}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {inner}
      </a>
    );
  }

  return <div className={className}>{inner}</div>;
}
