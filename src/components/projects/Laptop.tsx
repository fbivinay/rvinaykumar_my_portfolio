"use client";

import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";

/** Every demo is laid out on this canvas (browser bar included) and scaled to the screen. */
export const CANVAS = { w: 1024, h: 640, bar: 34 };

/** Keyboard rows, as key widths (1 = a letter key). */
const KEYS = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.6],
  [1.6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1.9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.7],
  [2.4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.2],
  [1, 1, 1, 1.3, 5.6, 1.3, 1, 1, 1],
];

const BASE_TILT = 76; // degrees the keyboard deck lies back from the screen plane

/**
 * A white laptop in perspective: the display leans back a little and turns
 * toward the text beside it, over a keyboard deck seen from above. The demo
 * inside is drawn at a fixed 1024×640 and scaled to the screen, so it looks
 * the same on every display.
 */
export default function Laptop({
  url,
  label,
  children,
}: {
  url: string;
  /** What the recording shows, for screen readers (the demo itself is decorative). */
  label: string;
  children: React.ReactNode;
}) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = screenRef.current!;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / CANVAS.w));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    // The eye sits a little above the hinge, so the deck is seen from just above
    <div role="img" aria-label={label} className="relative w-full pb-[21%]" style={{ perspective: "4500px", perspectiveOrigin: "50% 55%" }}>
      {/* Contact shadow on the "desk" */}
      <div aria-hidden className="absolute inset-x-[3%] bottom-[1%] h-[7%] rounded-[50%] bg-black/80 blur-2xl" />

      <div className="relative" style={{ transformStyle: "preserve-3d", transform: "rotateY(4deg)" }}>
        {/* Lid: white bezel round the screen */}
        <div
          className="relative rounded-[20px] bg-[linear-gradient(155deg,#ffffff_0%,#f3f4f7_50%,#e2e4ea_100%)] p-[1.5%] pb-[2.4%] pt-[2.2%] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.07),inset_0_2px_0_rgba(255,255,255,0.95),0_50px_100px_-50px_rgba(229,9,20,0.55)]"
          style={{ transformOrigin: "50% 100%", transform: "rotateX(5deg)" }}
        >
          <span aria-hidden className="absolute left-1/2 top-[0.75%] h-[6px] w-[6px] -translate-x-1/2 rounded-full bg-[#2b2d33] ring-2 ring-[#d9dbe1]" />
          <div ref={screenRef} className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-black ring-1 ring-black/15">
            {scale > 0 && (
              <div
                aria-hidden
                className="absolute left-0 top-0 origin-top-left"
                style={{ width: CANVAS.w, height: CANVAS.h, transform: `scale(${scale})` }}
              >
                {/* Browser chrome */}
                <div className="flex items-center gap-4 bg-[#1f1f1f] px-4" style={{ height: CANVAS.bar }}>
                  <span className="flex gap-[7px]">
                    <i className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                    <i className="h-3 w-3 rounded-full bg-[#febc2e]" />
                    <i className="h-3 w-3 rounded-full bg-[#28c840]" />
                  </span>
                  <span className="mx-auto flex h-[22px] w-[440px] items-center justify-center gap-1.5 rounded-md bg-[#2c2c2c] text-[12px] text-white/70">
                    <Lock size={10} />
                    {url}
                  </span>
                  <span className="w-[52px]" />
                </div>
                {/* The apps are light: reset the portfolio's white ink for everything inside */}
                <div className="relative overflow-hidden bg-white text-[#111]" style={{ height: CANVAS.h - CANVAS.bar }}>
                  {children}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Keyboard deck, hinged to the bottom of the lid and seen from above */}
        <div
          aria-hidden
          className="absolute left-[-2%] right-[-2%] top-full h-[92%] rounded-b-[34px] rounded-t-[10px] bg-[linear-gradient(180deg,#c9ccd3_0%,#eef0f3_6%,#f7f8fa_40%,#e6e8ec_100%)]"
          style={{ transformOrigin: "50% 0%", transform: `rotateX(${BASE_TILT}deg)`, transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-x-[10%] top-[10%] flex h-[50%] flex-col gap-[3%] rounded-[14px] bg-[#dfe2e7] p-[1.4%] shadow-[inset_0_2px_4px_rgba(0,0,0,0.12)]">
            {KEYS.map((row, r) => (
              <div key={r} className="flex flex-1 gap-[0.6%]">
                {row.map((w, k) => (
                  <span key={k} className="rounded-[5px] bg-white shadow-[0_2px_0_#c4c7ce]" style={{ flexGrow: w }} />
                ))}
              </div>
            ))}
          </div>
          <div className="absolute left-1/2 top-[66%] h-[27%] w-[36%] -translate-x-1/2 rounded-[16px] bg-[#e9ebef] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06),inset_0_2px_3px_rgba(0,0,0,0.06)]" />
          {/* Front edge, standing upright at the near side of the deck */}
          <div
            className="absolute inset-x-[1%] top-full h-[5%] rounded-b-[18px] bg-[linear-gradient(180deg,#f4f5f7,#c6c9d0)]"
            style={{ transformOrigin: "50% 0%", transform: `rotateX(${-BASE_TILT}deg)` }}
          >
            <span className="absolute left-1/2 top-0 h-[45%] w-[14%] -translate-x-1/2 rounded-b-[10px] bg-[#d3d6dc]" />
          </div>
        </div>
      </div>
    </div>
  );
}
