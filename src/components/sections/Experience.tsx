"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Briefcase, MapPin } from "lucide-react";
import { experience } from "@/lib/data";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { usePrefersReducedMotion } from "@/lib/hooks";

/** Vertical timeline — cards slide in from alternating sides on scroll. */
export default function Experience() {
  const reduced = usePrefersReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 80%", "end 55%"],
  });
  const spineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <section id="experience" aria-label="Experience" className="mx-auto max-w-6xl px-6 py-16 sm:py-24 lg:py-32">
      <SectionHeading
        eyebrow="Episodes"
        title="Experience"
        blurb="From founding a business at the base of the stack to shipping analytics inside a live retail floor."
      />

      <ol ref={listRef} className="relative ml-3 border-l border-line sm:ml-0 sm:border-none" role="list">
        {/* Center spine on larger screens — red line draws in as you scroll */}
        <div aria-hidden className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-line sm:block" />
        <motion.div
          aria-hidden
          style={{ scaleY: reduced ? 1 : spineScale, transformOrigin: "top" }}
          className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-accent via-accent/70 to-accent/20 shadow-glow sm:block"
        />

        {experience.map((job, i) => {
          const left = i % 2 === 0;
          return (
            <li key={job.company + job.title} className="relative mb-10 sm:mb-14">
              {/* Node */}
              <motion.span
                aria-hidden
                initial={reduced ? false : { scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                transition={{ delay: 0.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                className="absolute -left-[7px] top-8 h-3.5 w-3.5 rounded-full border-2 border-accent bg-base shadow-glow sm:left-1/2 sm:-translate-x-1/2"
              />
              <motion.article
                initial={reduced ? false : { opacity: 0, x: left ? -72 : 72, scale: 0.96, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`card-lift ml-6 rounded-xl border border-line bg-surface p-6 sm:ml-0 sm:w-[calc(50%-2.5rem)] ${
                  left ? "" : "sm:ml-auto"
                }`}
              >
                <motion.p
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  className="eyebrow mb-2"
                >
                  {job.start} — {job.end}
                </motion.p>
                <h3 className="text-lg font-bold text-ink">{job.title}</h3>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-mute">
                  <span className="flex items-center gap-1.5">
                    <Briefcase size={13} aria-hidden /> {job.company}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} aria-hidden /> {job.location}
                  </span>
                </p>
                <ul className="mt-4 space-y-2" role="list">
                  {job.points.map((pt, j) => (
                    <li key={j} className="flex gap-2.5 text-sm leading-relaxed text-mute">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </motion.article>
            </li>
          );
        })}
      </ol>

      <Reveal className="text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-mute">More episodes in production…</p>
      </Reveal>
    </section>
  );
}
