"use client";

import { motion } from "framer-motion";
import {
  ChevronDown, ClipboardCheck, Eye, Factory, FlaskConical, ImagePlus, Landmark, LayoutGrid, Lightbulb,
  Package, Plus, Recycle, Search, Settings, ShoppingCart, SlidersHorizontal, SquarePen, Truck, UserCog, Users, X,
} from "lucide-react";
import { CANVAS } from "../Laptop";
import { countUp, Cursor, Loop, Streamed, tokenize, typed, useLoop, type CursorKey } from "../kit";

/* everest-manufacturing-dashboard.vercel.app: one-click demo sign-in as the
   owner, the month at a glance, the orders book, then Ask Everest answering
   from live data. Figures and the answer are from the live site. */

const BRAND = "#714b67";
const LENGTH = 17000;

function Logo({ size, bars = "#fff" }: { size: number; bars?: string }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} fill={bars} aria-hidden>
      <path d="M10 9.5h9l5.2 7H10z" fill="#facc15" />
      <path d="M10 20.5h17.2l5.2 7H10zM10 31.5h25.4l5.2 7H10z" />
    </svg>
  );
}

function AskLogo({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} fill="#fff" aria-hidden>
      <path d="M9 6h30a5 5 0 0 1 5 5v21a5 5 0 0 1-5 5H22l-9 7v-7H9a5 5 0 0 1-5-5V11a5 5 0 0 1 5-5z" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinejoin="round" />
      <path d="M13 12.5h6.2l3.4 4.6H13z" fill="#facc15" />
      <path d="M13 19.7h11.6l3.4 4.6H13zM13 26.9h17l3.4 4.6H13z" />
    </svg>
  );
}

const NAV = [
  ["Overview", LayoutGrid], ["Orders", ShoppingCart], ["Yarn Received", Package], ["Raw Materials", FlaskConical],
  ["Machines", Factory], ["Quality check", ClipboardCheck], ["Waste", Recycle], ["Dispatch", Truck], ["Clients", Users],
  ["Accounts", Landmark], ["Everest Lab", Lightbulb], ["Employees", UserCog], ["Mill Setup", SlidersHorizontal],
] as const;

/** October 2026, as the owner dashboard showed it. */
const MONTH = [
  { label: "Invoiced", v: 42.5, unit: "L", note: "Fabric billed to clients in October, before GST" },
  { label: "Collected", v: 45.6, unit: "L", note: "Payments received from clients in October", color: "#16704a" },
  { label: "Outstanding", v: 1.48, unit: "Cr", note: "Still owed by clients today, whatever the month", color: "#96600a" },
  { label: "Total expenses", v: 41.5, unit: "L", note: "Materials used ₹30.8 L + wages ₹3.4 L + running costs ₹7.3 L" },
  { label: "Profit", v: 1.1, unit: "L", note: "3% of invoiced, after total expenses", color: "#16704a" },
  { label: "Cash flow", v: 3.5, unit: "L", note: "Collected – supplier bills, expenses and wages paid" },
];
/** Invoiced per month in 2026, ₹ crore (Oct is month to date). */
const BARS = [1.24, 1.12, 0.97, 1.13, 1.32, 1.21, 1.17, 1.12, 1.04, 0.425];

const ORDERS = [
  ["ORD-2777", "Ordered 10 Oct 2026", "Gokaldas Exports", "Poplin · Olive", "1,800 m · Cotton 40s", "20 Nov 2026"],
  ["ORD-2776", "Ordered 10 Oct 2026", "Welspun Home", "Satin · Ivory", "1,300 m · Polyester 150D", "06 Nov 2026"],
  ["ORD-2774", "Ordered 09 Oct 2026", "Aditya Birla Fashion", "Twill · Navy", "2,000 m · Poly-Cotton", "13 Dec 2026"],
  ["ORD-2775", "Ordered 09 Oct 2026", "Arvind Garments", "Satin · Black", "2,600 m · Polyester 150D", "14 Dec 2026"],
];

const STARTERS = [
  "How is the mill doing today?",
  "Which orders are past their deadline?",
  "Which yarns are low on stock?",
  "Which machines are idle right now?",
];
const REPLY = tokenize(
  "There are 2 orders past their deadline today:\n" +
    "- **ORD-2700** for Page Industries: 1,900 m of White Lawn, deadline was 5 Oct 2026 (Status: Weaving)\n" +
    "- **ORD-2661** for Welspun Home: 1,500 m of Dark Indigo Denim, deadline was today, 16 Oct 2026 (Status: In quality check)"
);

/* The sign-in roles are centred in the right half; Ask Everest sits at the bottom right. */
const W = CANVAS.w;
const KEYS: CursorKey[] = [
  [0, 420, 300],
  [1200, W * 0.75 - 144, 486, 1], // demo sign-in: Owner
  [2000, W * 0.75 - 144, 486],
  [2800, 560, 330],
  [5300, 520, 300],
  [5900, 70, 119, 1], // Orders
  [6400, 70, 119],
  [7400, 600, 470],
  [8200, 640, 520],
  [8700, W - 42, 564, 1], // Ask Everest
  [9200, W - 42, 564],
  [9900, W - 204, 410, 1], // starter question
  [10500, W - 204, 410],
  [11500, 560, 300],
];

const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.35 } };
const rise = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

function Slab({ children, cols }: { children: React.ReactNode; cols: number }) {
  return (
    <div className="rounded-[22px] border-2 border-[#c9b3c2] bg-[#e8e6e9] p-[18px]">
      <div className="grid gap-3.5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {children}
      </div>
    </div>
  );
}

function Kpi({ label, value, note, color }: { label: string; value: string; note: string; color?: string }) {
  return (
    <div className="rounded-[14px] bg-white px-4 py-3.5 text-center shadow-[0_1px_1px_rgba(11,11,12,0.04),0_8px_18px_-8px_rgba(11,11,12,0.12)]">
      <p className="text-[12.5px] text-[#3f3f46]">{label}</p>
      <p className="mt-0.5 text-[24px] font-bold tracking-tight" style={{ color: color ?? "#0b0b0c" }}>
        {value}
      </p>
      <p className="mt-1 text-[10.5px] leading-snug text-[#6b6b74]">{note}</p>
    </div>
  );
}

export default function EverestDemo() {
  const t = useLoop(LENGTH, 14500);
  const signedIn = t >= 2300;
  const onOrders = t >= 5900;
  const open = t >= 8750;
  const asked = t >= 9900;
  const words = asked && t >= 11300 ? Math.floor(((t - 11300) * 24) / 1000) : 0;

  return (
    <Loop t={t} length={LENGTH}>
      {!signedIn ? (
        /* ── Sign-in ── */
        <div className="flex h-full">
          <div
            className="relative flex w-1/2 flex-col justify-between overflow-hidden p-11 text-white"
            style={{ background: "linear-gradient(160deg,#6f4a66 0%,#4b3044 60%,#3d2838 100%)" }}
          >
            <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "34px 34px" }} />
            <p className="relative flex items-center gap-3 text-[16px] font-semibold">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/15">
                <Logo size={22} />
              </span>
              Everest Textile Mills
            </p>
            <div className="relative">
              <p className="text-[30px] font-bold tracking-tight">Every thread, accounted for.</p>
              <p className="mt-2 text-[14px] text-white/70">One system for the whole mill.</p>
              <ul className="mt-8 space-y-4 text-[14px] font-semibold">
                {([["Yarn stock", Package], ["Live production", Factory], ["Quality checks", ClipboardCheck], ["Dispatch & tracking", Truck]] as const).map(([l, Icon]) => (
                  <li key={l} className="flex items-center gap-3.5">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10">
                      <Icon size={17} />
                    </span>
                    {l}
                  </li>
                ))}
              </ul>
            </div>
            <p className="relative text-[11.5px] text-white/60">© 2026 Everest Textile Mills</p>
          </div>
          <div className="flex w-1/2 flex-col items-center justify-center bg-[#fafafa]">
            <div className="w-[384px] rounded-2xl border border-[#e3e3e6] bg-white p-7 shadow-sm">
              <p className="text-[20px] font-semibold text-[#0b0b0c]">Sign in</p>
              <p className="mt-1 text-[13px] text-[#6b6b74]">Use your mill email and password.</p>
              <p className="mt-5 text-[13px] font-medium">Email</p>
              <div className="mt-1.5 flex h-[34px] items-center rounded-lg border-2 px-3 text-[13px]" style={{ borderColor: t >= 1250 ? BRAND : "#d2d2d7" }}>
                {t >= 1250 ? typed("owner@everest.dev", t, 1250, 45) : <span className="text-[#8e8e96]">you@everest.dev</span>}
              </div>
              <p className="mt-4 text-[13px] font-medium">Password</p>
              <div className="mt-1.5 flex h-[34px] items-center justify-between rounded-lg border border-[#d2d2d7] px-3 text-[13px] tracking-[0.2em]">
                {t >= 1650 ? typed("•••••••••••", t, 1650, 60) : ""}
                <Eye size={15} className="text-[#6b6b74]" />
              </div>
              <div
                className="mt-6 grid h-[34px] place-items-center rounded-lg text-[13.5px] font-semibold text-white transition-transform"
                style={{ background: BRAND, transform: `scale(${t >= 2000 && t < 2200 ? 0.98 : 1})`, filter: t >= 2000 ? "brightness(0.9)" : "none" }}
              >
                Sign in
              </div>
              <p className="mt-4 text-center text-[11.5px] text-[#6b6b74]">Forgot your password? Ask the mill owner to reset it.</p>
            </div>
            <p className="mt-6 text-[12px] text-[#6b6b74]">Demo: sign in as</p>
            <div className="mt-2 flex max-w-[380px] flex-wrap justify-center gap-1.5">
              {["Owner", "Store Manager", "Production Supervisor", "Quality Inspector", "Dispatch Manager"].map((r) => (
                <span key={r} className="rounded-lg border border-[#e3e3e6] px-2.5 py-1 text-[12.5px]" style={{ background: r === "Owner" && t >= 1200 ? "#e2dce1" : "#efeff1" }}>
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ── Signed in as the owner ── */
        <motion.div {...fade} className="flex h-full bg-[#fafafa]">
          <aside className="flex w-[208px] shrink-0 flex-col px-2.5 py-4">
            <p className="flex items-center gap-2.5 px-2">
              <span className="grid h-[34px] w-[34px] place-items-center rounded-lg" style={{ background: BRAND }}>
                <Logo size={20} />
              </span>
              <span className="leading-tight">
                <b className="block text-[15px]">Everest</b>
                <span className="text-[11.5px] text-[#6b6b74]">Textile Mills</span>
              </span>
            </p>
            <ul className="mt-5 space-y-px">
              {NAV.map(([label, Icon]) => {
                const on = label === (onOrders ? "Orders" : "Overview");
                return (
                  <li
                    key={label}
                    className="flex h-[32px] items-center gap-2.5 rounded-lg px-3 text-[13px]"
                    style={on ? { background: "#f3edf1", color: BRAND } : { color: "#3f3f46" }}
                  >
                    <Icon size={15} strokeWidth={1.8} /> {label}
                  </li>
                );
              })}
            </ul>
            <p className="mt-auto flex items-center gap-2.5 px-3 text-[13px] text-[#3f3f46]">
              <Settings size={15} strokeWidth={1.8} /> Settings
            </p>
          </aside>

          <main className="relative my-3 mr-3.5 flex-1 overflow-hidden rounded-[20px] border border-[#e3e3e6] bg-[#f1f1f2] px-6 pt-6">
            {!onOrders ? (
              <motion.div key="overview" {...fade}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.3em] text-[#6b6b74]">MONTH AT A GLANCE</p>
                    <p className="mt-1 text-[19px] font-semibold">October 2026</p>
                    <p className="mt-1 flex items-center gap-1.5 text-[11.5px] text-[#4a4a52]">
                      <i className="h-2 w-2 rounded-full bg-[#16704a]" /> Live · updated 04:41:28 pm
                    </p>
                  </div>
                  <div className="flex gap-2 text-[13.5px]">
                    <span className="flex h-[34px] w-[130px] items-center justify-between rounded-lg border border-[#d2d2d7] bg-white px-3">October <ChevronDown size={14} /></span>
                    <span className="flex h-[34px] w-[92px] items-center justify-between rounded-lg border border-[#d2d2d7] bg-white px-3">2026 <ChevronDown size={14} /></span>
                  </div>
                </div>
                <div className="mt-5">
                  <Slab cols={3}>
                    {MONTH.map((m) => (
                      <Kpi
                        key={m.label}
                        label={m.label}
                        color={m.color}
                        note={m.note}
                        value={`₹${countUp(m.v, t, 2500, 1300).toFixed(m.unit === "Cr" ? 2 : 1)} ${m.unit}`}
                      />
                    ))}
                  </Slab>
                </div>
                <div className="mt-4 h-[260px] rounded-[16px] border border-[#e3e3e6] bg-white px-5 pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[15px] font-semibold">2026 month by month</p>
                    <p className="flex items-center gap-3 text-[11px] text-[#4a4a52]">
                      <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-[#c9b3c2]" /> Invoiced (click a bar to open that month)</span>
                      <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-[#16704a]" /> Profit</span>
                    </p>
                  </div>
                  <div className="relative mt-4 h-[200px] border-t border-[#ececef]">
                    <span className="absolute -top-2 left-0 bg-white pr-1 font-mono text-[9.5px] text-[#6b6b74]">1.4 Cr</span>
                    <div className="absolute inset-x-10 bottom-0 top-0 flex items-end justify-between">
                      {BARS.map((v, i) => (
                        <motion.span
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${(v / 1.4) * 100}%` }}
                          transition={{ duration: 0.9, delay: 0.6 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                          className="w-[46px] rounded-t-[5px]"
                          style={{ background: i === BARS.length - 1 ? BRAND : "#c9b3c2" }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="orders" {...fade}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.3em] text-[#6b6b74]">FROM BUYERS</p>
                    <p className="mt-1 text-[30px] font-bold tracking-tight">Orders</p>
                  </div>
                  <span className="mt-3 flex h-[34px] items-center gap-1.5 rounded-full px-4 text-[13.5px] font-semibold text-white" style={{ background: BRAND }}>
                    <Plus size={15} /> New order
                  </span>
                </div>
                <div className="mt-4">
                  <Slab cols={3}>
                    <Kpi label="Open orders" value={`${Math.round(countUp(101, t, 6000, 900))} orders`} note="29 in production · 70 not started" />
                    <Kpi label="Late" value="2 orders" note="Open and past their deadline" color="#a82e22" />
                    <Kpi label="Ready to ship" value="2 orders" note="Finished and waiting for a truck" color="#16704a" />
                  </Slab>
                </div>
                <div className="mt-5 flex items-center gap-2.5 text-[13px]">
                  <b className="mr-2 text-[15px] font-semibold">All orders</b>
                  <span className="flex h-[34px] flex-1 items-center gap-2 rounded-lg border border-[#d2d2d7] bg-white px-3 text-[#8e8e96]"><Search size={14} /> Search order, client or fabric</span>
                  <span className="flex h-[34px] w-[140px] items-center justify-between rounded-lg border border-[#d2d2d7] bg-white px-3">All statuses <ChevronDown size={14} /></span>
                  <span className="flex h-[34px] w-[150px] items-center justify-between rounded-lg border border-[#d2d2d7] bg-white px-3">All clients <ChevronDown size={14} /></span>
                </div>
                <div className="mt-4 overflow-hidden rounded-[14px] border border-[#e3e3e6] bg-white text-[12.5px]">
                  <div className="grid grid-cols-[1.1fr_1.1fr_1.4fr_0.9fr_0.7fr] bg-[#fafafa] px-4 py-2.5 text-[11.5px] text-[#4a4a52]">
                    <span>Order</span><span>Client</span><span>Fabric</span><span>Deadline</span><span>Status</span>
                  </div>
                  {ORDERS.map(([id, ordered, client, fabric, qty, due], i) => (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + i * 0.07 }}
                      className="grid grid-cols-[1.1fr_1.1fr_1.4fr_0.9fr_0.7fr] items-center border-t border-[#efeff1] px-4 py-2"
                    >
                      <span><b className="block font-medium">{id}</b><span className="text-[#6b6b74]">{ordered}</span></span>
                      <span>{client}</span>
                      <span className="truncate"><span className="block">{fabric}</span><span className="text-[#6b6b74]">{qty}</span></span>
                      <span>{due}</span>
                      <span><i className="rounded-full border border-[#d2d2d7] bg-[#eeeef0] px-2 py-0.5 font-mono text-[10px] not-italic text-[#4a4a52]">Pending</i></span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </main>

          {/* Ask Everest launcher */}
          <motion.span
            initial={false}
            animate={{ opacity: open ? 0 : 1, scale: open ? 0.5 : 1 }}
            className="absolute bottom-5 right-5 grid h-11 w-11 place-items-center rounded-full shadow-[0_0_0_6px_rgba(250,204,21,0.18),0_8px_20px_rgba(0,0,0,0.25)]"
            style={{ background: BRAND }}
          >
            <AskLogo size={26} />
          </motion.span>

          {/* Ask Everest panel */}
          <motion.section
            initial={false}
            animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.9, y: open ? 0 : 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-4 right-4 flex h-[470px] w-[330px] origin-bottom-right flex-col rounded-2xl border border-[#e3e3e6] bg-white shadow-2xl"
          >
            <header className="flex items-center gap-2.5 border-b border-[#e3e3e6] px-4 py-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full shadow-[0_0_0_4px_rgba(250,204,21,0.2)]" style={{ background: BRAND }}>
                <AskLogo size={19} />
              </span>
              <span className="flex-1 leading-tight">
                <b className="block text-[13.5px] font-medium">Ask Everest</b>
                <span className="text-[10.5px] text-[#6b6b74]">Answers from your sections</span>
              </span>
              {asked && <SquarePen size={15} className="text-[#4a4a52]" />}
              <X size={15} className="text-[#4a4a52]" />
            </header>
            <div className="flex min-h-0 flex-1 flex-col justify-end gap-3 overflow-hidden px-3.5 py-3.5 text-[12.5px] leading-relaxed">
              {!asked ? (
                <>
                  <div>
                    <p className="text-[15px] font-medium">Hi Mill, what do you need?</p>
                    <p className="mt-1 text-[#6b6b74]">Ask in your own words, or attach a photo of a bill, a roll or a screen.</p>
                  </div>
                  <div className="grid gap-1.5">
                    {STARTERS.map((q) => (
                      <span key={q} className="rounded-lg border border-[#e3e3e6] px-3 py-[7px]" style={q === STARTERS[1] && t >= 9500 ? { background: "#f3edf1", color: BRAND } : undefined}>
                        {q}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <motion.p {...rise} className="max-w-[85%] self-end rounded-2xl rounded-br-md px-3 py-2 text-white" style={{ background: BRAND }}>
                    {STARTERS[1]}
                  </motion.p>
                  {words === 0 ? (
                    t >= 10000 && (
                      <span className="flex w-fit gap-1 rounded-2xl rounded-bl-md bg-[#f4f4f5] px-3 py-3">
                        {[0, 1, 2].map((d) => (
                          <i key={d} className="h-1.5 w-1.5 rounded-full bg-[#a1a1aa]" style={{ transform: `translateY(${-3 * Math.max(0, Math.sin(t / 160 - d * 0.9))}px)` }} />
                        ))}
                      </span>
                    )
                  ) : (
                    <motion.div {...rise} className="max-w-[92%] rounded-2xl rounded-bl-md bg-[#f4f4f5] px-3 py-2">
                      <Streamed tokens={REPLY} n={words} />
                    </motion.div>
                  )}
                </>
              )}
            </div>
            <footer className="border-t border-[#e3e3e6] p-2.5">
              <div className="flex items-center gap-2 rounded-xl border border-[#d2d2d7] px-2.5 py-2 text-[12.5px] text-[#8e8e96]">
                <ImagePlus size={15} className="text-[#4a4a52]" />
                <span className="flex-1">Ask about the mill…</span>
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#c9b3c2] text-[12px] text-white">↑</span>
              </div>
            </footer>
          </motion.section>
        </motion.div>
      )}

      <Cursor t={t} keys={KEYS} />
    </Loop>
  );
}
