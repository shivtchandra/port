"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function GithubStats() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 border border-neon-red/20 bg-black/40 backdrop-blur-md p-6 relative overflow-hidden group"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-neon-red/50"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-neon-red font-mono text-sm tracking-[0.3em] uppercase mb-1">
                        &gt;&gt; GITHUB ACTIVITY LOG
                    </h3>
                    <p className="text-off-white/60 font-mono text-xs italic">
                        Real-time contribution frequency tracking...
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-neon-red animate-pulse"></div>
                    <div className="text-[10px] font-mono text-neon-red uppercase tracking-widest">Live Sync</div>
                </div>
            </div>

            <div className="relative rounded-lg overflow-hidden border border-off-white/5 bg-gray-900/50 p-2 md:p-4">
                <Image 
                    src="/github-activity-v2.png" 
                    alt="Github Contributions" 
                    width={1000} 
                    height={300} 
                    className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                />
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-[10px] font-mono text-off-white/40 uppercase tracking-widest">
                <div className="flex items-center gap-1">
                    <span className="text-neon-red">[636]</span> CONTRIBUTIONS
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-neon-red">[2026]</span> CURRENT_CYCLE
                </div>
                <div className="flex items-center gap-1 border-l border-off-white/10 pl-4 italic">
                    EXTRACTED_FROM: @shivtchandra
                </div>
            </div>
        </motion.div>
    );
}
