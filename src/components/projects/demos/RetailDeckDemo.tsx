"use client";

import {
  ArrowLeft, ArrowRight, CalendarDays, CloudRain, History, Maximize2, Percent, Tag,
} from "lucide-react";
import { Cursor, easeOut, Loop, prog, useLoop, type CursorKey } from "../kit";

/* mom-lab-finals.vercel.app, presented: the cover's barcode turning into a
   sales chart, a jump to the AI/ML chapter, one build step, then the demand
   forecasting scene answering "how much should we order?". Drawn on the
   deck's own 1600-wide stage (1rem = 16px) and scaled into the laptop. */

const LENGTH = 17800;
const STAGE = { w: 1600, h: 947, scale: 1024 / 1600 };
const C = {
  bg: "#f5f4f0", surface: "#fbfaf7", fg: "#171a17", fg2: "#474b46", fg3: "#6b6f69", line: "#dfddd6",
  line2: "#c9c6be", accent: "#1d6a44", accentInk: "#165536", wash: "#e0ebe3", signal: "#e2703a",
  signalInk: "#b04f1d", neg: "#b8432b", mute: "#b3afa6",
};
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const SECTIONS = [
  ["01", "Roles", "From Data to Decision"],
  ["02", "Data", "The Data a Retailer Never Stops Collecting"],
  ["03", "AI/ML", "From What Happened? to What Happens Next?"],
  ["04", "Industry", "Target: What an Analyst Learns"],
  ["05", "Careers", "What Should We Actually Learn?"],
  ["06", "Jobs", "Retail Analyst Jobs in India"],
];

/* ── Cover: the barcode that becomes a sales chart (slides/cover.tsx) ── */
const BAR = [1, 2, 1, 3, 1, 1, 2, 1, 4, 1, 2, 3, 1, 1, 2, 1, 3, 2, 1, 1, 4, 1, 2, 1, 3, 1, 1, 2, 1, 3];
const GAP = [1, 2, 1, 1, 2, 1, 3, 1, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 1, 2, 1, 1, 3, 1, 2, 1, 1, 2, 1];
const X0 = 24, SPAN = 640, BASE = 330, TOP = 70;
const unit = SPAN / (BAR.reduce((a, b) => a + b, 0) + GAP.reduce((a, b) => a + b, 0));
let acc = X0;
const barcode = BAR.map((w, i) => {
  const x = acc;
  acc += (w + (GAP[i] ?? 0)) * unit;
  return { x, w: w * unit };
});
const slot = SPAN / BAR.length;
const chart = BAR.map((_, i) => ({ x: X0 + i * slot + (slot - 11) / 2, w: 11, h: 62 + i * 4.4 + 26 * Math.sin(i * 0.85) + ((i * 7) % 5) * 5 }));
const trend = chart.map((c, i) => `${i ? "L" : "M"}${(c.x + c.w / 2).toFixed(1)} ${(BASE - c.h - 14).toFixed(1)}`).join(" ");
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/* ── AI/ML chapter opener (slides/aiml.tsx) ── */
const YEAR = [7400, 7900, 8600, 9300, 8800, 8200, 7900, 8300, 8900, 9600, 9200, 10000];
const hY = (v: number) => (v / 12000) * 330;

/* ── Demand forecasting (slides/aiml.tsx) ── */
const WEEKS = [14200, 14800, 15100, 14600, 15500, 16100, 15800, 16400, 16900, 16300, 17000, 17600, 17200, 17900, 18100, 17700];
const FORECAST = 18400, LOW = 17200, HIGH = 19600;
const fy = (v: number) => 640 - ((v - 12000) / 14000) * 340;
const fx = (i: number) => 670 + (i * (1440 - 650 - 140)) / (WEEKS.length - 1);
const FX = fx(WEEKS.length - 1) + 90;
const weeksPath = WEEKS.map((v, i) => `${i ? "L" : "M"}${fx(i)} ${fy(v)}`).join(" ");
const INPUTS = [
  { label: "Historical sales", Icon: History, d: "M0 22 L10 18 L20 20 L30 12 L40 14 L50 6" },
  { label: "Price", Icon: Tag, d: "M0 8 H18 V18 H34 V10 H50" },
  { label: "Promotions", Icon: Percent, d: "M0 20 H12 V6 H20 V20 H36 V6 H44 V20 H50" },
  { label: "Seasonality", Icon: CalendarDays, d: "M0 14 C8 2 17 2 25 14 S42 26 50 14" },
  { label: "Weather", Icon: CloudRain, d: "M0 18 L10 16 L20 19 L30 6 L40 9 L50 17" },
];
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/* Scene changes, in loop time */
const TO_INTRO = 4600; // curtain into the AI/ML chapter
const STEP = 7000; // → reveals the build
const TO_FORECAST = 8800; // rise into demand forecasting
const ORDERS: [number, number][] = [[0, 18400], [12000, 14000], [13600, 24000], [15200, 18400]];

const s = (v: number) => v * STAGE.scale; // stage px → canvas px for the cursor
const KEYS: CursorKey[] = [
  [0, 700, 260],
  [3200, 420, 470],
  [4300, s(612), s(764), 1], // 03 AI/ML
  [5000, s(612), s(764)],
  [6400, 640, 330],
  [8200, s(222), s(903)],
  [8500, s(222), s(903), 1], // third dot: Demand forecasting
  [9000, s(222), s(903)],
  [11500, 448, 525],
  [12000, 448, 525, 1], // 14,000
  [13600, 561, 525, 1], // 24,000
  [15200, 504, 525, 1], // 18,400
  [15700, 504, 525],
  [16600, 760, 260],
];

/** Headline words rising out of a mask, like AnimatedHeadline. */
function Rise({ text, t, at, style }: { text: string; t: number; at: number; style: React.CSSProperties }) {
  return (
    <span style={{ display: "block", ...style }}>
      {text.split(" ").map((w, i) => {
        const p = easeOut(prog(t, at + i * 60, at + i * 60 + 700));
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", marginRight: "0.24em" }}>
            <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 105}%)` }}>{w}</span>
          </span>
        );
      })}
    </span>
  );
}

const fadeIn = (t: number, at: number, dur = 500, dy = 12): React.CSSProperties => {
  const p = easeOut(prog(t, at, at + dur));
  return { opacity: p, transform: `translateY(${(1 - p) * dy}px)` };
};

function Cover({ t }: { t: number }) {
  const scan = prog(t, 1500, 2300);
  const toChart = (i: number) => easeOut(prog(t, 2400 + i * 18, 3400 + i * 18));
  const line = easeOut(prog(t, 3500, 4700));
  return (
    <>
      <div style={{ position: "absolute", left: 88, top: 152 }}>
        <p style={{ fontFamily: MONO, fontSize: 17, color: C.fg3, ...fadeIn(t, 100, 500, 8) }}>MSc Big Data Analytics</p>
        <div style={{ marginTop: 20, fontSize: 140, fontWeight: 650, lineHeight: 0.86, letterSpacing: "-0.06em", color: C.fg }}>
          <Rise text="Retail" t={t} at={200} style={{}} />
          <Rise text="Analytics" t={t} at={320} style={{}} />
        </div>
        <p style={{ marginTop: 28, fontSize: 36, letterSpacing: "-0.03em", color: C.fg2, ...fadeIn(t, 750, 600) }}>From data to decisions</p>
      </div>
      <svg viewBox="0 0 690 420" style={{ position: "absolute", right: 72, top: 144, width: 688, height: 432, overflow: "visible" }}>
        <line x1={X0} x2={X0 + SPAN} y1={BASE + 0.5} y2={BASE + 0.5} stroke={C.line2} opacity={toChart(0)} />
        {barcode.map((b, i) => {
          const g = easeOut(prog(t, 350 + i * 22, 1050 + i * 22));
          const p = toChart(i);
          const c = chart[i];
          const hot = i >= BAR.length - 3;
          return (
            <rect
              key={i}
              x={lerp(b.x, c.x, p)}
              width={lerp(b.w, c.w, p)}
              y={lerp(BASE - (BASE - TOP) * g, BASE - c.h, p)}
              height={lerp((BASE - TOP) * g, c.h, p)}
              rx={3 * p}
              fill={p > 0.4 ? (hot ? C.accent : C.mute) : C.fg}
            />
          );
        })}
        <line
          x1={X0 - 16}
          x2={X0 + SPAN + 16}
          y1={210}
          y2={210}
          stroke={C.signal}
          strokeWidth={3}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - scan}
          opacity={scan > 0 && scan < 1 ? Math.min(1, scan * 6, (1 - scan) * 5) : 0}
        />
        <text x={X0} y={BASE + 34} fontFamily={MONO} fontSize={17} letterSpacing={6} fill={C.fg3} opacity={prog(t, 1000, 1400) * (1 - prog(t, 2400, 2800))}>
          8 901234 567896
        </text>
        <path d={trend} fill="none" stroke={C.accent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - line} opacity={line > 0 ? 1 : 0} />
        <circle cx={chart[29].x + 5.5} cy={BASE - chart[29].h - 14} r={6 * easeOut(prog(t, 4600, 5000))} fill={C.accent} stroke={C.bg} strokeWidth={3} />
        <text x={X0} y={BASE + 34} fontFamily={MONO} fontSize={15} fill={C.fg3} opacity={prog(t, 4100, 4700)}>
          Every scan becomes a data point.
        </text>
      </svg>
      <nav style={{ position: "absolute", left: 88, right: 88, bottom: 128, display: "grid", gridTemplateColumns: "repeat(6,1fr)", borderTop: `1px solid ${C.line}` }}>
        {SECTIONS.map(([n, label, title], i) => (
          <div key={n} style={{ paddingTop: 18, paddingRight: 24, ...fadeIn(t, 1000 + i * 80, 600, 14) }}>
            <p style={{ fontFamily: MONO, fontSize: 15, color: C.accent }}>{n}</p>
            <p style={{ marginTop: 6, fontSize: 20, fontWeight: 560, letterSpacing: "-0.015em", color: n === "03" && t >= 3900 ? C.accentInk : C.fg }}>{label}</p>
            <p style={{ marginTop: 6, fontSize: 15, lineHeight: 1.35, color: C.fg3 }}>{title}</p>
          </div>
        ))}
      </nav>
    </>
  );
}

function Intro({ t }: { t: number }) {
  const at = TO_INTRO + 200;
  const step = t >= STEP;
  const lastX = 20 + 11 * 37;
  const nextX = lastX + 120;
  const ask = prog(t, STEP, STEP + 600);
  return (
    <>
      <div style={{ position: "absolute", left: 88, top: 132, width: 736 }}>
        <p style={{ display: "flex", gap: 12, fontSize: 20, ...fadeIn(t, at + 150, 500, 10) }}>
          <span style={{ fontFamily: MONO, color: C.accent }}>03</span>
          <span style={{ color: C.fg2 }}>AI/ML</span>
        </p>
        <Rise text="From What Happened? to What Happens Next?" t={t} at={at + 300} style={{ marginTop: 20, fontSize: 68, fontWeight: 600, lineHeight: 0.98, letterSpacing: "-0.045em", color: C.fg }} />
        <div style={{ marginTop: 36, fontSize: 26, lineHeight: 1.42, letterSpacing: "-0.012em", color: C.fg2 }}>
          <p style={fadeIn(t, at + 800, 600)}>A traditional report can tell a retailer that 10,000 products were sold last month.</p>
          <p style={{ marginTop: 16, opacity: ask, transform: `translateY(${(1 - ask) * 14}px)` }}>
            Machine learning asks a much more valuable question:{" "}
            <span
              style={{
                color: C.fg,
                backgroundImage: `linear-gradient(${C.wash}, ${C.wash})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${easeOut(prog(t, STEP + 500, STEP + 1300)) * 100}% 100%`,
              }}
            >
              how many are we likely to sell next month?
            </span>
          </p>
        </div>
      </div>
      <svg viewBox="0 0 632 576" style={{ position: "absolute", left: 880, top: 160, width: 632, height: 576, overflow: "visible" }}>
        <line x1={0} x2={632} y1={470.5} y2={470.5} stroke={C.line2} />
        {YEAR.map((v, i) => {
          const p = easeOut(prog(t, at + 700 + i * 50, at + 1500 + i * 50));
          return <rect key={i} x={20 + i * 37} width={26} rx={4} y={470 - hY(v) * p} height={hY(v) * p} fill={i === 11 ? C.fg : C.mute} />;
        })}
        <g opacity={prog(t, at + 1600, at + 2000)}>
          <text x={lastX + 13} y={470 - hY(10000) - 52} textAnchor="end" fontSize={15} fontFamily={MONO} fill={C.fg3}>last month</text>
          <text x={lastX + 13} y={470 - hY(10000) - 20} textAnchor="end" fontSize={30} fontWeight={600} fill={C.fg}>10,000 sold</text>
        </g>
        <rect x={nextX} y={140} width={36} height={330} rx={6} fill="none" stroke={C.fg3} strokeWidth={2} strokeDasharray="6 7" opacity={prog(t, at + 2000, at + 2500) * (1 - 0.75 * ask)} />
        <text x={nextX + 18} y={320} textAnchor="middle" fontSize={64} fontWeight={600} fill={C.signal} opacity={step ? 1 - ask : prog(t, at + 2200, at + 2700)}>?</text>
        <path d={`M${lastX + 13} ${470 - hY(10000)} L${nextX + 20} ${470 - hY(11800)} L${nextX + 20} ${470 - hY(9100)} Z`} fill={C.accent} fillOpacity={0.2 * ask} />
        <path d={`M${lastX + 13} ${470 - hY(10000)} L${nextX + 20} ${470 - hY(10500)}`} stroke={C.accent} strokeWidth={2.5} strokeDasharray="7 6" fill="none" opacity={ask} />
        <g opacity={ask}>
          <circle cx={nextX + 20} cy={470 - hY(10500)} r={6} fill={C.accent} stroke={C.bg} strokeWidth={3} />
          <text x={632} y={502} textAnchor="end" fontSize={15} fontFamily={MONO} fill={C.accentInk}>next month: likely range</text>
        </g>
        <text x={20} y={502} fontSize={15} fontFamily={MONO} fill={C.fg3}>a year ago</text>
      </svg>
    </>
  );
}

function Forecast({ t }: { t: number }) {
  const at = TO_FORECAST + 100;
  const stock = [...ORDERS].reverse().find(([when]) => t >= when)![1];
  const short = Math.max(0, FORECAST - stock);
  const excess = Math.max(0, stock - FORECAST);
  const verdict = short
    ? { color: C.neg, title: "Too little stock", body: `Lost sales: about ${fmt(short)} units of demand nobody can buy.` }
    : excess
      ? { color: C.signalInk, title: "Too much stock", body: `Excess inventory: about ${fmt(excess)} units tying up cash and space.` }
      : { color: C.accentInk, title: "Stock matches the forecast", body: "Fewer lost sales and less waste, as long as the forecast holds." };
  const lastChange = [...ORDERS].reverse().find(([when]) => t >= when)![0];
  const moved = easeOut(prog(t, lastChange, lastChange + 600));
  const prevStock = ORDERS[Math.max(0, ORDERS.findIndex(([w]) => w === lastChange) - 1)][1];
  const shown = lerp(prevStock, stock, moved);
  const line = easeOut(prog(t, at + 800, at + 2200));
  const later = prog(t, at + 2100, at + 2500);
  const counter = easeOut(prog(t, at + 2200, at + 3600));

  return (
    <>
      <Rise text="Forecast demand before it arrives." t={t} at={at + 100} style={{ position: "absolute", left: 88, top: 116, width: 960, fontSize: 52, fontWeight: 580, lineHeight: 1.02, letterSpacing: "-0.035em", color: C.fg }} />
      <div style={{ position: "absolute", right: 88, top: 116, textAlign: "right", ...fadeIn(t, at + 2200, 500, 10) }}>
        <p style={{ fontFamily: MONO, fontSize: 15, color: C.fg3 }}>Expected demand next week</p>
        <p style={{ marginTop: 3, fontSize: 60, fontWeight: 640, lineHeight: 1, letterSpacing: "-0.045em", color: C.accent }}>
          {fmt(FORECAST * counter)} <span style={{ fontSize: 28, letterSpacing: "-0.02em", color: C.fg2 }}>units</span>
        </p>
        <p style={{ marginTop: 6, fontSize: 15, color: C.fg3 }}>Example only: likely range 17,200–19,600</p>
      </div>
      <div style={{ position: "absolute", left: 88, top: 280, width: 432 }}>
        {INPUTS.map(({ label, Icon, d }, i) => (
          <div key={label} style={fadeIn(t, at + 400 + i * 120, 500, 0)}>
            {i > 0 && <p style={{ padding: "2px 0 2px 18px", fontFamily: MONO, fontSize: 16, color: C.fg3 }}>+</p>}
            <div style={{ display: "flex", alignItems: "center", gap: 14, border: `1px solid ${C.line}`, background: C.surface, borderRadius: 14, padding: "11px 16px" }}>
              <Icon size={20} color={C.fg3} />
              <span style={{ flex: 1, fontSize: 18, color: C.fg }}>{label}</span>
              <svg viewBox="0 0 50 28" width={48} height={26}>
                <path d={d} fill="none" stroke={C.fg2} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        ))}
      </div>
      <svg viewBox="0 0 1600 900" style={{ position: "absolute", left: 0, top: 0, width: 1600, height: 900 }}>
        {[14000, 18000, 22000, 26000].map((g) => (
          <g key={g}>
            <line x1={650} x2={1440} y1={fy(g)} y2={fy(g)} stroke={C.line} />
            <text x={640} y={fy(g) + 5} textAnchor="end" fontSize={14} fontFamily={MONO} fill={C.fg3}>{g / 1000}k</text>
          </g>
        ))}
        <path d="M500 288 H516 V630 H500" fill="none" stroke={C.line2} strokeWidth={2} opacity={prog(t, at + 1000, at + 1600)} />
        <path d="M516 459 C570 459 590 500 640 500" fill="none" stroke={C.line2} strokeWidth={2} />
        {[0, 1, 2].map((k) => {
          const p = ((t - at - 1400) / 1600 + k / 3) % 1;
          return t > at + 1400 ? <circle key={k} r={4.5} fill={C.accent} cx={lerp(516, 640, p)} cy={459 + 41 * p * p * (3 - 2 * p)} opacity={Math.sin(p * Math.PI)} /> : null;
        })}
        <path d={weeksPath} fill="none" stroke={C.fg} strokeWidth={2.5} strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - line} />
        <g opacity={later}>
          <line x1={fx(15) + 45} x2={fx(15) + 45} y1={290} y2={640} stroke={C.fg3} />
          <text x={fx(15) + 45} y={282} textAnchor="middle" fontSize={14} fontFamily={MONO} fill={C.fg3}>today</text>
          <path d={`M${fx(15)} ${fy(WEEKS[15])} L${FX} ${fy(FORECAST)}`} stroke={C.accent} strokeWidth={2.5} strokeDasharray="7 6" />
          <line x1={FX} x2={FX} y1={fy(HIGH)} y2={fy(LOW)} stroke={C.accent} strokeWidth={10} strokeLinecap="round" opacity={0.25} />
          <circle cx={FX} cy={fy(FORECAST)} r={8} fill={C.accent} stroke={C.bg} strokeWidth={3} />
          <rect x={FX - 40} width={80} y={Math.min(fy(shown), fy(FORECAST))} height={Math.abs(fy(shown) - fy(FORECAST))} fill={shown < FORECAST ? C.neg : C.signal} fillOpacity={0.2} />
          <line x1={FX - 40} x2={FX + 40} y1={fy(shown)} y2={fy(shown)} stroke={short ? C.neg : excess ? C.signal : C.fg} strokeWidth={3} />
          <text x={FX + 50} y={fy(shown) + 5} fontSize={15} fontFamily={MONO} fill={C.fg2}>order {fmt(stock)}</text>
        </g>
        <text x={650} y={670} fontSize={14} fontFamily={MONO} fill={C.fg3}>16 weeks ago</text>
      </svg>
      <div style={{ position: "absolute", left: 650, right: 88, bottom: 104, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32 }}>
        <div>
          <p style={{ fontFamily: MONO, fontSize: 15, color: C.fg3, marginBottom: 8 }}>How much should we order?</p>
          <div style={{ display: "flex", border: `1px solid ${C.line2}`, background: C.surface, borderRadius: 999, padding: 4 }}>
            {[14000, 18400, 24000].map((o) => (
              <span key={o} style={{ borderRadius: 999, padding: "6px 18px", fontFamily: MONO, fontSize: 16, ...(o === stock ? { background: C.fg, color: C.bg } : { color: C.fg2 }) }}>
                {fmt(o)}
              </span>
            ))}
          </div>
        </div>
        <div key={verdict.title} style={{ maxWidth: 448, ...fadeIn(t, lastChange || at, 300, 10) }}>
          <p style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", color: verdict.color }}>{verdict.title}</p>
          <p style={{ marginTop: 3, fontSize: 17, lineHeight: 1.4, color: C.fg2 }}>{verdict.body}</p>
        </div>
      </div>
    </>
  );
}

export default function RetailDeckDemo() {
  const t = useLoop(LENGTH, 14400);
  const scene = t >= TO_FORECAST ? 2 : t >= TO_INTRO ? 1 : 0;
  const index = [0, 13, 15][scene];
  const curtain = easeOut(prog(t, TO_INTRO, TO_INTRO + 900));
  const rise = easeOut(prog(t, TO_FORECAST, TO_FORECAST + 750));
  const step = scene === 1 && t >= STEP;
  const key = t >= STEP && t < STEP + 700;

  const layer: React.CSSProperties = { position: "absolute", inset: 0, background: C.bg };

  return (
    <Loop t={t} length={LENGTH}>
      <div style={{ position: "absolute", left: 0, top: 0, width: STAGE.w, height: STAGE.h, transform: `scale(${STAGE.scale})`, transformOrigin: "0 0", background: C.bg, color: C.fg, overflow: "hidden" }}>
        {/* scenes */}
        {t < TO_INTRO + 900 && (
          <div style={layer}>
            <Cover t={t} />
          </div>
        )}
        {t >= TO_INTRO && t < TO_FORECAST + 750 && (
          <div style={{ ...layer, clipPath: `inset(${(1 - curtain) * 100}% 0% 0% 0%)`, transform: `translateY(${-2 * rise}%) scale(${1 - 0.015 * rise})` }}>
            <Intro t={t} />
          </div>
        )}
        {t >= TO_FORECAST && (
          <div style={{ ...layer, opacity: rise, transform: `translateY(${5 * (1 - rise)}%)` }}>
            <Forecast t={t} />
          </div>
        )}

        {/* progress line */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3, background: "rgba(223,221,214,0.6)" }}>
          <div style={{ height: "100%", width: `${(index / 32) * 100}%`, background: C.accent, transition: "width .7s cubic-bezier(.22,1,.36,1)" }} />
        </div>

        {/* header */}
        <header style={{ position: "absolute", left: 0, right: 0, top: 0, height: 88, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "0 88px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <svg viewBox="0 0 24 24" width={28} height={28}>
              {[5, 8, 7, 12, 16].map((h, i) => (
                <rect key={i} x={2 + i * 4.3} y={21 - h} width="2.6" height={h} rx="1" fill={i === 4 ? C.accent : C.fg} />
              ))}
            </svg>
            <span style={{ fontSize: 18, fontWeight: 560, letterSpacing: "-0.02em" }}>Retail Analytics</span>
          </span>
          <nav style={{ display: "flex", gap: 36 }}>
            {SECTIONS.map(([n, label]) => {
              const on = scene > 0 && n === "03";
              return (
                <span key={n} style={{ position: "relative", display: "flex", alignItems: "baseline", gap: 8, padding: "14px 0", fontSize: 17, letterSpacing: "-0.01em" }}>
                  <span style={{ fontFamily: MONO, fontSize: 13, color: on ? C.accent : C.fg3 }}>{n}</span>
                  <span style={{ color: on ? C.fg : C.fg3 }}>{label}</span>
                  {on && (
                    <span style={{ position: "absolute", left: 0, right: 0, bottom: 4, height: 2, borderRadius: 2, background: C.line2, overflow: "hidden" }}>
                      <span style={{ display: "block", height: "100%", width: scene === 1 ? "16.7%" : "50%", background: C.accent, transition: "width .6s" }} />
                    </span>
                  )}
                </span>
              );
            })}
          </nav>
          <span style={{ justifySelf: "end", display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ fontFamily: MONO, fontSize: 15, color: C.fg3 }}>
              <span style={{ color: C.fg }}>{String(index + 1).padStart(2, "0")}</span> / 33
            </span>
            <span style={{ display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: 999, border: `1px solid ${C.line2}`, color: C.fg2 }}>
              <Maximize2 size={17} />
            </span>
          </span>
        </header>

        {/* footer */}
        <footer style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 88, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 88px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: 999, border: `1px solid ${C.line2}`, color: C.fg2, opacity: scene === 0 ? 0.35 : 1 }}>
              <ArrowLeft size={18} />
            </span>
            {scene > 0 && (
              <>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {[0, 1, 2, 3, 4, 5].map((d) => {
                    const on = d === (scene === 1 ? 0 : 2);
                    return (
                      <span key={d} style={{ display: "grid", placeItems: "center", height: 24, width: on ? 32 : 12 }}>
                        <i style={{ display: "block", height: 8, width: on ? "100%" : 8, borderRadius: 99, background: on ? C.accent : d < (scene === 1 ? 0 : 2) ? C.fg3 : C.line2 }} />
                      </span>
                    );
                  })}
                </span>
                <span style={{ fontSize: 17, color: C.fg2 }}>
                  <b style={{ marginRight: 10, fontFamily: MONO, fontSize: 15, fontWeight: 500, color: C.fg }}>{scene === 1 ? "01" : "03"}</b>
                  {scene === 1 ? "What happens next?" : "Demand forecasting"}
                </span>
              </>
            )}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {scene === 1 && <span style={{ fontFamily: MONO, fontSize: 14, color: C.fg3 }}>{step ? "2/2" : "1/2"}</span>}
            <span style={{ fontSize: 17, color: C.fg2 }}>
              {scene === 0 ? "From data to decision" : scene === 1 ? (step ? "Reporting vs prediction" : "Machine learning asks…") : "Recommendation systems"}
            </span>
            <span style={{ display: "grid", placeItems: "center", width: 56, height: 56, borderRadius: 999, background: C.fg, color: C.bg, transform: `scale(${key ? 0.94 : 1})` }}>
              <ArrowRight size={20} />
            </span>
          </span>
        </footer>
      </div>

      {/* the keystroke, as screen recorders show it */}
      <div
        className="absolute bottom-[86px] left-1/2 grid h-11 min-w-11 -translate-x-1/2 place-items-center rounded-lg bg-black/75 px-3 text-[20px] font-semibold text-white shadow-lg"
        style={{ opacity: key ? 1 - prog(t, STEP + 450, STEP + 700) : 0 }}
      >
        →
      </div>

      <Cursor t={t} keys={KEYS} />
    </Loop>
  );
}
