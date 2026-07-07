import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { profile } from "@/lib/data";
import "./globals.css";

/**
 * Inter Variable, self-hosted (single ~340 KB woff2, cached immutable).
 * The CSS stack puts "SF Pro Display" first so Apple devices render
 * the preferred face natively; Inter is the guaranteed fallback.
 */
const inter = localFont({
  src: "../../public/fonts/InterVariable.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

const title = `${profile.name} — ${profile.headline}`;
const description = `${profile.summary} Based in ${profile.location}.`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: title,
    template: `%s · ${profile.name}`,
  },
  description,
  keywords: [
    "Data Science", "AI", "Machine Learning", "Big Data Analytics",
    "Python", "SQL", "Power BI", "Tableau", "Bengaluru",
    profile.name, "portfolio",
  ],
  authors: [{ name: profile.name, url: profile.socials.github }],
  creator: profile.name,
  openGraph: {
    type: "website",
    url: profile.siteUrl,
    title,
    description,
    siteName: profile.name,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@fbi_vinay",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#fafafa",
  width: "device-width",
  initialScale: 1,
};

/** Structured data — Person schema for rich results */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.headline,
  description: profile.summary,
  email: `mailto:${profile.email}`,
  telephone: profile.phone,
  url: profile.siteUrl,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    addressCountry: "IN",
  },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "St. Joseph's University, Bengaluru" },
    { "@type": "CollegeOrUniversity", name: "St. Aloysius (Deemed to be University), Mangaluru" },
  ],
  sameAs: [profile.socials.github, profile.socials.linkedin, profile.socials.twitter],
  knowsAbout: ["Data Science", "Machine Learning", "Big Data Analytics", "Statistics", "Python", "SQL"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        {/* Restore persisted theme before first paint — prevents flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans noise antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
