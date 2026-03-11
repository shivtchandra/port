"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function About() {
    const [settings, setSettings] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSettings() {
            if (!supabase) {
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('site_settings')
                    .select('content')
                    .eq('id', 'about')
                    .single();

                if (!error && data) {
                    setSettings(data.content);
                }
            } catch (e) {
                console.error("Failed to load settings:", e);
            } finally {
                setLoading(false);
            }
        }
        fetchSettings();
    }, []);

    if (loading) {
        return (
            <section id="about" className="min-h-screen flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 text-neon-red animate-spin" />
            </section>
        );
    }

    const bio = settings.bio || "Subject demonstrates exceptional capability in bridging the gap between creative design and technical implementation.";
    const location = settings.location || "Hyderabad, India";
    const education_title = settings.education_title || "B.E. in CSE (2021–2025)";
    const education_school = settings.education_school || "GITAM University";
    const specializations = settings.specializations || ["Front-End Craft", "AI Applications", "Full-Stack Exp.", "Design-to-Code"];
    const mission = settings.mission || "Actively seeking collaboration on high-impact projects. Ready for deployment in Front-End or Full-Stack roles.";

    return (
        <section id="about" className="min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-8 pt-20 sm:pt-4 relative z-10 transition-all duration-300">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="max-w-5xl w-full bg-black/90 border border-off-white/10 p-4 sm:p-6 md:p-12 relative overflow-hidden backdrop-blur-sm"
            >
                {/* "Classified" Stamp */}
                <motion.div
                    initial={{ opacity: 0, scale: 2, rotate: 45 }}
                    whileInView={{ opacity: 0.15, scale: 1, rotate: -8 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 md:border-4 border-neon-red text-neon-red px-2 py-0.5 md:px-6 md:py-2 font-black text-[14px] sm:text-2xl md:text-4xl tracking-[0.5em] pointer-events-none z-0 opacity-10 md:opacity-20 select-none"
                >
                    CONFIDENTIAL
                </motion.div>

                {/* Header Info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-neon-red/30 pb-4 md:pb-6 mb-6 md:mb-8 gap-3 md:gap-4 relative z-10">
                    <div>
                        <div className="font-mono text-neon-red text-[7px] md:text-xs tracking-widest mb-1 md:mb-2 italic">
                            // DOSSIER_ID: SC-2025 // ACCESS_GRANTED
                        </div>
                        <h2 className="text-xl sm:text-2xl md:text-6xl font-black uppercase text-off-white tracking-tighter glitch leading-tight" data-text="SUBJECT: SHIVA CHANDRA">
                            SUBJECT: <span className="text-neon-red">SHIVA CHANDRA</span>
                        </h2>
                    </div>
                    <div className="font-mono text-off-white/50 text-[7px] md:text-xs text-left md:text-right">
                        STATUS: ACTIVE<br />
                        CLEARANCE: TOP SECRET
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {/* Personal Stats */}
                    <div className="md:col-span-1 space-y-6 font-mono text-sm order-2 md:order-1">
                        <div className="group">
                            <p className="text-neon-red text-xs tracking-widest mb-1">LOCATION</p>
                            <p className="text-off-white border-l-2 border-neon-red/50 pl-3 group-hover:bg-neon-red/5 transition-colors py-1">
                                {location}
                            </p>
                        </div>
                        <div className="group">
                            <p className="text-neon-red text-xs tracking-widest mb-1">EDUCATION</p>
                            <div className="text-off-white border-l-2 border-neon-red/50 pl-3 group-hover:bg-neon-red/5 transition-colors py-1">
                                <p className="font-bold text-xs md:text-sm">{education_title}</p>
                                <p className="text-off-white/70 text-xs">{education_school}</p>
                            </div>
                        </div>
                        <div className="group">
                            <p className="text-neon-red text-xs tracking-widest mb-1">SPECIALIZATION</p>
                            <ul className="text-off-white border-l-2 border-neon-red/50 pl-3 group-hover:bg-neon-red/5 transition-colors py-1 space-y-1 text-xs md:text-sm">
                                {specializations.map((spec: string) => (
                                    <li key={spec}>{spec}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Main Content with Redacted Effect */}
                    <div className="md:col-span-2 relative font-mono text-off-white/80 leading-relaxed space-y-6 order-1 md:order-2">
                        <div className="whitespace-pre-wrap text-sm md:text-base">
                            {bio}
                        </div>

                        <div className="bg-neon-red/5 border border-neon-red/20 p-4 mt-6">
                            <p className="text-neon-red text-[10px] md:text-xs tracking-widest mb-2 leading-tight">&gt;&gt; CURRENT MISSION STATUS</p>
                            <p className="text-xs md:text-sm">
                                {mission}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-4 right-4 w-12 md:w-24 h-12 md:h-24 border-r-2 border-b-2 border-neon-red/20"></div>
                <div className="absolute bottom-4 left-4 w-12 md:w-24 h-12 md:h-24 border-l-2 border-b-2 border-neon-red/20"></div>
            </motion.div>
        </section>
    );
}

