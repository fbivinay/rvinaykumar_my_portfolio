"use client";

import { motion } from "framer-motion";
import { Cursor, easeOut, Loop, prog, useLoop, type CursorKey } from "../kit";

/* ai-tech-news-alpha.vercel.app: the billboard top story, the ranked Trending
   Now rail, a card's AI summary on hover, and the click-out notice. Stories
   are from the live feed; cards use the site's own no-image placeholder. */

const RED = "#e50914";
const LENGTH = 13000;

const TOP = {
  title: "Anthropic cofounder renews call for robust regulation of frontier AI",
  summary:
    "Concerns about AI guardrails have soared after models developed by OpenAI and Anthropic were involved in security incidents during testing, piling on pressure to regulate the technology.",
  source: "Economic Times Tech",
  ago: "1 hour ago",
  tags: ["Policy & Regulation", "OpenAI", "Anthropic"],
};

const TRENDING = [
  {
    title: "New York City pension fund asks Anthropic to delay IPO",
    source: "Economic Times Tech",
    ago: "7 hours ago",
    tags: ["Startups & Funding", "Anthropic"],
    summary:
      "The supervisor of New York City's pension funds, one of the largest in the United States, asked Anthropic to postpone its stock market debut until risks posed by its artificial intelligence technology are better controlled.",
  },
  {
    title: "Tesla Debuts 2026 Roadster, an EV Sports Car at Least $200,000",
    source: "NYT Technology",
    ago: "2 hours ago",
    tags: ["Tech", "Tesla"],
    summary:
      "Elon Musk’s company and other automakers, like Jaguar and Bentley, are trying to sell very expensive electric cars to people who usually prefer gasoline-fueled luxury and performance.",
  },
  {
    title: "Urban Company board approves plan to raise Rs 2,500 crore via QIP",
    source: "Economic Times Tech",
    ago: "24 minutes ago",
    tags: ["Startups & Funding", "Urban Company"],
    summary:
      "Urban Company raised Rs 472 crore through its initial public offering (IPO) in September last year.",
  },
];

const CHIPS = ["Top Story", "Trending Now", "AI Models", "Tech", "Startups & Funding", "Policy & Regulation", "Security", "Hardware & Chips"];

const KEYS: CursorKey[] = [
  [0, 760, 330],
  [1800, 420, 300],
  [3300, 640, 470],
  [4600, 640, 430],
  [6200, 470, 330], // hover the Tesla story
  [8100, 470, 330],
  [8300, 470, 330, 1], // open it
  [8800, 470, 330],
  [10200, 760, 250],
];

function Source({ name }: { name: string }) {
  const nyt = name.startsWith("NYT");
  return (
    <span className="flex items-center gap-1.5 text-[12.5px]">
      <i className={`grid h-[18px] w-[18px] place-items-center rounded-[4px] text-[9px] font-bold not-italic ${nyt ? "bg-[#ececee] text-[#111]" : "bg-[#d71920] text-white"}`}>
        {nyt ? "T" : "ET"}
      </i>
      <b className="font-bold text-[#4d4d4f]">{name}</b>
    </span>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <span className="flex gap-1.5 text-[12px]">
      {tags.map((g, i) => (
        <i key={g} className="rounded-md px-2 py-0.5 not-italic" style={i === 0 ? { color: RED, background: "rgba(229,9,20,0.08)" } : { color: "#4d4d4f", background: "#f0f0f1" }}>
          {g}
        </i>
      ))}
    </span>
  );
}

export default function NewsDemo() {
  const t = useLoop(LENGTH, 7400);
  const loaded = t >= 900;
  const scroll = -410 * easeOut(prog(t, 3600, 4600));
  const hover = t >= 6200 && t < 9200;
  const toast = t >= 8350 && t < 11000;

  return (
    <Loop t={t} length={LENGTH}>
      <div className="relative h-full bg-white text-[#141414]">
        <header className="flex h-[60px] items-center justify-between px-7">
          <span className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/demos/updatebro-logo.png" alt="" width={34} height={34} />
            <b className="text-[20px] font-black tracking-[0.06em]">UPDATE BRO!</b>
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full border border-[#e4e4e6] text-[15px] text-[#4d4d4f]">◐</span>
        </header>
        <nav className="flex h-[50px] items-start justify-center gap-11 border-b border-[#ececee] text-[17px] font-extrabold text-[#4d4d4f]">
          {["News", "Jobs", "Courses", "Hackathons", "Workshops", "Conferences"].map((n) => (
            <span key={n} className="relative pt-1.5" style={n === "News" ? { color: RED } : undefined}>
              {n}
              {n === "News" && <i className="absolute -bottom-[14px] left-0 h-[3px] w-full" style={{ background: RED }} />}
            </span>
          ))}
        </nav>
        <div className="relative z-10 flex h-[54px] items-center gap-2.5 overflow-hidden bg-white px-6 text-[13.5px] font-semibold text-[#333]">
          {CHIPS.map((c, i) => (
            <span key={c} className="shrink-0 rounded-full border px-4 py-1.5" style={i === 0 ? { background: RED, borderColor: RED, color: "#fff" } : { borderColor: "#e4e4e6" }}>
              {c}
            </span>
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-0 top-[164px] overflow-hidden">
          <div style={{ transform: `translateY(${scroll}px)` }} className="px-6 pt-3">
            {/* Billboard */}
            <div
              className="relative h-[400px] overflow-hidden rounded-[18px] p-11 shadow-[0_1px_3px_rgba(20,20,20,0.08),0_10px_30px_rgba(20,20,20,0.1)]"
              style={{ background: "radial-gradient(520px 260px at 88% 0%, rgba(229,9,20,0.12), transparent 65%), linear-gradient(135deg,#efeff1,#f6f6f7)" }}
            >
              {loaded ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <p className="text-[12px] font-black tracking-[0.22em]" style={{ color: RED }}>🔥 TOP STORY</p>
                  <p className="mt-3 max-w-[640px] text-[34px] font-black leading-[1.08] tracking-tight">{TOP.title}</p>
                  <p className="mt-3 max-w-[600px] text-[14.5px] leading-relaxed text-[#4d4d4f]">{TOP.summary}</p>
                  <p className="mt-3 flex items-center gap-1.5 text-[12.5px] text-[#8c8c8e]">
                    <Source name={TOP.source} /> · {TOP.ago}
                  </p>
                  <div className="mt-3"><Tags tags={TOP.tags} /></div>
                  <p className="mt-4 flex items-center gap-3">
                    <span className="flex items-center gap-2 rounded-full px-5 py-2 text-[13.5px] font-bold text-white" style={{ background: RED }}>▶ Read Full Article</span>
                    <span className="text-[11.5px] text-[#8c8c8e]">↗ Opens the original source</span>
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-3 pt-6">
                  {[160, 600, 520, 420, 300].map((w, i) => (
                    <i key={i} className="block animate-pulse rounded-md bg-[#e4e4e6]" style={{ width: w, height: i === 1 || i === 2 ? 34 : 14 }} />
                  ))}
                </div>
              )}
            </div>

            {/* Trending Now */}
            <p className="mt-9 flex items-baseline gap-3">
              <i className="h-5 w-[3px] self-center rounded-full" style={{ background: RED }} />
              <b className="text-[19px] font-black tracking-[0.08em]">TRENDING NOW</b>
              <span className="text-[12.5px] font-semibold text-[#8c8c8e]">10 stories</span>
            </p>
            <div className="mt-5 flex gap-6 pl-9">
              {TRENDING.map((s, i) => {
                const on = hover && i === 1;
                return (
                  <motion.div
                    key={s.title}
                    initial={false}
                    animate={{ y: on ? -6 : 0, scale: on ? 1.03 : 1 }}
                    transition={{ duration: 0.25 }}
                    className="relative w-[288px] shrink-0"
                  >
                    <span
                      className="absolute -bottom-3 -left-12 z-10 text-[108px] font-black leading-none tracking-[-0.06em] text-white"
                      style={{ WebkitTextStroke: `3px ${on ? RED : "#d5d5d8"}` }}
                    >
                      {i + 1}
                    </span>
                    <div className={`relative h-[162px] overflow-hidden rounded-[14px] ${on ? "shadow-[0_10px_30px_rgba(20,20,20,0.18)]" : ""}`}>
                      <div className="grid h-full place-items-center" style={{ background: "radial-gradient(400px 200px at 80% -30%, rgba(229,9,20,0.14), transparent 65%), linear-gradient(135deg,#ececee,#f6f6f7)" }}>
                        <span className="text-[44px] font-black text-[#8c8c8e]">{s.source[0]}</span>
                      </div>
                      <motion.div
                        initial={false}
                        animate={{ opacity: on ? 1 : 0 }}
                        className="absolute inset-0 flex items-end bg-gradient-to-t from-black/85 via-black/55 to-transparent p-3.5"
                      >
                        <p className="text-[12px] leading-snug text-white">{s.summary}</p>
                      </motion.div>
                    </div>
                    <div className="relative z-20 pl-1 pt-3">
                      <p className="text-[15px] font-extrabold leading-snug">{s.title}</p>
                      <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-[#8c8c8e]">
                        <Source name={s.source} /> · {s.ago}
                      </p>
                      <div className="mt-2"><Tags tags={s.tags} /></div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* "You are leaving the platform" notice */}
        <motion.div
          initial={false}
          animate={{ opacity: toast ? 1 : 0, y: toast ? 0 : 8 }}
          transition={{ duration: 0.25 }}
          className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2.5 rounded-[10px] bg-[#141414] px-[18px] py-3 text-[13.5px] text-white shadow-[0_6px_24px_rgba(0,0,0,0.28)]"
        >
          <span className="text-[18px]">↗</span>
          <span>
            External link — you are leaving the platform.
            <br />
            <small className="opacity-70">Opening the full article on NYT Technology</small>
          </span>
        </motion.div>
      </div>

      <Cursor t={t} keys={KEYS} />
    </Loop>
  );
}
