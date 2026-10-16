"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";
import { countUp, Cursor, easeOut, Loop, prog, useLoop, type CursorKey } from "../kit";

/* intelligent-investment.vercel.app: the Overview chart (its real line paths),
   then the Performance calculator re-running from 2021. Every figure is what
   the live site returns for ₹10 lakh, one-time, new tax regime. */

const GREEN = "#087A52";
const INK = "#16201b";
const LENGTH = 15500;

/** y of each line every 2px from x=72 to x=390, read from the site's SVG (614×447). */
const SERIES = {
  max: "382 383 382 382 381 381 382 380 376 374 372 369 370 365 364 367 365 366 364 365 366 367 366 364 363 366 367 368 372 372 372 371 371 371 370 370 371 370 369 371 371 370 370 369 368 368 367 365 363 365 367 364 362 361 360 358 357 352 353 351 351 350 344 340 338 334 331 330 327 319 317 312 309 304 305 302 304 301 299 299 299 298 303 304 302 305 311 311 313 311 308 309 315 313 311 308 313 312 312 317 312 310 310 305 298 291 288 285 279 280 283 272 267 263 253 251 244 247 245 243 237 232 221 236 225 226 219 221 231 214 207 204 201 207 213 209 207 200 197 193 192 189 178 167 170 167 166 162 170 162 165 171 153 141 146 144 145 141 142 144",
  nifty: "382 383 381 380 380 379 379 379 377 378 376 376 377 375 372 376 375 376 374 373 373 374 372 370 369 372 374 374 373 372 373 372 373 369 368 368 367 367 367 370 371 371 369 368 366 366 364 364 365 370 387 381 380 380 377 372 370 369 369 369 366 362 359 356 353 349 350 351 352 350 346 345 344 342 340 336 334 331 333 335 337 334 336 343 336 336 344 340 341 336 333 333 337 334 330 328 331 332 333 335 336 333 330 328 326 323 323 323 319 322 324 321 314 310 310 310 306 308 307 307 301 298 293 294 290 288 291 294 299 293 297 300 302 304 301 294 290 291 287 289 291 291 288 288 286 282 284 285 288 285 296 301 294 296 298 293 294 291 294 301",
  gold: "382 381 383 382 382 384 382 381 381 381 382 381 383 381 380 380 380 380 379 378 379 380 381 381 380 380 378 378 380 379 378 376 376 378 378 378 379 378 376 374 370 369 370 368 369 369 368 366 365 362 364 356 354 356 354 352 345 345 348 350 348 349 352 350 353 354 358 359 354 355 352 355 354 354 356 356 357 354 353 355 355 353 351 346 350 348 351 350 351 350 349 351 353 352 348 346 345 341 341 344 339 336 335 337 339 338 338 339 339 341 337 337 334 333 334 334 333 328 317 319 320 320 317 324 320 317 315 309 316 313 313 307 300 299 294 285 291 282 283 283 278 273 262 240 249 242 232 225 216 196 199 213 206 194 211 218 216 204 202 211",
  nasdaq: "382 385 385 381 379 379 382 385 385 384 385 377 378 373 368 371 365 371 370 369 362 363 359 358 354 354 358 360 373 379 376 372 370 371 368 365 369 368 366 365 366 363 365 363 362 359 358 355 351 354 368 357 351 347 341 337 338 332 333 332 330 326 322 319 319 313 318 321 308 312 314 306 300 299 299 297 303 294 290 287 288 302 304 308 293 300 307 311 323 315 306 316 320 324 320 318 323 321 309 314 310 307 308 298 290 283 283 288 284 290 292 279 277 268 267 261 256 254 254 257 255 239 231 256 242 241 239 233 231 203 182 175 187 223 216 230 217 218 207 200 192 192 175 156 155 157 154 153 153 161 165 145 76 46 52 39 44 39 49 53",
};
const path = (ys: string) => ys.split(" ").map((y, i) => `${i ? "L" : "M"}${72 + 2 * i},${y}`).join("");

/** Line colour, where the line ends (x=390), the after-tax dot and its label. */
const LINES = [
  { key: "nasdaq", color: "#C4467C", width: 1.75, end: 53, dot: 103, value: "₹69.6 lakh", name: "Nasdaq 100 ETF" },
  { key: "max", color: GREEN, width: 2.75, end: 144, dot: 159, value: "₹57.7 lakh", name: "Intelligent Investment" },
  { key: "gold", color: "#A9770C", width: 1.75, end: 211, dot: 236, value: "₹41.2 lakh", name: "Gold ETF" },
  { key: "nifty", color: "#2F63B3", width: 1.75, end: 301, dot: 312, value: "₹24.9 lakh", name: "Nifty 50 ETF" },
] as const;

/** [option, colour, from Apr 2017, from Jan 2021] as [final ₹ lakh, % a year, worst fall %]. */
const TABLE: [string, string, number[], number[]][] = [
  ["Nasdaq 100 ETF", "#C4467C", [69.6, 22.7, 37], [30.7, 21.5, 29]],
  ["Max strategy", GREEN, [57.7, 20.3, 18], [29.4, 20.6, 12]],
  ["Gold ETF", "#A9770C", [41.2, 16.1, 24], [24.8, 17.1, 24]],
  ["LSTM model", "#4b5450", [27.4, 11.2, 30], [19.3, 12.1, 14]],
  ["Nifty 50 ETF", "#2F63B3", [24.9, 10.1, 36], [15.9, 8.4, 16]],
  ["Liquid fund", "#2a8fd0", [16, 5, 0], [12.8, 4.4, 0]],
];

const KEYS: CursorKey[] = [
  [0, 300, 380],
  [2600, 700, 300],
  [4800, 760, 250],
  [6500, 560, 45],
  [7000, 535, 32, 1], // Performance
  [7600, 535, 32],
  [9000, 430, 300],
  [10300, 233, 407, 1], // start in 2021
  [10900, 233, 407],
  [12000, 600, 330],
];

const lakh = (v: number) => `₹${v.toFixed(1).replace(/\.0$/, "")} lakh`;
const fall = (v: number) => (Math.round(v) === 0 ? "0%" : `−${Math.round(v)}%`);

/** The shaded area and the four lines, drawn once on the CPU into a picture (at 2x, for sharpness).
    Drawn as SVG paths, the first frame that showed them stalled the GPU for over 100 ms while it
    built what it needs to draw them; a picture of the same geometry costs nothing. */
let linesPicture: string | undefined;
const picture = () => {
  if (linesPicture) return linesPicture;
  const c = document.createElement("canvas");
  c.width = 614 * 2;
  c.height = 447 * 2;
  const g = c.getContext("2d", { willReadFrequently: true })!; // a CPU-backed canvas
  g.scale(2, 2);
  g.fillStyle = "rgba(8,122,82,0.08)"; // GREEN at 8%
  g.fill(new Path2D(`M72,409${path(SERIES.max).replace("M", "L")}L390,409Z`));
  g.lineJoin = "round";
  for (const l of [...LINES].reverse()) {
    g.strokeStyle = l.color;
    g.lineWidth = l.width;
    g.stroke(new Path2D(path(SERIES[l.key])));
  }
  return (linesPicture = c.toDataURL());
};

export default function InvestDemo() {
  const t = useLoop(LENGTH, 12500);
  const perf = t >= 7100;
  const y21 = t >= 10300;
  const k = easeOut(prog(t, 10300, 11000));
  const mix = (a: number[], b: number[]) => a.map((v, i) => v + (b[i] - v) * k);
  const reveal = 72 + 318 * easeOut(prog(t, 700, 4200));

  return (
    <Loop t={t} length={LENGTH}>
      <div className="h-full bg-[#f5f6f2]" style={{ color: INK }}>
        <header className="relative flex h-16 items-center px-10">
          <span className="flex items-center gap-2.5 text-[17px] font-bold tracking-tight">
            <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden>
              <rect width="32" height="32" rx="8" fill={GREEN} />
              <path d="M7 22.5 13.2 16l4.4 3.8L25 10" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Intelligent Investment
          </span>
          <nav className="absolute left-[390px] top-0 flex h-16 items-center gap-8 text-[15px]">
            {["Overview", "Performance", "Evidence"].map((n) => {
              const on = n === (perf ? "Performance" : "Overview");
              return (
                <span key={n} className="relative" style={{ color: on ? INK : "#5d6862" }}>
                  {n}
                  {on && <i className="absolute -bottom-3 left-0 h-[3px] w-1/2 rounded-full" style={{ background: GREEN }} />}
                </span>
              );
            })}
          </nav>
          <span className="ml-auto text-[10.5px] text-[#5d6862]">Past results, not a promise. Not investment advice.</span>
        </header>

        {!perf ? (
          /* ── Overview ── */
          <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative grid h-[478px] grid-cols-[430px_1fr] gap-8 px-10">
            <div className="pt-14">
              <p className="text-[23px] leading-[1.18] text-[#3b4540]">₹10 lakh invested 9.5 years ago could have become</p>
              <p className="mt-2 text-[58px] font-bold leading-none tracking-tight" style={{ color: GREEN }}>
                {lakh(countUp(57.7, t, 600, 2400, 10))}
              </p>
              <p className="mt-4 text-[15.5px] leading-relaxed text-[#3b4540]">
                today, after every charge and every tax. Its worst fall along the way was 18%.
              </p>
              <div className="mt-6">
                {LINES.filter((l) => l.key !== "max")
                  .reverse()
                  .map((l, i) => (
                    <motion.p
                      key={l.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: t >= 1200 + i * 200 ? 1 : 0, x: t >= 1200 + i * 200 ? 0 : -10 }}
                      className="flex items-center gap-3 border-t border-[#dde2dc] py-2.5 text-[15px]"
                    >
                      <span className="text-[13px] text-[#5d6862]">vs</span>
                      <i className="h-[3px] w-4 rounded-full" style={{ background: l.color }} />
                      <b className="text-[17px]">{l.value}</b>
                      <span>in a {l.name}</span>
                      <span className="ml-auto text-[13px] text-[#5d6862]">
                        fell {l.key === "nifty" ? 36 : l.key === "gold" ? 24 : 37}%
                      </span>
                    </motion.p>
                  ))}
              </div>
            </div>

            <div className="pt-6">
              <svg viewBox="0 0 614 447" className="w-[490px]" aria-hidden>
                <defs>
                  <clipPath id="ii-reveal">
                    <rect x="0" y="0" width={reveal} height="447" />
                  </clipPath>
                </defs>
                {[["₹20L", 335], ["₹40L", 242], ["₹60L", 148], ["₹80L", 54]].map(([l, y]) => (
                  <g key={l}>
                    <line x1="72" x2="390" y1={y} y2={y} stroke="rgb(221,226,220)" />
                    <text x="60" y={Number(y) + 4} textAnchor="end" fontSize="12" fill="#5d6862">{l}</text>
                  </g>
                ))}
                {[["2018", 97], ["2020", 164], ["2022", 231], ["2024", 298], ["2026", 365]].map(([y, x]) => (
                  <text key={y} x={x} y="433" textAnchor="middle" fontSize="12" fill="#5d6862">{y}</text>
                ))}
                <line x1="72" x2="390" y1="382" y2="382" stroke="rgb(102,114,107)" />
                <text x="384" y="374" textAnchor="end" fontSize="11" fill="#5d6862">₹10 lakh put in</text>
                <g clipPath="url(#ii-reveal)">
                  <image href={picture()} x="0" y="0" width="614" height="447" />
                </g>
                {LINES.map((l, i) => (
                  <motion.g key={l.key} initial={false} animate={{ opacity: t >= 4300 + i * 120 ? 1 : 0 }}>
                    <path d={`M390,${l.end}H400V${l.dot}`} fill="none" stroke={l.color} strokeWidth="2" />
                    <circle cx="400" cy={l.dot} r="4.5" fill={l.color} stroke="#f5f6f2" strokeWidth="2" />
                    <text x="420" y={l.dot - 2} fontSize="19" fontWeight="700" fill={INK}>{l.value}</text>
                    <text x="420" y={l.dot + 16} fontSize="13" fill="#5d6862">{l.name}</text>
                  </motion.g>
                ))}
              </svg>
              <motion.p initial={false} animate={{ opacity: t >= 2000 ? 1 : 0 }} className="mt-2 max-w-[480px] text-[12.5px] leading-relaxed text-[#5d6862]">
                Lines: what each was worth along the way. Dots: what was left after selling everything on 30 Sep 2026 and paying all tax (new regime, ₹12 lakh other income).
              </motion.p>
            </div>
          </motion.div>
        ) : (
          /* ── Performance: the calculator ── */
          <motion.div key="perf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative grid h-[478px] grid-cols-[260px_1fr] gap-[30px] px-10 pt-5">
            <div className="h-[456px] rounded-[18px] border border-[#e2e5df] bg-[#fbfbf9] p-5 text-[12.5px] shadow-[0_8px_24px_-12px_rgba(0,0,0,0.15)]">
              <div className="flex rounded-full bg-[#e9ebe6] p-1 text-[13.5px]">
                <span className="flex-1 rounded-full bg-white py-2 text-center font-medium shadow">One-time</span>
                <span className="flex-1 py-2 text-center text-[#5d6862]">Monthly SIP</span>
              </div>
              <p className="mt-[18px] text-[#5d6862]">Amount, once</p>
              <p className="mt-1.5 border-b-2 pb-1 text-[20px] font-semibold" style={{ borderColor: INK }}>₹ 10,00,000</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["₹1 lakh", "₹5 lakh", "₹10 lakh", "₹25 lakh"].map((c) => (
                  <span key={c} className="rounded-full border border-[#d5d9d2] px-3 py-1" style={c === "₹10 lakh" ? { background: INK, color: "#fff", borderColor: INK } : undefined}>{c}</span>
                ))}
              </div>
              <p className="mt-4 text-[#5d6862]">Invested in</p>
              <div className="mt-1.5 flex gap-2 text-[13px]">
                <span className="flex h-[38px] w-[118px] items-center justify-between rounded-lg border border-[#d5d9d2] bg-white px-3">{y21 ? "January" : "April"} <ChevronDown size={13} /></span>
                <span className="flex h-[38px] flex-1 items-center justify-between rounded-lg border border-[#d5d9d2] bg-white px-3">{y21 ? "2021" : "2017"} <ChevronDown size={13} /></span>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {["Apr 2017", "2019", "2021", "2023"].map((c) => (
                  <span key={c} className="rounded-full border border-[#d5d9d2] px-3 py-1" style={c === (y21 ? "2021" : "Apr 2017") ? { background: INK, color: "#fff", borderColor: INK } : undefined}>{c}</span>
                ))}
              </div>
              <p className="mt-3 text-[11.5px] leading-snug text-[#5d6862]">From April 2017: Max needs a year of share prices before its first pick.</p>
            </div>

            <div className="pt-3">
              <p className="text-[22px] font-medium">How your money would have grown</p>
              <p className="mt-5 text-[14.5px] text-[#5d6862]">₹10,00,000 on {y21 ? "1 Jan 2021" : "3 Apr 2017"}, valued on 30 Sep 2026</p>
              {(() => {
                const [v, a, f] = mix(TABLE[1][2], TABLE[1][3]);
                return (
                  <div className="mt-2.5 rounded-[14px] bg-[#e3eee6] px-[18px] py-3">
                    <p className="flex items-center gap-2 text-[13.5px] font-semibold"><i className="h-[3px] w-4 rounded-full" style={{ background: GREEN }} /> Max strategy</p>
                    <p className="mt-1 flex items-baseline gap-6">
                      <b className="text-[36px] leading-none tracking-tight" style={{ color: GREEN }}>{lakh(v)}</b>
                      <span className="text-[13.5px] text-[#5d6862]">{a.toFixed(1)}% a year</span>
                      <span className="text-[13.5px] text-[#c0392b]">Worst fall {fall(f)}</span>
                    </p>
                  </div>
                );
              })()}
              <div className="mt-2 text-[14px]">
                <div className="grid grid-cols-[28px_1fr_110px_90px_90px] py-2 text-[12px] text-[#5d6862]">
                  <span>#</span><span>Option</span><span className="text-right font-semibold" style={{ color: INK }}>Final value ▾</span><span className="text-right">Per year</span><span className="text-right">Worst fall</span>
                </div>
                {TABLE.map(([name, color, a, b], i) => {
                  const [v, yr, f] = mix(a, b);
                  const max = name === "Max strategy";
                  return (
                    <div key={name} className={`grid grid-cols-[28px_1fr_110px_90px_90px] border-t border-[#e5e7e2] py-[7px] ${max ? "font-semibold" : ""}`}>
                      <span className="text-[#5d6862]">{i + 1}</span>
                      <span className="flex items-center gap-2.5"><i className="h-[3px] w-4 rounded-full" style={{ background: color }} />{name}</span>
                      <span className="text-right">{lakh(v)}</span>
                      <span className="text-right">{yr.toFixed(1)}%</span>
                      <span className="text-right text-[#c0392b]">{fall(f)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        <footer className="flex h-16 items-center px-10 text-[13.5px]">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-[#d5d9d2] text-[#5d6862]"><ArrowUp size={15} /></span>
          <span className="ml-4 flex items-center gap-1.5">
            <i className="h-1.5 w-8 rounded-full" style={{ background: GREEN }} />
            {(perf ? [1, 2, 3, 4] : [1, 2]).map((d) => <i key={d} className="h-1.5 w-1.5 rounded-full bg-[#c9cec6]" />)}
          </span>
          <span className="ml-3"><b className="mr-2 font-mono font-medium">01</b>{perf ? "Your money, your dates" : "What the money became"}</span>
          <span className="ml-auto text-[13.5px]">{perf ? "Where the money went" : "Same money, different decisions"}</span>
          <span className="ml-4 grid h-10 w-10 place-items-center rounded-full text-white" style={{ background: INK }}><ArrowDown size={15} /></span>
        </footer>
      </div>

      <Cursor t={t} keys={KEYS} />
    </Loop>
  );
}
