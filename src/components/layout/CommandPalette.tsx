"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, Copy, Download, Github, Linkedin, Mail,
  MoonStar, Search, Share2,
} from "lucide-react";
import { navLinks, profile } from "@/lib/data";
import { cn, scrollToId } from "@/lib/utils";

type Action = {
  id: string;
  label: string;
  hint?: string;
  icon: React.ReactNode;
  run: () => void;
};

/**
 * Keyboard-first command palette (Ctrl/Cmd+K).
 * Fuzzy-ish filtering, arrow-key navigation, Enter to run.
 */
export default function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState("");

  const actions: Action[] = useMemo(() => {
    const nav: Action[] = navLinks.map((l) => ({
      id: `nav-${l.href}`,
      label: `Go to ${l.label}`,
      hint: "Section",
      icon: <ArrowRight size={15} aria-hidden />,
      run: () => scrollToId(l.href),
    }));
    return [
      ...nav,
      {
        id: "copy-email",
        label: "Copy email address",
        hint: profile.email,
        icon: <Copy size={15} aria-hidden />,
        run: async () => {
          await navigator.clipboard.writeText(profile.email);
          setToast("Email copied");
        },
      },
      {
        id: "resume",
        label: "Download resume",
        hint: "PDF",
        icon: <Download size={15} aria-hidden />,
        run: () => {
          const a = document.createElement("a");
          a.href = profile.resumeFile;
          a.download = "";
          a.click();
        },
      },
      {
        id: "email",
        label: "Send an email",
        hint: "Opens mail app",
        icon: <Mail size={15} aria-hidden />,
        run: () => window.open(`mailto:${profile.email}`),
      },
      {
        id: "github",
        label: "Open GitHub profile",
        hint: "@fbivinay",
        icon: <Github size={15} aria-hidden />,
        run: () => window.open(profile.socials.github, "_blank"),
      },
      {
        id: "linkedin",
        label: "Open LinkedIn profile",
        icon: <Linkedin size={15} aria-hidden />,
        run: () => window.open(profile.socials.linkedin, "_blank"),
      },
      {
        id: "share",
        label: "Share this portfolio",
        hint: "Copies link",
        icon: <Share2 size={15} aria-hidden />,
        run: async () => {
          const url = window.location.href;
          if (navigator.share) await navigator.share({ title: profile.name, url }).catch(() => {});
          else {
            await navigator.clipboard.writeText(url);
            setToast("Link copied");
          }
        },
      },
      {
        id: "theme",
        label: "Toggle dark / light mode",
        icon: <MoonStar size={15} aria-hidden />,
        run: () => {
          const cur = document.documentElement.getAttribute("data-theme");
          const next = cur === "light" ? "dark" : "light";
          document.documentElement.setAttribute("data-theme", next);
          try { localStorage.setItem("theme", next); } catch {}
        },
      },
    ];
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return actions;
    return actions.filter(
      (a) => a.label.toLowerCase().includes(q) || a.hint?.toLowerCase().includes(q)
    );
  }, [actions, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const runAction = (a: Action) => {
    a.run();
    if (a.id !== "copy-email" && a.id !== "share") onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(filtered.length - 1, c + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    } else if (e.key === "Enter" && filtered[cursor]) {
      runAction(filtered[cursor]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[95] flex items-start justify-center bg-black/70 px-4 pt-[16vh] backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-xl border border-line bg-surface shadow-card"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search size={16} className="text-mute" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCursor(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Type a command or search…"
                aria-label="Search commands"
                className="w-full bg-transparent py-4 text-sm text-ink placeholder:text-mute focus:outline-none"
              />
              <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px] text-mute">esc</kbd>
            </div>
            <ul className="max-h-72 overflow-y-auto p-2" role="listbox">
              {filtered.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-mute">
                  Nothing found. Try “resume” or “email”.
                </li>
              )}
              {filtered.map((a, i) => (
                <li key={a.id} role="option" aria-selected={i === cursor}>
                  <button
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => runAction(a)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                      i === cursor ? "bg-accent/15 text-ink" : "text-mute"
                    )}
                  >
                    <span className={cn(i === cursor ? "text-accent" : "text-mute")}>{a.icon}</span>
                    <span className="flex-1">{a.label}</span>
                    {a.hint && <span className="truncate text-[11px] text-mute">{a.hint}</span>}
                  </button>
                </li>
              ))}
            </ul>
            <AnimatePresence>
              {toast && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="border-t border-line bg-accent/10 px-4 py-2 text-center text-xs font-medium text-accent"
                >
                  {toast}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
