"use client";

import { ArrowLeft, ArrowRight, Maximize2, Search, ShoppingCart, Star } from "lucide-react";
import { CANVAS } from "../Laptop";
import { Cursor, easeOut, Loop, prog, useLoop, type CursorKey } from "../kit";

/* mom-lab-finals.vercel.app, presented: the cover's barcode turning into a
   sales chart, a jump to the Data section, then its customer journey built
   stage by stage (Search, View, Compare, Add to cart) while the event log
   records each step. Drawn on the deck's own 1600-wide stage (1rem = 16px),
   scaled into the laptop and centred on the screen, as the deck centres it. */

const LENGTH = 15500;
const STAGE = { w: 1600, h: 947, scale: 1024 / 1600 };
const X = (CANVAS.w - STAGE.w * STAGE.scale) / 2; // where the stage starts on the screen
const C = {
  bg: "#f5f4f0", surface: "#fbfaf7", fg: "#171a17", fg2: "#474b46", fg3: "#6b6f69", line: "#dfddd6",
  line2: "#c9c6be", accent: "#1d6a44", accentInk: "#165536", wash: "#e0ebe3", signal: "#e2703a",
  signalInk: "#b04f1d", neg: "#b8432b", mute: "#b3afa6", bg2: "#eceae4",
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

/* ── Customer journey, the Data section's first scene (slides/data.tsx) ── */
const STAGES = ["Search", "View", "Compare", "Add to cart", "Abandon", "Return", "Purchase", "Review"];
const EVENTS: [string, string, string][] = [
  ["Thu 18:02", "search", "“running shoes”"],
  ["Thu 18:03", "product_view", "trail runner · 48 s"],
  ["Thu 18:05", "compare", "2 shoes side by side"],
  ["Thu 18:06", "add_to_cart", "size UK 9"],
];
const stageX = (i: number) => 100 + i * 200; // stage dot centres (left 88 + 12 + i/7 × 1400)

/* Scene changes, in loop time */
const TO_DATA = 4600; // curtain into the Data section
const BUILDS = [TO_DATA, 7600, 9600, 11600]; // Search, then clicks on View, Compare, Add to cart

/* stage px → canvas px for the cursor */
const sx = (v: number) => X + v * STAGE.scale;
const sy = (v: number) => v * STAGE.scale;
const KEYS: CursorKey[] = [
  [0, X + 700, 260],
  [3200, X + 420, 470],
  [4300, sx(348), sy(762), 1], // 02 Data
  [5000, sx(348), sy(762)],
  [6400, X + 640, 330],
  [7300, sx(stageX(1)), sy(738)],
  [7600, sx(stageX(1)), sy(738), 1], // View
  [8400, sx(stageX(1)), sy(738)],
  [9300, sx(stageX(2)), sy(738)],
  [9600, sx(stageX(2)), sy(738), 1], // Compare
  [10400, sx(stageX(2)), sy(738)],
  [11300, sx(stageX(3)), sy(738)],
  [11600, sx(stageX(3)), sy(738), 1], // Add to cart
  [12300, sx(stageX(3)), sy(738)],
  [13600, X + 760, 260],
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
            <p style={{ marginTop: 6, fontSize: 20, fontWeight: 560, letterSpacing: "-0.015em", color: n === "02" && t >= 3900 ? C.accentInk : C.fg }}>{label}</p>
            <p style={{ marginTop: 6, fontSize: 15, lineHeight: 1.35, color: C.fg3 }}>{title}</p>
          </div>
        ))}
      </nav>
    </>
  );
}

/** The Data section's customer journey: the shop, the event log and the stage buttons. */
function Journey({ t }: { t: number }) {
  const at = TO_DATA + 200;
  const step = BUILDS.filter((when) => t >= when).length - 1;
  const inCart = step >= 3;
  const typing = prog(t, at + 1150, at + 2050); // "running shoes" types itself in
  const moved = easeOut(prog(t, BUILDS[step], BUILDS[step] + 600));
  const progress = step ? lerp(step - 1, step, moved) / (STAGES.length - 1) : 0;
  const panel: React.CSSProperties = { position: "absolute", top: 260, height: 440, overflow: "hidden", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 20 };
  const compare = easeOut(prog(t, BUILDS[2], BUILDS[2] + 500)) * (1 - prog(t, BUILDS[3], BUILDS[3] + 300));

  return (
    <>
      <div style={{ position: "absolute", left: 88, top: 116, width: 1024 }}>
        <p style={{ marginBottom: 10, fontSize: 20, fontWeight: 560, color: C.accentInk, ...fadeIn(t, at + 100, 500, 8) }}>Customer journey</p>
        <p style={{ fontSize: 44, fontWeight: 580, lineHeight: 1.02, letterSpacing: "-0.035em", color: C.fg, ...fadeIn(t, at + 200, 700) }}>
          A customer who doesn&apos;t buy can still generate valuable data.
        </p>
      </div>

      {/* The shop */}
      <div style={{ ...panel, left: 88, width: 672, ...fadeIn(t, at + 350, 700, 20) }}>
        <div style={{ display: "flex", height: 60, alignItems: "center", gap: 12, borderBottom: `1px solid ${C.line}`, padding: "0 20px" }}>
          <div style={{ display: "flex", height: 38, flex: 1, alignItems: "center", gap: 10, borderRadius: 999, background: C.bg2, padding: "0 16px", fontSize: 17, color: C.fg }}>
            <Search size={17} color={C.fg3} />
            <span style={{ clipPath: `inset(0 ${(1 - typing) * 100}% 0 0)` }}>running shoes</span>
            {step === 0 && <span style={{ marginLeft: -6, width: 1, height: 18, background: C.fg, opacity: Math.floor(t / 500) % 2 }} />}
          </div>
          <span style={{ position: "relative", display: "grid" }}>
            <ShoppingCart size={24} color={C.fg2} />
            {inCart && (
              <span
                style={{
                  position: "absolute", right: -9, top: -9, display: "grid", placeItems: "center", width: 20, height: 20, borderRadius: 999,
                  background: C.signal, color: "#fff", fontFamily: MONO, fontSize: 12, transform: `scale(${easeOut(prog(t, BUILDS[3], BUILDS[3] + 300))})`,
                }}
              >
                1
              </span>
            )}
          </span>
        </div>
        <div style={{ display: "grid", height: 380, gridTemplateColumns: "1.15fr 1fr" }}>
          <div style={{ position: "relative", display: "grid", placeItems: "center", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/shoe-runner.webp"
              alt=""
              style={{
                width: "112%", maxWidth: "none", mixBlendMode: "multiply",
                maskImage: "radial-gradient(ellipse at center, black 45%, transparent 72%)",
                WebkitMaskImage: "radial-gradient(ellipse at center, black 45%, transparent 72%)",
                opacity: step >= 1 ? lerp(0.4, 1, easeOut(prog(t, BUILDS[1], BUILDS[1] + 600))) : 0.4 * easeOut(prog(t, at + 400, at + 1300)),
                transform: `rotate(-4deg) scale(${lerp(0.92, 1, easeOut(prog(t, at + 400, at + 1300)))})`,
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 14, paddingRight: 24 }}>
            <div>
              <p style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em", color: C.fg }}>Trail runner</p>
              <p style={{ marginTop: 3, fontSize: 22, color: C.fg2 }}>₹4,999</p>
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={21} color={C.line2} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["7", "8", "9", "10"].map((size) => {
                const picked = inCart && size === "9";
                return (
                  <span
                    key={size}
                    style={{
                      display: "grid", placeItems: "center", height: 35, width: 51, borderRadius: 10, fontSize: 15,
                      border: `1px solid ${picked ? C.fg : C.line2}`, background: picked ? C.fg : "transparent", color: picked ? C.bg : C.fg2,
                    }}
                  >
                    UK {size}
                  </span>
                );
              })}
            </div>
            <div
              style={{
                display: "flex", height: 46, alignItems: "center", justifyContent: "center", borderRadius: 999, fontSize: 17, fontWeight: 540,
                transition: "background-color .5s, color .5s", border: `1px solid ${C.fg}`, background: inCart ? C.fg : "transparent", color: inCart ? C.bg : C.fg,
              }}
            >
              {inCart ? "In your cart" : "Add to cart"}
            </div>
          </div>
        </div>
        {compare > 0 && (
          <div
            style={{
              position: "absolute", left: 20, bottom: 20, display: "flex", width: 272, alignItems: "center", gap: 12, padding: 10,
              background: C.surface, border: `1px solid ${C.line}`, borderRadius: 20, boxShadow: "0 18px 40px -20px rgba(0,0,0,0.35)",
              opacity: compare, transform: `translateX(${(1 - compare) * -30}px)`,
            }}
          >
            <div style={{ height: 64, width: 80, flexShrink: 0, overflow: "hidden", borderRadius: 10, background: "#e9e9e7" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/shoe-airmax.webp" alt="" style={{ height: "100%", width: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <p style={{ fontFamily: MONO, fontSize: 12, color: C.fg3 }}>comparing with</p>
              <p style={{ fontSize: 16, fontWeight: 560, color: C.fg }}>Road runner</p>
              <p style={{ fontSize: 15, color: C.fg2 }}>₹5,499</p>
            </div>
          </div>
        )}
      </div>

      {/* What the retailer records, one event per stage */}
      <div style={{ ...panel, left: 784, width: 728, display: "flex", flexDirection: "column", ...fadeIn(t, at + 500, 700, 20) }}>
        <div style={{ display: "flex", height: 60, alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.line}`, padding: "0 20px" }}>
          <span style={{ fontSize: 18, fontWeight: 560, color: C.fg }}>Data the retailer records</span>
          <span style={{ fontFamily: MONO, fontSize: 15, color: C.fg3 }}>{step + 1} events</span>
        </div>
        <div style={{ padding: "6px 8px" }}>
          {EVENTS.slice(0, step + 1).map(([time, name, detail], i) => {
            const from = i ? BUILDS[i] : at + 900;
            const p = easeOut(prog(t, from, from + 450));
            return (
              <div
                key={name}
                style={{
                  display: "grid", gridTemplateColumns: "96px 184px 1fr", alignItems: "center", borderRadius: 10, padding: "8px 12px", fontFamily: MONO, fontSize: 15,
                  opacity: p, transform: `translateY(${(1 - p) * 12}px)`, background: i === step ? C.wash : "transparent", transition: "background-color .45s",
                }}
              >
                <span style={{ color: C.fg3 }}>{time}</span>
                <span style={{ color: C.fg }}>{name}</span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: C.fg2 }}>{detail}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Journey stages: each one is a button on the real slide */}
      <div style={{ position: "absolute", left: 88, right: 88, top: 726, height: 64, ...fadeIn(t, at + 600, 600, 10) }}>
        <div style={{ position: "absolute", left: 12, right: 12, top: 12, height: 2, background: C.line }} />
        <div style={{ position: "absolute", left: 12, right: 12, top: 12, height: 2, background: C.accent, transformOrigin: "left", transform: `scaleX(${progress})` }} />
        {STAGES.map((stage, i) => (
          <div key={stage} style={{ position: "absolute", top: 0, left: stageX(i) - 88, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <span
              style={{
                display: "block", width: 24, height: 24, borderRadius: 999, border: "2px solid", transition: "all .3s",
                borderColor: i === step ? C.accent : i < step ? C.fg3 : C.line2, background: i === step ? C.accent : i < step ? C.fg3 : C.bg,
              }}
            />
            <span style={{ whiteSpace: "nowrap", fontSize: 16, fontWeight: i === step ? 580 : 400, color: i === step ? C.fg : C.fg3 }}>{stage}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default function RetailDeckDemo() {
  const t = useLoop(LENGTH, 13500);
  const data = t >= TO_DATA;
  const step = BUILDS.filter((when) => t >= when).length - 1;
  const index = data ? 9 : 0; // the customer journey is slide 10 of 33
  const curtain = easeOut(prog(t, TO_DATA, TO_DATA + 900));

  const layer: React.CSSProperties = { position: "absolute", inset: 0, background: C.bg };

  return (
    <Loop t={t} length={LENGTH}>
      <div style={layer} />
      <div style={{ position: "absolute", left: X, top: 0, width: STAGE.w, height: STAGE.h, transform: `scale(${STAGE.scale})`, transformOrigin: "0 0", background: C.bg, color: C.fg, overflow: "hidden" }}>
        {/* scenes */}
        {t < TO_DATA + 900 && (
          <div style={layer}>
            <Cover t={t} />
          </div>
        )}
        {data && (
          <div style={{ ...layer, clipPath: `inset(${(1 - curtain) * 100}% 0% 0% 0%)` }}>
            <Journey t={t} />
          </div>
        )}


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
              const on = data && n === "02";
              return (
                <span key={n} style={{ position: "relative", display: "flex", alignItems: "baseline", gap: 8, padding: "14px 0", fontSize: 17, letterSpacing: "-0.01em" }}>
                  <span style={{ fontFamily: MONO, fontSize: 13, color: on ? C.accent : C.fg3 }}>{n}</span>
                  <span style={{ color: on ? C.fg : C.fg3 }}>{label}</span>
                  {on && (
                    <span style={{ position: "absolute", left: 0, right: 0, bottom: 4, height: 2, borderRadius: 2, background: C.line2, overflow: "hidden" }}>
                      <span style={{ display: "block", height: "100%", width: "25%", background: C.accent }} />
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
            <span style={{ display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: 999, border: `1px solid ${C.line2}`, color: C.fg2, opacity: data ? 1 : 0.35 }}>
              <ArrowLeft size={18} />
            </span>
            {data && (
              <>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {[0, 1, 2, 3].map((d) => (
                    <span key={d} style={{ display: "grid", placeItems: "center", height: 24, width: d === 0 ? 32 : 12 }}>
                      <i style={{ display: "block", height: 8, width: d === 0 ? "100%" : 8, borderRadius: 99, background: d === 0 ? C.accent : C.line2 }} />
                    </span>
                  ))}
                </span>
                <span style={{ fontSize: 17, color: C.fg2 }}>
                  <b style={{ marginRight: 10, fontFamily: MONO, fontSize: 15, fontWeight: 500, color: C.fg }}>01</b>
                  The customer journey
                </span>
              </>
            )}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {data && <span style={{ fontFamily: MONO, fontSize: 14, color: C.fg3 }}>{step + 1}/8</span>}
            <span style={{ fontSize: 17, color: C.fg2 }}>{data ? STAGES[step + 1] : "From data to decision"}</span>
            <span style={{ display: "grid", placeItems: "center", width: 56, height: 56, borderRadius: 999, background: C.fg, color: C.bg }}>
              <ArrowRight size={20} />
            </span>
          </span>
        </footer>
      </div>

      {/* progress line, across the whole window */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3 * STAGE.scale, background: "rgba(223,221,214,0.6)" }}>
        <div style={{ height: "100%", width: `${((index + (data ? step / 8 : 0)) / 32) * 100}%`, background: C.accent, transition: "width .7s cubic-bezier(.22,1,.36,1)" }} />
      </div>

      <Cursor t={t} keys={KEYS} />
    </Loop>
  );
}
