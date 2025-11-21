"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface EntrySequenceProps {
    onComplete: () => void;
}

export default function EntrySequence({ onComplete }: EntrySequenceProps) {
    const [show, setShow] = useState(true);
    const [staticIntensity, setStaticIntensity] = useState(1);
    const [noiseLinePosition, setNoiseLinePosition] = useState(0);
    const [tunedLetters, setTunedLetters] = useState(0);

    const name = "SHIVA CHANDRA T";

    useEffect(() => {
        // Animate static intensity (more frequent for intense flickering)
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

        // Handle scroll to dismiss
        const handleScroll = () => {
            handleDismiss();
        };

        window.addEventListener("wheel", handleScroll);
        window.addEventListener("touchmove", handleScroll);

        return () => {
            clearInterval(staticInterval);
            clearInterval(noiseInterval);
            clearInterval(letterInterval);
            window.removeEventListener("wheel", handleScroll);
            window.removeEventListener("touchmove", handleScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDismiss = () => {
        if (!show) return;
        setShow(false);
        // slow fade-out – match exit transition (2s)
        setTimeout(onComplete, 2000);
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    // 🔹 No initial upside-down now
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 0.9, // subtle shrink as it fades out
                    }}
                    transition={{ duration: 2, ease: "easeInOut" }} // slower overall
                    onClick={handleDismiss}
                    className="fixed inset-0 z-[100] bg-black cursor-pointer overflow-hidden"
                >
                    {/* Upside Down Background with red fog */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/30 to-black" />

                    {/* Red fog effect */}
                    <motion.div
                        animate={{
                            opacity: [0.1, 0.3, 0.1],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute inset-0 bg-gradient-radial from-red-900/20 via-transparent to-transparent blur-3xl"
                    />

                    {/* Animated Particles (spores) */}
                    <div className="absolute inset-0">
                        {[...Array(30)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-neon-red/40 rounded-full blur-sm"
                                initial={{
                                    x:
                                        Math.random() *
                                        (typeof window !== "undefined"
                                            ? window.innerWidth
                                            : 1000),
                                    y:
                                        Math.random() *
                                        (typeof window !== "undefined"
                                            ? window.innerHeight
                                            : 1000),
                                    opacity: 0,
                                }}
                                animate={{
                                    y: [
                                        null,
                                        Math.random() *
                                        (typeof window !== "undefined"
                                            ? window.innerHeight
                                            : 1000),
                                    ],
                                    x: [
                                        null,
                                        Math.random() *
                                        (typeof window !== "undefined"
                                            ? window.innerWidth
                                            : 1000),
                                    ],
                                    opacity: [0, 0.8, 0],
                                }}
                                transition={{
                                    duration: Math.random() * 5 + 3,
                                    repeat: Infinity,
                                    delay: Math.random() * 2,
                                }}
                            />
                        ))}
                    </div>

                    {/* VHS Scan Lines */}
                    <div className="absolute inset-0 vhs-scanlines opacity-50" />

                    {/* Main Content */}
                    <div className="relative h-full flex flex-col items-center justify-center px-4">
                        {/* Intense Glitch Overlay */}
                        <motion.div
                            animate={{
                                opacity: [0, 0.5, 0, 0.7, 0, 0.4, 0],
                            }}
                            transition={{
                                duration: 0.2,
                                repeat: Infinity,
                                repeatDelay: Math.random() * 1,
                            }}
                            className="absolute inset-0 bg-neon-red/20"
                        />

                        {/* Name with Enhanced Radio Static Effect */}
                        <div className="relative">
                            {/* Background glow */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.4, 0.7, 0.4],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                }}
                                className="absolute inset-0 blur-3xl bg-neon-red/40"
                            />

                            {/* Horizontal Noise Lines */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background: `linear-gradient(to bottom, transparent ${noiseLinePosition}%, rgba(229, 9, 20, 0.8) ${noiseLinePosition}%, rgba(229, 9, 20, 0.8) ${noiseLinePosition + 2
                                        }%, transparent ${noiseLinePosition + 2}%)`,
                                    mixBlendMode: "screen",
                                }}
                            />

                            {/* Main Text with Letter-by-Letter Tune-In */}
                            <motion.h1
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="relative text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-wider text-center px-4"
                                style={{
                                    textShadow: `
                                        0 0 10px rgba(229, 9, 20, 0.9),
                                        0 0 20px rgba(229, 9, 20, 0.7),
                                        0 0 30px rgba(229, 9, 20, 0.5),
                                        ${staticIntensity * 3}px ${staticIntensity * 3}px 0 rgba(255, 0, 0, ${staticIntensity * 0.4
                                        }),
                                        ${-staticIntensity * 3}px ${-staticIntensity * 3
                                        }px 0 rgba(0, 255, 255, ${staticIntensity * 0.4
                                        })
                                    `,
                                }}
                            >
                                {/* Intense Radio Static Effect Layers */}
                                <span
                                    className="absolute inset-0 text-neon-red"
                                    style={{
                                        clipPath: `inset(${Math.random() *
                                            100}% 0 ${Math.random() *
                                            100}% 0)`,
                                        transform: `translateX(${staticIntensity * 6 - 3
                                            }px) skew(${staticIntensity * 2}deg)`,
                                        opacity: staticIntensity * 0.8,
                                    }}
                                >
                                    {name}
                                </span>
                                <span
                                    className="absolute inset-0 text-cyan-400"
                                    style={{
                                        clipPath: `inset(${Math.random() *
                                            100}% 0 ${Math.random() *
                                            100}% 0)`,
                                        transform: `translateX(${-staticIntensity * 6 + 3
                                            }px) skew(${-staticIntensity * 2
                                            }deg)`,
                                        opacity: staticIntensity * 0.6,
                                    }}
                                >
                                    {name}
                                </span>

                                {/* Main text with letter-by-letter reveal */}
                                <span className="relative text-off-white">
                                    {name.split("").map((letter, i) => (
                                        <motion.span
                                            key={i}
                                            initial={{
                                                opacity: 0,
                                                filter: "blur(10px)",
                                            }}
                                            animate={{
                                                opacity:
                                                    i < tunedLetters ? 1 : 0.2,
                                                filter:
                                                    i < tunedLetters
                                                        ? "blur(0px)"
                                                        : "blur(8px)",
                                            }}
                                            transition={{ duration: 0.1 }}
                                            style={{
                                                display: "inline-block",
                                                textShadow:
                                                    i < tunedLetters
                                                        ? "0 0 10px rgba(229, 9, 20, 0.8)"
                                                        : "none",
                                            }}
                                        >
                                            {letter === " " ? "\u00A0" : letter}
                                        </motion.span>
                                    ))}
                                </span>
                            </motion.h1>

                            {/* Updated Subtitle */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0.8, 1] }}
                                transition={{ duration: 1.5, delay: 1.2 }}
                                className="text-center text-neon-red text-xs md:text-sm uppercase tracking-[0.3em] mt-6 font-mono"
                            >
                                Tuning into the Upside Down of Code & AI
                            </motion.p>
                        </div>

                        {/* Skip Indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.6, 0.6] }}
                            transition={{ duration: 0.8, delay: 1.5 }}
                            className="absolute bottom-12 text-off-white/60 text-xs uppercase tracking-widest font-mono animate-pulse"
                        >
                            Scroll or Click to Enter
                        </motion.div>
                    </div>

                    {/* Noise Texture */}
                    <div
                        className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                            animation: "noise 0.2s infinite",
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
