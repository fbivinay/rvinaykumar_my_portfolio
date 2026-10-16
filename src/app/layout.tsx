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
  themeColor: "#000000",
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

/** Desktop only: phones and tablets get a message instead of the site. Runs in <head>,
 *  before anything paints, so the site never flashes on a phone. */
const DESKTOP_ONLY_CSS = `
html[data-desktop-only]{display:flex!important;flex-direction:column;align-items:center;justify-content:center;height:100%;margin:0;padding:32px;box-sizing:border-box;overflow:hidden!important;background:#0f172a!important;color:#f1f5f9;font:16px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;text-align:center}
html[data-desktop-only] body{display:none!important}
html[data-desktop-only]::before{content:"Please open this website on a laptop or desktop";max-width:340px;font-size:22px;font-weight:700;line-height:1.3}
html[data-desktop-only]::after{content:"It is built for larger screens and is not available on phones or tablets.";max-width:340px;margin-top:12px;font-size:15px;color:#94a3b8}`;
const DESKTOP_ONLY_JS = `(function(){try{var n=navigator,ua=n.userAgent||"",mq=function(q){return!!(window.matchMedia&&matchMedia(q).matches)};
if((n.userAgentData&&n.userAgentData.mobile)||/Android|iPhone|iPad|iPod|Mobile|Tablet|Silk|Kindle|PlayBook|BlackBerry|BB10|Opera Mini|IEMobile|webOS/i.test(ua)||(/Macintosh/.test(ua)&&n.maxTouchPoints>1)||(mq("(pointer: coarse)")&&!mq("(any-pointer: fine)")))document.documentElement.setAttribute("data-desktop-only","")}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: DESKTOP_ONLY_CSS }} />
        <script dangerouslySetInnerHTML={{ __html: DESKTOP_ONLY_JS }} />
      </head>
      <body className={`${inter.variable} font-sans noise antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
