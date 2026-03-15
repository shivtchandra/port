"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Mail, Linkedin, Github, Twitter, ExternalLink, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function Contact() {
    const [input, setInput] = useState("");
    const [glitch, setGlitch] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInput(val);
        if (val === "ENTER_THE_UPSIDE_DOWN") {
            setGlitch(true);
            setTimeout(() => {
                setGlitch(false);
                setInput("");
                alert("WELCOME TO THE UPSIDE DOWN");
            }, 500);
        }
    };

    const handleTransmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('idle');

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const message = formData.get('message') as string;

        try {
            await addDoc(collection(db, "transmissions"), {
                name,
                email,
                message,
                timestamp: serverTimestamp()
            });

            setStatus('success');
            (e.target as HTMLFormElement).reset();

            const mailtoUrl = `mailto:shivachandra9490@gmail.com?subject=Transmission from ${name}&body=${message} (Contact: ${email})`;
            console.log("Transmission saved to Firebase. Link ready:", mailtoUrl);

        } catch (err) {
            console.error("Transmission failed:", err);
            setStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className={`min-h-screen flex flex-col items-center justify-center p-3 sm:p-4 md:p-8 pt-20 sm:pt-10 relative z-10 vhs-scanlines transition-all duration-300 ${glitch ? 'invert' : ''}`}>
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl md:text-6xl font-black uppercase mb-6 md:mb-12 text-off-white tracking-tighter text-glow flicker glitch leading-tight text-center"
                data-text="PORTAL TERMINAL"
            >
                PORTAL <span className="text-neon-red">TERMINAL</span>
            </motion.h2>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl bg-black border-2 border-neon-red/50 p-4 sm:p-6 rounded-lg shadow-[0_0_20px_rgba(229,9,20,0.2)] font-mono red-glow-border glitch-in overflow-hidden"
            >
                <div className="flex items-center gap-2 mb-4 md:mb-6 border-b border-neon-red/20 pb-4">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                    <span className="ml-auto text-neon-red text-[8px] sm:text-xs tracking-[0.2em] sm:tracking-widest">COMM_UPLINK_V4.0</span>
                </div>

                <div className="space-y-1 sm:space-y-2 text-green-500 text-[10px] sm:text-sm mb-6 sm:mb-8 font-mono">
                    <p className="typing-effect">{">"} establishing_connection...</p>
                    <p className="typing-effect delay-1000 hidden sm:block">{">"} channel_open</p>
                    <p className="typing-effect delay-2000">{status === 'success' ? "> transmission_received" : "> awaiting_input..."}</p>
                    {status === 'error' && <p className="text-neon-red">{">"} signal_interference_detected. retry_transmission.</p>}
                </div>

                <form
                    className="space-y-6"
                    onSubmit={handleTransmit}
                >
                    <div>
                        <label className="block text-neon-red text-xs uppercase tracking-widest mb-2">Identity</label>
                        <input name="name" id="name" type="text" required className="w-full bg-black border border-neon-red/30 p-3 text-off-white focus:border-neon-red focus:outline-none transition-colors font-mono" placeholder="ENTER NAME" />
                    </div>
                    <div>
                        <label className="block text-neon-red text-xs uppercase tracking-widest mb-2">Frequency</label>
                        <input name="email" id="email" type="email" required className="w-full bg-black border border-neon-red/30 p-3 text-off-white focus:border-neon-red focus:outline-none transition-colors font-mono" placeholder="ENTER EMAIL" />
                    </div>
                    <div>
                        <label className="block text-neon-red text-xs uppercase tracking-widest mb-2">Transmission</label>
                        <textarea name="message" id="message" rows={4} required className="w-full bg-black border border-neon-red/30 p-3 text-off-white focus:border-neon-red focus:outline-none transition-colors font-mono" placeholder="ENTER MESSAGE"></textarea>
                    </div>

                    {/* Easter Egg Input */}
                    <div className="pt-4 border-t border-neon-red/20">
                        <input
                            type="text"
                            value={input}
                            onChange={handleInput}
                            className="w-full bg-transparent text-center text-xs text-off-white/30 focus:text-neon-red focus:outline-none uppercase tracking-widest font-mono"
                            placeholder="> ENTER_COMMAND"
                        />
                    </div>

                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full bg-neon-red text-black font-bold uppercase py-4 tracking-widest hover:bg-red-600 transition-colors relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : status === 'success' ? (
                                <CheckCircle2 className="w-5 h-5" />
                            ) : (
                                "Transmit Signal"
                            )}
                        </span>
                        <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    </button>
                </form>

                {/* Social Links / Reach Out Options */}
                <div className="mt-8 pt-8 border-t border-neon-red/20">
                    <p className="text-neon-red text-xs uppercase tracking-widest mb-4 text-center">
                        {">"} Alternative_Channels
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Email */}
                        <a
                            href="mailto:shivachandra9490@gmail.com"
                            className="group flex items-center gap-2 bg-black border border-neon-red/30 p-3 hover:border-neon-red hover:bg-neon-red/10 transition-all duration-300"
                        >
                            <Mail className="w-4 h-4 text-neon-red group-hover:scale-110 transition-transform" />
                            <span className="text-off-white text-xs uppercase tracking-wider font-mono">Email</span>
                            <ExternalLink className="w-3 h-3 text-neon-red/50 ml-auto" />
                        </a>

                        {/* LinkedIn */}
                        <a
                            href="https://www.linkedin.com/in/shiva-chandra-takkelapati-10ba3032b/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 bg-black border border-neon-red/30 p-3 hover:border-neon-red hover:bg-neon-red/10 transition-all duration-300"
                        >
                            <Linkedin className="w-4 h-4 text-neon-red group-hover:scale-110 transition-transform" />
                            <span className="text-off-white text-xs uppercase tracking-wider font-mono">LinkedIn</span>
                            <ExternalLink className="w-3 h-3 text-neon-red/50 ml-auto" />
                        </a>

                        {/* GitHub */}
                        <a
                            href="https://github.com/shivtchandra"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 bg-black border border-neon-red/30 p-3 hover:border-neon-red hover:bg-neon-red/10 transition-all duration-300"
                        >
                            <Github className="w-4 h-4 text-neon-red group-hover:scale-110 transition-transform" />
                            <span className="text-off-white text-xs uppercase tracking-wider font-mono">GitHub</span>
                            <ExternalLink className="w-3 h-3 text-neon-red/50 ml-auto" />
                        </a>

                        {/* Medium */}
                        <a
                            href="https://medium.com/@shivachandra9490"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 bg-black border border-neon-red/30 p-3 hover:border-neon-red hover:bg-neon-red/10 transition-all duration-300"
                        >
                            <div className="w-4 h-4 flex items-center justify-center text-neon-red font-bold text-[10px] border border-neon-red rounded-sm group-hover:scale-110 transition-transform">M</div>
                            <span className="text-off-white text-xs uppercase tracking-wider font-mono">Medium</span>
                            <ExternalLink className="w-3 h-3 text-neon-red/50 ml-auto" />
                        </a>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
