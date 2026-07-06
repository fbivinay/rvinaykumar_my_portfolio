/**
 * ─────────────────────────────────────────────────────────────────
 *  DATA LAYER — single source of truth for the entire site.
 *
 *  Every value below was extracted from:
 *    1. Vinay_Resume.pdf                       (highest priority)
 *    2. LinkedIn data export (07-05-2026)      (second priority)
 *    3. GitHub account export                  (third priority)
 *
 *  Nothing here is invented. Conflicts were resolved Resume-first.
 * ─────────────────────────────────────────────────────────────────
 */

export const profile = {
  name: "R Vinay Kumar",
  shortName: "Vinay",
  monogram: "V",
  // Resume headline (primary) — LinkedIn headline kept for SEO description
  headline: "Data Science & AI/ML Enthusiast",
  subHeadline: "Big Data Analytics · Statistical Modelling",
  linkedinHeadline:
    "MSc Big Data Analytics | GenAI Tools • Machine Learning • SQL • Python • Data Visualization • Power BI • Tableau | Open to Data & Business Analyst Roles",
  roles: [
    "Data Science & AI/ML Enthusiast",
    "Big Data Analytics Postgraduate",
    "Statistical Modeller",
    "ML Pipeline Builder",
    "Dashboard & BI Developer",
  ],
  location: "Bengaluru, Karnataka, India",
  email: "rvinaykumar6924@gmail.com",
  phone: "+91 86181 87642",
  // From resume professional summary
  summary:
    "Results-driven MSc Big Data Analytics student with a strong foundation in statistical modelling, machine learning, and data-driven system design. Demonstrated ability to independently build end-to-end ML pipelines (94% accuracy) and architect IoT-based real-time analytics frameworks. Experienced with Python, R, SQL, and leading ML/cloud platforms.",
  // From LinkedIn About section
  about: [
    "I don't wait for tools to become standard — I learn them, test them, and put them to work. In a field that shifts every few months, that adaptability is what I lead with.",
    "I'm a Big Data Analytics postgraduate who works AI-first. I use AI tools daily to clean data, write and debug code, speed up analysis, and cut work that used to take hours down to minutes. Pair that with my core skills — SQL and Power BI/Tableau for querying and building dashboards — plus Python, machine learning, and SPSS/Jamovi from my Statistics and Economics background, and I can move from raw data to a clear answer fast.",
    "A proof point: my team won 2nd place for Outstanding Innovation at Project Showcase Day 2026, St. Joseph's University, for Smart RFID Inventory Intelligence — RFID hardware wired to a real-time analytics dashboard. We took it from idea to working prototype, and it got recognized for impact and presentation.",
    "I'm open to Data Analyst roles where speed, adaptability, and an AI-first approach add real value.",
  ],
  socials: {
    github: "https://github.com/fbivinay",
    linkedin: "https://linkedin.com/in/r-vinay-kumar-139938215",
    twitter: "https://x.com/fbi_vinay",
  },
  resumeFile: "/resume.pdf",
  siteUrl: "https://fbivinay.vercel.app", // update after deploy
} as const;

/* ── Skills (Resume tables ∪ LinkedIn Skills.csv, de-duplicated) ── */
export type SkillGroup = { label: string; items: string[] };
export const skillGroups: SkillGroup[] = [
  {
    label: "Languages & Querying",
    items: ["Python", "R", "SQL", "Hadoop", "SPSS", "Jamovi"],
  },
  {
    label: "ML / AI",
    items: [
      "Scikit-learn",
      "PyTorch",
      "Keras",
      "Random Forest",
      "Regression",
      "Classification",
      "GenAI Tools",
    ],
  },
  {
    label: "Data & Analytics",
    items: [
      "Pandas",
      "NumPy",
      "Power BI",
      "Tableau",
      "Jupyter Notebook",
      "Microsoft Excel",
      "Statistical Data Analysis",
      "Financial Econometrics",
    ],
  },
  { label: "Databases", items: ["MySQL", "MongoDB", "Supabase (PostgreSQL)", "Firebase"] },
  {
    label: "Cloud & DevOps",
    items: ["AWS", "Azure", "Git", "VS Code", "Software Deployment", "Vercel"],
  },
  {
    label: "Leadership & Method",
    items: [
      "Design Thinking",
      "Team Management",
      "Entrepreneurship",
      "Operations Management",
      "Start-up Leadership",
    ],
  },
];

/** Flat list for the rotating skill sphere */
export const sphereSkills = [
  "Python", "R", "SQL", "Hadoop", "SPSS", "Jamovi", "Scikit-learn", "PyTorch",
  "Keras", "Pandas", "NumPy", "Power BI", "Tableau", "MySQL", "MongoDB",
  "AWS", "Azure", "Git", "Firebase", "Machine Learning", "Random Forest",
  "Regression", "GenAI", "Excel", "Supabase", "Design Thinking",
];

/* ── Experience (LinkedIn Positions.csv, titles reconciled with resume) ── */
export type Experience = {
  company: string;
  title: string;
  location: string;
  start: string;
  end: string;
  points: string[];
};
export const experience: Experience[] = [
  {
    company: "ComedKares",
    // Resume title takes priority: "Data & Inventory Analytics Intern" (LinkedIn: "AI/ML Intern")
    title: "Data & Inventory Analytics Intern (AI/ML)",
    location: "Gopalan Mall, Sirsi Circle, Bengaluru",
    start: "May 2026",
    end: "Jun 2026",
    points: [
      "Executed an end-to-end RFID-based inventory intelligence project, translating conceptual design into a functional simulation prototype.",
      "Collaborated cross-functionally with MCA peers to integrate a front-end dashboard with a cloud database, ensuring real-time alert delivery for misplacement and theft events.",
      "Trained in machine learning fundamentals and data analytics; applied innovation and design-thinking methods to real project work.",
      "Team won 2nd place for Outstanding Innovation, Impact and Presentation at Project Showcase Day 2026.",
    ],
  },
  {
    company: "Oikos Consultancy",
    title: "Research Assistant Intern",
    location: "Mangaluru",
    start: "May 2024",
    end: "Jun 2024",
    points: [
      "Supported statistical analysis for social and medical science research projects.",
      "Managed and analyzed datasets using Microsoft Excel, SPSS, and Jamovi.",
      "Conducted descriptive and inferential statistical analyses; prepared and organized data for accuracy and consistency prior to analysis.",
    ],
  },
  {
    company: "Chaitra Enterprises",
    title: "Founder",
    location: "Mangaluru",
    start: "Dec 2022",
    end: "Present",
    points: [
      "Proprietor of a registered commercial establishment operating as a contractor office (Karnataka Shops & Commercial Establishments Act, 1961).",
      "Founded and manage day-to-day business operations, overseeing a team of employees.",
      "Handle client coordination, contracts, and service delivery; responsible for compliance, administration, and overall business growth.",
    ],
  },
];

/* ── Education (Resume + LinkedIn Education.csv) ── */
export const education = [
  {
    school: "St. Joseph's University, Bengaluru",
    degree: "MSc, Big Data Analytics",
    period: "2025 — 2027",
    score: "CGPA 8.08",
    notes:
      "Hands-on expertise in SQL, Python, machine learning, and data visualization (Power BI, Tableau). Applied through an AI/ML internship and an award-winning analytics project.",
  },
  {
    school: "St. Aloysius (Deemed to be University), Mangaluru",
    degree: "BSc, Statistics & Economics",
    period: "2022 — 2025",
    score: "CGPA 8.48",
    notes:
      "Foundation in statistical analysis, econometrics, and data-driven problem solving with SPSS, Jamovi, and Excel — descriptive & inferential statistics, regression, hypothesis testing.",
  },
];

/* ── Projects (Resume ∪ GitHub export; repo metadata is real) ── */
export type Project = {
  id: string;
  title: string;
  tagline: string;
  year: string;
  match: number; // Netflix-style "match" — derived from role relevance
  tags: string[];
  category: "AI / ML" | "Full-Stack" | "IoT / Analytics";
  description: string[];
  tech: string[];
  github: string;
  live?: string;
  commits: number; // real count from git history in the export
  accent: string; // poster gradient hue
};
export const projects: Project[] = [
  {
    id: "smart-rfid",
    title: "Smart RFID Inventory Intelligence",
    tagline: "Trend Trackers — real-time retail inventory, theft & misplacement alerts",
    year: "2026",
    match: 98,
    tags: ["Award Winner", "Team Lead Project"],
    category: "IoT / Analytics",
    description: [
      "Retail inventory intelligence platform where every clothing item carries an RFID tag. Tracks each item's live status — on rack, misplaced, billing, sold, or stolen — and raises alerts when items move to the wrong rack or leave the exit gate without billing.",
      "Defined a three-state inventory model to automatically detect theft and misplacement events with instant dashboard alerts. Includes a live analytics dashboard and an AI assistant that answers inventory questions in plain English.",
      "Field study conducted at Texs Mart, Gopalan Mall, Bengaluru — findings validated the phantom-inventory problem. Research paper co-authored and under review.",
      "Won 2nd place for Outstanding Innovation, Impact and Presentation at Project Showcase Day 2026, St. Joseph's University.",
    ],
    tech: ["Next.js 15", "React 19", "Supabase", "Tailwind CSS", "Recharts", "RFID / IoT", "OpenRouter LLM"],
    github: "https://github.com/fbivinay/Smart-RFID-Integrated-Inventory-system",
    live: "https://final-tt-rfid.vercel.app",
    commits: 28,
    accent: "0",
  },
  {
    id: "endurance-intelligence",
    title: "Endurance Intelligence",
    tagline: "AI-powered running training planner built on real Strava history",
    year: "2026",
    match: 96,
    tags: ["94% Model Accuracy", "Solo Build"],
    category: "AI / ML",
    description: [
      "Strava-connected web app that reads real running history and generates a personalised, science-backed training plan for a target race — weekly mileage, long runs, and Daniels VDOT pace zones for every session.",
      "Trained a Random Forest classifier to prescribe adaptive training plans for beginner, intermediate, and advanced runners — achieving 94% model accuracy.",
      "Automatic fitness-level detection from the last 60 runs, science-based periodization (10% growth rule, 4-week build/recover cycles, 80/20 split), and a fitness-loss forecast using an exponential detraining model.",
      "Data ingestion pipeline handles both Strava OAuth API data and manual user input, broadening system accessibility.",
    ],
    tech: ["Python", "Random Forest", "Scikit-learn", "Pandas", "React 18", "Vite", "Strava API", "Supabase", "Vercel Serverless"],
    github: "https://github.com/fbivinay/Strava-Integrated-Endurance-intelligence",
    live: "https://enduranceintelligence.vercel.app",
    commits: 27,
    accent: "150",
  },
  {
    id: "sju-chatbot",
    title: "SJU Chatbot",
    tagline: "AI assistant for St Joseph's University with live web retrieval",
    year: "2026",
    match: 92,
    tags: ["RAG / Retrieval", "FastAPI"],
    category: "Full-Stack",
    description: [
      "AI chatbot for St Joseph's University, Bengaluru, answering student questions against real crawled university content.",
      "Supabase-backed retrieval over scraped department data, with smarter search that understands abbreviations and campus shorthand.",
      "FastAPI server with an LLM via the OpenRouter API, deployed with a public URL — the full site clone plus embedded chat.",
    ],
    tech: ["Python", "FastAPI", "Supabase", "OpenRouter LLM", "Firecrawl", "Railway / Vercel"],
    github: "https://github.com/fbivinay/sju-chatbot",
    live: "https://sju-chatbot.vercel.app",
    commits: 9,
    accent: "210",
  },
];

/* ── GitHub stats (computed from the actual account export) ── */
export const github = {
  username: "fbivinay",
  url: "https://github.com/fbivinay",
  totalCommits: 64,
  publicRepos: 3,
  collaborators: 4, // write-access collaborators on Smart-RFID
  memberSince: "March 2026",
  /** Real commit dates → count, extracted from git history in the export */
  activity: [
    { date: "2026-03-06", count: 1 },
    { date: "2026-03-07", count: 6 },
    { date: "2026-03-08", count: 15 },
    { date: "2026-03-20", count: 3 },
    { date: "2026-06-09", count: 4 },
    { date: "2026-06-10", count: 15 },
    { date: "2026-06-11", count: 7 },
    { date: "2026-06-19", count: 1 },
    { date: "2026-06-27", count: 6 },
    { date: "2026-06-30", count: 1 },
    { date: "2026-07-01", count: 1 },
    { date: "2026-07-02", count: 1 },
    { date: "2026-07-05", count: 3 },
  ],
  /** Byte-weighted language mix across all repos (lockfiles/config excluded) */
  languages: [
    { name: "JavaScript / React", pct: 74.7, color: "#E50914" },
    { name: "HTML", pct: 12.6, color: "#B81D24" },
    { name: "Markdown / Docs", pct: 6.8, color: "#831010" },
    { name: "Python", pct: 5.6, color: "#5A0B0F" },
    { name: "CSS", pct: 0.3, color: "#3d3d3d" },
  ],
};

/* ── Certifications (Resume ∪ LinkedIn Certifications.csv) ── */
export const certifications = [
  { name: "AWS Cloud Practitioner Essentials", issuer: "Coursera / Amazon Web Services", year: "—" },
  { name: "Python Fundamentals", issuer: "Great Learning", year: "2022" },
  { name: "Introduction to Excel", issuer: "Labour Law Advisor", year: "2022" },
  { name: "Microsoft AI Classroom Series", issuer: "Microsoft", year: "2021" },
  { name: "The Fundamentals of Digital Marketing", issuer: "Google Digital Garage", year: "2021" },
];

/* ── Achievements & publications (Resume + LinkedIn feed) ── */
export const achievements = [
  {
    icon: "trophy",
    title: "2nd Place — Outstanding Innovation, Impact & Presentation",
    detail:
      "Project Showcase Day 2026, ComedKares Innovation Hub at St. Joseph's University — for Smart RFID Inventory Intelligence, taken from idea to working prototype.",
  },
  {
    icon: "medal",
    title: "National-Level Table Tennis Player",
    detail:
      "Represented Mangalore University at the South Zone National Table Tennis Championships — competitive discipline, resilience, and teamwork at the national level.",
  },
  {
    icon: "scroll",
    title: "Research Publication (Under Review)",
    detail:
      "Co-author — \"A Cognitive RFID-Based Inventory Intelligence Framework for Real-Time Asset Visibility and Shrinkage Analytics in Apparel Retail Ecosystems.\" Keywords: RFID, Phantom Inventory, Shrinkage Analytics, IoT, Real-Time Tracking.",
  },
];

/* ── Hero / About stat counters (all verifiable from sources) ── */
export const stats = [
  { value: 94, suffix: "%", label: "ML model accuracy" },
  { value: 64, suffix: "", label: "Commits shipped" },
  { value: 3, suffix: "", label: "Deployed products" },
  { value: 2, suffix: "nd", label: "Place · Showcase 2026" },
];

export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#github", label: "GitHub" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];
