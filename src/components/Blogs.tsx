"use client";

import { motion } from "framer-motion";
import { ExternalLink, Radio, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

const STATIC_BLOGS = [
    {
        title: "Understanding Large Language Models",
        date: "2024-03-15",
        preview: "A deep dive into the architecture of transformers and how they are reshaping the landscape of artificial intelligence...",
        link: "https://medium.com/@shivachandra9490"
    },
    {
        title: "The Future of Generative AI",
        date: "2024-02-20",
        preview: "Exploring the potential applications and ethical considerations of the next generation of AI models...",
        link: "https://medium.com/@shivachandra9490"
    }
];

export default function Blogs() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBlogs() {
            try {
                const q = query(collection(db, "blogs"), orderBy("display_order", "asc"));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setBlogs(STATIC_BLOGS);
                } else {
                    setBlogs(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                }
            } catch (e) {
                console.error("Failed to load blogs:", e);
                setBlogs(STATIC_BLOGS);
            } finally {
                setLoading(false);
            }
        }
        fetchBlogs();
    }, []);

    return (
        <section id="blogs" className="min-h-screen flex items-center justify-center p-4 md:p-8 pt-20 sm:pt-10 mb-20 relative z-10 transition-all duration-300">
            <div className="max-w-4xl w-full">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-center mb-8 md:mb-16"
                >
                    <h2 className="text-3xl md:text-6xl font-black uppercase text-off-white tracking-tighter mb-4 glitch lg:leading-normal leading-tight" data-text="MEDIUM FIELD NOTES">
                        MEDIUM <span className="text-neon-red">FIELD NOTES</span>
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-neon-red animate-pulse">
                        <Radio className="w-4 h-4" />
                        <span className="font-mono text-[10px] md:text-xs tracking-widest uppercase">Incoming Transmission...</span>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-neon-red animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-8">
                        {blogs.map((blog, i) => (
                            <motion.a
                                key={i}
                                href={blog.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.2 }}
                                className="block bg-black/80 border-l-4 border-neon-red p-6 relative overflow-hidden group hover:bg-neon-red/5 transition-colors duration-300"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                                    <ExternalLink className="w-6 h-6 text-neon-red" />
                                </div>

                                <div className="font-mono text-neon-red text-xs mb-2 tracking-widest">
                                    // LOG_DATE: {blog.date}
                                </div>

                                <h3 className="text-2xl font-bold text-off-white mb-3 group-hover:text-neon-red transition-colors duration-300">
                                    {blog.title}
                                </h3>

                                <p className="text-off-white/70 font-mono text-sm leading-relaxed max-w-2xl">
                                    {blog.preview}
                                </p>

                                {/* Scanline effect on hover */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-red/5 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 pointer-events-none"></div>
                            </motion.a>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

