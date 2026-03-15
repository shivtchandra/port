"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Code2, Briefcase, Mail, BookOpen, GraduationCap, Award, Terminal, ChevronRight } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Simple section detection if window scroll is used
            const sections = ["about", "skills", "experience", "projects", "blogs", "leadership", "freelance", "certifications", "contact"];
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { id: "about", label: "ABOUT", icon: User },
        { id: "skills", label: "SKILLS", icon: Code2 },
        { id: "experience", label: "EXPERIENCE", icon: Briefcase },
        { id: "projects", label: "PROJECTS", icon: BookOpen },
        { id: "blogs", label: "BLOGS", icon: BookOpen },
        { id: "leadership", label: "LEADERSHIP", icon: Award },
        { id: "freelance", label: "FREELANCE", icon: Award },
        { id: "certifications", label: "CERTS", icon: GraduationCap },
        { id: "contact", label: "CONTACT", icon: Mail },
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        setIsOpen(false);
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-[100]">
            {/* Main Bar */}
            <div className={`px-4 md:px-10 py-3 md:py-4 flex justify-between items-center transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-md border-b border-neon-red/20 shadow-2xl' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>

                {/* Logo Area */}
                <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <div className="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 border-2 border-neon-red/80 rounded-sm group-hover:bg-neon-red transition-all duration-300">
                        <span className="font-black text-neon-red group-hover:text-black transition-colors text-sm md:text-base">ST</span>
                        <div className="absolute inset-0 bg-neon-red/20 blur-md rounded-full group-hover:bg-neon-red/40 transition-colors"></div>
                    </div>
                    <span className="font-black text-[10px] md:text-sm uppercase tracking-[0.3em] text-off-white group-hover:text-neon-red transition-colors">
                        TACTICAL_<span className="text-neon-red">REPORT</span>
                    </span>
                </div>

                {/* Desktop Links - Simple & Easy */}
                <div className="hidden lg:flex items-center gap-6">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:text-neon-red relative py-1 ${activeSection === item.id ? 'text-neon-red' : 'text-off-white/60'}`}
                        >
                            {item.label}
                            {activeSection === item.id && (
                                <motion.div layoutId="activeNav" className="absolute -bottom-1 left-0 w-full h-0.5 bg-neon-red" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Mobile Menu Trigger */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden w-10 h-10 bg-neon-red/10 border border-neon-red/30 flex items-center justify-center text-neon-red active:scale-90 transition-all rounded shadow-lg backdrop-blur-sm"
                    aria-label="Toggle Menu"
                >
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                                <X size={20} />
                            </motion.div>
                        ) : (
                            <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                                <Menu size={20} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>

            {/* Mobile Overlay - Simpler List */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-[80%] max-w-[320px] bg-black border-l border-neon-red/20 z-[101] lg:hidden flex flex-col"
                        >
                            {/* Scanline pattern */}
                            <div className="absolute inset-0 pointer-events-none vhs-scanlines opacity-20" />

                            <div className="p-6 pt-24 space-y-2 flex-grow overflow-y-auto relative z-10">
                                <p className="text-[10px] text-neon-red/40 font-mono tracking-[0.5em] mb-6 uppercase">
                                    // SYSTEM_SECTORS
                                </p>

                                {navItems.map((item, idx) => (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollToSection(item.id)}
                                        className={`w-full flex items-center justify-between p-4 group transition-all duration-300 border ${activeSection === item.id ? 'border-neon-red/50 bg-neon-red/5' : 'border-transparent bg-white/5 hover:bg-white/10'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <item.icon size={18} className={activeSection === item.id ? 'text-neon-red' : 'text-off-white/40'} />
                                            <span className={`text-xs font-black uppercase tracking-widest ${activeSection === item.id ? 'text-white' : 'text-off-white/70'}`}>
                                                {item.label}
                                            </span>
                                        </div>
                                        <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-all ${activeSection === item.id ? 'text-neon-red opacity-100 shadow-[0_0_8px_rgba(229,9,20,0.5)]' : 'text-off-white/20'}`} />
                                    </button>
                                ))}
                            </div>

                            <div className="p-6 border-t border-neon-red/10 bg-black relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-[10px] font-mono text-off-white/40 uppercase tracking-widest">Uplink: Synchronized</span>
                                </div>
                                <p className="text-[8px] font-mono text-neon-red/30 tracking-[0.2em] uppercase">
                                    Property of Tactical_SC_Dossier
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}
