"use client";

import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";
import { profile, stats } from "@/lib/data";
import Counter from "@/components/ui/Counter";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

/** "Now Streaming" — poster card + the LinkedIn About narrative + stat counters. */
export default function About() {
  return (
    <section id="about" aria-label="About" className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <SectionHeading
        eyebrow="Now Streaming"
        title="About"
        blurb="The origin story — statistics roots, an AI-first workflow, and a habit of shipping."
      />

      <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
        {/* Poster card */}
        <Reveal>
          <motion.div
            whileHover={{ rotateY: 6, rotateX: -4 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            style={{ transformStyle: "preserve-3d", perspective: 800 }}
            className="group relative mx-auto aspect-[2/3] w-64 overflow-hidden rounded-xl border border-line bg-surface shadow-card lg:w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/25 via-surface to-black" aria-hidden />
            <div className="bg-grid absolute inset-0 opacity-60" aria-hidden />
            <div className="relative flex h-full flex-col justify-between p-6">
              <span className="eyebrow">Feature Presentation</span>
              <div>
                <span className="block text-8xl font-extrabold text-accent drop-shadow-[0_0_36px_rgba(229,9,20,0.5)]">
                  {profile.monogram}
                </span>
                <p className="mt-4 text-lg font-bold text-ink">{profile.name}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-mute">
                  <MapPin size={12} aria-hidden /> {profile.location}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-mute">
                <Sparkles size={12} className="text-accent" aria-hidden />
                AI-first · Data-driven · Ships fast
              </div>
            </div>
            {/* Glass reflection sweep on hover */}
            <div
              aria-hidden
              className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-700 group-hover:left-full group-hover:opacity-100"
            />
          </motion.div>
        </Reveal>

        {/* Narrative — verbatim from the LinkedIn About section */}
        <div>
          {profile.about.map((para, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="mb-5 text-pretty leading-relaxed text-mute [&:first-of-type]:text-lg [&:first-of-type]:text-ink">
                {para}
              </p>
            </Reveal>
          ))}

          {/* Animated statistics */}
          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={0.1 + i * 0.08} className="bg-surface p-5">
                <p className="text-3xl font-extrabold text-ink">
                  <Counter value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-mute">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
