"use client";

import { useState, useCallback } from "react";
import { PersonalOpening as Hero } from "@/components/listening/PersonalOpening";
import { WorkGallery as SelectedWork } from "@/components/listening/WorkGallery";
import About from "@/components/About";
import { PersonalChapter } from "@/components/listening/PersonalChapter";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";


import { SecretBSide } from "@/components/SecretBSide";
import { useKonamiCode } from "@/hooks/useKonamiCode";

export default function Home() {
  const [bSideOpen, setBSideOpen] = useState(false);
  const openBSide = useCallback(() => setBSideOpen(true), []);
  useKonamiCode(openBSide);

  return (
    <main id="main-content" className="listening-room">
      <Hero />
      <SelectedWork />
      <div className="career-chapter"><Experience /><a className="room-link resume-link" href="/resume.pdf">Download my resume ↗</a></div>
      <About />
      <PersonalChapter />
      <Contact />
      <SecretBSide open={bSideOpen} onClose={() => setBSideOpen(false)} />
    </main>
  );
}
