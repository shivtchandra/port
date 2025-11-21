"use client";

import { Scroll, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useState } from "react";
import { FlaskConical, FolderOpen } from "lucide-react";

export default function Hero() {
    const scroll = useScroll();
    const [opacity, setOpacity] = useState(1);

    useFrame(() => {
        // Fade out hero text as we scroll
        setOpacity(1 - scroll.range(0, 0.2));
    });

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <Scroll html>
            <div
                className="w-screen h-screen flex flex-col items-center justify-center pointer-events-none"
                style={{ opacity }}
            >
                <div className="relative z-10 text-center px-4">
                    {/* Main Heading */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-off-white mb-6 leading-tight">
                        <span className="block text-glow chromatic" data-text="WELCOME TO THE UPSIDE DOWN">
                            WELCOME TO THE UPSIDE DOWN
                        </span>
                        <span className="block text-neon-red text-5xl md:text-7xl lg:text-8xl mt-2 glitch" data-text="OF SHIVA CHANDRA">
                            OF SHIVA CHANDRA
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-off-white/80 font-mono text-sm md:text-base lg:text-lg tracking-wider mb-12 uppercase">
                        Front-End Craft <span className="text-neon-red">•</span> AI Engineering <span className="text-neon-red">•</span> Creative Technologist
                    </p>

                    {/* Action Buttons with 3D Hover Tilt */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pointer-events-auto justify-center items-center">
                        <button
                            onClick={() => scrollToSection('projects')}
                            className="group relative px-6 py-3 border-2 border-neon-red text-neon-red hover:text-black transition-all duration-300 font-bold tracking-widest uppercase text-sm overflow-hidden perspective-1000 w-full sm:w-auto"
                            style={{
                                transformStyle: 'preserve-3d',
                            }}
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const y = e.clientY - rect.top;
                                const centerX = rect.width / 2;
                                const centerY = rect.height / 2;
                                const rotateX = (y - centerY) / 10;
                                const rotateY = (centerX - x) / 10;
                                e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
                            }}
                        >
                            <span className="relative z-10 flex items-center gap-2 justify-center">
                                <FlaskConical className="w-4 h-4" />
                                View Experiments
                            </span>
                            <div className="absolute inset-0 bg-neon-red transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                        </button>

                        <button
                            onClick={() => scrollToSection('about')}
                            className="group relative px-6 py-3 border-2 border-off-white/30 text-off-white hover:border-neon-red hover:text-neon-red transition-all duration-300 font-bold tracking-widest uppercase text-sm perspective-1000 w-full sm:w-auto"
                            style={{
                                transformStyle: 'preserve-3d',
                            }}
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const y = e.clientY - rect.top;
                                const centerX = rect.width / 2;
                                const centerY = rect.height / 2;
                                const rotateX = (y - centerY) / 10;
                                const rotateY = (centerX - x) / 10;
                                e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
                            }}
                        >
                            <span className="relative z-10 flex items-center gap-2 justify-center">
                                <FolderOpen className="w-4 h-4" />
                                Open Case Files
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </Scroll>
    );
}
