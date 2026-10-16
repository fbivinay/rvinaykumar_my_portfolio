"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "@/lib/hooks";

let lenis: Lenis | null = null;

/** Scrolls the page smoothly: through Lenis while it runs, so the two never fight; natively otherwise. */
export function smoothScrollTo(target: number | HTMLElement) {
  if (lenis) return lenis.scrollTo(target, { offset: typeof target === "number" ? 0 : -88 }); // clear the fixed navbar
  if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else target.scrollIntoView({ behavior: "smooth" });
}

/** Lenis smooth scroll — disabled entirely for reduced-motion users. */
export default function SmoothScroll() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const l = (lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    }));
    let raf: number;
    const loop = (time: number) => {
      l.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      l.destroy();
      lenis = null;
    };
  }, [reduced]);

  return null;
}
