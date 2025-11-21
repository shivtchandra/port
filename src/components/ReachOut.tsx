"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin } from "lucide-react";

export default function ReachOut() {
    return (
        <section
            id="reach-out"
            className="min-h-[50vh] flex items-center justify-center p-8 relative z-10 bg-gradient-to-b from-black via-red-950/10 to-black"
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="max-w-3xl w-full text-center"
            >
                {/* Heading */}
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-neon-red mb-4 glitch" data-text="Reach Out From This Side">
                    Reach Out From This Side
                </h2>

                {/* Description */}
                <p className="text-off-white/70 font-mono text-sm md:text-base mb-8 tracking-wide">
                    Got an idea, a role, or a collaboration? Drop me a line.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {/* Email Button */}
                    <motion.a
                        href="mailto:shivachandra9490@gmail.com"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative px-6 py-4 border-2 border-neon-red bg-black/50 hover:bg-neon-red/10 transition-all duration-300 w-full sm:w-auto perspective-1000"
                        style={{
                            transformStyle: 'preserve-3d',
                        }}
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            const centerX = rect.width / 2;
                            const centerY = rect.height / 2;
                            const rotateX = (y - centerY) / 15;
                            const rotateY = (centerX - x) / 15;
                            e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
                        }}
                    >
                        <div className="flex items-center gap-3 justify-center">
                            <Mail className="w-5 h-5 text-neon-red group-hover:animate-pulse" />
                            <span className="text-off-white font-bold tracking-widest uppercase text-sm">
                                Email Me
                            </span>
                        </div>
                        {/* Red glow effect */}
                        <div className="absolute inset-0 border-2 border-neon-red opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 pointer-events-none" />
                    </motion.a>

                    {/* LinkedIn Button */}
                    <motion.a
                        href="https://www.linkedin.com/in/shiva-chandra-takkelapati-10ba3032b/"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative px-6 py-4 border-2 border-off-white/30 bg-black/50 hover:border-neon-red hover:bg-neon-red/10 transition-all duration-300 w-full sm:w-auto perspective-1000"
                        style={{
                            transformStyle: 'preserve-3d',
                        }}
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            const centerX = rect.width / 2;
                            const centerY = rect.height / 2;
                            const rotateX = (y - centerY) / 15;
                            const rotateY = (centerX - x) / 15;
                            e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
                        }}
                    >
                        <div className="flex items-center gap-3 justify-center">
                            <Linkedin className="w-5 h-5 text-off-white group-hover:text-neon-red transition-colors" />
                            <span className="text-off-white font-bold tracking-widest uppercase text-sm group-hover:text-neon-red transition-colors">
                                Connect on LinkedIn
                            </span>
                        </div>
                        {/* Red glow effect */}
                        <div className="absolute inset-0 border-2 border-neon-red opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 pointer-events-none" />
                    </motion.a>
                </div>

                {/* Decorative Line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="mt-12 h-px bg-gradient-to-r from-transparent via-neon-red to-transparent"
                />
            </motion.div>
        </section>
    );
}
