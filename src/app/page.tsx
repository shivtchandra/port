"use client";

import { useState } from "react";
import Scene3D from "@/components/Scene3D";
import AudioPlayer from "@/components/AudioPlayer";
import VHSEffect from "@/components/VHSEffect";
import EntrySequence from "@/components/EntrySequence";

export default function Home() {
  const [showEntry, setShowEntry] = useState(true);

  return (
    <main className="w-full min-h-screen bg-black text-off-white">
      {showEntry && <EntrySequence onComplete={() => setShowEntry(false)} />}
      <Scene3D />
      <AudioPlayer />
      <VHSEffect />
    </main>
  );
}
