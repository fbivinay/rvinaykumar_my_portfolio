"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Github, Play } from "lucide-react";
import type { Project } from "@/lib/data";
import { useMagnetic } from "@/lib/hooks";
import FitToScreen from "@/components/ui/FitToScreen";
import Laptop from "@/components/projects/Laptop";
import SjuDemo from "@/components/projects/demos/SjuDemo";
import EverestDemo from "@/components/projects/demos/EverestDemo";
import InvestDemo from "@/components/projects/demos/InvestDemo";
import NewsDemo from "@/components/projects/demos/NewsDemo";
import KasautiDemo from "@/components/projects/demos/KasautiDemo";
import RetailDeckDemo from "@/components/projects/demos/RetailDeckDemo";

/** Each project's own screen recording, keyed by project id. */
const DEMOS: Record<string, React.ComponentType> = {
  "sju-chatbot": SjuDemo,
  everest: EverestDemo,
  "intelligent-investment": InvestDemo,
  "update-bro": NewsDemo,
  kasauti: KasautiDemo,
  "retail-analytics": RetailDeckDemo,
};

const ease = [0.22, 1, 0.36, 1] as const;
/** Rise and fade in: opacity and transform only, so it runs on the GPU. */
const enter = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease },
});

/** One full-screen project: the laptop playing the project, its essentials beside it. */
export function ProjectSlide({ p, id }: { p: Project; id?: string }) {
  const Demo = DEMOS[p.id];
  return (
    <section id={id} aria-label={p.title} className="flex h-full flex-col pb-8 pt-24">
      <FitToScreen>
        <div className="mx-auto grid w-full max-w-[1480px] items-center gap-10 px-6 lg:grid-cols-[1.6fr_1fr] lg:px-12 xl:gap-14">
          <motion.div {...enter(0.25)} className="mx-auto w-full max-w-[calc(100svh-160px)]">
            <Laptop url={new URL(p.live).host} label={`${p.title} in use: a recording of the live app`}>
              <Demo />
            </Laptop>
          </motion.div>

          <div>
            <motion.h2 {...enter(0.35)} className="text-3xl font-extrabold tracking-tight text-ink xl:text-4xl">
              {p.title}
            </motion.h2>
            <motion.p {...enter(0.45)} className="mt-4 text-sm leading-relaxed text-mute xl:text-[15px]">
              {p.summary}
            </motion.p>
            <motion.ul {...enter(0.55)} className="mt-5 space-y-2.5" role="list">
              {p.points.map((pt) => (
                <li key={pt} className="flex gap-2.5 text-sm leading-relaxed text-mute">
                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {pt}
                </li>
              ))}
            </motion.ul>
            <motion.ul {...enter(0.65)} className="mt-6 flex flex-wrap gap-1.5" role="list">
              {p.tech.map((t) => (
                <li key={t} className="rounded-md border border-line bg-raised px-2.5 py-1 text-xs font-medium text-ink">
                  {t}
                </li>
              ))}
            </motion.ul>
            <motion.div {...enter(0.75)} className="mt-7 flex flex-wrap gap-3">
              <a
                href={p.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-[#f6121d]"
              >
                <Play size={14} fill="currentColor" aria-hidden /> Live Demo
              </a>
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-line bg-white/5 px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent/60"
              >
                <Github size={14} aria-hidden /> Source Code
              </a>
            </motion.div>
          </div>
        </div>
      </FitToScreen>
    </section>
  );
}

/** "More Projects": reveals the next three slides, or (last time) leaves for GitHub. */
export function MoreSlide({ onMore, href }: { onMore?: () => void; href?: string }) {
  const button = useMagnetic<HTMLButtonElement>(0.25);
  const link = useMagnetic<HTMLAnchorElement>(0.25);
  const cls =
    "inline-flex items-center gap-3 rounded-md bg-accent px-10 py-5 text-lg font-semibold text-white shadow-glow transition-colors duration-300 will-change-transform hover:bg-[#f6121d]";
  return (
    <section aria-label="More projects" className="relative flex h-full items-center justify-center">
      <div aria-hidden className="animate-drift absolute inset-0 m-auto h-[50vh] w-[50vw] bg-[radial-gradient(closest-side,rgba(229,9,20,0.1),transparent)]" />
      <motion.div {...enter(0.3)} className="relative">
        {href ? (
          <a ref={link} href={href} target="_blank" rel="noopener noreferrer" data-cursor="hover" className={cls}>
            More Projects <Github size={20} aria-hidden />
          </a>
        ) : (
          <button ref={button} type="button" onClick={onMore} data-cursor="hover" className={cls}>
            More Projects <ArrowRight size={20} aria-hidden />
          </button>
        )}
      </motion.div>
      <motion.span
        aria-hidden
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-mute"
      >
        <ChevronDown size={22} />
      </motion.span>
    </section>
  );
}
