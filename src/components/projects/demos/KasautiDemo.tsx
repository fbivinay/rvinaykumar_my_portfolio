"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { countUp, Cursor, inr, Loop, useLoop, type CursorKey } from "../kit";

/* mplads-risk-monitor-web.vercel.app: the national overview (18th Lok Sabha),
   then the review queue: the riskiest work, why it was flagged, and an
   officer escalating it. Figures and works are from the live site. */

const LENGTH = 13500;
const RED = "#a82e22";
const AMBER = "#96600a";

const OVERVIEW = [
  { label: "Works tracked", v: 131116, note: "43,943 completed, 87,173 still pending" },
  { label: "Allocated to MPs", v: 11681.9, cr: true, note: "789 members · 774 with a fund record" },
  { label: "Completed works value", v: 2403.95, cr: true, note: "What finished works finally cost" },
  { label: "High risk", v: 1026, note: "Score 70 and above", color: RED },
  { label: "Running late", v: 24713, note: "More than 60 days past due", color: AMBER },
  { label: "Worth a look", v: 19295, note: "Score 40 and above" },
];

const TICKER = [
  ["From Banki tindola - road sampark marg to Bhavi Bharat inter", "BARA BANKI · ₹25.00 L"],
  ["Construction of two class rooms in Bhagwat Jha Azad Degree C", "JAMTARA · ₹10.00 L"],
  ["Banipur Road se Ramswaroop ke khet ke pas Khanba ki aor DevS", "BHIND · ₹2.50 L"],
  ["Construction Teenshed at Trimurti dham, Gram Panchayat Umri,", "BHIND · ₹9.95 L"],
];

const KEYS: CursorKey[] = [
  [0, 520, 360],
  [2200, 600, 400],
  [4000, 640, 300],
  [4700, 506, 46, 1], // Projects
  [5200, 506, 46],
  [6400, 300, 450],
  [7800, 640, 440],
  [8700, 788, 412, 1], // Escalate
  [9200, 788, 412],
  [10200, 380, 170],
];

const COLS = "40px 1fr 115px 95px 180px 230px";

export default function KasautiDemo() {
  const t = useLoop(LENGTH, 10500);
  const queue = t >= 4800;
  const escalated = t >= 8750;
  const crore = (n: number) => `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr`;

  return (
    <Loop t={t} length={LENGTH}>
      <div className="relative h-full overflow-hidden text-[#0b0b0c]" style={{ background: "linear-gradient(180deg,#f6f2f2 0%,#eeeef0 22%,#f3f3f4 100%)" }}>
        <header className="flex h-[92px] items-center px-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/demos/kasauti-logo.png" alt="" width={62} height={62} />
          <span className="ml-3 leading-tight">
            <b className="block text-[30px] font-bold tracking-tight">Kasauti</b>
            <span className="text-[15px] text-[#3f3f46]"><span className="text-[#8b1a1a]">AI-powered</span> MPLADS verification</span>
          </span>
          <nav className="ml-auto flex items-center rounded-full border-2 border-[#cfcfd4] bg-white/60 p-[5px] text-[15px]">
            {["Overview", "Projects", "States", "MPs", "Sources"].map((n) => (
              <span key={n} className="rounded-full px-3 py-1.5" style={n === (queue ? "Projects" : "Overview") ? { background: "#111", color: "#fff" } : undefined}>
                {n}
              </span>
            ))}
          </nav>
          <span className="ml-4 flex h-11 w-[220px] items-center rounded-full border-2 border-[#cfcfd4] bg-white/70 px-5 text-[14px] text-[#6b6b74]">Search anything</span>
        </header>

        {!queue ? (
          /* ── National overview ── */
          <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-8">
            <p className="text-center text-[34px] font-bold tracking-[-0.03em]">Every MPLADS work, checked against its peers.</p>
            <div className="mt-3 flex items-center justify-between gap-6">
              <p className="max-w-[560px] text-[14px] leading-snug text-[#4a4a52]">
                18th Lok Sabha (2024–29) — figures cover this scope only, matching the same view on the source&apos;s dashboard.
              </p>
              <span className="flex rounded-full border-2 border-[#cfcfd4] bg-white/60 p-1 text-[13.5px]">
                <span className="rounded-full bg-[#111] px-3 py-1.5 text-white">18th Lok Sabha</span>
                <span className="px-3 py-1.5">17th Lok Sabha</span>
                <span className="px-3 py-1.5">Both terms</span>
              </span>
            </div>
            <div className="mt-5 rounded-[28px] border-2 border-[#5a5a60] bg-gradient-to-b from-[#e4e4e7] to-[#d4d4d8] p-5">
              <div className="grid grid-cols-3 gap-3.5">
                {OVERVIEW.map((k, i) => {
                  const n = countUp(k.v, t, 500 + i * 90, 1500);
                  return (
                    <div key={k.label} className="rounded-[18px] bg-white/95 px-4 py-3.5 text-center shadow-[0_8px_18px_-8px_rgba(11,11,12,0.25)]">
                      <p className="text-[15px] text-[#3f3f46]">{k.label}</p>
                      <p className="mt-0.5 text-[30px] font-bold tracking-tight" style={{ color: k.color }}>{k.cr ? crore(n) : inr(n)}</p>
                      <p className="text-[12.5px] text-[#6b6b74]">{k.note}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── Review queue ── */
          <motion.div key="queue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-8">
            <div className="grid grid-cols-5 gap-3">
              {[
                ["Awaiting review", inr(escalated ? 48293 : 48294), "₹4,618.91 Cr sanctioned", RED],
                ["Escalated", escalated ? "1" : "0", "Sent for physical verification", AMBER],
                ["Verified", "0", "Checked, found in order", "#16704a"],
                ["Dismissed", "2", "Flag did not hold"],
                ["In scope", "48,296", "Score 40 and above — 2,316 high, 45,980 medium"],
              ].map(([label, value, note, color], i) => (
                <div key={label} className={`h-[124px] rounded-[18px] bg-white/90 px-4 py-3 shadow-[0_8px_18px_-10px_rgba(11,11,12,0.25)] ${i === 4 ? "border-2 border-[#111]" : "border border-white"}`}>
                  <p className="text-[14px] leading-5 text-[#3f3f46]">{label}</p>
                  <motion.p key={value} initial={{ opacity: 0.4, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-[28px] font-bold leading-[38px]" style={{ color }}>
                    {value}
                  </motion.p>
                  <p className="text-[11px] leading-[14px] text-[#6b6b74]">{note}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-full border border-white bg-white/80 p-1.5 text-[13.5px] shadow-sm">
              <span className="flex-1 px-4 text-[#6b6b74]">Search for projects</span>
              {["All states", "Needs review (s…", "Both terms", "Any review stat…"].map((s) => (
                <span key={s} className="flex h-9 w-[160px] items-center justify-between gap-2 whitespace-nowrap rounded-full border border-[#dcdce0] bg-white px-4">
                  {s} <ChevronDown size={14} className="shrink-0" />
                </span>
              ))}
            </div>
            <p className="mt-3 flex justify-end">
              <span className="rounded-full bg-[#111] px-5 py-2 text-[13.5px] font-semibold text-white">Download this queue (CSV)</span>
            </p>
            <div className="mt-3 overflow-hidden rounded-[20px] border border-white bg-white/90 shadow-sm">
              <div className="grid px-4 py-2.5 text-[13.5px] text-[#3f3f46]" style={{ gridTemplateColumns: COLS }}>
                <span>#</span><span>Work</span><span>Where</span><span>Sanctioned</span><span>Risk</span><span>Decision</span>
              </div>
              <div className="grid border-t border-[#ececef] px-4 py-3.5" style={{ gridTemplateColumns: COLS }}>
                <span className="font-mono text-[13px] text-[#6b6b74]">1</span>
                <div className="pr-4">
                  <p className="text-[14.5px] font-semibold leading-snug underline decoration-[#bbb] underline-offset-4">Construction Teenshed at Trimurti dham, Gram Panchayat Umri,</p>
                  <p className="mt-1.5 text-[12px] font-semibold text-[#3f3f46]">Religious &amp; Cultural — BHIND(DISTRICT COLLECTOR BHIND_IDA)</p>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-2 space-y-1 border-l-2 border-[#d4d4d8] pl-2.5 text-[12px] leading-snug text-[#3f3f46]">
                    <p>₹995,000 against a ₹250,000 median for Religious &amp; Cultural works in BHIND (298% above, 10 peer works)</p>
                    <p>191 days beyond expected completion</p>
                  </motion.div>
                </div>
                <span className="text-[13.5px]"><b className="block font-semibold underline decoration-[#bbb] underline-offset-4">BHIND</b>Madhya Pradesh</span>
                <span className="font-mono text-[14px]">₹9.95 L</span>
                <div>
                  <span className="rounded-full border border-[#a82e22]/40 bg-[#fbe9e7] px-2.5 py-0.5 font-mono text-[13px] text-[#a82e22]">HIGH 85</span>
                  <div className="mt-2 flex h-[7px] w-[170px] gap-px overflow-hidden rounded-full bg-[#ececef]">
                    {[["#a82e22", 25], ["#c0533f", 25], ["#d98a7a", 20]].map(([c, w], i) => (
                      <motion.i key={c} initial={{ width: 0 }} animate={{ width: `${w}%` }} transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }} className="block h-full" style={{ background: c as string }} />
                    ))}
                  </div>
                  <p className="mt-1.5 font-mono text-[11.5px] text-[#4a4a52]">cost 25&nbsp; delay 25<br />duplication 20</p>
                </div>
                <div className="flex flex-wrap content-start gap-1.5 text-[13.5px] font-semibold">
                  <span className="rounded-full border px-3.5 py-1.5" style={escalated ? { background: "#111", borderColor: "#111", color: "#fff" } : { borderColor: "#cfcfd4" }}>
                    {escalated ? "✓ Escalated" : "Escalate"}
                  </span>
                  <span className="rounded-full border border-[#cfcfd4] px-3.5 py-1.5" style={{ opacity: escalated ? 0.45 : 1 }}>Verified</span>
                  <span className="rounded-full border border-[#cfcfd4] bg-[#e8e8ea] px-3.5 py-1.5" style={{ opacity: escalated ? 0.45 : 1 }}>Dismiss</span>
                </div>
              </div>
              <div className="grid border-t border-[#ececef] px-4 py-3.5" style={{ gridTemplateColumns: COLS }}>
                <span className="font-mono text-[13px] text-[#6b6b74]">2</span>
                <p className="pr-4 text-[14.5px] font-semibold leading-snug underline decoration-[#bbb] underline-offset-4">From Banki tindola - road sampark marg to Bhavi Bharat inter</p>
                <span className="text-[13.5px]"><b className="block font-semibold">BARA BANKI</b>Uttar Pradesh</span>
                <span className="font-mono text-[14px]">₹25.00 L</span>
                <span><span className="rounded-full border border-[#a82e22]/40 bg-[#fbe9e7] px-2.5 py-0.5 font-mono text-[13px] text-[#a82e22]">HIGH 85</span></span>
                <span />
              </div>
            </div>
          </motion.div>
        )}

        {!queue && (
          <div className="absolute inset-x-0 bottom-0 flex h-[54px] items-center overflow-hidden border-t border-[#d4d4d8] bg-white/85">
            <div className="flex shrink-0 gap-10 whitespace-nowrap pl-6" style={{ transform: `translateX(${-((t * 0.05) % 900)}px)` }}>
              {[...TICKER, ...TICKER].map(([w, at], i) => (
                <span key={i} className="flex items-center gap-3 text-[14.5px]">
                  <b className="rounded-md bg-[#fbe9e7] px-1.5 py-0.5 font-mono text-[13px] text-[#a82e22]">85</b>
                  <span className="max-w-[300px] truncate">{w}</span>
                  <span className="text-[12.5px] text-[#4a4a52]">{at}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <Cursor t={t} keys={KEYS} />
    </Loop>
  );
}
