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
  siteUrl: "https://rvinaykumar-my-portfolio.vercel.app",
} as const;

/* ── Skills (exactly the Skills section of R_Vinay_Kumar_Resume.pdf) ── */
export type SkillGroup = { label: string; items: string[] };
export const skillGroups: SkillGroup[] = [
  {
    label: "Languages & Databases",
    items: ["Python", "R", "SQL", "JavaScript", "TypeScript", "PostgreSQL", "MySQL", "MongoDB", "Supabase", "Redis"],
  },
  {
    label: "ML, GenAI & Agentic AI",
    items: [
      "Machine Learning", "Deep Learning", "LLMs", "Scikit-learn", "Clustering",
      "Feature Engineering", "Sentence Transformers", "RAG", "Vector Search", "AI Agents", "MCP",
      "Prompt Engineering", "Claude & Gemini APIs",
    ],
  },
  {
    label: "Big Data, Cloud & DevOps",
    items: [
      "Apache Spark (Structured Streaming)", "PySpark", "Kafka", "Databricks", "Hadoop", "AWS (EC2, S3)",
      "Azure", "Docker", "Kubernetes", "Helm", "Terraform", "GitHub Actions", "Vercel", "Git",
    ],
  },
  {
    label: "Statistics & Econometrics",
    items: [
      "Pandas", "NumPy", "SciPy", "Statsmodels", "linearmodels", "Panel Regression (FE / RE)",
      "Hypothesis Testing", "Time Series", "Econometrics",
    ],
  },
  {
    label: "BI & Visualization",
    items: ["Data Visualization", "Power BI", "Tableau", "Excel", "SPSS", "Matplotlib", "Seaborn"],
  },
  {
    label: "Web & APIs",
    items: ["FastAPI", "Node.js", "Express", "React", "Next.js", "Tailwind CSS", "REST APIs"],
  },
];

/** Flat list for the rotating skill sphere (a subset of the groups above) */
export const sphereSkills = [
  "Python", "R", "SQL", "PostgreSQL", "MongoDB", "Machine Learning", "Deep Learning",
  "LLMs", "Scikit-learn", "RAG", "AI Agents", "MCP", "Apache Spark", "PySpark",
  "Kafka", "Databricks", "AWS", "Docker", "Kubernetes", "Pandas", "NumPy", "Power BI",
  "Tableau", "FastAPI", "React", "Next.js",
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

/* ── Projects (Resume ∪ each repo's README and live site) ──
   `id` also picks the laptop demo in components/projects/demos. */
export type Project = {
  id: string;
  title: string;
  summary: string;
  points: string[];
  tech: string[];
  live: string;
  github: string;
};
export const featuredProjects: Project[] = [
  {
    id: "sju-chatbot",
    title: "SJU Chatbot",
    summary:
      "AI assistant for St Joseph's University, Bengaluru, answering student questions on programmes, admissions, fees and campus life from the university's own website.",
    points: [
      "Scraped ~290 university pages into ~940 chunks in Supabase; full-text search feeds Gemini grounded context.",
      "Reads the live deadlines and notices pages at question time and streams the answer word by word.",
      "Live on the SJU website via a one-tag embed, generating revenue.",
    ],
    tech: ["Python", "FastAPI", "Supabase", "Gemini", "Playwright", "Vercel"],
    live: "https://sju-chatbot.vercel.app",
    github: "https://github.com/fbivinay/sju-chatbot",
  },
  {
    id: "everest",
    title: "Everest Textile Mills",
    summary:
      "Built for the Odoo x NMIT Hackathon 2026 finals: one system that runs a textile mill, tracking every order from yarn and production through quality checks and dispatch to the invoice and payment.",
    points: [
      "Hackathon finalist: top 6 of 2,840+ teams.",
      "Live owner dashboard, plus separate views for store, production, quality and dispatch staff.",
      "AI assistant that answers questions about the mill from live data.",
    ],
    tech: ["React", "TypeScript", "Node.js", "Express", "Prisma", "PostgreSQL", "Gemini"],
    live: "https://everest-manufacturing-dashboard.vercel.app",
    github: "https://github.com/fbivinay/Odoo-Hackathon-Finals-Textile-Manufacturing",
  },
  {
    id: "intelligent-investment",
    title: "Intelligent Investment",
    summary:
      "An algorithmic investing system for an Indian investor that tests strategies on years they never saw and compares them with ETFs and funds after every real Fyers charge and every tax rule.",
    points: [
      "₹10 lakh from April 2017 grew to ₹57.7 lakh after all charges and tax: 20.3% a year, 18% worst fall.",
      "197 dated charge and tax rules; every trade is charged and taxed by the rules of its own date.",
      "A rules-based momentum strategy and an LSTM portfolio model behind a live what-if calculator.",
    ],
    tech: ["Python", "pandas", "NumPy", "LSTM", "Next.js", "Vercel"],
    live: "https://intelligent-investment.vercel.app",
    github: "https://github.com/fbivinay/Intelligent_Investment",
  },
];
export const moreProjects: Project[] = [
  {
    id: "update-bro",
    title: "Update Bro!",
    summary:
      "An AI and tech news site that gathers stories from 36 sources, shows a short AI summary of each and links straight to the original article.",
    points: [
      "Top story and a Trending Now rail ranked by an importance score, weighted by source authority and recency.",
      "Neutral 3–4 line summaries from Claude, with an extractive fallback so the site always works.",
      "Feeds refresh every minute behind a CDN-cached serverless API.",
    ],
    tech: ["Node.js", "Express", "JavaScript", "Claude API", "RSS", "Vercel"],
    live: "https://ai-tech-news-alpha.vercel.app",
    github: "https://github.com/fbivinay/Ai_tech_news",
  },
  {
    id: "kasauti",
    title: "Kasauti",
    summary:
      "AI-powered MPLADS verification for Smart India Hackathon 2026 (SIH26102, MoSPI): every MP development work is scored against comparable works, and every flag is explained in the record's own figures.",
    points: [
      "Risk-scores 250,839 works using peer cost comparison, Isolation Forest and compliance rules.",
      "Sentence-BERT flags duplicate works; Gemini classifies 41,691 works into 22 sectors.",
      "Nightly sync reconciles with MoSPI data; won the SIH internal round.",
    ],
    tech: ["Python", "FastAPI", "PostgreSQL", "Scikit-learn", "Sentence-BERT", "Next.js"],
    live: "https://mplads-risk-monitor-web.vercel.app",
    github: "https://github.com/fbivinay/SIH-HACKATHON",
  },
  {
    id: "retail-analytics",
    title: "Retail Analytics",
    summary:
      "An animated slide-deck website for an MSc Big Data Analytics talk, walking from data roles and customer data to AI forecasting, a Target industry interview, career skills and live job openings in India.",
    points: [
      "33 scenes in six sections on its own deck engine: keyboard control, URL sync and seven transitions.",
      "Interactive teaching visuals for demand forecasting, recommendations and market basket analysis.",
      "A jobs board collected every morning from employer career sites by GitHub Actions.",
    ],
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Motion", "GitHub Actions"],
    live: "https://mom-lab-finals.vercel.app",
    github: "https://github.com/fbivinay/MOM_Lab_Finals",
  },
];

/* ── Certifications (exactly the Certifications section of the resume) ── */
export const certifications = [
  { name: "Data Analytics Professional Certificate", issuer: "Google" },
  { name: "Introduction to Python", issuer: "Great Learning" },
  { name: "Introduction to MongoDB", issuer: "MongoDB" },
  { name: "Microsoft AI Classroom Series", issuer: "Microsoft" },
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
    title: "Conference Paper (Partially Accepted)",
    detail:
      "R Vinay Kumar & S. Dutta — \"Fiscal Discipline and Foreign Direct Investment among India's Top 10 FDI-Receiving States: A Computational Panel Analysis, FY 2019-20 to FY 2023-24.\" CONFLUENCE-2026, BMS College of Commerce and Management, Bengaluru.",
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
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];
