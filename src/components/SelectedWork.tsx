"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { SectionShell, SectionTitle } from "@/components/ui/SectionShell";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { TrackLabel } from "@/components/ui/TrackLabel";
import { Equalizer } from "@/components/ui/Equalizer";
import { FeaturedProjectCard } from "@/components/FeaturedProjectCard";
import { ProjectTrackRow } from "@/components/ProjectTrackRow";
import { FEATURED_PROJECTS, PROJECTS } from "@/lib/projects";

function GroupHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <FadeIn className="mt-16 md:mt-24 mb-5 md:mb-6">
      <div className="flex items-center gap-3 mb-3">
        <span className="track-num text-sm" style={{ opacity: 0.35 }}>
          ·
        </span>
        <span className="h-px w-8 bg-white/20" />
        <span className="text-[11px] tracking-[0.28em] uppercase text-text-muted font-medium">
          {eyebrow}
        </span>
        <Equalizer bars={4} className="h-3 ml-1" />
      </div>
      <h3
        className="font-display font-bold text-text leading-[0.95]"
        style={{ fontSize: "clamp(22px, 3vw, 36px)", letterSpacing: "-0.02em" }}
      >
        {title}
      </h3>
    </FadeIn>
  );
}

function Tracklist({
  projects,
  startIndex,
}: {
  projects: typeof PROJECTS;
  startIndex: number;
}) {
  if (projects.length === 0) return null;
  return (
    <div className="border-b border-white/10">
      {projects.map((p, i) => (
        <ProjectTrackRow key={p.title} project={p} index={startIndex + i} />
      ))}
    </div>
  );
}

export default function SelectedWork() {
  const nonFeatured = PROJECTS.filter((p) => !p.featured);

  const freelance = nonFeatured.filter((p) => p.group === "freelance");
  const personal = nonFeatured.filter((p) => p.group === "personal");
  const mobile = nonFeatured.filter((p) => p.group === "mobile");

  let trackIndex = FEATURED_PROJECTS.length;
  const baseFreelance = trackIndex;
  trackIndex += freelance.length;
  const basePersonal = trackIndex;
  trackIndex += personal.length;
  const baseMobile = trackIndex;

  return (
    <SectionShell id="selected-work" variant="first">
      <FadeIn className="mb-4 md:mb-6">
        <TrackLabel num="02" name="The Hits" />
        <SectionTitle><ScrambleText text="What I've Built" /></SectionTitle>
        <p className="text-text-muted text-base md:text-lg leading-relaxed mt-6 max-w-2xl">
          Production client platforms, AI products, and shipped mobile apps — from
          architecture through deployment.
        </p>
      </FadeIn>

      {/* A-side — featured headliners */}
      <FadeIn className="mt-10 md:mt-14 mb-4">
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <span className="text-[11px] tracking-[0.28em] uppercase text-text-muted font-medium">
            Side A · Headliners
          </span>
          <Equalizer bars={5} className="h-3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-x-8 md:gap-y-12">
          {FEATURED_PROJECTS.map((p) => (
            <FeaturedProjectCard key={p.title} project={p} />
          ))}
        </div>
      </FadeIn>

      {/* Deep cuts — full tracklist */}
      {(freelance.length > 0 || personal.length > 0 || mobile.length > 0) && (
        <FadeIn className="mt-6">
          <p className="text-[11px] tracking-[0.28em] uppercase text-text-muted/80 mb-6">
            Full tracklist
          </p>
        </FadeIn>
      )}

      {freelance.length > 0 && (
        <>
          <GroupHeading eyebrow="Client Work · Tekkdevv" title="More freelance" />
          <Tracklist projects={freelance} startIndex={baseFreelance} />
        </>
      )}

      {personal.length > 0 && (
        <>
          <GroupHeading eyebrow="Personal" title="More projects" />
          <Tracklist projects={personal} startIndex={basePersonal} />
        </>
      )}

      {mobile.length > 0 && (
        <>
          <GroupHeading eyebrow="Shipped" title="More apps" />
          <Tracklist projects={mobile} startIndex={baseMobile} />
        </>
      )}
    </SectionShell>
  );
}
