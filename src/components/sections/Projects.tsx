"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Github, GitCommitHorizontal, Play, X } from "lucide-react";
import { projects, type Project } from "@/lib/data";
import { cn } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

const FILTERS = ["All", "AI / ML", "IoT / Analytics", "Full-Stack"] as const;

/* ── Poster artwork: pure-CSS cinematic gradient keyed per project ── */
function Poster({ p, big = false }: { p: Project; big?: boolean }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background: `
          radial-gradient(120% 90% at 85% 0%, hsla(${p.accent}, 90%, 22%, 0.9), transparent 60%),
          radial-gradient(100% 80% at 0% 100%, rgba(229,9,20,0.35), transparent 55%),
          linear-gradient(160deg, #181818 0%, #0a0a0a 70%)
        `,
      }}
    >
      <div className="bg-grid absolute inset-0 opacity-40" />
      <span
        className={cn(
          "absolute font-extrabold tracking-tighter text-white/[0.06] select-none",
          big ? "-bottom-10 -right-4 text-[11rem]" : "-bottom-6 -right-2 text-8xl"
        )}
      >
        {p.title.slice(0, 2)}
      </span>
    </div>
  );
}

/* ── Netflix title card ── */
function ProjectCard({
  p,
  index,
  onOpen,
}: {
  p: Project;
  index: number;
  onOpen: () => void;
}) {
  return (
    <Reveal delay={index * 0.08}>
      <motion.button
        layoutId={`card-${p.id}`}
        onClick={onOpen}
        whileHover="hover"
        data-cursor="hover"
        aria-label={`Open details for ${p.title}`}
        className="group relative block aspect-video w-full overflow-hidden rounded-lg border border-line text-left shadow-card transition-shadow duration-500 hover:shadow-glow"
      >
        <motion.div
          variants={{ hover: { scale: 1.06 } }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Poster p={p} />
        </motion.div>

        {/* Hover scrim + trailer-style play affordance */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" aria-hidden />
        <motion.span
          variants={{ hover: { scale: 1, opacity: 1 } }}
          initial={{ scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur"
          aria-hidden
        >
          <Play size={15} fill="currentColor" />
        </motion.span>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold">
            <span className="text-[#46d369]">{p.match}% Match</span>
            <span className="text-mute">{p.year}</span>
            <span className="rounded border border-white/25 px-1 text-[9px] text-white/70">
              {p.category}
            </span>
          </div>
          <h3 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
            {p.title}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-white/60">{p.tagline}</p>
          {/* Tech chips fade in on hover */}
          <motion.ul
            variants={{ hover: { opacity: 1, y: 0 } }}
            initial={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mt-3 hidden flex-wrap gap-1.5 sm:flex"
            aria-hidden
          >
            {p.tech.slice(0, 4).map((t) => (
              <li key={t} className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur">
                {t}
              </li>
            ))}
          </motion.ul>
        </div>
      </motion.button>
    </Reveal>
  );
}

/* ── Immersive detail modal ── */
function ProjectModal({ p, onClose }: { p: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={p.title}
    >
      <motion.div
        layoutId={`card-${p.id}`}
        onClick={(e) => e.stopPropagation()}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-line bg-surface shadow-card"
      >
        {/* Billboard header */}
        <div className="relative aspect-[21/9]">
          <Poster p={p} big />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent" aria-hidden />
          <button
            onClick={onClose}
            aria-label="Close project details"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-accent"
          >
            <X size={16} aria-hidden />
          </button>
          <div className="absolute bottom-0 left-0 p-6 sm:p-8">
            <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
              {p.title}
            </h3>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold">
            <span className="text-[#46d369]">{p.match}% Match</span>
            <span className="text-mute">{p.year}</span>
            <span className="flex items-center gap-1 text-mute">
              <GitCommitHorizontal size={13} aria-hidden /> {p.commits} commits
            </span>
            {p.tags.map((t) => (
              <span key={t} className="rounded border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-accent">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            {p.description.map((d, i) => (
              <p key={i} className="text-sm leading-relaxed text-mute [&:first-of-type]:text-ink">
                {d}
              </p>
            ))}
          </div>

          <h4 className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-mute">
            Tech stack
          </h4>
          <ul className="mt-2 flex flex-wrap gap-2" role="list">
            {p.tech.map((t) => (
              <li key={t} className="rounded-md border border-line bg-raised px-2.5 py-1 text-xs font-medium text-ink">
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            {p.live && (
              <a
                href={p.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-[#f6121d]"
              >
                <Play size={14} fill="currentColor" aria-hidden /> Live Demo
              </a>
            )}
            <a
              href={p.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-line bg-white/5 px-5 py-2.5 text-sm font-semibold text-ink backdrop-blur transition-colors hover:border-accent/60"
            >
              <Github size={14} aria-hidden /> Source Code
            </a>
            <a
              href={p.live ?? p.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-line bg-white/5 px-5 py-2.5 text-sm font-semibold text-ink backdrop-blur transition-colors hover:border-accent/60"
            >
              <ExternalLink size={14} aria-hidden /> Case Study
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const shown = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  );
  const openProject = projects.find((p) => p.id === openId);

  return (
    <section id="projects" aria-label="Projects" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <SectionHeading
        eyebrow="Featured Titles"
        title="Projects"
        blurb="Every title below is a shipped, deployed product with public source. Click one to play."
      />

      {/* Filter chips */}
      <Reveal className="mb-8">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects by category">
          {FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-300",
                filter === f
                  ? "border-accent bg-accent text-white shadow-glow"
                  : "border-line bg-surface text-mute hover:border-accent/50 hover:text-ink"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </Reveal>

      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard p={p} index={i} onOpen={() => setOpenId(p.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {openProject && <ProjectModal p={openProject} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </section>
  );
}
