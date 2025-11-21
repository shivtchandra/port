"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Linkedin, Github, Twitter, ExternalLink } from "lucide-react";

export default function Contact() {
    const [input, setInput] = useState("");
    const [glitch, setGlitch] = useState(false);

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

    return (
        <section id="contact" className={`min-h-screen flex flex-col items-center justify-center p-8 relative z-10 vhs-scanlines ${glitch ? 'invert' : ''}`}>
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-black uppercase mb-12 text-off-white tracking-tighter text-glow flicker glitch"
                data-text="PORTAL TERMINAL"
            >
                PORTAL <span className="text-neon-red">TERMINAL</span>
            </motion.h2>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl bg-black border-2 border-neon-red/50 p-6 rounded-lg shadow-[0_0_20px_rgba(229,9,20,0.2)] font-mono red-glow-border glitch-in"
            >
                <div className="flex items-center gap-2 mb-6 border-b border-neon-red/20 pb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-auto text-neon-red text-xs tracking-widest">COMM_UPLINK_V4.0</span>
                </div>

                <div className="space-y-2 text-green-500 text-sm mb-8 font-mono">
                    <p className="typing-effect">{">"} establishing_connection...</p>
                    <p className="typing-effect delay-1000">{">"} channel_open</p>
                    <p className="typing-effect delay-2000">{">"} awaiting_input...</p>
                </div>

                <form
                    className="space-y-6"
                    onSubmit={(e) => {
                        e.preventDefault();
                        const name = (document.getElementById('name') as HTMLInputElement).value;
                        const email = (document.getElementById('email') as HTMLInputElement).value;
                        const message = (document.getElementById('message') as HTMLTextAreaElement).value;
                        window.location.href = `mailto:shivachandra9490@gmail.com?subject=Transmission from ${name}&body=${message} (Contact: ${email})`;
                    }}
                >
                    <div>
                        <label className="block text-neon-red text-xs uppercase tracking-widest mb-2">Identity</label>
                        <input id="name" type="text" required className="w-full bg-black border border-neon-red/30 p-3 text-off-white focus:border-neon-red focus:outline-none transition-colors font-mono" placeholder="ENTER NAME" />
                    </div>
                    <div>
                        <label className="block text-neon-red text-xs uppercase tracking-widest mb-2">Frequency</label>
                        <input id="email" type="email" required className="w-full bg-black border border-neon-red/30 p-3 text-off-white focus:border-neon-red focus:outline-none transition-colors font-mono" placeholder="ENTER EMAIL" />
                    </div>
                    <div>
                        <label className="block text-neon-red text-xs uppercase tracking-widest mb-2">Transmission</label>
                        <textarea id="message" rows={4} required className="w-full bg-black border border-neon-red/30 p-3 text-off-white focus:border-neon-red focus:outline-none transition-colors font-mono" placeholder="ENTER MESSAGE"></textarea>
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

                    <button type="submit" className="w-full bg-neon-red text-black font-bold uppercase py-4 tracking-widest hover:bg-red-600 transition-colors relative overflow-hidden group">
                        <span className="relative z-10">Transmit Signal</span>
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
