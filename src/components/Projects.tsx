"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Pin, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const STATIC_PROJECTS = [
    {
        title: "CivicWatch",
        category: "Community Safety",
        description: "A community crime and civic reporting platform enabling real-time incident tracking and neighborhood safety alerts.",
        stack: ["React", "TypeScript", "Node", "PostgreSQL", "Docker"],
        links: { github: "#", demo: "#" }
    },
    {
        title: "Quizx-Study",
        category: "AI Education",
        description: "Adaptive learning agent using RAG and BKT to generate personalized quizzes and study materials based on user performance.",
        stack: ["Python", "Streamlit", "LangChain", "RAG", "BKT"],
        links: { github: "#", demo: "#" }
    },
    {
        title: "Stock Trend Prediction",
        category: "Financial AI",
        description: "Machine learning model analyzing ESG scores and financial data to predict stock market trends with high accuracy.",
        stack: ["Python", "LSTM", "ML", "Data Analysis"],
        links: { github: "#", demo: "#" }
    }
];

export default function Projects() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            if (!supabase) {
                setProjects(STATIC_PROJECTS);
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .order('display_order', { ascending: true });

                if (error || !data || data.length === 0) {
                    setProjects(STATIC_PROJECTS);
                } else {
                    setProjects(data.map(p => ({
                        ...p,
                        links: { github: p.github_link, demo: p.demo_link }
                    })));
                }
            } catch (e) {
                console.error("Failed to load projects:", e);
                setProjects(STATIC_PROJECTS);
            } finally {
                setLoading(false);
            }
        }

        fetchProjects();
    }, []);

    return (
        <section id="projects" className="min-h-screen flex items-center justify-center p-4 md:p-8 pt-20 sm:pt-8 relative z-10">
            <div className="max-w-7xl w-full">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-center mb-12 md:mb-20"
                >
                    <h2 className="text-3xl md:text-6xl font-black uppercase text-off-white tracking-tighter mb-4 glitch leading-tight" data-text="EXPERIMENTS WALL">
                        EXPERIMENTS <span className="text-neon-red">WALL</span>
                    </h2>
                    <p className="font-mono text-off-white/60 tracking-widest text-[10px] sm:text-sm">
                        // INVESTIGATION BOARD // EVIDENCE LOGS
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-neon-red animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative">
                        {/* Connection Lines (Decorative) */}
                        <div className="absolute top-1/2 left-0 w-full h-px bg-neon-red/20 -rotate-3 pointer-events-none hidden lg:block"></div>
                        <div className="absolute top-1/3 right-0 w-2/3 h-px bg-neon-red/20 rotate-6 pointer-events-none hidden lg:block"></div>

                        {projects.map((project, idx) => (
                            <motion.div
                                key={project.title}
                                initial={{ opacity: 0, y: 50, rotate: idx % 2 === 0 ? 1 : -1 }}
                                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                whileHover={{ scale: 1.02, zIndex: 10 }}
                                className="bg-[#1a1a1a] p-4 sm:p-6 relative shadow-xl border border-off-white/5 group"
                            >
                                {/* Pin Effect */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-neon-red drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">
                                    <Pin className="w-6 h-6 md:w-8 md:h-8 fill-neon-red" />
                                </div>

                                {/* Tape Effect */}
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 md:w-16 h-6 md:h-8 bg-white/10 rotate-2 backdrop-blur-sm"></div>

                                <div className="mt-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="font-mono text-[10px] text-neon-red tracking-widest border border-neon-red/30 px-2 py-1">
                                            {project.category}
                                        </span>
                                    </div>

                                    <h3 className="text-xl md:text-2xl font-black text-off-white mb-3 uppercase group-hover:text-neon-red transition-colors line-clamp-1">
                                        {project.title}
                                    </h3>

                                    <p className="text-off-white/70 font-mono text-xs md:text-sm leading-relaxed mb-6 line-clamp-3">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6 min-h-[60px]">
                                        {project.stack.map((tech: string) => (
                                            <span key={tech} className="text-[10px] text-off-white/50 bg-black/30 px-2 py-1 border border-white/5">
                                                #{tech}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex gap-4 pt-4 border-t border-off-white/10">
                                        {project.links?.github && (
                                            <a href={project.links.github} className="flex items-center gap-2 text-sm font-bold text-off-white hover:text-neon-red transition-colors">
                                                <Github className="w-4 h-4" /> CODE
                                            </a>
                                        )}
                                        {project.links?.demo && (
                                            <a href={project.links.demo} className="flex items-center gap-2 text-sm font-bold text-off-white hover:text-neon-red transition-colors">
                                                <ExternalLink className="w-4 h-4" /> DEMO
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

