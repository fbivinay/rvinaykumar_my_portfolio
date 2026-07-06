"use client";

import { useEffect, useRef } from "react";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Custom cursor: a red dot with a trailing ring.
 * Ring expands over interactive elements, contracts on click.
 * Only mounts for fine pointers; respects reduced motion.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("custom-cursor");

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    let x = -100, y = -100, rx = -100, ry = -100;
    let hovering = false, down = false;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      const t = e.target as HTMLElement;
      hovering = !!t.closest("a, button, [role=button], input, textarea, select, [data-cursor=hover]");
    };
    const onDown = () => (down = true);
    const onUp = () => (down = false);

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      const ringScale = down ? 0.7 : hovering ? 2.2 : 1;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%) scale(${down ? 0.5 : 1})`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%) scale(${ringScale})`;
      ring.style.opacity = hovering ? "0.9" : "0.5";
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      document.documentElement.classList.remove("custom-cursor");
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-2 w-2 rounded-full bg-accent"
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-8 w-8 rounded-full border border-accent/70 transition-opacity duration-300"
      />
    </>
  );
}
