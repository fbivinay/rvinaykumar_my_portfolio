"use client";

import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";

/** Every demo is laid out on this canvas (browser bar included) and scaled to the screen. */
export const CANVAS = { w: 1024, h: 640, bar: 34 };

/**
 * A laptop showing a browser window. The demo inside is drawn at a fixed
 * 1024×640 and scaled to whatever width the screen gets, so it looks the
 * same on every display.
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
    <div role="img" aria-label={label} className="relative w-full">
      {/* Lid */}
      <div className="relative rounded-[22px] border border-white/[0.13] bg-[#0b0b0b] p-[1.6%] pt-[2.4%] shadow-[0_50px_110px_-45px_rgba(229,9,20,0.6)]">
        <span aria-hidden className="absolute left-1/2 top-[0.9%] h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-white/20" />
        <div ref={screenRef} className="relative aspect-[16/10] overflow-hidden rounded-[5px] bg-black">
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
      {/* Base */}
      <div
        aria-hidden
        className="relative -mx-[4.5%] h-[clamp(10px,1.25vw,17px)] rounded-b-[18px] rounded-t-[3px] bg-gradient-to-b from-[#343434] via-[#1d1d1d] to-[#0e0e0e] shadow-[0_26px_40px_-18px_rgba(0,0,0,0.95)]"
      >
        <span className="absolute left-1/2 top-0 h-[42%] w-[15%] -translate-x-1/2 rounded-b-[8px] bg-[#0b0b0b]" />
      </div>
    </div>
  );
}
