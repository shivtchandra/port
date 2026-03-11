"use client";

import { Scroll, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useState } from "react";
import { FlaskConical, FolderOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Hero() {
    const scroll = useScroll();
    const [opacity, setOpacity] = useState(1);
    const [staticIntensity, setStaticIntensity] = useState(1);
    const [noiseLinePosition, setNoiseLinePosition] = useState(0);
    const [tunedLetters, setTunedLetters] = useState(0);

    const name = "SHIVA CHANDRA T";

    useEffect(() => {
        // Animate static intensity
        const staticInterval = setInterval(() => {
            setStaticIntensity(Math.random());
        }, 50);

        // Animate horizontal noise lines
        const noiseInterval = setInterval(() => {
            setNoiseLinePosition(Math.random() * 100);
        }, 150);

        // Letter-by-letter tune-in effect
        const letterInterval = setInterval(() => {
            setTunedLetters((prev) => {
                if (prev < name.length) return prev + 1;
                return prev;
            });
        }, 80);

        return () => {
            clearInterval(staticInterval);
            clearInterval(noiseInterval);
            clearInterval(letterInterval);
        };
    }, []);

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
                <div className="relative z-10 text-center px-4 w-full flex flex-col items-center">
                    {/* Main Heading with Radio Static Effect */}
                    <div className="relative mb-6 w-full">
                        {/* Background glow */}
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                            }}
                            className="absolute inset-0 blur-3xl bg-neon-red/20 -z-10"
                        />

                        {/* Horizontal Noise Lines */}
                        <div
                            className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
                            style={{
                                background: `linear-gradient(to bottom, transparent ${noiseLinePosition}%, rgba(229, 9, 20, 0.4) ${noiseLinePosition}%, rgba(229, 9, 20, 0.4) ${noiseLinePosition + 1}%, transparent ${noiseLinePosition + 1}%)`,
                                mixBlendMode: "screen",
                            }}
                        />

                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-off-white leading-tight">
                            <span className="block text-glow chromatic opacity-70 text-[8px] sm:text-xs md:text-base mb-2 tracking-[0.2em] sm:tracking-[0.4em] md:tracking-[0.5em]" data-text="WELCOME TO THE UPSIDE DOWN">
                                WELCOME TO THE UPSIDE DOWN
                            </span>

                            <div className="relative inline-block w-full">
                                {/* Intense Radio Static Effect Layers */}
                                <span
                                    className="absolute inset-0 text-neon-red select-none hidden md:block"
                                    style={{
                                        clipPath: `inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0)`,
                                        transform: `translateX(${staticIntensity * 4 - 2}px) skew(${staticIntensity}deg)`,
                                        opacity: staticIntensity * 0.5,
                                    }}
                                >
                                    {name}
                                </span>
                                <span
                                    className="absolute inset-0 text-cyan-400 select-none hidden md:block"
                                    style={{
                                        clipPath: `inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0)`,
                                        transform: `translateX(${-staticIntensity * 4 + 2}px) skew(${-staticIntensity}deg)`,
                                        opacity: staticIntensity * 0.3,
                                    }}
                                >
                                    {name}
                                </span>

                                {/* Main text with letter-by-letter reveal */}
                                <span className="relative text-neon-red text-3xl sm:text-5xl md:text-7xl lg:text-8xl glitch break-words !leading-tight sm:!leading-normal" data-text={name}>
                                    {name.split("").map((letter, i) => (
                                        <motion.span
                                            key={i}
                                            initial={{
                                                opacity: 0,
                                                filter: "blur(10px)",
                                            }}
                                            animate={{
                                                opacity: i < tunedLetters ? 1 : 0.2,
                                                filter: i < tunedLetters ? "blur(0px)" : "blur(8px)",
                                            }}
                                            transition={{ duration: 0.1 }}
                                            style={{
                                                display: "inline-block",
                                                textShadow: i < tunedLetters ? "0 0 15px rgba(229, 9, 20, 0.8)" : "none",
                                            }}
                                        >
                                            {letter === " " ? "\u00A0" : letter}
                                        </motion.span>
                                    ))}
                                </span>
                            </div>
                        </h1>
                    </div>

                    {/* Subheading */}
                    <p className="text-off-white/80 font-mono text-[9px] sm:text-xs md:text-base lg:text-lg tracking-wider mb-8 md:mb-12 uppercase max-w-[280px] sm:max-w-none mx-auto leading-relaxed">
                        Multicloud Engineer <span className="text-neon-red sm:inline text-[8px] sm:text-base">•</span> Full-Stack Craft <br className="sm:hidden" /> <span className="text-neon-red hidden sm:inline">•</span> AI Engineering
                    </p>

                    {/* Action Buttons with 3D Hover Tilt */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pointer-events-auto justify-center items-center px-4 w-full max-w-sm mx-auto sm:max-w-none">
                        <button
                            onClick={() => scrollToSection('projects')}
                            className="group relative px-6 py-4 sm:py-3 border-2 border-neon-red text-neon-red hover:text-black transition-all duration-300 font-bold tracking-widest uppercase text-xs sm:text-sm overflow-hidden perspective-1000 w-full sm:w-auto"
                            style={{
                                transformStyle: 'preserve-3d',
                            }}
                            onMouseMove={(e) => {
                                if (window.innerWidth < 640) return;
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
                            className="group relative px-6 py-4 sm:py-3 border-2 border-off-white/30 text-off-white hover:border-neon-red hover:text-neon-red transition-all duration-300 font-bold tracking-widest uppercase text-xs sm:text-sm perspective-1000 w-full sm:w-auto"
                            style={{
                                transformStyle: 'preserve-3d',
                            }}
                            onMouseMove={(e) => {
                                if (window.innerWidth < 640) return;
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
