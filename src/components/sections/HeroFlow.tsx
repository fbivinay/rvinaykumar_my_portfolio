"use client";

import { useEffect, useRef, type RefObject } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

/* The landing page's living data diagram, drawn in the room beside the name.
   Three sources stream records down pipes into a transform step that turns
   them into blocks; a warehouse stores the blocks, and from there they feed a
   dashboard and a model whose forecast moves on with every batch. One canvas,
   no text, and nothing runs while the hero is off screen. */

const W = 340, H = 200; // design units; the drawing is scaled to fit its room
export const ink = (a: number) => `rgba(255,255,255,${a})`;
export const red = (a: number) => `rgba(229,9,20,${a})`;

type Pt = [number, number];
type Curve = [Pt, Pt, Pt, Pt]; // a cubic Bézier: start, two controls, end

const at = ([a, b, c, d]: Curve, t: number): Pt => {
  const u = 1 - t;
  const k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return [k[0] * a[0] + k[1] * b[0] + k[2] * c[0] + k[3] * d[0], k[0] * a[1] + k[1] * b[1] + k[2] * c[1] + k[3] * d[1]];
};
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const ease = (p: number) => 1 - Math.pow(1 - p, 3);
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

/* Layout, in design units */
const SRC: Pt[] = [[16, 42], [16, 100], [16, 158]];
const T = { x: 96, y: 100, r: 18 }; // transform step
const DB = { x: 166, y: 100, rx: 15, ry: 5, h: 36 }; // warehouse
const A = { x: 212, y: 10, w: 122, h: 80 }; // dashboard
const M = { x: 212, y: 110, w: 122, h: 80 }; // model
const IN: Curve[] = SRC.map(([x, y]) => [[x + 8, y], [52, y], [56, T.y], [T.x - T.r, T.y]]);
const TO_DB: Curve = [[T.x + T.r, T.y], [128, T.y], [140, T.y], [DB.x - DB.rx, DB.y]];
const TO_A: Curve = [[DB.x + DB.rx, DB.y - 10], [196, DB.y - 10], [192, A.y + A.h / 2], [A.x, A.y + A.h / 2]];
const TO_M: Curve = [[DB.x + DB.rx, DB.y + 10], [196, DB.y + 10], [192, M.y + M.h / 2], [M.x, M.y + M.h / 2]];
const PIPES = [...IN, TO_DB, TO_A, TO_M];
const LAYERS = [3, 4, 2]; // the model's network
const node = (l: number, i: number): Pt => [M.x + 14 + l * 18, M.y + M.h / 2 + (i - (LAYERS[l] - 1) / 2) * 15];
/** An element's layout position inside `root`, through any transformed or filtered ancestors on the way. */
export const offset = (el: HTMLElement, root: HTMLElement) => {
  let x = 0, y = 0;
  for (let e: HTMLElement | null = el; e && e !== root; e = e.offsetParent as HTMLElement | null) (x += e.offsetLeft), (y += e.offsetTop);
  return { x, y };
};
const PROCESS = 180; // ms the transform step spends on a record
const WAVE = 650; // ms for one pass through the network

export default function HeroFlow({ name, photo }: { name: RefObject<HTMLElement | null>; photo: RefObject<HTMLElement | null> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const wide = window.matchMedia("(min-width: 1024px)");
    let fit = { s: 1, ox: 0, oy: 0 };
    let shown = false;
    let still = false; // reduced motion: the held frame is repainted after every resize (resizing clears a canvas)

    /** Fits the canvas between the name and the photo, level with the name; hides it when there's no room. */
    const place = () => {
      const root = canvas.parentElement!, h1 = name.current, card = photo.current;
      const lines = h1 ? [...h1.querySelectorAll<HTMLElement>('[role="text"]')] : [];
      const left = Math.max(...lines.map((s) => offset(s, root).x + s.offsetWidth)) + 28;
      const w = card ? offset(card, root).x - 28 - left : 0;
      shown = wide.matches && !!h1 && lines.length > 0 && w >= 180;
      if (!shown) return void (canvas.style.display = "none");
      const top = offset(h1!, root).y - 12, h = h1!.offsetHeight + 12;
      Object.assign(canvas.style, { display: "block", left: `${left}px`, top: `${top}px`, width: `${w}px`, height: `${h}px` });
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const s = Math.min(w / W, h / H);
      fit = { s: s * dpr, ox: ((w - W * s) / 2) * dpr, oy: ((h - H * s) / 2) * dpr };
      if (still) draw(0, 1);
    };

    /* ── The workflow ── */
    type Packet = { c: Curve; t: number; dur: number; block: boolean; land: () => void };
    const packets: Packet[] = [];
    const send = (c: Curve, dur: number, block: boolean, land: () => void) => packets.push({ c, t: 0, dur, block, land });
    const flash = { src: [0, 0, 0], t: 0, db: 0, a: 0, m: 0 };
    const due = [rnd(0, 400), rnd(200, 700), rnd(400, 900)]; // ms until each source sends
    let queue = 0, busy = 0; // records waiting at the transform step, ms left on the current one
    let level = 0, drain = 0; // warehouse blocks (0–3), and the fade when it flushes
    let toDash = true;
    let sortFrom = [0.9, 0.4, 0.7, 0.55], sortTo = sortFrom, sortK = 1; // the transform's bars
    const bars = Array.from({ length: 9 }, () => rnd(0.25, 0.9)), shownBars = [...bars];
    const trend = Array.from({ length: 9 }, () => rnd(0.3, 0.8));
    let dashSlide = 0, kpi = 0.62, shownKpi = 0;
    let wave = -1, waiting = false; // network pass progress (0–1), and whether another batch is queued
    const actual = Array.from({ length: 10 }, (_, i) => 0.35 + i * 0.03 + rnd(-0.05, 0.05));
    let forecast: number[] = [], slide = 0;
    /** Recent trend, pulled back towards the middle so the series keeps wandering instead of running off. */
    const predict = () => {
      const last = actual[actual.length - 1];
      const drift = ((last - actual[actual.length - 4]) / 3) * 0.8 + (0.5 - last) * 0.12;
      forecast = [1, 2, 3, 4].map((k) => clamp01(last + drift * k));
    };
    predict();

    const step = (dt: number) => {
      for (let i = 0; i < 3; i++) {
        flash.src[i] = Math.max(0, flash.src[i] - dt / 300);
        if ((due[i] -= dt) <= 0) {
          due[i] = rnd(650, 1150);
          flash.src[i] = 1;
          send(IN[i], rnd(700, 950), false, () => queue++);
        }
      }
      if (busy > 0 && (busy -= dt) <= 0) {
        send(TO_DB, 420, true, () => {
          flash.db = 1;
          if (level === 3) (drain = 1), (level = 0);
          level++;
          const dash = toDash;
          toDash = !toDash;
          send(dash ? TO_A : TO_M, 560, true, () => {
            if (dash) {
              bars.shift(), bars.push(rnd(0.25, 0.95)), shownBars.shift(), shownBars.push(0);
              trend.shift(), trend.push(clamp01(trend[trend.length - 1] + rnd(-0.18, 0.2)));
              dashSlide = 1, kpi = rnd(0.35, 0.95), flash.a = 1;
            } else {
              flash.m = 1;
              if (wave < 0) wave = 0;
              else waiting = true;
            }
          });
        });
      }
      if (busy <= 0 && queue > 0) {
        queue--, busy = PROCESS, flash.t = 1;
        sortFrom = sortTo.map((v, i) => v + (sortFrom[i] - v) * (1 - ease(sortK)));
        sortTo = [rnd(0.3, 1), rnd(0.3, 1), rnd(0.3, 1), rnd(0.3, 1)].sort((a, b) => b - a);
        sortK = 0;
      }
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        if ((p.t += dt / p.dur) >= 1) packets.splice(i, 1), p.land();
      }
      if (wave >= 0 && (wave += dt / WAVE) >= 1) {
        actual.shift();
        actual.push(Math.min(0.9, Math.max(0.1, forecast[0] + rnd(-0.09, 0.09))));
        predict();
        slide = 1;
        wave = waiting ? 0 : -1;
        waiting = false;
      }
      const k = Math.min(1, dt / 160);
      shownBars.forEach((v, i) => (shownBars[i] = v + (bars[i] - v) * k));
      shownKpi += (kpi - shownKpi) * k;
      sortK = Math.min(1, sortK + dt / 420);
      dashSlide = Math.max(0, dashSlide - dt / 380);
      slide = Math.max(0, slide - dt / 380);
      drain = Math.max(0, drain - dt / 500);
      flash.t = Math.max(0, flash.t - dt / 260);
      flash.db = Math.max(0, flash.db - dt / 420);
      flash.a = Math.max(0, flash.a - dt / 500);
      flash.m = Math.max(0, flash.m - dt / 500);
    };

    /* ── Drawing ── */
    const curve = ([a, b, c, d]: Curve) => {
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.bezierCurveTo(b[0], b[1], c[0], c[1], d[0], d[1]);
    };
    const box = (x: number, y: number, w: number, h: number, r: number | number[]) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
    };
    const dot = (x: number, y: number, r: number, fill: string) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
    };
    const line = (pts: Pt[]) => {
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    };
    /** The cylinder's body between two heights, as a closed shape. */
    const drum = (y1: number, y2: number) => {
      ctx.beginPath();
      ctx.moveTo(DB.x - DB.rx, y1);
      ctx.lineTo(DB.x - DB.rx, y2);
      ctx.ellipse(DB.x, y2, DB.rx, DB.ry, 0, Math.PI, 0, true);
      ctx.lineTo(DB.x + DB.rx, y1);
      ctx.ellipse(DB.x, y1, DB.rx, DB.ry, 0, 0, Math.PI, false);
    };

    const draw = (now: number, intro: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(fit.s, 0, 0, fit.s, fit.ox, fit.oy);
      ctx.globalAlpha = intro;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // pipes, with a slow dash running along them
      ctx.lineWidth = 1;
      for (const c of PIPES) curve(c), (ctx.strokeStyle = ink(0.07)), ctx.stroke();
      ctx.setLineDash([2, 6]);
      ctx.lineDashOffset = -now / 45;
      for (const c of PIPES) curve(c), (ctx.strokeStyle = ink(0.16)), ctx.stroke();
      ctx.setLineDash([]);

      // sources: a table, a log, a sensor
      SRC.forEach(([x, y], i) => {
        const f = flash.src[i];
        box(x - 8, y - 8, 16, 16, 4);
        ctx.fillStyle = f > 0 ? red(0.14 * f) : ink(0.02);
        ctx.fill();
        ctx.strokeStyle = f > 0.05 ? red(0.4 + 0.5 * f) : ink(0.28);
        ctx.stroke();
        ctx.fillStyle = ctx.strokeStyle = ink(0.45);
        if (i === 0) for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) ctx.fillRect(x - 4.5 + c * 5, y - 4 + r * 3, 4, 1.8);
        if (i === 1) [9, 6, 8].forEach((len, r) => (line([[x - 4.5, y - 3 + r * 3], [x - 4.5 + len, y - 3 + r * 3]]), ctx.stroke()));
        if (i === 2) {
          dot(x - 2.5, y + 2.5, 1.3, ink(0.45));
          for (const r of [3.5, 6]) ctx.beginPath(), ctx.arc(x - 2.5, y + 2.5, r, -Math.PI / 2, 0), ctx.stroke();
        }
      });

      // transform step: records sorted into shape, a scan line while it works
      box(T.x - T.r, T.y - T.r, T.r * 2, T.r * 2, 7);
      ctx.fillStyle = flash.t > 0 ? red(0.1 * flash.t) : ink(0.025);
      ctx.fill();
      ctx.strokeStyle = flash.t > 0.05 ? red(0.35 + 0.5 * flash.t) : ink(0.28);
      ctx.stroke();
      const k = ease(sortK);
      sortTo.forEach((to, i) => {
        const v = sortFrom[i] + (to - sortFrom[i]) * k;
        box(T.x - 11, T.y - 10.5 + i * 7, 22 * v, 3, 1.5);
        ctx.fillStyle = i === 0 ? red(0.85) : ink(0.42);
        ctx.fill();
      });
      if (busy > 0) {
        const sx = T.x - 13 + 26 * (1 - busy / PROCESS);
        line([[sx, T.y - 13], [sx, T.y + 13]]);
        ctx.strokeStyle = red(0.7);
        ctx.stroke();
      }

      // warehouse: fills a level per block, flushes when full
      const top = DB.y - DB.h / 2, bot = DB.y + DB.h / 2, seg = DB.h / 3;
      drum(top, bot);
      ctx.fillStyle = ink(0.03);
      ctx.fill();
      for (let s = 0; s < 3; s++) {
        const lit = s < level ? 1 : drain;
        if (lit <= 0) continue;
        drum(bot - (s + 1) * seg + 1.5, bot - s * seg - 1);
        ctx.fillStyle = red((0.12 + 0.12 * flash.db) * lit);
        ctx.fill();
      }
      ctx.strokeStyle = ink(0.32);
      line([[DB.x - DB.rx, top], [DB.x - DB.rx, bot]]), ctx.stroke();
      line([[DB.x + DB.rx, top], [DB.x + DB.rx, bot]]), ctx.stroke();
      ctx.beginPath(), ctx.ellipse(DB.x, bot, DB.rx, DB.ry, 0, 0, Math.PI), ctx.stroke();
      ctx.strokeStyle = ink(0.16);
      for (let s = 1; s < 3; s++) ctx.beginPath(), ctx.ellipse(DB.x, bot - s * seg, DB.rx, DB.ry, 0, 0, Math.PI), ctx.stroke();
      ctx.beginPath(), ctx.ellipse(DB.x, top, DB.rx, DB.ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = flash.db > 0 ? red(0.25 * flash.db) : ink(0.04);
      ctx.fill();
      ctx.strokeStyle = flash.db > 0.05 ? red(0.4 + 0.5 * flash.db) : ink(0.35);
      ctx.stroke();

      // dashboard: bars scroll in, a trend line rides over them, a KPI ring
      box(A.x, A.y, A.w, A.h, 8);
      ctx.fillStyle = ink(0.02);
      ctx.fill();
      ctx.strokeStyle = ink(0.1 + 0.25 * flash.a);
      ctx.stroke();
      ctx.save();
      box(A.x + 1, A.y + 1, A.w - 2, A.h - 2, 7);
      ctx.clip();
      ctx.strokeStyle = ink(0.05);
      for (let g = 0; g < 3; g++) line([[A.x + 8, A.y + 34 + g * 14], [A.x + A.w - 8, A.y + 34 + g * 14]]), ctx.stroke();
      const x0 = A.x + 10, slot = (A.w - 20) / 8, off = dashSlide * slot, base = A.y + A.h - 9;
      shownBars.forEach((v, i) => {
        const x = x0 + (i - 1) * slot + off + slot * 0.22, h = v * 40;
        box(x, base - h, slot * 0.56, h, [2, 2, 0, 0]);
        ctx.fillStyle = i === shownBars.length - 1 ? red(0.85) : ink(0.2);
        ctx.fill();
      });
      const pts: Pt[] = trend.map((v, i) => [x0 + (i - 0.5) * slot + off, base - 6 - v * 34]);
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length - 1; i++) ctx.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2);
      const end = pts[pts.length - 1];
      ctx.lineTo(end[0], end[1]);
      ctx.strokeStyle = red(0.75);
      ctx.lineWidth = 1.3;
      ctx.stroke();
      dot(end[0], end[1], 4.5, red(0.18));
      dot(end[0], end[1], 2, red(0.95));
      ctx.restore();
      ctx.lineWidth = 2;
      const kx = A.x + A.w - 13, ky = A.y + 13;
      ctx.beginPath(), ctx.arc(kx, ky, 6, 0, Math.PI * 2), (ctx.strokeStyle = ink(0.1)), ctx.stroke();
      ctx.beginPath(), ctx.arc(kx, ky, 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * shownKpi), (ctx.strokeStyle = red(0.85)), ctx.stroke();
      ctx.lineWidth = 1;

      // model: a pass through the network, then the forecast moves on
      box(M.x, M.y, M.w, M.h, 8);
      ctx.fillStyle = ink(0.02);
      ctx.fill();
      ctx.strokeStyle = ink(0.1 + 0.25 * flash.m);
      ctx.stroke();
      const lit = (l: number) => wave >= 0 && wave >= [0, 0.42, 0.82][l] && wave <= [0.3, 0.7, 1][l];
      ctx.strokeStyle = ink(0.08);
      for (let l = 0; l < 2; l++)
        for (let i = 0; i < LAYERS[l]; i++)
          for (let j = 0; j < LAYERS[l + 1]; j++) line([node(l, i), node(l + 1, j)]), ctx.stroke();
      if (wave >= 0)
        for (let l = 0; l < 2; l++) {
          const p = clamp01((wave - [0.12, 0.55][l]) / 0.33);
          if (p <= 0 || p >= 1) continue;
          for (let i = 0; i < LAYERS[l]; i++)
            for (let j = 0; j < LAYERS[l + 1]; j++) {
              const [ax, ay] = node(l, i), [bx, by] = node(l + 1, j), e = ease(p);
              dot(ax + (bx - ax) * e, ay + (by - ay) * e, 1.2, red(0.9));
            }
        }
      for (let l = 0; l < 3; l++)
        for (let i = 0; i < LAYERS[l]; i++) {
          const [nx, ny] = node(l, i);
          if (lit(l)) dot(nx, ny, 5, red(0.18));
          dot(nx, ny, 2.8, lit(l) ? red(0.9) : ink(0.12));
          ctx.beginPath(), ctx.arc(nx, ny, 2.8, 0, Math.PI * 2), (ctx.strokeStyle = ink(0.4)), ctx.stroke();
        }
      const cx0 = M.x + 64, cx1 = M.x + M.w - 9, cy0 = M.y + 14, cy1 = M.y + M.h - 14;
      const dx = (cx1 - cx0) / 13, y = (v: number) => cy1 - v * (cy1 - cy0);
      const now0 = cx0 + 9 * dx;
      line([[cx0, cy1 + 4], [cx1, cy1 + 4]]), (ctx.strokeStyle = ink(0.08)), ctx.stroke();
      ctx.save();
      box(M.x + 58, M.y + 1, M.w - 59, M.h - 2, 7);
      ctx.clip();
      const real: Pt[] = actual.map((v, i) => [cx0 + (i + slide) * dx, y(v)]);
      line(real), (ctx.strokeStyle = ink(0.5)), (ctx.lineWidth = 1.2), ctx.stroke();
      const from = now0 + slide * dx;
      const ahead: Pt[] = [[from, y(actual[actual.length - 1])], ...forecast.map((v, i): Pt => [from + (i + 1) * dx, y(v)])];
      ctx.beginPath();
      ahead.forEach(([px, py], i) => (i ? ctx.lineTo(px, py - (0.03 + 0.035 * i) * (cy1 - cy0)) : ctx.moveTo(px, py)));
      for (let i = ahead.length - 1; i > 0; i--) ctx.lineTo(ahead[i][0], ahead[i][1] + (0.03 + 0.035 * i) * (cy1 - cy0));
      ctx.closePath();
      ctx.fillStyle = red(0.12);
      ctx.fill();
      ctx.setLineDash([3, 3]);
      line(ahead), (ctx.strokeStyle = red(0.85)), ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      ctx.lineWidth = 1;
      line([[now0, cy0 - 4], [now0, cy1 + 4]]), (ctx.strokeStyle = ink(0.12)), ctx.stroke();
      dot(now0, y(actual[actual.length - 1]), 2, ink(0.85));

      // what's in flight: records as dots, blocks as small red squares
      for (const p of packets) {
        const [px, py] = at(p.c, ease(p.t) * 0.35 + p.t * 0.65);
        if (p.block) {
          dot(px, py, 4.5, red(0.16));
          ctx.fillStyle = red(0.95);
          ctx.fillRect(px - 1.8, py - 1.8, 3.6, 3.6);
        } else dot(px, py, 1.7, ink(0.75));
      }
      ctx.globalAlpha = 1;
    };

    place();
    const ro = new ResizeObserver(place);
    ro.observe(canvas.parentElement!);
    wide.addEventListener("change", place);
    document.fonts?.ready.then(place);

    if (reduced) {
      for (let t = 0; t < 6000; t += 16) step(16); // a moment into the workflow, held still
      draw(0, 1);
      still = true;
      return () => (ro.disconnect(), wide.removeEventListener("change", place));
    }
    let raf = 0, last = 0, start = 0;
    const tick = (now: number) => {
      if (!start) start = last = now;
      if (shown) step(Math.min(50, now - last)), draw(now, ease(clamp01((now - start - 900) / 900)));
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wide.removeEventListener("change", place);
    };
  }, [name, photo, reduced]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute hidden" />;
}
