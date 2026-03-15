"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Pin, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

const STATIC_PROJECTS = [
    {
        title: "Resumit",
        category: "Full Stack",
        image: "/projects/resumit.png",
        description: "AI-powered resume platform featuring feedback, scoring, improvement suggestions using LLMs, and a smart template recommendation engine. 200+ resumes analyzed since launch.",
        stack: ["React.js", "Python", "OpenAI API", "Vercel"],
        links: { github: "#", demo: "https://resumit-kappa.vercel.app" }
    },
    {
        title: "Trippy",
        category: "Full Stack",
        image: "/projects/trippy.png",
        description: "A full-stack travel itinerary builder with real-time collaboration, drag-and-drop activity planning, and group trip management features.",
        stack: ["React", "TypeScript", "Tailwind CSS", "Firebase"],
        links: { github: "#", demo: "https://trippy-blond.vercel.app/" }
    },
    {
        title: "Digital Invitation",
        category: "Full Stack",
        image: "/projects/invite.png",
        description: "A digital invitation and event management platform with real-time RSVP tracking and personalized guest experiences.",
        stack: ["React", "TypeScript", "Tailwind CSS", "Firebase"],
        links: { github: "#", demo: "https://invite-client-tan.vercel.app/" }
    },
    {
        title: "Medical Impact Predictor",
        category: "Full Stack",
        description: "ML system predicting hospital stays/costs using 430K+ MIMIC-IV patient records with XGBoost quantile regression.",
        stack: ["Python", "XGBoost", "Flask", "React"],
        links: { github: "#", demo: "#" }
    },
    {
        title: "Instant Tab Screenshot",
        category: "Web Extension",
        description: "Published Chrome extension with 5.0 rating. Multi-mode capture (visible, selection, full-page) with zero-data collection policy.",
        stack: ["JavaScript", "Chrome API", "Manifest V3"],
        links: { github: "#", demo: "https://chromewebstore.google.com/detail/nfjacblekofgmkigcfonfdgabjedkdao" }
    }
];

export default function Projects() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const q = query(collection(db, "projects"), orderBy("display_order", "asc"));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setProjects(STATIC_PROJECTS);
                } else {
                    setProjects(querySnapshot.docs.map(doc => {
                        const p = doc.data();
                        return {
                            ...p,
                            links: { github: p.github_link, demo: p.demo_link }
                        };
                    }));
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
                                className="bg-[#1a1a1a] relative shadow-xl border border-off-white/5 group overflow-hidden"
                            >
                                {/* Pin Effect */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-neon-red drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)] z-20">
                                    <Pin className="w-6 h-6 md:w-8 md:h-8 fill-neon-red" />
                                </div>

                                {/* Project Image Header */}
                                {project.image && (
                                    <div className="relative w-full h-40 md:h-48 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                        <img 
                                            src={project.image} 
                                            alt={project.title} 
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent opacity-60"></div>
                                    </div>
                                )}

                                <div className="p-4 sm:p-6">
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

