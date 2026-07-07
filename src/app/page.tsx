"use client";

import { useCallback, useEffect, useState } from "react";
import Loader from "@/components/fx/Loader";
import SmoothScroll from "@/components/fx/SmoothScroll";
import CustomCursor from "@/components/fx/CustomCursor";
import ScrollProgress from "@/components/fx/ScrollProgress";
import Navbar from "@/components/layout/Navbar";
import CommandPalette from "@/components/layout/CommandPalette";
import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Credentials from "@/components/sections/Credentials";
import Contact from "@/components/sections/Contact";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const onLoaderDone = useCallback(() => setStarted(true), []);

  /* Global keyboard shortcuts:
     ⌘/Ctrl+K → command palette · ⌘/Ctrl+/ → jump to contact */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Loader onDone={onLoaderDone} />
      <SmoothScroll />
      <CustomCursor />
      <ScrollProgress />
      <Navbar onOpenPalette={() => setPaletteOpen(true)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      <main id="main">
        <Hero started={started} />
        <Projects />
        <Experience />
        <Skills />
        <Credentials />
        <Contact />
      </main>
    </>
  );
}
