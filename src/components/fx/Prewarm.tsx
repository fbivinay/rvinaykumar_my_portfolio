"use client";

import { useEffect, useState } from "react";
import { featuredProjects, moreProjects } from "@/lib/data";
import { MoreSlide, ProjectSlide } from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";

/* While the intro plays, every slide is mounted once behind it, one after
   another, and its images decoded. The first real turn to a slide then finds
   its layout, fonts (emoji included), images and code already warm, instead of
   paying for them halfway through the transition. */

const SLIDES = [...featuredProjects, ...moreProjects];
const STEP = 230; // ms each slide stays mounted
/** The recordings' emoji: the first one on a page costs a system font lookup. */
const EMOJI = "📢🎓📚📜🔬📘💰✅📅📝🎯👋🎉🔍";

export default function Prewarm() {
  const [i, setI] = useState(-1);

  useEffect(() => {
    const timers = Array.from({ length: SLIDES.length + 3 }, (_, k) => setTimeout(() => setI(k), 120 + k * STEP));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      for (const img of document.querySelectorAll<HTMLImageElement>("[data-prewarm] img")) img.decode().catch(() => {});
    }, 80);
    return () => clearTimeout(t);
  }, [i]);

  if (i < 0 || i > SLIDES.length + 1) return null;
  return (
    // behind the loader's black curtain, so none of it is ever seen
    <div data-prewarm aria-hidden inert className="pointer-events-none fixed inset-0 z-[100] overflow-hidden opacity-[0.01]">
      {i < SLIDES.length ? <ProjectSlide p={SLIDES[i]} /> : i === SLIDES.length ? <Skills /> : <MoreSlide />}
      <span className="absolute left-0 top-0">{EMOJI}</span>
    </div>
  );
}
