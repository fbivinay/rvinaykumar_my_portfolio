"use client";

import { useEffect, useRef, useState } from "react";

/** Media-query hook with SSR-safe default. */
export function useMediaQuery(query: string, initial = false) {
  const [matches, setMatches] = useState(initial);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");

export const useFinePointer = () => useMediaQuery("(pointer: fine)");

/**
 * Magnetic hover: the element leans toward the cursor.
 * Attach the returned ref to any element. No-ops for reduced motion.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !fine) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };
    const onLeave = () => {
      el.style.transition = "transform 0.4s cubic-bezier(0.22,1,0.36,1)";
      el.style.transform = "translate(0,0)";
      setTimeout(() => (el.style.transition = ""), 400);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength, reduced, fine]);

  return ref;
}

/** Typewriter cycling through phrases. */
export function useTypewriter(phrases: readonly string[], speed = 55, hold = 1800) {
  const [text, setText] = useState("");
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setText(phrases[0]);
      return;
    }
    let i = 0, char = 0, deleting = false, timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const phrase = phrases[i % phrases.length];
      char = deleting ? char - 1 : char + 1;
      setText(phrase.slice(0, char));
      let delay = deleting ? speed / 2 : speed;
      if (!deleting && char === phrase.length) { deleting = true; delay = hold; }
      else if (deleting && char === 0) { deleting = false; i++; delay = 300; }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 300);
    return () => clearTimeout(timer);
  }, [phrases, speed, hold, reduced]);

  return text;
}

/** Which section id is currently in view (drives "Now Playing"). */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}
