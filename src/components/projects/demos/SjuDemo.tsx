"use client";

import { motion } from "framer-motion";
import { Bot, MapPin } from "lucide-react";
import { Cursor, Loop, Streamed, tokenize, typed, useLoop, type CursorKey } from "../kit";

/* The demo site (sju-chatbot.vercel.app) with the real widget flow:
   level → programme search → option cards → a free question answered by
   Gemini. The answer is a real reply from the live bot, cut after its first
   two points. */

const NAVY = "#0a2340";
const LENGTH = 18800;

/** Postgraduate programmes, as listed in static/embed.html. */
const PG = [
  "M.Sc. Big Data Analytics", "M.Sc. Computer Science", "M.Sc. Cyber Security and Artificial Intelligence",
  "MCA (Master of Computer Applications)", "M.Sc. Analytical Chemistry", "M.Sc. Organic Chemistry",
  "M.Sc. Biochemistry", "M.Sc. Counselling Psychology", "M.Sc. Biotechnology",
  "M.Sc. Environmental Science and Sustainability", "M.Sc. Food Science and Technology", "M.Sc. Microbiology",
  "M.Sc. Zoology", "M.Sc. Mathematics", "M.Sc. Physics", "M.Sc. Statistics", "M.Com (Master of Commerce)",
  "M.A. Economics", "M.A. English", "M.A. Political Science", "M.A. Advertising and Public Relations",
  "M.A. Journalism and Mass Communication", "M.S.W (Master of Social Work)",
];

const LEVELS = [
  ["🎓 Undergraduate", "BCA · BSc · BBA · BCom · BA"],
  ["📚 Postgraduate", "MSc · MCA · MBA · MA · MSW"],
  ["📜 PG Diploma", "Data Science · Cyber Security · etc"],
  ["🔬 PhD Programmes", "Research degrees"],
];
const CARDS = ["📘 Programme Info", "💰 Fees", "✅ Eligibility", "📅 Important Dates", "📝 How to Apply", "🎯 Selection Process"];

const QUESTION = "What is the eligibility for M.Sc. Big Data Analytics?";
const ANSWER = tokenize(
  "To be eligible for the **MSc in Big Data Analytics** at St Joseph's University, candidates must meet the following criteria:\n" +
    "- **Qualifying Degree:** Graduates who have studied **Mathematics, Basic Mathematics, Business Mathematics, Statistics, or Computer Science** as cognate/optional subjects. Candidates with a **BCA** (with Mathematics up to +2 level) or a **BE/B.Tech** degree are also eligible.\n" +
    "- **Minimum Marks:**\n" +
    "  - At least **40% marks in the cognate subject**.\n" +
    "  - At least **50% aggregate marks** across all optional subjects at the degree level (including English and Languages)."
);

const KEYS: CursorKey[] = [
  [0, 560, 320],
  [1300, 950, 578, 1], // open the widget
  [2400, 950, 578],
  [3300, 923, 402, 1], // Postgraduate
  [3700, 923, 402],
  [4300, 790, 524, 1], // search box
  [5000, 790, 524],
  [5500, 790, 480, 1], // M.Sc. Big Data Analytics
  [5900, 790, 480],
  [6600, 790, 524, 1], // ask a question
  [9500, 790, 524],
  [9800, 978, 524, 1], // send
  [10400, 978, 524],
  [11600, 880, 420],
];

const appear = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

function Avatar({ size }: { size: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/demos/sju-logo.jpg" alt="" width={size} height={size} className="shrink-0 rounded-full bg-[#f0c93d] object-cover" />
  );
}

function BotMsg({ children }: { children: React.ReactNode }) {
  return (
    <motion.div {...appear} className="flex max-w-[90%] shrink-0 items-end gap-2">
      <Avatar size={24} />
      <div className="rounded-[16px] rounded-bl-[5px] border border-[#dde6f0] bg-white px-3.5 py-2.5 text-[12.5px] font-medium leading-[1.55] text-[#1a1a1a] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        {children}
      </div>
    </motion.div>
  );
}

function UserMsg({ children }: { children: React.ReactNode }) {
  return (
    <motion.div {...appear} className="max-w-[86%] shrink-0 self-end rounded-[16px] rounded-br-[5px] px-3.5 py-2 text-[12.5px] font-medium leading-[1.55] text-white" style={{ background: NAVY }}>
      {children}
    </motion.div>
  );
}

export default function SjuDemo() {
  const t = useLoop(LENGTH, 16000);
  const open = t >= 1350;
  const picked = t >= 3300;
  const chosen = t >= 5500;
  const sent = t >= 9800;
  const query = picked && !chosen && t >= 4500 ? typed("big data", t, 4500, 16) : "";
  const draft = chosen && !sent && t >= 6800 ? typed(QUESTION, t, 6800, 20) : "";
  const matches = PG.filter((p) => p.toLowerCase().includes(query));
  const words = sent && t >= 10900 ? Math.floor(((t - 10900) * 18) / 1000) : 0;

  return (
    <Loop t={t} length={LENGTH}>
      {/* ── The university site the widget is embedded in ── */}
      <div className="flex h-[52px] items-center justify-between px-6 text-[11.5px] text-white/85" style={{ background: "#0d2543" }}>
        <span className="flex items-center gap-1.5">
          <MapPin size={12} className="text-[#ef4444]" /> 36, Lalbagh Road, Bengaluru-560027, Karnataka, India.
        </span>
        <span className="flex gap-3">
          UGC Proforma/Mandatory Disclosure <i className="not-italic opacity-40">|</i> NIRF <i className="not-italic opacity-40">|</i> Admissions
        </span>
      </div>
      <div className="flex h-[78px] items-center gap-4 px-7">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/demos/sju-logo.jpg" alt="" width={56} height={56} className="object-contain" />
        <div>
          <p className="text-[20px] font-extrabold tracking-tight" style={{ color: "#0d2543" }}>ST JOSEPH&apos;S UNIVERSITY</p>
          <p className="text-[10.5px] tracking-[0.18em] text-[#777]">BENGALURU · INDIA</p>
        </div>
      </div>
      <div className="flex h-[46px] items-center gap-5 px-6 text-[13px] font-semibold text-[#333]">
        <span className="rounded-full bg-[#19723f] px-3.5 py-1.5 text-white">Home</span>
        {["About Us", "Academics", "Student Support", "Examinations", "Services", "Bulletin", "Why SJU", "Admissions"].map((n) => (
          <span key={n}>
            {n} <span className="text-[9px] text-[#888]">▼</span>
          </span>
        ))}
      </div>
      <div className="flex h-[32px] items-center gap-4 overflow-hidden border-y border-[#f1e1ad] bg-[#fff8e3] px-6 text-[12px] font-semibold" style={{ color: "#0d2543" }}>
        <span className="shrink-0 rounded px-2 py-0.5 text-[10.5px] text-white" style={{ background: "#0d2543" }}>📢 Announcements</span>
        <div className="min-w-0 flex-1 overflow-hidden">
          <span className="block whitespace-nowrap" style={{ transform: `translateX(${-((t * 0.04) % 520)}px)` }}>
            {"• Admissions 2026-27 are OPEN — Apply at admissions.sju.edu.in      ".repeat(4)}
          </span>
        </div>
      </div>
      <div
        className="relative flex h-[398px] flex-col items-center pt-9 text-center"
        style={{ background: "#0b2240", backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 9px, transparent 10px)", backgroundSize: "34px 34px" }}
      >
        <p className="text-[12px] tracking-[0.3em] text-white/70">ST JOSEPH&apos;S UNIVERSITY, BENGALURU</p>
        <p className="mt-5 text-[62px] font-black leading-[0.98] tracking-tight text-white">
          PROUD TO BE <span className="text-[#f0c93d]">RANKED</span>
          <br />
          <span className="text-[#f0c93d]">AMONG</span> INDIA&apos;S BEST!
        </p>
      </div>

      {/* Launcher */}
      <div className="absolute bottom-[16px] right-[18px] flex items-center gap-2.5">
        <span className="rounded-full bg-white px-3 py-1 text-[12.5px] font-bold text-[#d61f3a] shadow-md">Chat</span>
        <span className="relative grid h-7 w-7 place-items-center rounded-full bg-white text-[#0d2543] shadow-md">
          <Bot size={17} />
          <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-[#e11d48] text-[7px] font-bold text-white">AI</span>
        </span>
      </div>

      {/* ── The widget ── */}
      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.92, y: open ? 0 : 14 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-[54px] right-[16px] flex h-[446px] w-[356px] origin-bottom-right flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_24px_60px_-12px_rgba(0,0,0,0.45)]"
      >
        <div className="flex h-[58px] shrink-0 items-center gap-2.5 px-3.5 text-white" style={{ background: `linear-gradient(135deg, ${NAVY}, #003580)` }}>
          <Avatar size={38} />
          <div className="flex-1 leading-tight">
            <p className="text-[14px] font-bold">SJU Assistant</p>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] opacity-75">
              <i className="h-[7px] w-[7px] rounded-full bg-[#4ade80]" /> Online
            </p>
          </div>
          <span className="rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[10.5px] font-semibold">⟳ Start Over</span>
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white/[0.12] text-[13px]">✕</span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-end gap-2.5 overflow-hidden bg-[#f5f7fb] p-3">
          {t >= 1700 && (
            <BotMsg>
              Hi 👋 Welcome to the <strong>SJU Assistant</strong>!
              <br />
              <br />
              Choose a programme level, or open any official page below:
            </BotMsg>
          )}
          {t >= 2000 && (
            <motion.div {...appear} className="ml-8 grid shrink-0 grid-cols-2 gap-[7px]">
              {LEVELS.map(([name, sub]) => (
                <span
                  key={name}
                  className="flex h-[50px] flex-col items-center justify-center rounded-[12px] border-2 bg-white text-center text-[12.5px] font-bold"
                  style={{ borderColor: NAVY, color: NAVY }}
                >
                  {name}
                  <small className="text-[9.5px] font-bold text-[#c0392b]">{sub}</small>
                </span>
              ))}
            </motion.div>
          )}
          {picked && <UserMsg>Postgraduate</UserMsg>}
          {t >= 3500 && (
            <BotMsg>
              Great! Please <strong>search or select</strong> the Postgraduate programme you&apos;re interested in. 🔍
              <br />
              <span className="text-[10.5px] font-bold opacity-70">Start typing below — e.g. &quot;data&quot;, &quot;computer&quot;, &quot;psych&quot;...</span>
            </BotMsg>
          )}
          {chosen && <UserMsg>M.Sc. Big Data Analytics</UserMsg>}
          {t >= 5700 && (
            <BotMsg>
              <strong>M.Sc. Big Data Analytics</strong> — great choice! 🎉
              <br />
              What would you like to know? Click an option below, or type any question.
            </BotMsg>
          )}
          {t >= 5900 && (
            <motion.div {...appear} className="ml-8 grid shrink-0 grid-cols-2 gap-1.5">
              {CARDS.map((c) => (
                <span key={c} className="rounded-[10px] border-2 border-[#dde6f4] bg-white px-2.5 py-1.5 text-[11.5px] font-semibold" style={{ color: NAVY }}>
                  {c}
                </span>
              ))}
            </motion.div>
          )}
          {sent && <UserMsg>{QUESTION}</UserMsg>}
          {sent && t >= 9900 && t < 10900 && (
            <BotMsg>
              <span className="flex gap-1.5 py-1">
                {[0, 1, 2].map((d) => (
                  <i key={d} className="h-2 w-2 rounded-full" style={{ background: NAVY, opacity: 0.3 + 0.7 * Math.max(0, Math.sin((t / 1200) * Math.PI * 2 - d * 0.9)) }} />
                ))}
              </span>
            </BotMsg>
          )}
          {words > 0 && (
            <BotMsg>
              <Streamed tokens={ANSWER} n={words} />
            </BotMsg>
          )}
        </div>

        {/* Input, with the programme search dropdown above it */}
        <div className="relative flex h-[56px] shrink-0 items-center gap-2 border-t border-[#e4ecf4] bg-white px-3">
          {picked && !chosen && t >= 3500 && (
            <motion.div {...appear} className="absolute bottom-[51px] left-3 right-[56px] overflow-hidden rounded-[14px] border border-[#dde6f4] bg-white shadow-[0_-6px_24px_rgba(0,0,0,0.14)]">
              {matches.slice(0, 5).map((m, i) => (
                <div
                  key={m}
                  className="border-b border-[#f4f6fa] px-3.5 py-2 text-[12.5px] font-bold last:border-none"
                  style={{ color: NAVY, background: query && i === 0 ? "#eef3ff" : "#fff" }}
                >
                  {m}
                </div>
              ))}
            </motion.div>
          )}
          <div
            className="flex h-9 flex-1 items-center overflow-hidden whitespace-nowrap rounded-full border-2 px-4 text-[12.5px] font-medium"
            style={{
              borderColor: (t >= 4300 && !chosen) || (t >= 6600 && !sent) ? NAVY : "#dde6f0",
              background: (t >= 4300 && !chosen) || (t >= 6600 && !sent) ? "#fff" : "#f5f7fb",
            }}
          >
            {query || draft ? (
              <span className="text-[#1a1a1a]">
                {query || draft}
                <i className="ml-px inline-block h-3.5 w-px animate-pulse bg-[#1a1a1a] align-middle" />
              </span>
            ) : (
              <span className="text-[#999]">
                {chosen ? "Ask anything about this programme..." : picked ? "Search Postgraduate programmes..." : "Ask anything about SJU..."}
              </span>
            )}
          </div>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full" style={{ background: NAVY, opacity: sent && words < ANSWER.length ? 0.4 : 1 }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#fff">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </span>
        </div>
      </motion.div>

      <Cursor t={t} keys={KEYS} />
    </Loop>
  );
}
