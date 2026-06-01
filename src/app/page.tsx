"use client";

import { useState, useCallback } from "react";
import Hero from "@/components/Hero";
import SelectedWork from "@/components/SelectedWork";
import About from "@/components/About";
import BeyondCode from "@/components/BeyondCode";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import { SideMarker } from "@/components/ui/SideMarker";
import { AmbientBackground } from "@/components/AmbientBackground";
import { SecretBSide } from "@/components/SecretBSide";
import { useKonamiCode } from "@/hooks/useKonamiCode";

export default function Home() {
  const [bSideOpen, setBSideOpen] = useState(false);
  const openBSide = useCallback(() => setBSideOpen(true), []);
  useKonamiCode(openBSide);

  return (
    <main className="w-full min-h-screen text-text pb-20">
      <AmbientBackground />
      <Hero />
      <SideMarker side="a" />
      <SelectedWork />
      <Experience />
      <About />
      <SideMarker side="b" />
      <BeyondCode />
      <Contact />
      <SecretBSide open={bSideOpen} onClose={() => setBSideOpen(false)} />
    </main>
  );
}
