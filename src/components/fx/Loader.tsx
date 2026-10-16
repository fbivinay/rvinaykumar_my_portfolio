"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/data";
import { usePrefersReducedMotion } from "@/lib/hooks";
import Prewarm from "@/components/fx/Prewarm";

const RUN = 2600; // ms the count takes from 0 to 100
const LIFT = 400; // ms the curtain takes to lift: 3 s in all
const READY = 2350; // the page mounts behind the curtain just before it lifts

/** When (0–100%) the count reaches v%: the inverse of an ease-in-out, so it starts gently and lands softly. */
const at = (v: number) => {
  const y = v / 100;
  return `${((y < 0.5 ? Math.cbrt(y / 4) : 1 - Math.cbrt(2 * (1 - y)) / 2) * 100).toFixed(3)}%`;
};

/** The bar and the count's digit strips, as keyframes drawn from that one curve so they never drift
    apart. Plain CSS sent with the page: they start with the first paint, before any script runs, and
    run on the compositor. */
const COUNT_CSS = (() => {
  let css = `@keyframes loader-bar{${Array.from({ length: 101 }, (_, v) => `${at(v)}{transform:scaleX(${v / 100})}`).join("")}}`;
  for (const place of [100, 10, 1]) {
    let frames = "", last = "";
    for (let v = 0; v <= 100; v++) {
      const digit = Math.floor(v / place) % 10, shown = v >= place || place === 1 ? 1 : 0;
      if (`${digit}${shown}` === last) continue;
      last = `${digit}${shown}`;
      frames += `${at(v)}{transform:translateY(-${digit}em);opacity:${shown};animation-timing-function:steps(1,end)}`;
    }
    css += `@keyframes loader-digit-${place}{${frames}}.loader-digit-${place}{animation:loader-digit-${place} ${RUN}ms both}`;
  }
  return `${css}.loader-bar{animation:loader-bar ${RUN}ms linear both}`;
})();

/**
 * Cinematic intro, on every visit, lasting 3 s. A red monogram beam sweeps in
 * (a nod to the Netflix ident), the count runs to 100, the name reveals letter
 * by letter, then the curtain lifts. Everything here is CSS animating transforms
 * and opacity, which the compositor runs by itself, so it stays perfectly smooth
 * while the page warms up behind it. Skipped for reduced motion.
 */
export default function Loader({ onReady }: { onReady: () => void }) {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<"run" | "lift" | "gone">("run");

  useEffect(() => {
    if (reduced) {
      setPhase("gone");
      onReady();
      return;
    }
    // The curtain has been up, and animating, since the first paint: time the rest from there.
    const fcp = performance.getEntriesByName("first-contentful-paint")[0]?.startTime;
    const up = fcp === undefined ? 0 : Math.max(0, performance.now() - fcp);
    const after = (ms: number, fn: () => void) => setTimeout(fn, Math.max(0, ms - up));
    const timers = [after(READY, onReady), after(RUN, () => setPhase("lift")), after(RUN + LIFT, () => setPhase("gone"))];
    return () => timers.forEach(clearTimeout);
  }, [reduced, onReady]);

  if (phase === "gone") return null;
  return (
    <>
      {phase === "run" && <Prewarm />}
      <div
        role="status"
        aria-label="Loading portfolio"
        className={`fixed inset-0 z-[110] flex flex-col items-center justify-center bg-black transition-[opacity,transform] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          phase === "lift" ? "scale-[1.04] opacity-0" : ""
        }`}
      >
        <style>{COUNT_CSS}</style>

        {/* Monogram beam */}
        <div className="relative mb-10 h-24 w-24">
          <div className="loader-rise absolute inset-0 flex origin-bottom items-center justify-center">
            <span className="text-7xl font-extrabold tracking-tighter text-accent drop-shadow-[0_0_28px_rgba(229,9,20,0.7)]">
              {profile.monogram}
            </span>
          </div>
          <div className="loader-beam absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-sm" />
        </div>

        {/* Name — staggered letter reveal */}
        <div className="flex overflow-hidden" aria-hidden>
          {profile.name.split("").map((ch, i) => (
            <span
              key={i}
              className="loader-letter text-xl font-semibold tracking-[0.14em] text-white sm:text-2xl"
              style={{ animationDelay: `${0.9 + i * 0.035}s` }}
            >
              {ch === " " ? " " : ch}
            </span>
          ))}
        </div>

        {/* Progress */}
        <div className="mt-12 w-56">
          <div className="h-px w-full bg-white/10">
            <div className="loader-bar h-px origin-left bg-accent shadow-glow" />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-mute">
            <span className="loader-line">Now streaming</span>
            <span className="flex leading-none tabular-nums tracking-normal text-white">
              {[100, 10, 1].map((place) => (
                <span key={place} className="h-[1em] overflow-hidden">
                  <span className={`loader-digit-${place} flex flex-col`}>
                    {Array.from({ length: 10 }, (_, d) => (
                      <span key={d} className="h-[1em]">
                        {d}
                      </span>
                    ))}
                  </span>
                </span>
              ))}
              %
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
