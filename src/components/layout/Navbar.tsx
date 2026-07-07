"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { Command, Download, Menu, Moon, Sun, X } from "lucide-react";
import { navLinks, profile } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Floating glass navbar.
 * Hides while scrolling down, reappears on scroll up (Netflix chrome
 * behavior). Links get an animated red underline; the resume CTA is
 * always one click away.
 */
export default function Navbar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    setTheme(
      (document.documentElement.getAttribute("data-theme") as "dark" | "light") ?? "light"
    );
    return scrollY.on("change", (y) => {
      const prev = scrollY.getPrevious() ?? 0;
      setHidden(y > prev && y > 160 && !open);
      setScrolled(y > 24);
    });
  }, [scrollY, open]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <motion.header
      animate={{ y: hidden ? "-120%" : "0%" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-[70] px-4 pt-4 sm:px-6"
    >
      <nav
        aria-label="Primary"
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-xl border px-4 py-3 transition-all duration-500",
          scrolled
            ? "border-line bg-black/60 shadow-card backdrop-blur-xl [html[data-theme=light]_&]:bg-white/70"
            : "border-transparent bg-transparent"
        )}
      >
        {/* Brand */}
        <a href="#top" className="group flex items-center gap-2" aria-label="Back to top">
          <span className="grid h-8 w-8 place-items-center rounded bg-accent text-lg font-extrabold text-white shadow-glow transition-transform duration-300 group-hover:scale-110">
            {profile.monogram}
          </span>
          <span className="hidden text-sm font-semibold tracking-wide text-ink sm:block">
            {profile.name}
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-6 lg:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group relative py-2 text-[13px] font-medium text-mute transition-colors hover:text-ink"
              >
                {l.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-netflix group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenPalette}
            aria-label="Open command palette (Ctrl+K)"
            className="hidden items-center gap-2 rounded-md border border-line bg-white/5 px-3 py-2 text-xs text-mute transition-colors hover:border-accent/50 hover:text-ink sm:flex"
          >
            <Command size={13} aria-hidden />
            <span className="font-mono">K</span>
          </button>
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="grid h-9 w-9 place-items-center rounded-md border border-line bg-white/5 text-mute transition-colors hover:border-accent/50 hover:text-ink"
          >
            {theme === "dark" ? <Sun size={15} aria-hidden /> : <Moon size={15} aria-hidden />}
          </button>
          <a
            href={profile.resumeFile}
            download
            className="hidden items-center gap-2 rounded-md bg-accent px-4 py-2 text-xs font-semibold text-white shadow-glow transition-colors hover:bg-[#f6121d] md:flex"
          >
            <Download size={13} aria-hidden />
            Resume
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center rounded-md border border-line bg-white/5 text-ink lg:hidden"
          >
            {open ? <X size={16} aria-hidden /> : <Menu size={16} aria-hidden />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-2 max-w-6xl rounded-xl border border-line bg-black/85 p-4 backdrop-blur-xl lg:hidden [html[data-theme=light]_&]:bg-white/90"
          >
            <ul className="grid gap-1">
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2.5 text-sm font-medium text-mute transition-colors hover:bg-white/5 hover:text-ink"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <li>
                <a
                  href={profile.resumeFile}
                  download
                  className="mt-2 flex items-center justify-center gap-2 rounded-md bg-accent px-3 py-2.5 text-sm font-semibold text-white"
                >
                  <Download size={14} aria-hidden /> Download Resume
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
