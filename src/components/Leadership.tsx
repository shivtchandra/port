"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Loader2 } from "lucide-react";

const STATIC_ROLES = [
    {
        role: "External Affairs Manager",
        event: "Shore Fest",
        description: "Managed external communications, vendors, and partnerships for a university fest. Coordinated with multiple stakeholders to ensure seamless execution."
    },
    {
        role: "Food Department In-Charge",
        event: "Gusto Sports Event",
        description: "Coordinated food operations and vendors across a multi-day sports event. Ensured quality control and timely service for thousands of participants."
    }
];

export default function Leadership() {
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLeadership() {
            try {
                const q = query(collection(db, "leadership"), orderBy("display_order", "asc"));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setRoles(STATIC_ROLES);
                } else {
                    setRoles(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                }
            } catch (e) {
                console.error("Failed to load leadership:", e);
                setRoles(STATIC_ROLES);
            } finally {
                setLoading(false);
            }
        }
        fetchLeadership();
    }, []);

    return (
        <section id="leadership" className="min-h-screen flex items-center justify-center p-4 md:p-8 pt-20 sm:pt-8 relative z-10 transition-all duration-300">
            <div className="max-w-5xl w-full">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-center mb-8 md:mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase text-off-white tracking-tighter mb-4 glitch lg:leading-normal leading-tight" data-text="MISSION REPORTS">
                        MISSION <span className="text-neon-red">REPORTS</span>
                    </h2>
                    <p className="font-mono text-off-white/60 tracking-widest text-[8px] sm:text-sm uppercase">
                        // Leadership Logs // Field Operations
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-neon-red animate-spin" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {roles.map((role, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.2 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-black border-2 border-off-white/10 p-6 sm:p-8 relative group overflow-hidden"
                            >
                                {/* Caution Tape Effect */}
                                <div className="absolute -top-2 -left-2 bg-yellow-500 text-black font-black text-[10px] sm:text-xs px-2 sm:px-4 py-0.5 sm:py-1 transform -rotate-3 shadow-lg z-10">
                                    FIELD OP
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold text-off-white mb-2 group-hover:text-neon-red transition-colors">
                                        {role.role}
                                    </h3>
                                    <p className="text-neon-red font-mono text-sm mb-6 tracking-widest border-b border-neon-red/20 pb-2 inline-block">
                                        OPERATION: {role.event.toUpperCase()}
                                    </p>
                                    <p className="text-off-white/70 leading-relaxed font-mono text-sm">
                                        {role.description || role.desc}
                                    </p>
                                </div>

                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#e50914_1px,transparent_1px)] [background-size:16px_16px]"></div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

