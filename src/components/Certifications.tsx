"use client";

import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";

const certs = [
    {
        title: "Core Java",
        issuer: "Coursera",
        id: "CJ-2023-X"
    },
    {
        title: "Google Analytics",
        issuer: "Google",
        id: "GA-CERT-01"
    },
    {
        title: "Data Structures",
        issuer: "Coursera",
        id: "DSA-ADV-99"
    },
    {
        title: "Digital Transformation",
        issuer: "IIM Ahmedabad",
        id: "IIM-DT-2024"
    }
];

export default function Certifications() {
    return (
        <section id="certifications" className="min-h-screen flex items-center justify-center p-8 relative z-10">
            <div className="max-w-6xl w-full">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-black uppercase text-off-white tracking-tighter mb-4 glitch" data-text="ACCESS CARDS">
                        ACCESS <span className="text-neon-red">CARDS</span>
                    </h2>
                    <p className="font-mono text-off-white/60 tracking-widest text-sm">
                        // SECURITY CLEARANCE // AUTHORIZED PERSONNEL
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {certs.map((cert, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.05, rotateY: 10 }}
                            className="bg-off-white text-black p-4 rounded-lg shadow-lg relative overflow-hidden group perspective-1000"
                        >
                            {/* Lanyard Hole */}
                            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-black/20 rounded-full"></div>

                            <div className="mt-4 flex flex-col items-center text-center relative z-10">
                                <div className="w-16 h-16 bg-gray-200 rounded-full mb-4 border-2 border-neon-red flex items-center justify-center">
                                    <BadgeCheck className="w-8 h-8 text-neon-red" />
                                </div>
                                <h3 className="font-black text-sm uppercase leading-tight mb-1">{cert.title}</h3>
                                <p className="font-mono text-xs text-red-600 mb-3">{cert.issuer}</p>

                                <div className="w-full h-8 bg-black/10 mt-2 flex items-center justify-center border border-black/5">
                                    <span className="font-mono text-[10px] tracking-widest font-bold">ID: {cert.id}</span>
                                </div>

                                {/* Barcode Simulation */}
                                <div className="mt-3 flex gap-[2px] h-4 opacity-50">
                                    {[...Array(20)].map((_, j) => (
                                        <div key={j} className="w-[2px] bg-black" style={{ height: Math.random() * 100 + '%' }}></div>
                                    ))}
                                </div>
                            </div>

                            {/* Holographic Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                            {/* Red Glow Border */}
                            <div className="absolute inset-0 border-2 border-neon-red opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
