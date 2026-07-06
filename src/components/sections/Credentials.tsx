"use client";

import { Award, BadgeCheck, GraduationCap, Medal, ScrollText, Trophy } from "lucide-react";
import { achievements, certifications, education } from "@/lib/data";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

const iconFor = (name: string) =>
  name === "trophy" ? <Trophy size={18} aria-hidden /> :
  name === "medal" ? <Medal size={18} aria-hidden /> :
  <ScrollText size={18} aria-hidden />;

/** Education, certifications, and awards — three curated shelves. */
export default function Credentials() {
  return (
    <section id="education" aria-label="Education, certifications and achievements" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <SectionHeading
        eyebrow="Collections"
        title="Education & Credentials"
        blurb="Statistics and economics at the base, big data analytics on top, certifications along the way."
      />

      {/* Education */}
      <div className="grid gap-5 sm:grid-cols-2">
        {education.map((e, i) => (
          <Reveal key={e.school} delay={i * 0.1}>
            <article className="card-lift group relative h-full overflow-hidden rounded-xl border border-line bg-surface p-6">
              <div aria-hidden className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 blur-2xl transition-all duration-500 group-hover:bg-accent/20" />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <GraduationCap size={22} className="text-accent" aria-hidden />
                  <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                    {e.score}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink">{e.degree}</h3>
                <p className="mt-0.5 text-sm text-mute">{e.school}</p>
                <p className="eyebrow mt-2 !text-mute">{e.period}</p>
                <p className="mt-4 text-sm leading-relaxed text-mute">{e.notes}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Certifications */}
      <div id="certifications" className="mt-16">
        <Reveal>
          <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-mute">
            <BadgeCheck size={16} className="text-accent" aria-hidden /> Certifications
          </h3>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.06}>
              <div className="card-lift flex h-full items-start gap-3 rounded-lg border border-line bg-surface p-4">
                <span aria-hidden className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent/10 text-accent">
                  <Award size={15} />
                </span>
                <div>
                  <p className="text-sm font-semibold leading-snug text-ink">{c.name}</p>
                  <p className="mt-1 text-xs text-mute">
                    {c.issuer}
                    {c.year !== "—" && <> · {c.year}</>}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div id="achievements" className="mt-16">
        <Reveal>
          <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-mute">
            <Trophy size={16} className="text-accent" aria-hidden /> Awards & Publications
          </h3>
        </Reveal>
        <div className="grid gap-4 lg:grid-cols-3">
          {achievements.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08}>
              <article className="card-lift h-full rounded-xl border border-line bg-gradient-to-b from-surface to-base p-6">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-accent/40 bg-accent/10 text-accent shadow-glow">
                  {iconFor(a.icon)}
                </span>
                <h4 className="mt-4 text-sm font-bold leading-snug text-ink">{a.title}</h4>
                <p className="mt-2 text-xs leading-relaxed text-mute">{a.detail}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
