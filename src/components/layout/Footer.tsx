"use client";

import { ArrowUp, Github, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { navLinks, profile } from "@/lib/data";
import { useActiveSection } from "@/lib/hooks";

const SECTION_IDS = ["top", "projects", "experience", "skills", "education", "contact"];
const SECTION_TITLES: Record<string, string> = {
  top: "Opening Titles",
  skills: "Skills & Tooling",
  experience: "Experience",
  projects: "Featured Projects",
  education: "Credentials",
  contact: "Let's Work Together",
};

/** Footer with link columns, the "Now Playing" indicator, and back-to-top. */
export default function Footer() {
  const active = useActiveSection(SECTION_IDS);

  return (
    <footer className="relative border-t border-line" role="contentinfo">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col justify-between gap-10 sm:flex-row">
          <div>
            <a href="#top" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded bg-accent text-lg font-extrabold text-white shadow-glow">
                {profile.monogram}
              </span>
              <span className="text-sm font-bold text-ink">{profile.name}</span>
            </a>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-mute">
              {profile.headline} · {profile.subHeadline}
            </p>
            {/* Now Playing */}
            <div className="mt-5 flex items-center gap-2 text-[11px] text-mute" aria-live="polite">
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Now Playing: <span className="font-semibold text-ink">{SECTION_TITLES[active] ?? "…"}</span>
            </div>
          </div>

          <nav aria-label="Footer">
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-mute">Browse</h3>
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-xs text-mute transition-colors hover:text-accent">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-mute">Elsewhere</h3>
            <div className="flex gap-2.5">
              {[
                { href: profile.socials.github, label: "GitHub", icon: <Github size={15} aria-hidden /> },
                { href: profile.socials.linkedin, label: "LinkedIn", icon: <Linkedin size={15} aria-hidden /> },
                { href: profile.socials.twitter, label: "X / Twitter", icon: <Twitter size={15} aria-hidden /> },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-md border border-line text-mute transition-colors hover:border-accent/60 hover:text-accent"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-[11px] text-mute sm:flex-row">
          <p>
            © {new Date().getFullYear()} {profile.name}. Built with Next.js, TypeScript & Framer Motion.
          </p>
          <motion.a
            href="#top"
            whileHover={{ y: -3 }}
            className="flex items-center gap-1.5 font-semibold text-ink transition-colors hover:text-accent"
            aria-label="Back to top"
          >
            Back to top <ArrowUp size={13} aria-hidden />
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
