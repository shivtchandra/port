"use client";

import { motion } from "framer-motion";

export default function About() {
    return (
        <section id="about" className="min-h-screen flex items-center justify-center p-8 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="max-w-5xl w-full bg-black/90 border border-off-white/10 p-8 md:p-12 relative overflow-hidden backdrop-blur-sm"
            >
                {/* "Classified" Stamp */}
                <motion.div
                    initial={{ opacity: 0, scale: 2, rotate: 45 }}
                    whileInView={{ opacity: 0.5, scale: 1, rotate: 12 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="absolute top-8 right-8 border-4 border-neon-red text-neon-red px-6 py-2 font-black text-2xl tracking-widest pointer-events-none z-20"
                >
                    CONFIDENTIAL
                </motion.div>

                {/* Header Info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-neon-red/30 pb-6 mb-8 gap-4">
                    <div>
                        <div className="font-mono text-neon-red text-xs tracking-widest mb-2">
                            // DOSSIER_ID: SC-2025 // LEVEL_IV_ACCESS
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase text-off-white tracking-tighter glitch" data-text="SUBJECT: SHIVA CHANDRA">
                            SUBJECT: <span className="text-neon-red">SHIVA CHANDRA</span>
                        </h2>
                    </div>
                    <div className="font-mono text-off-white/50 text-xs text-right">
                        STATUS: ACTIVE<br />
                        CLEARANCE: TOP SECRET
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    {/* Personal Stats */}
                    <div className="md:col-span-1 space-y-6 font-mono text-sm">
                        <div className="group">
                            <p className="text-neon-red text-xs tracking-widest mb-1">LOCATION</p>
                            <p className="text-off-white border-l-2 border-neon-red/50 pl-3 group-hover:bg-neon-red/5 transition-colors py-1">
                                Hyderabad, India
                            </p>
                        </div>
                        <div className="group">
                            <p className="text-neon-red text-xs tracking-widest mb-1">EDUCATION</p>
                            <div className="text-off-white border-l-2 border-neon-red/50 pl-3 group-hover:bg-neon-red/5 transition-colors py-1">
                                <p className="font-bold">B.E. in CSE (2021–2025)</p>
                                <p className="text-off-white/70">GITAM University</p>
                            </div>
                        </div>
                        <div className="group">
                            <p className="text-neon-red text-xs tracking-widest mb-1">SPECIALIZATION</p>
                            <ul className="text-off-white border-l-2 border-neon-red/50 pl-3 group-hover:bg-neon-red/5 transition-colors py-1 space-y-1">
                                <li>Front-End Craft</li>
                                <li>AI Applications</li>
                                <li>Full-Stack Exp.</li>
                                <li>Design-to-Code</li>
                            </ul>
                        </div>
                    </div>

                    {/* Main Content with Redacted Effect */}
                    <div className="md:col-span-2 relative font-mono text-off-white/80 leading-relaxed space-y-6">
                        <p>
                            <span className="bg-off-white/10 px-1">OBSERVATION LOG:</span> Subject demonstrates exceptional capability in bridging the gap between
                            <span className="text-neon-red font-bold mx-1">creative design</span> and
                            <span className="text-neon-red font-bold mx-1">technical implementation</span>.
                        </p>

                        <p>
                            Primary objective involves the construction of immersive digital experiences.
                            <span className="bg-black text-black hover:bg-transparent hover:text-off-white/50 transition-colors duration-300 cursor-help select-none mx-1 px-1 relative group">
                                <span className="absolute inset-0 bg-off-white/20 animate-pulse group-hover:hidden"></span>
                                [REDACTED DATA]
                            </span>
                            utilizing advanced frameworks like Next.js and React.
                        </p>

                        <p>
                            Recent surveillance indicates heavy experimentation with
                            <span className="border-b border-neon-red text-off-white mx-1">Generative AI agents</span>
                            and Large Language Models. Subject appears to be tuning into frequencies
                            that allow for the rapid deployment of intelligent interfaces.
                        </p>

                        <div className="bg-neon-red/5 border border-neon-red/20 p-4 mt-6">
                            <p className="text-neon-red text-xs tracking-widest mb-2">&gt;&gt; CURRENT MISSION STATUS</p>
                            <p>
                                Actively seeking collaboration on high-impact projects.
                                Ready for deployment in Front-End or Full-Stack roles.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-4 right-4 w-24 h-24 border-r-2 border-b-2 border-neon-red/20"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 border-l-2 border-b-2 border-neon-red/20"></div>
            </motion.div>
        </section>
    );
}
