"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

function MiniVinyl() {
  return (
    <div className="relative mx-auto mb-8" style={{ width: 72, height: 72 }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 40% 36%, #4a4a4a 0%, #333333 44%, #242424 70%, #181818 88%, #101010 100%)",
          boxShadow: "0 0 40px rgba(255,255,255,0.10), inset 0 0 0 1px rgba(255,255,255,0.10)",
          animation: "vinyl-spin 2s linear infinite",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#0A0A0A",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)",
          }}
        />
      </div>
    </div>
  );
}

export function SecretBSide({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-bg/92 backdrop-blur-lg" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 text-text-muted/50 hover:text-text transition-colors"
            aria-label="Close secret B-side"
          >
            <X size={22} />
          </button>

          {/* Content card */}
          <motion.div
            className="relative z-10 text-center max-w-md px-8 py-12"
            initial={{ scale: 0.88, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 16, opacity: 0 }}
            transition={{ duration: 0.45, type: "spring", stiffness: 220, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-text-muted text-[10px] tracking-[0.35em] uppercase mb-8">
              ↑↑↓↓←→←→BA · Secret B-Side Unlocked
            </p>

            <MiniVinyl />

            <h2
              className="font-display font-extrabold text-text"
              style={{
                fontSize: "clamp(36px, 6vw, 56px)",
                letterSpacing: "-0.03em",
                lineHeight: 0.9,
              }}
            >
              You found it.
            </h2>

            <p className="text-text-muted mt-7 text-base leading-relaxed max-w-xs mx-auto">
              The B-side is where the real stuff lives. Right now I&apos;m building in stealth —
              AI systems that reason, not just respond.
            </p>

            <p className="text-text-muted/40 mt-4 text-sm italic">
              Stay tuned.
            </p>

            <div className="mt-8 h-px w-12 bg-white/15 mx-auto" />

            <button
              onClick={onClose}
              className="mt-6 text-[11px] tracking-[0.28em] uppercase text-text-muted/50 hover:text-text-muted transition-colors"
            >
              Close · Esc
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
