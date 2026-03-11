"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const STATIC_SKILLS = [
    {
        title: "PROGRAMMING",
        skills: ["Java", "Python", "JavaScript", "TypeScript"]
    },
    {
        title: "AI / ML CORE",
        skills: ["Neural Networks", "Deep Learning", "NLP", "LLMs", "LangChain", "RAG", "TensorFlow", "PyTorch"]
    },
    {
        title: "DATA SCIENCE",
        skills: ["Scikit-learn", "NumPy", "Pandas"]
    },
    {
        title: "FRONTEND",
        skills: ["React.js", "HTML5", "CSS3", "Tailwind"]
    },
    {
        title: "BACKEND",
        skills: ["Node.js", "Express.js", "Prisma ORM"]
    },
    {
        title: "INFRASTRUCTURE",
        skills: ["PostgreSQL", "MySQL", "Docker", "Git", "Vercel", "Hugging Face"]
    }
];

export default function Skills() {
    const [skillCategories, setSkillCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSkills() {
            if (!supabase) {
                setSkillCategories(STATIC_SKILLS);
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('skills')
                    .select('*')
                    .order('display_order', { ascending: true });

                if (error || !data || data.length === 0) {
                    setSkillCategories(STATIC_SKILLS);
                } else {
                    setSkillCategories(data.map(d => ({
                        title: d.category_title,
                        skills: d.skills_list
                    })));
                }
            } catch (e) {
                console.error("Failed to load skills:", e);
                setSkillCategories(STATIC_SKILLS);
            } finally {
                setLoading(false);
            }
        }
        fetchSkills();
    }, []);

    return (
        <section id="skills" className="min-h-screen flex items-center justify-center p-4 md:p-8 pt-20 sm:pt-8 relative z-10">
            <div className="max-w-6xl w-full">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8 md:mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase text-off-white tracking-tighter mb-4 glitch lg:leading-normal leading-tight" data-text="NEURAL POWER GRID">
                        NEURAL <span className="text-neon-red">POWER GRID</span>
                    </h2>
                    <div className="h-1 w-12 md:w-24 bg-neon-red mx-auto shadow-[0_0_10px_rgba(229,9,20,0.8)]"></div>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-neon-red animate-spin" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {skillCategories.map((category, idx) => (
                            <motion.div
                                key={category.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="bg-black/80 border border-off-white/10 p-6 hover:border-neon-red/50 transition-colors duration-300 group"
                            >
                                <h3 className="text-neon-red font-mono text-lg tracking-widest mb-6 border-b border-off-white/10 pb-2 group-hover:border-neon-red/30 transition-colors">
                                    {category.title}
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {category.skills.map((skill: string) => (
                                        <motion.span
                                            key={skill}
                                            whileHover={{ scale: 1.05, backgroundColor: "rgba(229, 9, 20, 0.2)" }}
                                            className="px-3 py-1 bg-off-white/5 text-off-white/80 text-sm font-mono border border-transparent hover:border-neon-red/50 hover:text-white transition-all duration-200 cursor-default relative overflow-hidden"
                                        >
                                            {skill}
                                            <span className="absolute inset-0 bg-neon-red/10 transform translate-y-full hover:translate-y-0 transition-transform duration-200"></span>
                                        </motion.span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

