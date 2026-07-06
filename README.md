# R Vinay Kumar — Cinematic Portfolio

A Netflix-grade personal portfolio: pure-black stage, `#E50914` accent, cinematic intro, buttery 60fps motion, and every fact sourced from real data (resume, LinkedIn export, GitHub account export). Fully static, ~173 KB first-load JS.

**Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS · Framer Motion · Lenis · Lucide

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

## Deploy to Vercel (recommended)

1. Push this folder to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new) → import the repo → Deploy. Zero config needed.
3. After the first deploy, open `src/lib/data.ts` and set `profile.siteUrl` to your live URL (this feeds canonical URLs, sitemap, robots, and Open Graph). Commit and push — Vercel redeploys automatically.
4. Vercel Analytics & Speed Insights are already wired (`@vercel/analytics`, `@vercel/speed-insights`); enable them in the Vercel dashboard under your project → Analytics.

## Project structure

```
├── public/
│   ├── fonts/InterVariable.woff2   # self-hosted variable font (SF Pro renders first on Apple devices)
│   └── resume.pdf                  # served at /resume.pdf, wired to every "Download Resume" CTA
├── src/
│   ├── app/
│   │   ├── layout.tsx              # metadata, Open Graph, Twitter cards, JSON-LD Person schema
│   │   ├── page.tsx                # section composition + keyboard shortcuts
│   │   ├── globals.css             # theme tokens, noise, grid, reduced-motion rules
│   │   ├── opengraph-image.tsx     # dynamic OG card (edge)
│   │   ├── sitemap.ts / robots.ts / manifest.ts / icon.svg
│   ├── lib/
│   │   ├── data.ts                 # ★ SINGLE SOURCE OF TRUTH — edit content here
│   │   ├── hooks.ts                # magnetic, typewriter, media-query, active-section hooks
│   │   └── utils.ts
│   └── components/
│       ├── fx/                     # Loader (intro), SmoothScroll, CustomCursor, ScrollProgress
│       ├── layout/                 # Navbar, CommandPalette (⌘K), Footer (Now Playing)
│       ├── sections/               # Hero, About, Skills, Experience, Projects, GithubSection, Credentials, Contact
│       └── ui/                     # MagneticButton, Reveal, SectionHeading, Counter
```

## Where the content came from

Everything in `src/lib/data.ts` was extracted from the provided files — **nothing invented**:

| Data | Source |
|---|---|
| Name, headline, summary, skills, projects, certifications, achievements | `Vinay_Resume.pdf` |
| About narrative, positions (3), education notes, extra certifications, X handle | LinkedIn export CSVs |
| Repo names, descriptions, live URLs, collaborator count | GitHub export `repositories_000001.json` |
| Contribution heatmap + per-repo commit counts (64 total) | actual `git log` history inside the export |
| Language usage percentages | byte-weighted file sizes across all three repos |

Conflicts were resolved **Resume → LinkedIn → GitHub**, e.g. the ComedKares title uses the resume's wording with LinkedIn's dates.

## Features

- **Cinematic intro loader** — monogram beam, letter-by-letter name reveal, progress counter. Plays once per session; skipped for `prefers-reduced-motion`.
- **Hero billboard** — canvas particle field with a mouse-reactive red key light, staggered 3D character reveal, cycling typewriter, parallax fade on scroll.
- **Netflix project cards** — hover scale + glow + tech-chip reveal, category filter chips, and a shared-element (`layoutId`) modal with match score, real commit counts, Live Demo / Source / Case Study actions.
- **Real GitHub telemetry** — contribution heatmap and language bars computed from the actual account export, not mocked.
- **3D skill sphere** — hand-rolled canvas projection (≈2 KB) instead of Three.js, so it holds 60fps everywhere. Hover to steer it.
- **Command palette** — `⌘/Ctrl+K`: jump to sections, copy email, download resume, share, toggle theme. `⌘/Ctrl+/` jumps to contact.
- **Custom cursor** — dot + trailing ring, expands over interactive elements, contracts on click. Fine pointers only.
- **Lenis smooth scroll**, hide-on-scroll glass navbar, scroll progress bar, "Now Playing" section indicator, infinite skill marquee, animated counters, magnetic buttons.
- **Dark / light mode** with `localStorage` persistence and a pre-paint script (no flash).
- **Contact form** with inline validation and a success sequence — composes a pre-filled email client-side (static site, nothing stored).

## SEO & accessibility

- Full metadata: Open Graph, Twitter cards, canonical, robots directives.
- `sitemap.xml`, `robots.txt`, web manifest, dynamic OG image, JSON-LD `Person` schema.
- Semantic landmarks, ARIA labels on all icon buttons/dialogs, keyboard-navigable palette and modal (Esc closes), visible red focus rings, `aria-live` regions.
- `prefers-reduced-motion` honored globally — the loader, cursor, particles, sphere, and all transitions shut off.

## Performance notes

- Fully static export of the homepage; single self-hosted variable font with immutable caching.
- All animation runs on `transform`/`opacity` (compositor-only) or a single rAF-driven canvas; particle count scales with viewport area and caps `devicePixelRatio` at 2.
- No Three.js / GSAP payloads: Framer Motion covers orchestration, and the sphere/particles are tiny bespoke canvas renderers. This is the main lever behind the small bundle and Lighthouse-friendly TBT.

## Customizing

- **All content:** `src/lib/data.ts`
- **Colors/typography tokens:** `tailwind.config.ts` + `src/app/globals.css`
- **Resume file:** replace `public/resume.pdf`
- **Live URL:** `profile.siteUrl` in `data.ts`
