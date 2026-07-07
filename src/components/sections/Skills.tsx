"use client";

import { useEffect, useRef } from "react";
import { skillGroups, sphereSkills } from "@/lib/data";
import { usePrefersReducedMotion } from "@/lib/hooks";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * 3D rotating skill sphere — hand-rolled canvas projection instead of
 * Three.js. Same effect, ~2 KB instead of ~150 KB, and it stays at
 * 60fps on low-end devices. Drag / hover to steer the rotation.
 */
function SkillSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let W = 0, H = 0, R = 0;

    // Fibonacci-sphere distribution → evenly spread labels
    const N = sphereSkills.length;
    const pts = sphereSkills.map((label, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / N);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      return {
        label,
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.sin(phi) * Math.sin(theta),
        z: Math.cos(phi),
      };
    });

    let rotX = 0.28, rotY = 0;
    let velX = 0.0016, velY = 0.0032;
    let targetVX = velX, targetVY = velY;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(W, H) * 0.38;
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
      targetVY = nx * 0.012;
      targetVX = ny * 0.008;
    };
    const onLeave = () => {
      targetVX = 0.0016;
      targetVY = 0.0032;
    };

    const draw = () => {
      velX += (targetVX - velX) * 0.04;
      velY += (targetVY - velY) * 0.04;
      rotX += velX;
      rotY += velY;
      ctx.clearRect(0, 0, W, H);

      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

      const projected = pts
        .map((p) => {
          // rotate Y then X
          const x1 = p.x * cosY - p.z * sinY;
          const z1 = p.x * sinY + p.z * cosY;
          const y1 = p.y * cosX - z1 * sinX;
          const z2 = p.y * sinX + z1 * cosX;
          const scale = 1 / (1.9 - z2 * 0.7); // perspective
          return { label: p.label, sx: W / 2 + x1 * R, sy: H / 2 + y1 * R, z: z2, scale };
        })
        .sort((a, b) => a.z - b.z);

      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      for (const p of projected) {
        const depth = (p.z + 1) / 2; // 0 back → 1 front
        const size = 9 + depth * 6;
        ctx.font = `${depth > 0.8 ? "700" : "500"} ${size}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (depth > 0.82) {
          ctx.fillStyle = "#E50914";
          ctx.shadowColor = "rgba(229,9,20,0.6)";
          ctx.shadowBlur = 14;
        } else {
          ctx.fillStyle = isLight
            ? `rgba(10,10,10,${0.18 + depth * 0.6})`
            : `rgba(255,255,255,${0.14 + depth * 0.6})`;
          ctx.shadowBlur = 0;
        }
        ctx.fillText(p.label, p.sx, p.sy);
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  if (reduced) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      data-cursor="hover"
      className="h-[340px] w-full sm:h-[420px]"
    />
  );
}

export default function Skills() {
  const marqueeItems = [...sphereSkills, ...sphereSkills];
  return (
    <section id="skills" aria-label="Skills" className="relative py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Genres"
          title="Skills & Tooling"
          blurb="Steer the sphere — the toolkit spans statistics, ML, BI dashboards, and cloud."
        />

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-line bg-surface/60">
              <div className="bg-grid absolute inset-0" aria-hidden />
              <SkillSphere />
            </div>
          </Reveal>

          {/* Grouped chips with hover glow */}
          <div className="grid gap-5">
            {skillGroups.map((g, gi) => (
              <Reveal key={g.label} delay={gi * 0.06}>
                <div>
                  <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-mute">
                    {g.label}
                  </h3>
                  <ul className="flex flex-wrap gap-2" role="list">
                    {g.items.map((item) => (
                      <li key={item}>
                        <span
                          data-cursor="hover"
                          className="inline-block rounded-md border border-line bg-surface px-3 py-1.5 text-[13px] font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-glow"
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Infinite marquee */}
      <div className="marquee-mask mt-20 overflow-hidden border-y border-line py-4" aria-hidden>
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
          {marqueeItems.map((s, i) => (
            <span key={i} className="flex items-center gap-10 text-sm font-semibold uppercase tracking-[0.2em] text-mute/60">
              {s} <span className="text-accent">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
