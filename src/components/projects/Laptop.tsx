"use client";

import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";

/** Every demo is laid out on this canvas (browser bar included) and scaled to the screen. */
export const CANVAS = { w: 1024, h: 640, bar: 34 };

/** A laptop keyboard, row by row, as key widths (1 = a letter key). Each row adds up to 14.5. */
const ROWS = [
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // esc, F1–F12, power
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5], // ` 1–0 - = delete
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // tab Q–] \
  [1.8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.7], // caps A–' return
  [2.3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.2], // shift Z–/ shift
  [1, 1, 1, 1.25, 5, 1.25, 1], // fn ctrl opt cmd space cmd opt (arrows follow)
];
const KEY = "rounded-[4px] bg-[linear-gradient(180deg,#3b3e45,#26282d)] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_2px_0_#101114]";

const BASE_TILT = 76; // degrees the keyboard deck lies back from the screen plane

/**
 * A white laptop in perspective: the display leans back a little over a
 * keyboard deck seen from just above, with its keys, trackpad and front edge.
 * The demo inside is drawn at a fixed 1024×640 and scaled to the screen, so
 * it looks the same on every display.
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
    // The eye sits above the hinge, so the keyboard deck is seen from just above
    <div role="img" aria-label={label} className="relative w-full pb-[19%]" style={{ perspective: "5000px", perspectiveOrigin: "50% 45%" }}>
      {/* Shadows on the desk: a soft spread, and a tight one right under the front edge */}
      <div aria-hidden className="absolute inset-x-[1%] bottom-0 h-[8%] rounded-[50%] bg-black/70 blur-3xl" />
      <div aria-hidden className="absolute inset-x-[7%] bottom-[2.6%] h-[1.6%] rounded-[50%] bg-black/90 blur-[7px]" />

      <div className="relative" style={{ transformStyle: "preserve-3d" }}>
        {/* Lid: white bezel round the screen, its bottom edge showing the lid's thickness */}
        <div
          className="relative rounded-[20px] border-b-[3px] border-[#d3d6dc] bg-[linear-gradient(155deg,#ffffff_0%,#f3f4f7_50%,#e2e4ea_100%)] p-[1.5%] pb-[2.2%] pt-[2.2%] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.07),inset_0_2px_0_rgba(255,255,255,0.95),0_50px_100px_-50px_rgba(229,9,20,0.55)]"
          style={{ transformOrigin: "50% 100%", transform: "rotateX(4deg)" }}
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
          className="absolute left-[-0.5%] right-[-0.5%] top-full h-[80%] rounded-b-[28px] rounded-t-[6px] bg-[linear-gradient(180deg,#a9aeb6_0%,#dcdfe4_3%,#f6f7f9_14%,#fbfbfc_55%,#eceef1_100%)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]"
          style={{ transformOrigin: "50% 0%", transform: `rotateX(${BASE_TILT}deg)`, transformStyle: "preserve-3d" }}
        >
          {/* Keyboard, set into a shallow well */}
          <div className="absolute inset-x-[6.5%] top-[7%] flex h-[47%] flex-col gap-[2.2%] rounded-[10px] bg-[#c4c8cf] p-[0.9%] shadow-[inset_0_3px_6px_rgba(0,0,0,0.28),inset_0_-1px_0_rgba(255,255,255,0.6)]">
            {ROWS.map((row, r) => (
              <div key={r} className="flex min-h-0 gap-[0.55%]" style={{ flex: r === 0 ? 0.62 : 1 }}>
                {row.map((w, k) => (
                  <span key={k} className={KEY} style={{ flexGrow: w, flexBasis: 0 }} />
                ))}
                {r === ROWS.length - 1 && (
                  // arrow keys: left, up over down, right
                  <span className="flex gap-[3%]" style={{ flexGrow: 3, flexBasis: 0 }}>
                    <span className={`${KEY} flex-1 self-end`} style={{ height: "50%" }} />
                    <span className="flex flex-1 flex-col gap-[6%]">
                      <span className={`${KEY} flex-1`} />
                      <span className={`${KEY} flex-1`} />
                    </span>
                    <span className={`${KEY} flex-1 self-end`} style={{ height: "50%" }} />
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Trackpad, flush with the deck */}
          <div className="absolute left-1/2 top-[60%] h-[33%] w-[42%] -translate-x-1/2 rounded-[14px] bg-[linear-gradient(180deg,#eef0f3,#e3e5e9)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.09),inset_0_2px_3px_rgba(0,0,0,0.07),0_1px_0_rgba(255,255,255,0.9)]" />

          {/* Front edge: the base's thickness, standing upright at the near side */}
          <div
            className="absolute inset-x-[0.4%] top-full h-[6%] rounded-b-[22px] bg-[linear-gradient(180deg,#ffffff_0%,#e4e6ea_35%,#c3c7ce_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,1)]"
            style={{ transformOrigin: "50% 0%", transform: `rotateX(${-BASE_TILT}deg)` }}
          >
            <span className="absolute left-1/2 top-0 h-[42%] w-[13%] -translate-x-1/2 rounded-b-[12px] bg-[linear-gradient(180deg,#c9ccd2,#dcdfe3)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
