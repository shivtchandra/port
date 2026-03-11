"use client";

import { motion } from "framer-motion";
import { Briefcase, ExternalLink, Target, Shield, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const STATIC_MISSIONS = [
    {
        client_name: "Private Client",
        mission_title: "Corporate Portal Alpha",
        description: "Developed a full-stack corporate portal with real-time analytics and encrypted communication channels.",
        services: ["Next.js", "Supabase", "Framer Motion"],
        result_metric: "Reduced latency by 45%",
        link: "#"
    },
    {
        client_name: "Tech Startup",
        mission_title: "AI Asset Manager",
        description: "Built an automated asset management system using GPT-4 for content categorization and tagging.",
        services: ["Python", "React", "OpenAI API"],
        result_metric: "Automated 90% of manual tasks",
        link: "#"
    }
];

export default function Freelance() {
    const [missions, setMissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMissions() {
            if (!supabase) {
                setMissions(STATIC_MISSIONS);
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('freelance_missions')
                    .select('*')
                    .order('display_order', { ascending: true });

                if (error || !data || data.length === 0) {
                    setMissions(STATIC_MISSIONS);
                } else {
                    setMissions(data);
                }
            } catch (e) {
                console.error("Failed to load missions:", e);
                setMissions(STATIC_MISSIONS);
            } finally {
                setLoading(false);
            }
        }

        fetchMissions();
    }, []);

    return (
        <section id="freelance" className="min-h-screen flex items-center justify-center p-4 md:p-8 pt-20 sm:pt-8 relative z-10 transition-all duration-300">
            <div className="max-w-6xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-4 border-b border-neon-red/30 pb-6 md:pb-8"
                >
                    <div>
                        <div className="font-mono text-neon-red text-[8px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] mb-2 sm:mb-4 uppercase text-left">
                            // CONTRACT_HISTORY // EXTERNAL_OPERATIONS
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-7xl font-black uppercase text-off-white tracking-tighter leading-tight sm:leading-none glitch" data-text="MISSION LOGS">
                            MISSION <span className="text-neon-red">LOGS</span>
                        </h2>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="font-mono text-off-white/40 text-[8px] sm:text-[10px] uppercase tracking-widest leading-loose">
                            Classification: LEVEL_V_CONTRACTOR<br />
                            Operational_Status: [AVAILABLE_FOR_HIRE]
                        </p>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-neon-red animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {missions.map((mission, idx) => (
                            <motion.div
                                key={mission.mission_title}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className="group relative bg-black border border-neon-red/20 p-6 md:p-10 hover:border-neon-red/60 transition-all duration-500"
                            >
                                {/* Decorative "Stamp" */}
                                <div className="absolute top-4 right-4 text-neon-red/5 group-hover:text-neon-red/20 transition-colors pointer-events-none">
                                    <Shield className="w-24 h-24 rotate-12" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-neon-red/10 border border-neon-red/30 flex items-center justify-center">
                                            <Target className="w-5 h-5 text-neon-red" />
                                        </div>
                                        <div>
                                            <p className="font-mono text-[10px] text-neon-red/60 uppercase tracking-widest font-bold">Client: {mission.client_name}</p>
                                            <h3 className="text-xl md:text-2xl font-black text-off-white uppercase group-hover:text-neon-red transition-colors">
                                                {mission.mission_title}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <p className="text-off-white/70 font-mono text-sm leading-relaxed border-l-2 border-neon-red/30 pl-4 py-2 italic bg-neon-red/5">
                                            "{mission.description}"
                                        </p>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-neon-red text-[10px] uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
                                                    <Briefcase className="w-3 h-3" /> Services
                                                </p>
                                                <div className="flex flex-wrap gap-2 font-mono text-[10px] text-off-white/50">
                                                    {mission.services.map((service: string) => (
                                                        <span key={service} className="hover:text-off-white transition-colors cursor-default">
                                                            {service}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-neon-red text-[10px] uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
                                                    <Target className="w-3 h-3" /> Result
                                                </p>
                                                <p className="font-mono text-xs text-off-white font-bold">
                                                    {mission.result_metric}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-neon-red/10 flex justify-between items-center">
                                            <div className="flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                                                <div className="w-1.5 h-1.5 rounded-full bg-neon-red animate-pulse" />
                                                <span className="text-[8px] font-mono text-neon-red uppercase tracking-widest">Live_Signal_Confirmed</span>
                                            </div>
                                            {mission.link && mission.link !== '#' && (
                                                <a
                                                    href={mission.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-[10px] font-black uppercase text-neon-red hover:text-white transition-colors bg-neon-red/10 px-3 py-2 border border-neon-red/20 group-hover:border-neon-red/100"
                                                >
                                                    <ExternalLink className="w-3 h-3" /> View_Evidence
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Corner Accents */}
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-red/20 group-hover:border-neon-red/50 transition-colors" />
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-red/20 group-hover:border-neon-red/50 transition-colors" />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
