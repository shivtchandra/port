"use client";

import { useState } from "react";

export default function VHSEffect() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-40">
            {/* VHS Scan Lines */}
            <div className="absolute inset-0 vhs-scanlines opacity-30" />

            {/* VHS Noise */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    animation: "noise 0.2s infinite"
                }}
            />

            {/* Red Vignette */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    background: "radial-gradient(circle, transparent 50%, rgba(229, 9, 20, 0.3) 100%)"
                }}
            />

            {/* Toggle Button */}
            <button
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 pointer-events-auto text-xs font-mono text-off-white/50 hover:text-neon-red transition-colors"
            >
                [DISABLE VHS]
            </button>

            <style jsx>{`
                @keyframes noise {
                    0%, 100% { transform: translate(0, 0); }
                    10% { transform: translate(-5%, -5%); }
                    20% { transform: translate(-10%, 5%); }
                    30% { transform: translate(5%, -10%); }
                    40% { transform: translate(-5%, 15%); }
                    50% { transform: translate(-10%, 5%); }
                    60% { transform: translate(15%, 0); }
                    70% { transform: translate(0, 10%); }
                    80% { transform: translate(-15%, 0); }
                    90% { transform: translate(10%, 5%); }
                }
            `}</style>
        </div>
    );
}
