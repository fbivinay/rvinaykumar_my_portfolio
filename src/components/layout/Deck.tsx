"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { featuredProjects, moreProjects, profile } from "@/lib/data";
import { usePrefersReducedMotion } from "@/lib/hooks";
import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import { MoreSlide, ProjectSlide } from "@/components/sections/Projects";

/**
 * The opening of the page is a deck of full-screen slides: hero, projects,
 * skills. While the page sits at the top, a scroll, an arrow key or a swipe
 * turns one slide, the slides riding a wheel whose hub is off-screen to the
 * right. Past the last slide (Skills) the page scrolls normally again, and
 * scrolling back to the top hands control back to the deck.
 */

/** Every slide that can exist, in order. "more" swaps for the second set once clicked. */
const SECOND = moreProjects.map((p) => p.id);
const ORDER = ["top", ...featuredProjects.map((p) => p.id), "more", ...SECOND, "more-github", "skills"];
/** In-page anchors that land on a slide. */
const ANCHORS: Record<string, string> = { top: "top", projects: featuredProjects[0].id, skills: "skills" };

const TURN = 38; // degrees between neighbouring slides on the wheel
const DURATION = 1000; // ms per turn
const QUIET = 200; // ms without wheel events that ends a scroll gesture
const TRAVEL = 30; // px a gesture has to scroll before it turns a slide
const ease = [0.76, 0, 0.24, 1] as const;

const wheel: Variants = {
  enter: (dir: number) => ({ rotate: -dir * TURN, opacity: 0 }),
  center: (dir: number) => ({ rotate: 0, opacity: 1, transition: { duration: dir ? DURATION / 1000 : 0, ease } }),
  exit: (dir: number) => ({ rotate: dir * TURN, opacity: 0, transition: { duration: dir ? DURATION / 1000 : 0, ease } }),
};
const fade: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

export default function Deck({ started }: { started: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const [view, setView] = useState({ key: "top", dir: 1 });
  const keys = ORDER.filter((k) => (expanded ? k !== "more" : !SECOND.includes(k) && k !== "more-github"));

  // Listeners read the latest state through this ref instead of re-binding.
  const live = useRef({ keys, key: view.key, lock: 0, gesture: { last: -Infinity, sum: 0, spent: false } });
  useEffect(() => {
    live.current.keys = keys;
    live.current.key = view.key;
  });

  /** Turn to a slide; `instant` swaps it with no animation (it is off-screen anyway). */
  const go = useCallback((to: string, instant = false) => {
    live.current.lock = performance.now() + DURATION;
    setView((v) =>
      v.key === to ? v : { key: to, dir: instant ? 0 : Math.sign(ORDER.indexOf(to) - ORDER.indexOf(v.key)) }
    );
  }, []);

  useEffect(() => {
    const s = live.current;
    const atTop = () => window.scrollY <= 1;
    const target = (d: number) => s.keys[s.keys.indexOf(s.key) + d];

    /* One scroll gesture turns at most one slide. A gesture is every wheel event
       up to a QUIET pause, so trackpad inertia (which can run for seconds after the
       fingers lift) never turns a second slide. A gesture that starts mid-turn, or
       while the page itself is scrolling, never turns one. */
    const onWheel = (e: WheelEvent) => {
      const g = s.gesture;
      if (e.timeStamp - g.last > QUIET) {
        g.sum = 0;
        g.spent = performance.now() < s.lock;
      }
      g.last = e.timeStamp;
      if (e.ctrlKey) return; // pinch-zoom
      if (!atTop()) {
        g.spent = true; // the page is scrolling: this gesture belongs to it
        return;
      }
      const px = e.deltaY * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1);
      const d = Math.sign(px);
      if (!d) return;
      const to = target(d);
      if (!to && !g.spent) return; // past either end of the deck: let the page scroll
      e.preventDefault();
      e.stopPropagation(); // keep Lenis from scrolling underneath the deck
      if (g.spent || !to) return;
      g.sum = Math.sign(g.sum) === d ? g.sum + px : px; // a change of direction starts the count again
      if (Math.abs(g.sum) < TRAVEL) return;
      g.spent = true;
      go(to);
    };

    const onKey = (e: KeyboardEvent) => {
      if (!atTop() || e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, select, [contenteditable='true']")) return;
      if (e.key === " " && el.closest("button, a")) return; // Space presses the focused control
      const d =
        e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey) ? 1
        : e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey) ? -1
        : 0;
      const to = d && target(d);
      if (!to) return;
      e.preventDefault();
      if (performance.now() >= s.lock) go(to);
    };

    let startY = 0;
    let swiped = false;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      swiped = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!atTop()) return;
      const dy = startY - e.touches[0].clientY;
      const to = target(Math.sign(dy));
      if (!dy || !to) return;
      e.preventDefault();
      if (!swiped && Math.abs(dy) > 40 && performance.now() >= s.lock) {
        swiped = true;
        go(to);
      }
    };

    /** #top, #projects, #skills turn the deck; other sections scroll, leaving Skills (the slide just above them) showing. */
    const navigate = (hash: string) => {
      const slide = ANCHORS[hash.slice(1)];
      if (slide) {
        go(slide);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        go("skills", true);
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      }
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.('a[href^="#"]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      navigate(a.getAttribute("href")!);
    };
    const onNavigate = (e: Event) => navigate((e as CustomEvent<string>).detail);

    // Arriving on a link like /#skills or /#contact
    if (location.hash) {
      const slide = ANCHORS[location.hash.slice(1)];
      if (slide) {
        go(slide, true);
        window.scrollTo(0, 0);
      } else go("skills", true);
    }

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("click", onClick);
    window.addEventListener("navigate", onNavigate);
    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("click", onClick);
      window.removeEventListener("navigate", onNavigate);
    };
  }, [go]);

  const render = (k: string) => {
    if (k === "top") return <Hero started={started} />;
    if (k === "skills") return <Skills />;
    if (k === "more")
      return (
        <MoreSlide
          onMore={() => {
            setExpanded(true);
            go(SECOND[0]);
          }}
        />
      );
    if (k === "more-github") return <MoreSlide href={profile.socials.github} />;
    const p = [...featuredProjects, ...moreProjects].find((x) => x.id === k)!;
    return <ProjectSlide p={p} id={k === featuredProjects[0].id ? "projects" : undefined} />;
  };

  return (
    <div className="relative h-svh overflow-hidden">
      {/* The stage stays still while the slides turn over it */}
      <div aria-hidden className="bg-grid absolute inset-0" />
      <AnimatePresence initial={false} custom={view.dir}>
        <motion.div
          key={view.key}
          custom={view.dir}
          variants={reduced ? fade : wheel}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
          style={{ transformOrigin: "150% 50%" }}
        >
          {render(view.key)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
