"use client";

import { useEffect, useRef, type RefObject } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { clamp01, ease as easeOut, ink, offset, red } from "@/components/sections/HeroFlow";

/* Slim animations in the page margins either side of the name and photo,
   drawn in a different language from the pipeline beside the name.
   Left, the data work: a raw table is cleaned row by row, its columns are
   typed, and it folds into a star schema whose joins then light up.
   Right, the decisions: a model learns the boundary between two classes, is
   scored on a confusion matrix, then sorts incoming records on its own. */

const W = 120, H = 460; // design units for each side; scaled to fit its margin
const ease = (p: number) => easeOut(clamp01(p));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** A repeatable random stream (mulberry32), so each batch looks the same on every frame. */
const seeded = (k: number) => {
  let a = (k * 2654435761) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let x = Math.imul(a ^ (a >>> 15), a | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
};
const gauss = (r: () => number) => Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());

/* ── Left: a table cleaned, typed and modelled ── */
const ROWS = 7, COLS = 4, CW = 22, CG = 4, X0 = 10, RY = 36, RH = 9, RS = 14;
const TABLE = { x: 6, y: 18, w: 108, h: 118 };
const FACT = { x: 39, y: 318, w: 42, h: 50 };
const DIMS = [{ x: 4, y: 262 }, { x: 86, y: 262 }, { x: 4, y: 392 }, { x: 86, y: 392 }]; // 30×40 each
const EVERY_L = 4800, LIFE_L = 8100; // a new batch every 4.8 s; each lives 8.1 s, so two overlap

const leftBatch = (k: number) => {
  const r = seeded(k + 1);
  const raw = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => 0.3 + r() * 0.7));
  const dup = 2 + Math.floor(r() * 4);
  raw[dup] = [...raw[dup - 1]]; // a duplicate record, removed in cleaning
  const nulls = new Set<number>();
  while (nulls.size < 3) {
    const i = Math.floor(r() * ROWS * COLS);
    if (Math.floor(i / COLS) !== dup) nulls.add(i);
  }
  const joins = [0, 1, 2, 3].sort(() => r() - 0.5);
  return { raw, dup, nulls, joins };
};

/* ── Right: a model trained, scored and put to work ── */
const PX = 10, PY = 18, PS = 100; // the training plot
const EVERY_R = 6000, LIFE_R = 6600;
const MATRIX = { x: 16, y: 170, cell: 42, gap: 4 };
const COUNTS = [21, 3, 2, 22]; // true negatives, false positives, false negatives, true positives
const CARD_EVERY = 800, CARD_LIFE = 1150;
const TRAYS = [{ x: 12, cls: 1 }, { x: 68, cls: 0 }]; // accepted (red) and set aside
const TRAY = { y: 404, w: 40, h: 40, holds: 6 };

const model = (k: number) => {
  const r = seeded(1000 + k);
  const m0 = [30 + r() * 10, 30 + r() * 10], m1 = [62 + r() * 10, 60 + r() * 10];
  const pts = Array.from({ length: 24 }, (_, i) => {
    const m = i % 2 ? m1 : m0;
    return [Math.min(95, Math.max(5, m[0] + gauss(r) * 12)), Math.min(95, Math.max(5, m[1] + gauss(r) * 12)), i % 2];
  });
  const phi = Math.atan2(m1[1] - m0[1], m1[0] - m0[0]);
  return { pts, mid: [(m0[0] + m1[0]) / 2, (m0[1] + m1[1]) / 2], phi, start: phi + (r() < 0.5 ? -1 : 1) * (0.9 + r() * 0.5) };
};

export default function HeroSides({ name, photo }: { name: RefObject<HTMLElement | null>; photo: RefObject<HTMLElement | null> }) {
  const leftRef = useRef<HTMLCanvasElement>(null);
  const rightRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const L = leftRef.current!, R = rightRef.current!;
    const lc = L.getContext("2d")!, rc = R.getContext("2d")!;
    const wide = window.matchMedia("(min-width: 1024px)");
    let s = 1, dpr = 1, shown = false;
    let still = false; // reduced motion: the held frame is repainted after every resize (resizing clears a canvas)

    /** Centres each canvas in its margin, level with the photo; hidden when the margins are too narrow. */
    const place = () => {
      const root = L.parentElement!, h1 = name.current, card = photo.current;
      if (!h1 || !card) return;
      const left = offset(h1, root).x, right = offset(card, root).x + card.offsetWidth;
      const roomL = left - 24 - 16, roomR = root.clientWidth - 16 - (right + 24);
      const room = Math.min(roomL, roomR), top = offset(card, root).y, h = card.offsetHeight;
      shown = wide.matches && room >= 84;
      L.style.display = R.style.display = shown ? "block" : "none";
      if (!shown) return;
      s = Math.min(room / W, h / H, 1.4);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = W * s, hh = H * s;
      const put = (c: HTMLCanvasElement, x: number) => {
        Object.assign(c.style, { left: `${x}px`, top: `${top + (h - hh) / 2}px`, width: `${w}px`, height: `${hh}px` });
        c.width = Math.round(w * dpr);
        c.height = Math.round(hh * dpr);
      };
      put(L, 16 + (roomL - w) / 2);
      put(R, right + 24 + (roomR - w) / 2);
      if (still) frame(9200, 1);
    };

    const box = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
    };
    const segment = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    /* ── Left ── */
    const batches = new Map<number, ReturnType<typeof leftBatch>>();
    const drawLeft = (ctx: CanvasRenderingContext2D, t: number, intro: number) => {
      const newest = Math.floor(t / EVERY_L);
      for (let k = Math.max(0, newest - 1); k <= newest; k++) {
        const u = t - k * EVERY_L;
        if (u < 0 || u >= LIFE_L) continue;
        if (!batches.has(k)) batches.set(k, leftBatch(k));
        for (const old of batches.keys()) if (old < newest - 1) batches.delete(old);
        const b = batches.get(k)!;
        ctx.globalAlpha = intro * Math.min(ease(u / 500), 1 - clamp01((u - 7500) / 600));

        // the table, shrinking into the fact table of the schema
        const m = ease((u - 2900) / 1000);
        const sx = lerp(1, FACT.w / TABLE.w, m), sy = lerp(1, FACT.h / TABLE.h, m);
        const tx = lerp(TABLE.x, FACT.x, m), ty = lerp(TABLE.y, FACT.y, m);
        const rect = (x: number, y: number, w: number, h: number): [number, number, number, number] => [tx + (x - TABLE.x) * sx, ty + (y - TABLE.y) * sy, w * sx, h * sy];

        box(ctx, ...rect(TABLE.x, TABLE.y, TABLE.w, TABLE.h), lerp(5, 3, m));
        ctx.fillStyle = ink(0.025);
        ctx.fill();
        ctx.strokeStyle = ink(0.16);
        ctx.lineWidth = 1;
        ctx.stroke();

        // header, with a type mark popping onto each column once it's clean
        for (let c = 0; c < COLS; c++) {
          const x = X0 + c * (CW + CG);
          box(ctx, ...rect(x, 24, CW * 0.62, 5), 1.5);
          ctx.fillStyle = ink(0.34);
          ctx.fill();
          const pop = ease((u - 2300 - c * 120) / 300);
          if (pop <= 0) continue;
          const [mx, my] = rect(x + CW * 0.82, 26.5, 0, 0);
          const r = 2.2 * pop * Math.max(sx, 0.6);
          ctx.fillStyle = c === 0 ? red(0.9) : ink(0.6);
          ctx.beginPath();
          if (c === 0) ctx.arc(mx, my, r, 0, Math.PI * 2);
          else if (c === 1) ctx.rect(mx - r, my - r, r * 2, r * 2);
          else if (c === 2) ctx.moveTo(mx, my - r), ctx.lineTo(mx + r, my), ctx.lineTo(mx, my + r), ctx.lineTo(mx - r, my);
          else ctx.moveTo(mx, my - r), ctx.lineTo(mx + r, my + r), ctx.lineTo(mx - r, my + r);
          ctx.fill();
        }

        // rows, cleaned as the scan passes: ragged values even out, gaps fill in, the duplicate drops out
        const scan = lerp(30, 136, clamp01((u - 500) / 1800));
        const passed = (r: number) => (u < 500 ? 0 : ease((scan - (RY + r * RS)) / RS));
        const gone = passed(b.dup);
        for (let r = 0; r < ROWS; r++) {
          const y = RY + r * RS - (r > b.dup ? RS * gone : 0);
          const dup = r === b.dup;
          if (dup && gone >= 1) continue;
          const p = passed(r);
          for (let c = 0; c < COLS; c++) {
            const x = X0 + c * (CW + CG);
            const missing = b.nulls.has(r * COLS + c);
            const w = CW * lerp(missing ? 0.7 : b.raw[r][c], 0.86, p);
            const h = dup ? RH * (1 - gone) : RH;
            box(ctx, ...rect(x, y + (RH - h) / 2, w, h), 2);
            if (missing && p < 0.5) {
              ctx.setLineDash([2, 2]);
              ctx.strokeStyle = red(0.75);
              ctx.stroke();
              ctx.setLineDash([]);
            } else {
              const fixed = missing ? clamp01((u - 500 - (r + 1) * 260) / 900) : 1; // imputed values glow, then settle
              ctx.fillStyle = dup ? red(0.32 * (1 - gone)) : missing && fixed < 1 ? red(0.55 * (1 - fixed) + 0.1) : ink(0.24);
              ctx.fill();
            }
          }
          if (dup && gone < 1) {
            ctx.fillStyle = red(0.8 * (1 - gone));
            ctx.fillRect(...rect(TABLE.x + 1, y, 2, RH));
          }
        }
        if (u > 500 && u < 2300) {
          box(ctx, 8, scan - 9, 104, 9, 2);
          ctx.fillStyle = red(0.08);
          ctx.fill();
          ctx.strokeStyle = red(0.85);
          segment(ctx, 8, scan, 112, scan);
        }

        // the star schema forms round it, then its joins light up in turn
        if (u > 3800) {
          const join = u > 5100 && u < 7400 ? b.joins[Math.floor((u - 5100) / 575) % 4] : -1;
          DIMS.forEach((d, i) => {
            const inn = ease((u - 3900 - i * 180) / 500), link = ease((u - 4150 - i * 180) / 450);
            if (inn <= 0) return;
            const left = d.x < FACT.x, x = d.x + (left ? -1 : 1) * 14 * (1 - inn);
            const save = ctx.globalAlpha;
            ctx.globalAlpha = save * inn;
            box(ctx, x, d.y, 30, 40, 3);
            ctx.fillStyle = ink(0.025);
            ctx.fill();
            ctx.strokeStyle = join === i ? red(0.7) : ink(0.2);
            ctx.stroke();
            box(ctx, x + 4, d.y + 5, 16, 4, 1.5);
            ctx.fillStyle = ink(0.34);
            ctx.fill();
            for (let k = 0; k < 3; k++) {
              box(ctx, x + 4, d.y + 14 + k * 8, 22, 4, 1.5);
              ctx.fillStyle = join === i && k === (Math.floor(u / 575) % 3) ? red(0.85) : ink(0.18);
              ctx.fill();
            }
            ctx.globalAlpha = save;
            if (link <= 0) return;
            const ax = left ? FACT.x : FACT.x + FACT.w, ay = FACT.y + (d.y < FACT.y ? 12 : FACT.h - 12);
            const bx = left ? x + 30 : x, by = d.y + 20;
            ctx.strokeStyle = join === i ? red(0.85) : ink(0.26);
            segment(ctx, ax, ay, lerp(ax, bx, link), lerp(ay, by, link));
            if (link >= 1) {
              const dir = left ? -1 : 1; // crow's foot on the fact side: many rows to one
              for (const dy of [-3, 0, 3]) segment(ctx, ax + dir * 5, ay + (by - ay) * (5 / Math.abs(bx - ax)), ax, ay + dy);
            }
          });
          if (join >= 0) {
            const row = Math.floor(u / 575) % 5;
            box(ctx, ...rect(X0 - 2, RY + row * RS - 2.5, 104, RH + 5), 2);
            ctx.strokeStyle = red(0.85);
            ctx.stroke();
          }
        }
      }
    };

    /* ── Right ── */
    const models = new Map<number, ReturnType<typeof model>>();
    const filled = [0, 0]; // records filed so far, by class
    let lastCard = -1;
    const cardClass = (j: number) => (seeded(5000 + j)() < 0.55 ? 1 : 0);
    const drawRight = (ctx: CanvasRenderingContext2D, t: number, intro: number) => {
      const newest = Math.floor(t / EVERY_R);
      for (let k = Math.max(0, newest - 1); k <= newest; k++) {
        const u = t - k * EVERY_R;
        if (u < 0 || u >= LIFE_R + (k === newest ? Infinity : 0)) continue;
        if (!models.has(k)) models.set(k, model(k));
        for (const old of models.keys()) if (old < newest - 1) models.delete(old);
        const md = models.get(k)!;
        const fadeOut = k === newest ? 1 : 1 - clamp01((u - EVERY_R) / 600);
        if (fadeOut <= 0) continue;
        const alpha = intro * Math.min(ease(u / 400), fadeOut);

        // training: the boundary swings into place between the classes
        ctx.globalAlpha = alpha;
        box(ctx, PX, PY, PS, PS, 5);
        ctx.fillStyle = ink(0.025);
        ctx.fill();
        ctx.strokeStyle = ink(0.16);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.strokeStyle = ink(0.05);
        for (const g of [1, 2]) segment(ctx, PX + (PS * g) / 3, PY + 4, PX + (PS * g) / 3, PY + PS - 4), segment(ctx, PX + 4, PY + (PS * g) / 3, PX + PS - 4, PY + (PS * g) / 3);
        const learn = Math.max(0, u - 400);
        const phi = md.phi + (md.start - md.phi) * Math.exp(-learn / 750) * Math.cos(learn / 260);
        const shift = 10 * Math.exp(-learn / 600) * Math.sin(learn / 300);
        const nx = Math.cos(phi), ny = Math.sin(phi);
        const qx = PX + md.mid[0] + nx * shift, qy = PY + md.mid[1] + ny * shift;
        ctx.save();
        box(ctx, PX, PY, PS, PS, 5);
        ctx.clip();
        ctx.beginPath(); // the side the model calls positive
        ctx.moveTo(qx - ny * 200, qy + nx * 200);
        ctx.lineTo(qx + ny * 200, qy - nx * 200);
        ctx.lineTo(qx + ny * 200 + nx * 300, qy - nx * 200 + ny * 300);
        ctx.lineTo(qx - ny * 200 + nx * 300, qy + nx * 200 + ny * 300);
        ctx.fillStyle = red(0.07);
        ctx.fill();
        ctx.strokeStyle = red(0.85);
        ctx.lineWidth = 1.3;
        segment(ctx, qx - ny * 200, qy + nx * 200, qx + ny * 200, qy - nx * 200);
        ctx.restore();
        ctx.lineWidth = 1;
        md.pts.forEach(([x, y, c], i) => {
          const a = ease((u - i * 12) / 300);
          if (a <= 0) return;
          const px = PX + x, py = PY + y;
          const wrong = ((px - qx) * nx + (py - qy) * ny > 0 ? 1 : 0) !== c;
          ctx.globalAlpha = alpha * a;
          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          if (c) (ctx.fillStyle = red(0.9)), ctx.fill();
          else (ctx.strokeStyle = ink(0.7)), ctx.stroke();
          if (wrong && u > 400) {
            ctx.beginPath();
            ctx.arc(px, py, 4.5, 0, Math.PI * 2);
            ctx.strokeStyle = red(0.25 + 0.3 * Math.abs(Math.sin(u / 140)));
            ctx.stroke();
          }
        });
        ctx.globalAlpha = alpha;
        for (let e = 0; e < 12; e++) {
          box(ctx, 14 + e * 8, 127, 4.5, 4.5, 1.2);
          ctx.fillStyle = learn > (e + 1) * 210 ? ink(0.55) : ink(0.1);
          ctx.fill();
        }

        // evaluation: each cell of the confusion matrix counts up
        const score = ease((u - 3000) / 900);
        const { x: mx, y: my, cell, gap } = MATRIX;
        // column and row marks in the scatter's own glyphs: predicted / actual, negative then positive
        ctx.beginPath(), ctx.arc(mx + cell / 2, my - 7, 2, 0, Math.PI * 2), (ctx.strokeStyle = ink(0.6)), ctx.stroke();
        dotAt(ctx, mx + cell * 1.5 + gap, my - 7, red(0.9));
        ctx.beginPath(), ctx.arc(mx - 7, my + cell / 2, 2, 0, Math.PI * 2), ctx.stroke();
        dotAt(ctx, mx - 7, my + cell * 1.5 + gap, red(0.9));
        COUNTS.forEach((n, i) => {
          const cx = mx + (i % 2) * (cell + gap), cy = my + Math.floor(i / 2) * (cell + gap);
          box(ctx, cx, cy, cell, cell, 4);
          ctx.fillStyle = ink(0.02);
          ctx.fill();
          ctx.strokeStyle = ink(0.13);
          ctx.stroke();
          const lit = Math.round(n * score), right = i === 0 || i === 3;
          for (let d = 0; d < 25; d++) {
            const on = d < lit;
            dotAt(ctx, cx + 7 + (d % 5) * 7, cy + 7 + Math.floor(d / 5) * 7, on ? (i === 3 ? red(0.9) : right ? ink(0.7) : i === 1 ? red(0.4) : ink(0.35)) : ink(0.06), 1.5);
          }
        });
      }

      // decisions: new records are scored at the gate and filed by the model
      ctx.globalAlpha = intro;
      const gy = 340;
      ctx.strokeStyle = ink(0.22);
      segment(ctx, 26, gy, 94, gy);
      segment(ctx, 26, gy - 4, 26, gy + 4);
      segment(ctx, 94, gy - 4, 94, gy + 4);
      const J = Math.floor((t - 3000) / CARD_EVERY);
      let scoring = false;
      for (let j = Math.max(0, J - 2); j <= J; j++) {
        const v = t - 3000 - j * CARD_EVERY;
        if (v < 0) continue;
        const c = cardClass(j);
        if (v >= CARD_LIFE) {
          if (j > lastCard) (lastCard = j), filled[c]++;
          continue;
        }
        const tray = TRAYS[c === 1 ? 0 : 1];
        const drop = ease(v / 250), go = ease((v - 650) / 450);
        const x = lerp(51, tray.x + 2, go), y = lerp(lerp(292, gy - 14, drop), TRAY.y + TRAY.h - 8 - (filled[c] % TRAY.holds) * 5.5, go);
        ctx.globalAlpha = intro * Math.min(1, v / 150);
        box(ctx, x, y, 18, 12, 2.5);
        ctx.fillStyle = ink(0.06);
        ctx.fill();
        ctx.strokeStyle = ink(0.4);
        ctx.stroke();
        ctx.fillStyle = ink(0.3);
        ctx.fillRect(x + 3, y + 3.5, 8, 1.5);
        ctx.fillRect(x + 3, y + 7, 11, 1.5);
        if (v > 250 && v < 650) {
          scoring = true;
          const sx = lerp(x - 2, x + 20, (v - 250) / 400);
          ctx.strokeStyle = red(0.8);
          segment(ctx, sx, y - 2, sx, y + 14);
        }
        if (v > 520) {
          box(ctx, x + 13, y + 3, 3.5, 3.5, 1);
          if (c) (ctx.fillStyle = red(0.95)), ctx.fill();
          else (ctx.strokeStyle = ink(0.7)), ctx.stroke();
        }
      }
      ctx.globalAlpha = intro;
      ctx.beginPath(); // the model at the gate
      ctx.moveTo(60, gy - 5), ctx.lineTo(65, gy), ctx.lineTo(60, gy + 5), ctx.lineTo(55, gy);
      ctx.fillStyle = scoring ? red(0.9) : ink(0.35);
      ctx.fill();
      TRAYS.forEach((tr) => {
        const n = filled[tr.cls] % TRAY.holds;
        ctx.strokeStyle = ink(0.22);
        ctx.beginPath();
        ctx.moveTo(tr.x, TRAY.y), ctx.lineTo(tr.x, TRAY.y + TRAY.h), ctx.lineTo(tr.x + TRAY.w, TRAY.y + TRAY.h), ctx.lineTo(tr.x + TRAY.w, TRAY.y);
        ctx.stroke();
        for (let k = 0; k < n; k++) {
          box(ctx, tr.x + 4, TRAY.y + TRAY.h - 8 - k * 5.5, 32, 4, 1.5);
          ctx.fillStyle = tr.cls ? red(0.75) : ink(0.4);
          ctx.fill();
        }
      });
    };
    const dotAt = (ctx: CanvasRenderingContext2D, x: number, y: number, fill: string, r = 2) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
    };

    const frame = (t: number, intro: number) => {
      for (const [c, ctx, draw] of [[L, lc, drawLeft], [R, rc, drawRight]] as const) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.setTransform(s * dpr, 0, 0, s * dpr, 0, 0);
        ctx.lineCap = ctx.lineJoin = "round";
        draw(ctx, t, intro);
      }
    };

    place();
    const ro = new ResizeObserver(place);
    ro.observe(L.parentElement!);
    wide.addEventListener("change", place);
    document.fonts?.ready.then(place);

    if (reduced) {
      for (let t = 0; t <= 9200; t += 100) frame(t, 1); // advance the trays, then hold one moment
      still = true;
      return () => (ro.disconnect(), wide.removeEventListener("change", place));
    }
    let raf = 0, start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = now - start;
      if (shown) frame(t, ease((t - 1200) / 900));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wide.removeEventListener("change", place);
    };
  }, [name, photo, reduced]);

  return (
    <>
      <canvas ref={leftRef} aria-hidden className="pointer-events-none absolute hidden" />
      <canvas ref={rightRef} aria-hidden className="pointer-events-none absolute hidden" />
    </>
  );
}
