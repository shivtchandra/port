"use client";

import { useState } from "react";
import Scene3D from "@/components/Scene3D";
import AudioPlayer from "@/components/AudioPlayer";
import VHSEffect from "@/components/VHSEffect";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-black text-off-white">
      <Scene3D />
      <AudioPlayer />
      <VHSEffect />
    </main>
  );
}
