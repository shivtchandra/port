"use client";

import Hero from "@/components/Hero";
import SelectedWork from "@/components/SelectedWork";
import About from "@/components/About";
import BeyondCode from "@/components/BeyondCode";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import { SideMarker } from "@/components/ui/SideMarker";

export default function Home() {
  return (
    <main className="w-full min-h-screen text-text pb-20">
      <Hero />
      <SideMarker side="a" />
      <SelectedWork />
      <Experience />
      <About />
      <SideMarker side="b" />
      <BeyondCode />
      <Contact />
    </main>
  );
}
