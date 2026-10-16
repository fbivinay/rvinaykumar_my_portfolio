"use client";

import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";

/** Every demo is laid out on this canvas (browser bar included) and scaled to the screen. */
export const CANVAS = { w: 1104, h: 640, bar: 34 };

/** A laptop keyboard, row by row, as key widths (1 = a letter key). Each row adds up to 14.5. */
const ROWS = [
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // esc, F1–F12, power
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5], // ` 1–0 - = delete
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // tab Q–] \
  [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.75], // caps A–' return
  [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25], // shift Z–/ shift
  [1, 1, 1, 1.25, 5, 1.25, 1, 3], // fn ctrl opt cmd space cmd opt, then the arrow keys
];
const GAP = "0.9%"; // between keys, as a share of the keyboard's width
/** Flex size of a key `w` units wide, so that keys line up on one pitch in every row. */
const keyFlex = (w: number) => `0 0 calc(${w} * (100% + ${GAP}) / 14.5 - ${GAP})`;
const KEY =
  "rounded-[0.35cqw] bg-[linear-gradient(180deg,#3d4047,#26282d)] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_0.25cqw_0_#111215,0_0_0_1px_rgba(0,0,0,0.22)]";

const BASE_TILT = 70; // degrees the base lies back from the screen plane
const THICK = "2.6cqw"; // the base's thickness (cqw = 1% of the laptop's width)
const CORNERS = "rounded-b-[3.5cqw]"; // the base's front corners, seen from above
/** The scoop in the middle of the front edge, for lifting the lid. */
const NOTCH = "radial-gradient(6% 2% at 50% 100%, transparent 96%, #000 100%)";

/**
 * A white laptop in perspective: the display leans back a little over a
 * keyboard base seen from just above, with its keys, trackpad and front edge.
 * Lengths are in cqw so it keeps its shape at any size. The demo inside is
 * drawn at a fixed 1104×640 and scaled to the screen, so it looks the same on
 * every display.
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
    <div role="img" aria-label={label} className="w-full [container-type:inline-size]">
      {/* The eye sits 21.4cqw above the hinge (which is 32cqw up from the bottom), so the base is seen from above */}
      <div className="relative pb-[32%]" style={{ perspective: "800cqw", perspectiveOrigin: "50% calc(100% - 53.4cqw)" }}>
        <div className="relative" style={{ transformStyle: "preserve-3d" }}>
          {/* Lid: white bezel round the screen, its curved bottom edge showing the lid's thickness.
              It is as wide as the base, and faces the viewer square-on: tilting it, even by a few
              degrees, resamples the screen and halves the sharpness of the recording. */}
          <div className="relative rounded-[20px] border-b-[3px] border-[#d3d6dc] bg-[linear-gradient(155deg,#ffffff_0%,#f3f4f7_50%,#e2e4ea_100%)] px-[1.4%] py-[2.05%] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.07),inset_0_2px_0_rgba(255,255,255,0.95),0_50px_100px_-50px_rgba(229,9,20,0.55)]">
            <span aria-hidden className="absolute left-1/2 top-[0.75%] h-[6px] w-[6px] -translate-x-1/2 rounded-full bg-[#2b2d33] ring-2 ring-[#d9dbe1]" />
            <div
              ref={screenRef}
              className="relative overflow-hidden rounded-[6px] bg-black ring-1 ring-black/15"
              style={{ aspectRatio: `${CANVAS.w} / ${CANVAS.h}` }}
            >
              {scale > 0 && (
                // zoom rather than a scale transform: the demo is laid out at its final size, so text is drawn crisp
                <div aria-hidden className="absolute left-0 top-0" style={{ width: CANVAS.w, height: CANVAS.h, zoom: scale }}>
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

          {/* Base, hinged to the bottom of the lid and as deep as a real one */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-full h-[71.3cqw]"
            style={{ transformOrigin: "50% 0%", transform: `rotateX(${BASE_TILT}deg)`, transformStyle: "preserve-3d" }}
          >
            {/* Shadow on the desk, under the base */}
            <div
              className={`absolute inset-x-[0.5%] bottom-0 top-[3%] ${CORNERS}`}
              style={{
                transform: `translateZ(calc(-1 * ${THICK} - 0.1cqw))`,
                boxShadow: "0 0.6cqw 1.6cqw 0.3cqw rgba(0,0,0,0.7), 0 5cqw 9cqw rgba(0,0,0,0.45)",
              }}
            />
            {/* The chassis' underside: a copy of the deck sunk by the base's thickness, so its
                rim shows below the deck as one unbroken front edge and rounded corners. Drawn
                a little wider, as perspective shrinks it, so its sides line up with the deck's. */}
            <div
              className={`absolute inset-x-[-0.45%] inset-y-0 ${CORNERS} bg-[linear-gradient(180deg,#e8eaed_89%,#d2d5da_94%,#b3b8c0_98.4%,#8e939b_100%)]`}
              style={{ transform: `translateZ(calc(-1 * ${THICK}))` }}
            />
            {/* Deck */}
            <div
              className={`absolute inset-0 rounded-t-[6px] ${CORNERS} bg-[linear-gradient(180deg,#a9aeb6_0%,#dcdfe4_3%,#f6f7f9_14%,#fbfbfc_60%,#eef0f2_100%)] shadow-[inset_0_-0.35cqw_0_rgba(255,255,255,0.95),inset_0_0_0_1px_rgba(0,0,0,0.05)]`}
              style={{ maskImage: NOTCH, WebkitMaskImage: NOTCH }}
            >
              {/* Keyboard */}
              <div className="absolute inset-x-[6.5%] top-[6%] flex h-[46%] flex-col gap-[2.3%]">
                {ROWS.map((row, r) => (
                  <div key={r} className="flex min-h-0" style={{ flex: r === 0 ? 0.7 : 1, gap: GAP }}>
                    {row.map((w, k) =>
                      r === ROWS.length - 1 && k === row.length - 1 ? (
                        // arrow keys: left, up over down, right
                        <span key={k} className="flex gap-[4.5%]" style={{ flex: keyFlex(w) }}>
                          <span className={`${KEY} h-[44%] flex-1 self-end`} />
                          <span className="flex flex-1 flex-col gap-[12%]">
                            <span className={`${KEY} flex-1`} />
                            <span className={`${KEY} flex-1`} />
                          </span>
                          <span className={`${KEY} h-[44%] flex-1 self-end`} />
                        </span>
                      ) : (
                        <span key={k} className={KEY} style={{ flex: keyFlex(w) }} />
                      ),
                    )}
                  </div>
                ))}
              </div>

              {/* Trackpad */}
              <div className="absolute left-1/2 top-[56.5%] h-[37.5%] w-[44%] -translate-x-1/2 rounded-[1.4cqw] bg-[linear-gradient(180deg,#e2e5e9,#d8dbe0)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.17),inset_0_0.3cqw_0.6cqw_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.9)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
