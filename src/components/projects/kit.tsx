"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Building blocks for the laptop "screen recordings". Every demo is a pure
 * function of `t`, the milliseconds into its loop, so a scene is just a list
 * of moments: the cursor arrives here, this panel opens, that text types in.
 */

/** Milliseconds into a looping timeline. Reduced motion freezes it on `still`. */
export function useLoop(length: number, still: number) {
  const reduced = usePrefersReducedMotion();
  const [t, setT] = useState(0);
  useEffect(() => {
    if (reduced) {
      setT(still);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      setT((now - start) % length);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [length, still, reduced]);
  return t;
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

/** 0 → 1 as t runs from a to b. */
export const prog = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

/** What someone typing `cps` characters a second has typed `start` ms in. */
export const typed = (text: string, t: number, start: number, cps = 18) =>
  text.slice(0, Math.max(0, Math.floor(((t - start) * cps) / 1000)));

/** A figure counting up from `from` to `to`, the way dashboards load. */
export const countUp = (to: number, t: number, start: number, dur = 1200, from = 0) =>
  from + (to - from) * easeOut(prog(t, start, start + dur));

/** Indian digit grouping: 131116 → "1,31,116". */
export const inr = (n: number) => Math.round(n).toLocaleString("en-IN");

/** Fades the recording in after the loop restarts and out before it ends. */
export function Loop({ t, length, children }: { t: number; length: number; children: React.ReactNode }) {
  const o = Math.min(prog(t, 0, 300), 1 - prog(t, length - 450, length - 50));
  return (
    <div className="absolute inset-0" style={{ opacity: o }}>
      {children}
    </div>
  );
}

/** [time, x, y, click?]: the cursor reaches (x, y) at `time`, clicking there if flagged. */
export type CursorKey = [number, number, number, 1?];

/** macOS-style pointer gliding between keys, with a ripple on every click. */
export function Cursor({ t, keys }: { t: number; keys: CursorKey[] }) {
  let i = 0;
  while (i < keys.length - 1 && keys[i + 1][0] <= t) i++;
  const [t0, x0, y0] = keys[i];
  const [t1, x1, y1] = keys[i + 1] ?? keys[i];
  const p = t1 > t0 ? easeInOut(prog(t, t0, t1)) : 1;
  let since = Infinity;
  for (const k of keys) if (k[3] && k[0] <= t) since = t - k[0];
  return (
    <div
      className="pointer-events-none absolute left-0 top-0 z-50"
      style={{ transform: `translate(${x0 + (x1 - x0) * p}px, ${y0 + (y1 - y0) * p}px)` }}
    >
      {since < 450 && (
        <span
          className="absolute -left-[18px] -top-[18px] h-9 w-9 rounded-full border-2 border-[#E50914]/70 bg-[#E50914]/20"
          style={{ transform: `scale(${0.35 + since / 450})`, opacity: 1 - since / 450 }}
        />
      )}
      <svg
        width="17"
        height="24"
        viewBox="0 0 17 24"
        className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]"
        style={{ transform: `scale(${since < 140 ? 0.85 : 1})`, transformOrigin: "2px 2px" }}
      >
        <path
          d="M1.5 1.5v17.2l4.3-4.1 2.9 6.9 3-1.3-2.9-6.7h6z"
          fill="#111"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/** Splits light Markdown (**bold**, "- " bullets) into words so an answer can stream in. */
export type Token = { text: string; bold: boolean; br: boolean };
export function tokenize(md: string): Token[] {
  const out: Token[] = [];
  md.split("\n").forEach((line, li) => {
    if (li > 0) out.push({ text: "", bold: false, br: true });
    let bold = false;
    line
      .replace(/^( *)- /, (_, sp: string) => " ".repeat(sp.length * 2) + "• ")
      .split(/(\*\*)/)
      .forEach((part) => {
        if (part === "**") return void (bold = !bold);
        const words = part.split(" ");
        words.forEach((w, wi) => {
          const text = wi < words.length - 1 ? `${w} ` : w;
          if (text) out.push({ text, bold, br: false });
        });
      });
  });
  return out;
}

/** The first `n` tokens, rendered the way the chat widgets render their Markdown. */
export function Streamed({ tokens, n }: { tokens: Token[]; n: number }) {
  return (
    <>
      {tokens.slice(0, n).map((tk, i) =>
        tk.br ? <br key={i} /> : tk.bold ? <strong key={i}>{tk.text}</strong> : <span key={i}>{tk.text}</span>
      )}
    </>
  );
}
