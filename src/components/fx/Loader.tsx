"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/lib/data";
import { usePrefersReducedMotion } from "@/lib/hooks";

const LOADING_LINES = [
  "Warming up the projector",
  "Loading data pipelines",
  "Compiling the highlight reel",
  "Now streaming",
];

/**
 * Cinematic intro. A red monogram beam sweeps in (a nod to the
 * Netflix ident), a progress counter runs to 100, the name reveals
 * letter by letter, then the whole curtain lifts.
 *
 * Plays once per session; skipped entirely for reduced motion.
 */
export default function Loader({ onDone }: { onDone: () => void }) {
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);
  const [line, setLine] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (reduced || sessionStorage.getItem("intro-played")) {
      setShow(false);
      onDone();
      return;
    }
    // Eased fake-progress: fast start, dramatic finish
    let p = 0;
    const tick = setInterval(() => {
      p += Math.max(1, Math.round((100 - p) * 0.08));
      if (p >= 100) {
        p = 100;
        clearInterval(tick);
        setTimeout(() => {
          setShow(false);
          sessionStorage.setItem("intro-played", "1");
          onDone();
        }, 900);
      }
      setProgress(p);
      setLine(Math.min(LOADING_LINES.length - 1, Math.floor(p / 28)));
    }, 90);
    return () => clearInterval(tick);
  }, [reduced, onDone]);

  const letters = profile.name.split("");

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          role="status"
          aria-label="Loading portfolio"
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-black"
        >
          {/* Monogram beam */}
          <div className="relative mb-10 h-24 w-24">
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex origin-bottom items-center justify-center"
            >
              <span className="text-7xl font-extrabold tracking-tighter text-accent drop-shadow-[0_0_28px_rgba(229,9,20,0.7)]">
                {profile.monogram}
              </span>
            </motion.div>
            <motion.div
              initial={{ x: "-120%" }}
              animate={{ x: "220%" }}
              transition={{ delay: 0.5, duration: 1.1, ease: "easeInOut" }}
              className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-sm"
            />
          </div>

          {/* Name — staggered letter reveal */}
          <div className="flex overflow-hidden" aria-hidden>
            {letters.map((ch, i) => (
              <motion.span
                key={i}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 + i * 0.035, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="text-xl font-semibold tracking-[0.14em] text-white sm:text-2xl"
              >
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            ))}
          </div>

          {/* Progress */}
          <div className="mt-12 w-56">
            <div className="h-px w-full bg-white/10">
              <motion.div
                className="h-px bg-accent shadow-glow"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-mute">
              <AnimatePresence mode="wait">
                <motion.span
                  key={line}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  {LOADING_LINES[line]}
                </motion.span>
              </AnimatePresence>
              <span className="tabular-nums text-white">{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
