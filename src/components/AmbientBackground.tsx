"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { lenisRef } from "@/components/SmoothScroll";

const SECTION_COLORS: Record<string, string> = {
  hero: "rgba(255,255,255,0.05)",
  "selected-work": "rgba(99,102,241,0.08)",
  experience: "rgba(217,119,6,0.08)",
  about: "rgba(59,130,246,0.08)",
  "beyond-code": "rgba(200,7,8,0.08)",
  contact: "rgba(16,185,129,0.08)",
};

const SECTION_IDS = ["hero", "selected-work", "experience", "about", "beyond-code", "contact"];

export function AmbientBackground() {
  const [color, setColor] = useState(SECTION_COLORS.hero);

  useEffect(() => {
    const update = () => {
      const vh = window.innerHeight;
      let active = "hero";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top < vh * 0.55) active = id;
      }
      setColor(SECTION_COLORS[active] ?? SECTION_COLORS.hero);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });

    // Bind to Lenis once available
    const poll = window.setInterval(() => {
      if (lenisRef.current) {
        clearInterval(poll);
        lenisRef.current.on("scroll", update);
        update();
      }
    }, 50);

    return () => {
      clearInterval(poll);
      window.removeEventListener("scroll", update);
      lenisRef.current?.off("scroll", update);
    };
  }, []);

  return (
    <motion.div
      aria-hidden
      animate={{ backgroundColor: color }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      style={{
        position: "fixed",
        top: "-25%",
        left: "50%",
        translateX: "-50%",
        width: "120%",
        height: "70%",
        zIndex: 0,
        pointerEvents: "none",
        filter: "blur(100px)",
        opacity: 0.85,
        borderRadius: "50%",
      }}
    />
  );
}
