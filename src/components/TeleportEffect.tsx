"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TeleportEffectProps {
    trigger: boolean;
    onComplete?: () => void;
}

export default function TeleportEffect({ trigger, onComplete }: TeleportEffectProps) {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (trigger) {
            setIsActive(true);
            const timer = setTimeout(() => {
                setIsActive(false);
                onComplete?.();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [trigger, onComplete]);

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 pointer-events-none"
                >
                    {/* Red Flash */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: [0, 1, 0, 1, 0],
                            scale: [1, 1.2, 1, 1.1, 1]
                        }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-neon-red mix-blend-screen"
                    />

                    {/* Glitch Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: [0, 0.8, 0.3, 0.9, 0],
                            x: [0, -10, 10, -5, 0],
                            y: [0, 5, -5, 10, 0]
                        }}
                        transition={{ duration: 0.6, times: [0, 0.2, 0.4, 0.7, 1] }}
                        className="absolute inset-0"
                        style={{
                            background: `repeating-linear-gradient(
                                0deg,
                                rgba(229, 9, 20, 0.1) 0px,
                                transparent 2px,
                                transparent 4px,
                                rgba(229, 9, 20, 0.1) 6px
                            )`
                        }}
                    />

                    {/* Particle Burst */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    opacity: 1,
                                    scale: 0,
                                    x: 0,
                                    y: 0
                                }}
                                animate={{
                                    opacity: [1, 0],
                                    scale: [0, 1],
                                    x: Math.cos((i / 20) * Math.PI * 2) * 300,
                                    y: Math.sin((i / 20) * Math.PI * 2) * 300
                                }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="absolute w-2 h-2 bg-neon-red rounded-full"
                                style={{
                                    boxShadow: "0 0 10px rgba(229, 9, 20, 0.8)"
                                }}
                            />
                        ))}
                    </div>

                    {/* Screen Distortion */}
                    <motion.div
                        initial={{ scaleX: 1 }}
                        animate={{
                            scaleX: [1, 0.95, 1.05, 0.98, 1],
                            scaleY: [1, 1.05, 0.95, 1.02, 1]
                        }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 border-4 border-neon-red/50"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
