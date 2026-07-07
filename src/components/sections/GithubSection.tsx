"use client";

import { motion } from "framer-motion";
import { ExternalLink, GitCommitHorizontal, Github, Users } from "lucide-react";
import { github, projects } from "@/lib/data";
import Counter from "@/components/ui/Counter";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * Contribution heatmap built from the *actual commit history* in the
 * GitHub account export — March through July 2026, week by week.
 * No fabricated squares: empty weeks render empty.
 */
function Heatmap() {
  // Build a Sun-aligned week grid from 2026-03-01 → 2026-07-05
  const start = new Date("2026-03-01");
  const end = new Date("2026-07-05");
  const counts = new Map(github.activity.map((a) => [a.date, a.count]));

  const days: { date: string; count: number }[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const iso = d.toISOString().slice(0, 10);
    days.push({ date: iso, count: counts.get(iso) ?? 0 });
  }
  // pad to start on Sunday
  const pad = start.getDay();
  const cells: ({ date: string; count: number } | null)[] = [
    ...Array<null>(pad).fill(null),
    ...days,
  ];
  const weeks: (typeof cells)[] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const level = (c: number) =>
    c === 0
      ? "bg-raised"
      : c < 3
        ? "bg-accent/30"
        : c < 7
          ? "bg-accent/60"
          : "bg-accent shadow-glow";

  const months = ["Mar", "Apr", "May", "Jun", "Jul"];

  return (
    <div>
      <div className="mb-2 flex justify-between px-1 text-[10px] uppercase tracking-wider text-mute">
        {months.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
      <div className="flex gap-[3px]" role="img" aria-label={`Contribution heatmap: ${github.totalCommits} commits between March and July 2026`}>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day, di) => (
              <motion.div
                key={di}
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: wi * 0.02 + di * 0.008, duration: 0.3 }}
                title={day ? `${day.date}: ${day.count} commit${day.count === 1 ? "" : "s"}` : undefined}
                className={`h-3 w-3 rounded-[3px] ${day ? level(day.count) : "bg-transparent"}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-mute">
        Less
        {["bg-raised", "bg-accent/30", "bg-accent/60", "bg-accent"].map((c) => (
          <span key={c} className={`h-2.5 w-2.5 rounded-[3px] ${c}`} />
        ))}
        More
      </div>
    </div>
  );
}

/** Byte-weighted language distribution, computed from the repo export. */
function Languages() {
  return (
    <div className="space-y-3">
      {github.languages.map((l, i) => (
        <div key={l.name}>
          <div className="mb-1 flex justify-between text-xs">
            <span className="font-medium text-ink">{l.name}</span>
            <span className="tabular-nums text-mute">{l.pct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-raised">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${l.pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full"
              style={{ background: l.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GithubSection() {
  return (
    <section id="github" aria-label="GitHub activity" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <SectionHeading
        eyebrow="Behind the Scenes"
        title="On GitHub"
        blurb="Real numbers straight from the account export — commits, languages, and shipped repositories."
      />

      {/* Stat strip */}
      <Reveal>
        <div className="mb-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
          {[
            { icon: <GitCommitHorizontal size={16} aria-hidden />, v: github.totalCommits, label: "Total commits" },
            { icon: <Github size={16} aria-hidden />, v: github.publicRepos, label: "Public repos" },
            { icon: <Users size={16} aria-hidden />, v: github.collaborators, label: "Collaborators" },
            { icon: <ExternalLink size={16} aria-hidden />, v: 3, label: "Live deployments" },
          ].map((s) => (
            <div key={s.label} className="bg-surface p-5">
              <div className="flex items-center gap-2 text-accent">{s.icon}
                <span className="text-2xl font-extrabold text-ink">
                  <Counter value={s.v} />
                </span>
              </div>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-mute">{s.label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Reveal className="overflow-x-auto rounded-xl border border-line bg-surface p-6">
          <h3 className="mb-5 text-sm font-bold text-ink">
            Contribution activity <span className="font-normal text-mute">· Mar – Jul 2026</span>
          </h3>
          <Heatmap />
        </Reveal>
        <Reveal delay={0.1} className="rounded-xl border border-line bg-surface p-6">
          <h3 className="mb-5 text-sm font-bold text-ink">Language usage</h3>
          <Languages />
        </Reveal>
      </div>

      {/* Repo cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.08}>
            <a
              href={p.github}
              target="_blank"
              rel="noopener noreferrer"
              className="card-lift group block h-full rounded-xl border border-line bg-surface p-5"
            >
              <div className="flex items-center justify-between">
                <Github size={16} className="text-mute transition-colors group-hover:text-accent" aria-hidden />
                <span className="flex items-center gap-1 text-[11px] text-mute">
                  <GitCommitHorizontal size={12} aria-hidden /> {p.commits}
                </span>
              </div>
              <h4 className="mt-3 text-sm font-bold text-ink group-hover:text-accent">
                {p.github.split("/").pop()}
              </h4>
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-mute">{p.tagline}</p>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8 text-center">
        <a
          href={github.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-[#f6121d]"
        >
          Follow the full story on GitHub <ExternalLink size={13} aria-hidden />
        </a>
      </Reveal>
    </section>
  );
}
