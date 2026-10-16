"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * Fills the remaining height of a full-screen slide and scales its content
 * down (never up) until it fits, so a slide never spills on short laptops.
 */
export default function FitToScreen({ children }: { children: React.ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const o = outer.current!;
    const i = inner.current!;
    const fit = () => setScale(Math.min(1, o.clientHeight / i.offsetHeight));
    const ro = new ResizeObserver(fit);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outer} className="flex min-h-0 flex-1 items-center justify-center">
      <div ref={inner} className="w-full shrink-0" style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}
