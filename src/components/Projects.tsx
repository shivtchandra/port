"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Pin } from "lucide-react";

const projects = [
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
    return (
        <section id="projects" className="min-h-screen flex items-center justify-center p-8 relative z-10">
            <div className="max-w-7xl w-full">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-black uppercase text-off-white tracking-tighter mb-4 glitch" data-text="EXPERIMENTS WALL">
                        EXPERIMENTS <span className="text-neon-red">WALL</span>
                    </h2>
                    <p className="font-mono text-off-white/60 tracking-widest text-sm">
                        // INVESTIGATION BOARD // EVIDENCE LOGS
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
                    {/* Connection Lines (Decorative) */}
                    <div className="absolute top-1/2 left-0 w-full h-px bg-neon-red/20 -rotate-3 pointer-events-none hidden lg:block"></div>
                    <div className="absolute top-1/3 right-0 w-2/3 h-px bg-neon-red/20 rotate-6 pointer-events-none hidden lg:block"></div>

                    {projects.map((project, idx) => (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 50, rotate: Math.random() * 4 - 2 }}
                            whileInView={{ opacity: 1, y: 0, rotate: Math.random() * 2 - 1 }}
                            transition={{ duration: 0.5, delay: idx * 0.2 }}
                            whileHover={{ scale: 1.02, rotate: 0, zIndex: 10 }}
                            className="bg-[#1a1a1a] p-6 relative shadow-xl border border-off-white/5 group"
                        >
                            {/* Pin Effect */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-neon-red drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">
                                <Pin className="w-8 h-8 fill-neon-red" />
                            </div>

                            {/* Tape Effect */}
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-8 bg-white/10 rotate-2 backdrop-blur-sm"></div>

                            <div className="mt-4">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="font-mono text-xs text-neon-red tracking-widest border border-neon-red/30 px-2 py-1">
                                        {project.category}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black text-off-white mb-3 uppercase group-hover:text-neon-red transition-colors">
                                    {project.title}
                                </h3>

                                <p className="text-off-white/70 font-mono text-sm leading-relaxed mb-6">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.stack.map((tech) => (
                                        <span key={tech} className="text-xs text-off-white/50 bg-black/30 px-2 py-1">
                                            #{tech}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-off-white/10">
                                    <a href={project.links.github} className="flex items-center gap-2 text-sm font-bold text-off-white hover:text-neon-red transition-colors">
                                        <Github className="w-4 h-4" /> CODE
                                    </a>
                                    <a href={project.links.demo} className="flex items-center gap-2 text-sm font-bold text-off-white hover:text-neon-red transition-colors">
                                        <ExternalLink className="w-4 h-4" /> DEMO
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
