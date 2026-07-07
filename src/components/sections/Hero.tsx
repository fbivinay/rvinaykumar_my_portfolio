"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Download, FolderOpen, Send } from "lucide-react";
import { profile } from "@/lib/data";
import { usePrefersReducedMotion, useTypewriter } from "@/lib/hooks";
import MagneticButton from "@/components/ui/MagneticButton";

/* ── Ambient particle field + mouse-reactive spotlight (one canvas) ── */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, raf = 0;
    let mx = -1000, my = -1000;

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    let dots: P[] = [];

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(110, Math.floor((w * h) / 16000));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.4,
        a: Math.random() * 0.5 + 0.15,
      }));
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 380);
      grad.addColorStop(0, "rgba(229,9,20,0.10)");
      grad.addColorStop(1, "rgba(229,9,20,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      for (const p of dots) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const d = Math.hypot(p.x - mx, p.y - my);
        const near = Math.max(0, 1 - d / 260);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + near * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = near > 0.05
          ? `rgba(229,9,20,${p.a + near * 0.5})`
          : `rgba(255,255,255,${p.a * 0.5})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [reduced]);

  if (reduced) return null;
  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />;
}

/* ── Staggered character reveal for the name ── */
function NameReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span aria-label={text} role="text" className="inline-block">
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={{ opacity: 0, y: 40, rotateX: 60, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
          transition={{ delay: delay + i * 0.03, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block will-change-transform"
          style={{ transformOrigin: "bottom" }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero({ started }: { started: boolean }) {
  const typed = useTypewriter(profile.roles);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Introduction"
      className="relative flex min-h-svh items-center overflow-hidden"
    >
      {/* Layered cinematic backdrop */}
      <div className="absolute inset-0 bg-grid" aria-hidden />
      <div
        aria-hidden
        className="animate-drift absolute -top-1/3 left-1/2 h-[80vh] w-[80vw] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]"
      />
      <ParticleField />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-base to-transparent"
      />

      {started && (
        <motion.div
          style={{ y, opacity }}
          className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-0"
        >
          {/* ── LEFT: text column ── */}
          <div className="order-2 text-center lg:order-1 lg:text-left">
            {/* Netflix-style meta row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mb-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[12px] font-medium tracking-wide text-mute lg:justify-start"
            >
              <span>2026</span>
              <span aria-hidden>·</span>
              <span className="rounded border border-line px-1.5 py-0.5 text-[10px]">MSc BDA</span>
              <span aria-hidden>·</span>
              <span>{profile.location.split(",")[0]}</span>
            </motion.div>

            <h1 className="text-balance text-5xl font-extrabold leading-[1.02] tracking-tighter text-ink sm:text-7xl lg:text-8xl">
              <NameReveal text="R Vinay" delay={0.25} />
              <br />
              <span className="text-accent drop-shadow-[0_0_40px_rgba(229,9,20,0.45)]">
                <NameReveal text="Kumar" delay={0.55} />
              </span>
            </h1>

            {/* Typewriter role */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="mt-6 min-h-[1.75rem] text-lg font-semibold text-ink sm:text-xl"
              aria-live="polite"
            >
              {typed}
              <span className="ml-0.5 inline-block h-5 w-[2px] animate-pulse bg-accent align-middle" aria-hidden />
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.7 }}
              className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed sm:text-base lg:mx-0"
            >
               <span className="font-semibold text-ink">
                {profile.subHeadline}
                </span>{" "}
              <span className="text-ink">
                — building end-to-end ML pipelines, IoT-based real-time analytics, and
                  dashboards that turn raw data into clear answers.
              </span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.7 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              <MagneticButton href="#projects" variant="solid">
                <FolderOpen size={15} aria-hidden /> View Projects
              </MagneticButton>
              <MagneticButton href={profile.resumeFile} variant="ghost" download>
                <Download size={15} aria-hidden /> Download Resume
              </MagneticButton>
              <MagneticButton href="#contact" variant="ghost">
                <Send size={15} aria-hidden /> Contact Me
              </MagneticButton>
            </motion.div>
          </div>

          {/* ── RIGHT: profile poster ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 flex justify-center lg:order-2 lg:justify-end"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="group relative w-[230px] sm:w-[290px] lg:w-full lg:max-w-[380px]"
            >
              {/* red glow behind the poster */}
              <div
                aria-hidden
                className="absolute -inset-4 rounded-[2rem] bg-accent/25 blur-3xl transition-opacity duration-500 group-hover:opacity-100 lg:opacity-70"
              />
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-[0_40px_90px_-25px_rgba(229,9,20,0.55)]">
                <Image
                  src="/profile.jpg"
                  alt="R Vinay Kumar"
                  fill
                  priority
                  sizes="(max-width: 1024px) 290px, 380px"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                {/* cinematic gradient wash */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent"
                />
                {/* top-left ribbon */}
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded bg-accent px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-glow">
                  Top Pick · 2026
                </div>
                {/* bottom label */}
                <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                  <p className="flex items-center gap-1.5 text-[11px] font-medium text-white/80">
                    <span className="relative flex h-2 w-2" aria-hidden>
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                    </span>
                    Now Streaming
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">Data Science · AI / ML</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* Scroll indicator */}
      <motion.a
        href="#projects"
        aria-label="Scroll to Projects section"
        initial={{ opacity: 0 }}
        animate={{ opacity: started ? 1 : 0 }}
        transition={{ delay: 2.1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-mute transition-colors hover:text-accent"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="block"
        >
          <ChevronDown size={22} aria-hidden />
        </motion.span>
      </motion.a>
    </section>
  );
}
