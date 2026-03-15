"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronDown, FileText, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

const STATIC_EXPERIENCES = [
    {
        id: "EXP-001",
        role: "Multicloud Engineer Associate",
        company: "Cognizant",
        period: "Feb 2026 – Present",
        description: "Undergoing structured multicloud training covering AWS, Azure, and GCP as part of the Multicloud Engineer track.",
        tech: ["AWS", "Azure", "GCP", "Cloud Infrastructure"]
    },
    {
        id: "EXP-002",
        role: "Freelance Full-Stack Developer",
        company: "Self-Employed",
        period: "Dec 2025 - Feb 2026",
        description: "Designed and delivered two production-grade platforms: CyberSecurityTrain (LMS with Razorpay) and TheCyberSeal (B2B portal). Managed end-to-end development from requirements to live deployment.",
        tech: ["React 18", "Next.js 15", "Firebase", "Supabase", "Razorpay", "jsPDF"]
    },
    {
        id: "EXP-003",
        role: "AI / Full-Stack Automation Intern",
        company: "Callus",
        period: "Oct 2025 - Dec 2025",
        description: "Automated SEO research workflows. Built AI-driven keyword analysis, competitor scraping, and RAG-based document querying by converting n8n workflows into a FastAPI/React application.",
        tech: ["FastAPI", "Python", "React", "OpenAI", "Pinecone", "n8n"]
    },
    {
        id: "EXP-004",
        role: "Technical Intern",
        company: "Getto",
        period: "July 2025 - Oct 2025",
        description: "Enhanced vendor panel UI/workflows. Specialized in product management streamlining and database interaction optimization in an Agile environment.",
        tech: ["React.js", "Express.js", "Node.js", "PostgreSQL", "Docker"]
    },
    {
        id: "EXP-005",
        role: "Machine Learning Intern",
        company: "Tuzen Tech Solutions",
        period: "May 2024 - July 2024",
        description: "Developed ML solution for counterfeit currency detection. Built preprocessing pipeline and trained models with TensorFlow, achieving 95%+ accuracy.",
        tech: ["TensorFlow", "Python", "ML", "Computer Vision"]
    },
    {
        id: "EXP-006",
        role: "Academic Support Volunteer",
        company: "Make A Difference (MAD)",
        period: "March 2025 - Present",
        description: "Providing academic mentoring and personalized support to underprivileged students to bridge foundational learning gaps.",
        tech: ["Mentorship", "Education", "Social Impact"]
    }
];

export default function Experience() {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [experiences, setExperiences] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchExperience() {
            try {
                const q = query(collection(db, "experience"), orderBy("display_order", "asc"));
                const querySnapshot = await getDocs(q);
                
                if (querySnapshot.empty) {
                    setExperiences(STATIC_EXPERIENCES);
                } else {
                    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setExperiences(data);
                }
            } catch (e) {
                console.error("Failed to load experience:", e);
                setExperiences(STATIC_EXPERIENCES);
            } finally {
                setLoading(false);
            }
        }
        fetchExperience();
    }, []);

    return (
        <section id="experience" className="min-h-screen flex items-center justify-center p-4 md:p-8 pt-20 sm:pt-8 relative z-10">
            <div className="max-w-4xl w-full">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-center mb-10 md:mb-16"
                >
                    <h2 className="text-3xl md:text-6xl font-black uppercase text-off-white tracking-tighter mb-4 glitch leading-tight" data-text="LAB EXPERIMENT FILES">
                        LAB <span className="text-neon-red">EXPERIMENT FILES</span>
                    </h2>
                    <p className="font-mono text-off-white/60 tracking-widest text-[10px] sm:text-sm">
                        // CLASSIFIED RECORDS // AUTHORIZED PERSONNEL ONLY
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-neon-red animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {experiences.map((exp) => (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className={`border ${expandedId === exp.id ? 'border-neon-red bg-neon-red/5' : 'border-off-white/20 bg-black/60'} backdrop-blur-sm overflow-hidden transition-colors duration-300`}
                            >
                                <button
                                    onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                                    className="w-full flex items-center justify-between p-4 md:p-6 text-left group"
                                >
                                    <div className="flex items-start md:items-center gap-4">
                                        <div className={`mt-1 md:mt-0 p-2 rounded border ${expandedId === exp.id ? 'border-neon-red text-neon-red' : 'border-off-white/20 text-off-white/50'} group-hover:border-neon-red group-hover:text-neon-red transition-colors flex-shrink-0`}>
                                            <FileText className="w-4 h-4 md:w-5 md:h-5" />
                                        </div>
                                        <div>
                                            <div className="font-mono text-[10px] text-off-white/50 mb-1 flex flex-wrap gap-2">
                                                <span>{exp.id}</span>
                                                <span className="text-neon-red">// {exp.period}</span>
                                            </div>
                                            <h3 className="text-sm md:text-xl font-bold text-off-white group-hover:text-neon-red transition-colors leading-tight">
                                                {exp.role} <br className="md:hidden" />
                                                <span className="text-off-white/60 md:ml-2">@ {exp.company}</span>
                                            </h3>
                                        </div>
                                    </div>
                                    <ChevronDown
                                        className={`w-4 h-4 md:w-5 md:h-5 text-off-white/50 transition-transform duration-300 flex-shrink-0 ${expandedId === exp.id ? 'rotate-180 text-neon-red' : ''}`}
                                    />
                                </button>

                                <AnimatePresence>
                                    {expandedId === exp.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="px-6 pb-6 pt-0 border-t border-neon-red/20 mt-2">
                                                <div className="pt-4 font-mono text-off-white/80 leading-relaxed text-xs sm:text-sm">
                                                    {exp.description}
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    {exp.tech.map((t: string) => (
                                                        <span key={t} className="text-xs font-mono px-2 py-1 bg-neon-red/10 text-neon-red border border-neon-red/20">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

