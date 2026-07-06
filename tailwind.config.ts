import type { Config } from "tailwindcss";

/** Netflix-derived token system — every color decision flows from here. */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: ["selector", '[data-theme="light"] &:not(*)'],
  theme: {
    extend: {
      colors: {
        base: "var(--bg)",
        surface: "var(--surface)",
        raised: "var(--raised)",
        accent: "#E50914",
        ink: "var(--ink)",
        mute: "var(--mute)",
        line: "var(--line)",
      },
      fontFamily: {
        sans: [
          "SF Pro Display",
          "SF Pro Text",
          "-apple-system",
          "var(--font-inter)",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(229,9,20,0.45)",
        card: "0 24px 60px -24px rgba(0,0,0,0.9)",
      },
      transitionTimingFunction: {
        netflix: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
