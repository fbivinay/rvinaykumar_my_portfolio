"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Row header in the Netflix idiom: red eyebrow + display title + rule.
 * Orchestrated entrance — eyebrow tracks in, title rises out of blur,
 * the red rule draws itself across, blurb fades last.
 */
export default function SectionHeading({
  eyebrow,
  title,
  blurb,
}: {
  eyebrow: string;
  title: string;
  blurb?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  if (reduced) {
    return (
      <div className="mb-10 sm:mb-14">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">{title}</h2>
          {blurb && <p className="max-w-md text-sm leading-relaxed text-mute">{blurb}</p>}
        </div>
        <div className="mt-6 h-px w-full bg-gradient-to-r from-accent/70 via-line to-transparent" />
      </div>
    );
  }

  return (
    <motion.div
      className="mb-10 sm:mb-14"
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "0px 0px -8% 0px" }}
      variants={{ show: { transition: { staggerChildren: 0.12 } } }}
    >
      <motion.p
        variants={{
          hidden: { opacity: 0, x: -28, letterSpacing: "0.55em" },
          show: { opacity: 1, x: 0, letterSpacing: "0.28em", transition: { duration: 0.7, ease } },
        }}
        className="eyebrow mb-3"
      >
        {eyebrow}
      </motion.p>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <motion.h2
          variants={{
            hidden: { opacity: 0, y: 44, filter: "blur(12px)" },
            show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease } },
          }}
          className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl"
        >
          {title}
        </motion.h2>
        {blurb && (
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
            }}
            className="max-w-md text-sm leading-relaxed text-mute"
          >
            {blurb}
          </motion.p>
        )}
      </div>

      <motion.div
        variants={{
          hidden: { scaleX: 0 },
          show: { scaleX: 1, transition: { duration: 0.9, ease } },
        }}
        style={{ transformOrigin: "left" }}
        className="mt-6 h-px w-full bg-gradient-to-r from-accent/70 via-line to-transparent"
      />
    </motion.div>
  );
}
