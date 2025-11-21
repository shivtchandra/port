"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { ScrollControls, Environment, Scroll } from "@react-three/drei";
import { Road } from "./Road";
import { Sky } from "./Sky";
import { Silhouettes } from "./Silhouettes";
import { Particles } from "./Particles";
import { CameraController } from "./CameraController";
import Hero from "./Hero";
import About from "./About";
import Skills from "./Skills";
import Experience from "./Experience";
import Projects from "./Projects";
import Blogs from "./Blogs";
import Leadership from "./Leadership";
import Certifications from "./Certifications";
import Contact from "./Contact";
import TeleportEffect from "./TeleportEffect";

export default function Scene3D() {
    const [showTeleport, setShowTeleport] = useState(false);

    return (
        <div className="relative w-full">
            {/* 3D Scene */}
            <div className="h-[300vh] w-full bg-black">
                <div className="sticky top-0 h-screen">
                    <Canvas shadows camera={{ position: [0, 1.6, 5], fov: 60 }}>
                        <fog attach="fog" args={["#000000", 5, 60]} />
                        <ambientLight intensity={0.2} color="#111111" />
                        <pointLight position={[0, 10, -100]} intensity={10} color="#E50914" distance={200} decay={2} />

                        <Suspense fallback={null}>
                            <ScrollControls pages={12} damping={0.2}>
                                <CameraController onTeleport={setShowTeleport} />
                                <Sky />
                                <Road />
                                <Silhouettes />
                                <Particles />
                                <Hero />

                                {/* Content Sections in 3D Space */}
                                <Scroll html style={{ width: '100%' }}>
                                    <div className="w-full">
                                        {/* Spacer for hero and road journey */}
                                        <div className="h-[200vh]" />

                                        {/* Teleport transition point */}
                                        <div className="h-[100vh] flex items-center justify-center">
                                            <div className="text-6xl font-black text-neon-red text-glow glitch" data-text="ENTERING THE UPSIDE DOWN">
                                                ENTERING THE UPSIDE DOWN
                                            </div>
                                        </div>

                                        {/* Content sections */}
                                        <About />
                                        <Skills />
                                        <Experience />
                                        <Projects />
                                        <Blogs />
                                        <Leadership />
                                        <Certifications />
                                        <Contact />
                                    </div>
                                </Scroll>
                            </ScrollControls>
                            <Environment preset="night" />
                        </Suspense>
                    </Canvas>
                </div>
            </div>

            <TeleportEffect trigger={showTeleport} />
        </div>
    );
}
