"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cursor, easeOut, Loop, prog, useLoop, type CursorKey } from "../kit";

/* ai-tech-news-alpha.vercel.app in a 1280-wide window: the billboard top story,
   the ranked Trending Now rail, a card's AI summary on hover and the click-out
   notice. Stories are from the live feed (16 Oct 2026). Images load the way the
   site loads them: through its image optimiser, then the publisher's own URL,
   then the site's lettered placeholder. */

const RED = "#e50914";
const LENGTH = 13000;
const ZOOM = 0.8; // the site at 1280px wide, fitted into the 1024px screen
const SITE = "https://ai-tech-news-alpha.vercel.app";
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"; // the site's own stack

const optimised = (url: string, w: 480 | 1600) => `${SITE}/_vercel/image?url=${encodeURIComponent(url)}&w=${w}&q=75`;

type Story = { title: string; summary: string; source: string; domain: string; ago: string; tags: string[]; image: string };

const TOP: Story = {
  title: "Tesla unveils long-delayed Roadster developed with SpaceX, fueling merger speculation",
  summary: "Elon Musk first debuted the Roadster refresh concept in 2017 but Tesla has since missed every targeted delivery date.",
  source: "CNBC Technology",
  domain: "www.cnbc.com",
  ago: "just now",
  tags: ["Startups & Funding", "Tesla", "SpaceX"],
  image: "https://image.cnbcfm.com/api/v1/image/108419270-1792151092525-108419270-1792150895998-screenshot_2026-10-15_at_60952___pm.jpg?v=1792151098&w=1920&h=1080",
};

const TRENDING: Story[] = [
  {
    title: "iPhone Duo orders are already delayed into 2027",
    summary: "Delivery estimates for the iPhone Duo slipped into next year in less than an hour after Apple opened preorders for it at 8AM ET on Friday.",
    source: "The Verge",
    domain: "www.theverge.com",
    ago: "33 min ago",
    tags: ["Consumer Tech", "Apple"],
    image: "https://platform.theverge.com/wp-content/uploads/sites/2/2026/09/apple-event-september-2026-452-10-57-30.jpg?quality=90&#038;strip=all&#038;crop=0,0,100,100",
  },
  {
    title: "Steam Achievement Sets will stop DLCs from ruining your 100 percent record",
    summary: "Steam has launched Achievement Sets in beta.",
    source: "Engadget",
    domain: "www.engadget.com",
    ago: "1 hour ago",
    tags: ["Tech"],
    image: "https://www.engadget.com/img/gallery/steam-achievement-sets-will-stop-dlcs-from-ruining-your-100-percent-record/l-intro-1792151622.jpg",
  },
  {
    title: "Nvidia’s RTX Spark laptops are built to run AI agents locally",
    summary:
      "Nvidia’s RTX Spark laptops, which launched on Friday, are built to run AI agents on the laptop itself. Users can install agents such as GitHub Copilot, Hermes, OpenClaw and Perplexity from the first start-up, without a command line, Nvidia said.",
    source: "The Next Web",
    domain: "thenextweb.com",
    ago: "39 min ago",
    tags: ["AI Models", "Microsoft"],
    image: "https://media.thenextweb.com/2026/10/nvidia-rtx-spark-laptops-transparent-chassis-render.avif",
  },
  {
    title: "Anthropic gives METR inside access to audit its AI models and safety practices",
    summary: "Anthropic has given a team from the nonprofit METR inside access to review its AI models and safety practices, the company announced.",
    source: "The Decoder",
    domain: "the-decoder.com",
    ago: "31 min ago",
    tags: ["Tech", "Anthropic"],
    image: "https://the-decoder.com/wp-content/uploads/2025/11/Anthropic-Cybersecurity.png",
  },
];

const CHIPS = ["Top Story", "Trending Now", "AI Models", "Tech", "Startups & Funding", "Policy & Regulation", "Security", "Hardware & Chips", "Consumer Tech"];
const HOVERED = 2; // the Nvidia story

/** Cursor keys are in screen (1024-wide) coordinates, measured on the rendered page. */
const KEYS: CursorKey[] = [
  [0, 760, 330],
  [1800, 300, 300], // over the top story's headline
  [3300, 520, 420],
  [4600, 600, 430],
  [6200, 764, 441], // hover the Nvidia story
  [8100, 764, 441],
  [8300, 764, 441, 1], // open it
  [8800, 764, 441],
  [10200, 760, 250],
];

/** A story image: the optimiser first, then the publisher's URL, then the placeholder. */
function StoryImage({ story, width }: { story: Story; width: 480 | 1600 }) {
  const [src, setSrc] = useState(() => optimised(story.image, width));
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <div
        className="grid h-full w-full place-items-center"
        style={{ background: "radial-gradient(400px 200px at 80% -30%, rgba(229,9,20,0.14), transparent 65%), linear-gradient(135deg,#f0f0f2,#f6f6f7)" }}
      >
        <span className="text-[44px] font-black text-[#8c8c8e]">{story.source[0]}</span>
      </div>
    );
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      referrerPolicy="no-referrer"
      onError={() => (src === story.image ? setFailed(true) : setSrc(story.image))}
      className="h-full w-full object-cover"
    />
  );
}

function Meta({ story }: { story: Story }) {
  const [logo, setLogo] = useState(true);
  return (
    <p className="flex items-center gap-[7px] text-[12.5px] text-[#8c8c8e]">
      {logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://www.google.com/s2/favicons?domain=${story.domain}&sz=64`}
          alt=""
          width={16}
          height={16}
          onError={() => setLogo(false)}
          className="h-4 w-4 rounded-[4px]"
        />
      )}
      <b className="font-bold text-[#4d4d4f]">{story.source}</b>
      <span>·</span>
      <span>{story.ago}</span>
    </p>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <p className="flex flex-wrap gap-1.5">
      {tags.map((g, i) => (
        <span
          key={g}
          className="rounded-[4px] px-[9px] py-[3px] text-[11px] font-semibold tracking-[0.02em]"
          style={i === 0 ? { color: RED, background: "rgba(229,9,20,0.08)" } : { color: "#4d4d4f", background: "#f0f0f2" }}
        >
          {g}
        </span>
      ))}
    </p>
  );
}

export default function NewsDemo() {
  const t = useLoop(LENGTH, 7400);
  const loaded = t >= 900;
  const scroll = -330 * easeOut(prog(t, 3600, 4600));
  const hover = t >= 6200 && t < 9200;
  const toast = t >= 8350 && t < 11000;

  return (
    <Loop t={t} length={LENGTH}>
      <div
        className="relative overflow-hidden bg-white text-[#141414]"
        style={{ width: 1024 / ZOOM, height: 606 / ZOOM, transform: `scale(${ZOOM})`, transformOrigin: "0 0", fontFamily: FONT }}
      >
        {/* Sticky header: brand row, sections, story chips */}
        <header className="relative z-10 bg-white" style={{ boxShadow: scroll < -4 ? "0 4px 20px rgba(20,20,20,0.1)" : "none" }}>
          <div className="flex items-center justify-between px-6 pb-1 pt-2.5">
            <span className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/updatebro-logo.png" alt="" width={30} height={30} className="drop-shadow-[0_3px_8px_rgba(20,20,20,0.25)]" />
              <b className="text-[18px] font-black uppercase tracking-[0.04em]">Update Bro!</b>
            </span>
            <span className="grid h-[34px] w-[34px] place-items-center rounded-full border border-[#e8e8ea] text-[16px] text-[#4d4d4f]">◐</span>
          </div>
          <nav className="flex justify-center gap-9 border-b border-[#e8e8ea] px-6 pb-3.5 pt-2">
            {["News", "Jobs", "Courses", "Hackathons", "Workshops", "Conferences"].map((n) => (
              <span
                key={n}
                className="border-b-[3px] px-0.5 pb-3 pt-1.5 text-[18px] font-extrabold tracking-[0.01em]"
                style={n === "News" ? { color: RED, borderColor: RED } : { color: "#4d4d4f", borderColor: "transparent" }}
              >
                {n}
              </span>
            ))}
          </nav>
          <div className="flex gap-2 overflow-hidden px-6 pb-2 pt-0.5">
            {CHIPS.map((c, i) => (
              <span
                key={c}
                className="shrink-0 whitespace-nowrap rounded-full border px-[15px] py-1.5 text-[12.5px] font-bold tracking-[0.02em]"
                style={i === 0 ? { background: RED, borderColor: RED, color: "#fff" } : { borderColor: "#e8e8ea", color: "#4d4d4f" }}
              >
                {c}
              </span>
            ))}
          </div>
        </header>

        <div style={{ transform: `translateY(${scroll}px)` }}>
          {/* Billboard */}
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="relative isolate mb-3.5 mt-[22px] flex min-h-[420px] items-center overflow-hidden rounded-2xl bg-[#f6f6f7] shadow-[0_1px_3px_rgba(20,20,20,0.08),0_10px_30px_rgba(20,20,20,0.1)]">
              {loaded ? (
                <>
                  <motion.div
                    className="absolute inset-0 -z-20"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ opacity: { duration: 0.7 }, scale: { duration: 6, ease: "easeOut" } }}
                  >
                    <StoryImage story={TOP} width={1600} />
                  </motion.div>
                  <div
                    className="absolute inset-0 -z-10"
                    style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 42%, rgba(255,255,255,0.4) 72%, rgba(255,255,255,0.04) 100%)" }}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative flex max-w-[620px] flex-col gap-3.5 px-12 py-11"
                  >
                    <p className="text-[12px] font-extrabold uppercase tracking-[0.14em]" style={{ color: RED }}>🔥 Top Story</p>
                    <p className="text-[42px] font-black leading-[1.08] tracking-[-0.015em]">{TOP.title}</p>
                    <p className="max-w-[54ch] text-[16px] leading-[1.6] text-[#4d4d4f]">{TOP.summary}</p>
                    <Meta story={TOP} />
                    <Tags tags={TOP.tags} />
                    <p className="mt-1 flex items-center gap-4">
                      <span className="flex items-center gap-[9px] rounded-md px-[22px] py-3 text-[15px] font-extrabold text-white shadow-[0_6px_18px_rgba(229,9,20,0.35)]" style={{ background: RED }}>
                        <span className="text-[12px]">▶</span> Read Full Article
                      </span>
                      <span className="text-[11.5px] text-[#8c8c8e]">↗ Opens the original source</span>
                    </p>
                  </motion.div>
                </>
              ) : (
                <div className="space-y-3.5 px-12 py-11">
                  {[120, 560, 480, 420, 260].map((w, i) => (
                    <i key={i} className="block animate-pulse rounded-md bg-[#e4e4e6]" style={{ width: w, height: i === 1 || i === 2 ? 40 : 14 }} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Trending Now rail */}
          <section className="my-[26px]">
            <div className="mx-auto mb-3 flex max-w-[1200px] items-center gap-2.5 px-6">
              <b className="flex items-center text-[17px] font-black uppercase tracking-[0.06em]">
                <i className="mr-2.5 inline-block h-4 w-1 rounded-sm" style={{ background: RED }} />
                Trending Now
              </b>
              <span className="text-[12.5px] font-semibold text-[#8c8c8e]">10 stories</span>
            </div>
            <div className="mx-auto max-w-[1200px] overflow-hidden">
              <div className="flex gap-4 px-6 pb-[18px] pt-2">
                {TRENDING.map((s, i) => {
                  const on = hover && i === HOVERED;
                  return (
                    <motion.article
                      key={s.title}
                      initial={false}
                      animate={{ y: on ? -6 : 0, scale: on ? 1.03 : 1 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="relative shrink-0 basis-[332px] pl-[52px]"
                      style={{ zIndex: on ? 4 : 0 }}
                    >
                      <span
                        className="absolute -bottom-3 -left-1.5 z-10 text-[108px] font-black leading-none tracking-[-0.06em] text-white"
                        style={{ WebkitTextStroke: `3px ${on ? RED : "#d4d4d6"}` }}
                      >
                        {i + 1}
                      </span>
                      <div className={`relative aspect-video overflow-hidden rounded-[10px] bg-[#f0f0f2] ${on ? "shadow-[0_1px_3px_rgba(20,20,20,0.08),0_10px_30px_rgba(20,20,20,0.1)]" : "shadow-[0_1px_3px_rgba(20,20,20,0.1)]"}`}>
                        <StoryImage story={s} width={480} />
                        <div
                          className="absolute inset-0 flex items-end p-3 transition-opacity duration-200"
                          style={{ opacity: on ? 1 : 0, background: "linear-gradient(180deg, transparent 20%, rgba(255,255,255,0.92) 78%)" }}
                        >
                          <p
                            className="line-clamp-4 text-[12.5px] leading-[1.5] text-[#141414] transition-transform duration-200"
                            style={{ transform: on ? "none" : "translateY(6px)" }}
                          >
                            {s.summary}
                          </p>
                        </div>
                      </div>
                      <div className="relative z-20 flex flex-col gap-1.5 px-0.5 pt-2.5">
                        <p className="line-clamp-2 text-[14.5px] font-extrabold leading-[1.32] tracking-[-0.005em]">{s.title}</p>
                        <Meta story={s} />
                        <Tags tags={s.tags} />
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </section>
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
            <small className="opacity-70">Opening the full article on {TRENDING[HOVERED].source}</small>
          </span>
        </motion.div>
      </div>

      <Cursor t={t} keys={KEYS} />
    </Loop>
  );
}
