"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

const STATIC_CERTS = [
    {
        title: "Core Java",
        issuer: "Coursera",
        cert_id: "CJ-CERT-2024"
    },
    {
        title: "Google Analytics",
        issuer: "Google",
        cert_id: "GA-CERT-2024"
    },
    {
        title: "Data Structures and Algorithms",
        issuer: "Coursera",
        cert_id: "DSA-ADV-2024"
    }
];

export default function Certifications() {
    const [certs, setCerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCerts() {
            try {
                const q = query(collection(db, "certifications"), orderBy("display_order", "asc"));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setCerts(STATIC_CERTS);
                } else {
                    setCerts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                }
            } catch (e) {
                console.error("Failed to load certifications:", e);
                setCerts(STATIC_CERTS);
            } finally {
                setLoading(false);
            }
        }
        fetchCerts();
    }, []);

    return (
        <section id="certifications" className="min-h-screen flex items-center justify-center p-4 md:p-8 pt-20 sm:pt-8 relative z-10 transition-all duration-300">
            <div className="max-w-6xl w-full">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-center mb-10 md:mb-16"
                >
                    <h2 className="text-3xl md:text-6xl font-black uppercase text-off-white tracking-tighter mb-4 glitch lg:leading-normal leading-tight" data-text="ACCESS CARDS">
                        ACCESS <span className="text-neon-red">CARDS</span>
                    </h2>
                    <p className="font-mono text-off-white/60 tracking-widest text-[8px] sm:text-sm uppercase">
                        // Security Clearance // Authorized Personnel
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-neon-red animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                                        <span className="font-mono text-[10px] tracking-widest font-bold">ID: {cert.cert_id || cert.id}</span>
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
                )}
            </div>
        </section>
    );
}

