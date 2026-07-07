"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin } from "lucide-react";
import { experience } from "@/lib/data";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { usePrefersReducedMotion } from "@/lib/hooks";

/** Vertical timeline — cards slide in from alternating sides on scroll. */
export default function Experience() {
  const reduced = usePrefersReducedMotion();
  return (
    <section id="experience" aria-label="Experience" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <SectionHeading
        eyebrow="Episodes"
        title="Experience"
        blurb="From founding a business at the base of the stack to shipping analytics inside a live retail floor."
      />

      <ol className="relative ml-3 border-l border-line sm:ml-0 sm:border-none" role="list">
        {/* Center spine on larger screens */}
        <div aria-hidden className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-accent/60 via-line to-transparent sm:block" />

        {experience.map((job, i) => {
          const left = i % 2 === 0;
          return (
            <li key={job.company + job.title} className="relative mb-10 sm:mb-14">
              {/* Node */}
              <span
                aria-hidden
                className="absolute -left-[7px] top-8 h-3.5 w-3.5 rounded-full border-2 border-accent bg-base shadow-glow sm:left-1/2 sm:-translate-x-1/2"
              />
              <motion.article
                initial={reduced ? false : { opacity: 0, x: left ? -48 : 48, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
