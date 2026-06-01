"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only activate on fine-pointer (mouse) devices
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setMounted(true);

    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });

    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button, [data-cursor-hover]")) {
        setHovering(true);
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button, [data-cursor-hover]")) {
        setHovering(false);
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  if (!mounted) return null;

  const size = hovering ? 40 : 12;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      animate={{ x: pos.x - size / 2, y: pos.y - size / 2 }}
      transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.5 }}
    >
      <motion.div
        animate={{
          width: size,
          height: size,
          backgroundColor: hovering ? "transparent" : "#FAFAFA",
          border: hovering ? "1.5px solid #FAFAFA" : "0px solid transparent",
        }}
        transition={{ duration: 0.18 }}
        style={{
          borderRadius: "50%",
          mixBlendMode: "difference",
          opacity: 0.85,
        }}
      />
    </motion.div>
  );
}
