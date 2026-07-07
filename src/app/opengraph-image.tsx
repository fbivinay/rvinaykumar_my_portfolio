import { ImageResponse } from "next/og";
import { profile } from "@/lib/data";

export const runtime = "edge";
export const alt = `${profile.name} — ${profile.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Dynamic OG card — black stage, red monogram, name + headline. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #000 60%, #1a0203 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", color: "#E50914", fontSize: 28, letterSpacing: 8, fontWeight: 700 }}>
          PORTFOLIO
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 800, marginTop: 16, letterSpacing: -2 }}>
          {profile.name}
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#b3b3b3", marginTop: 12 }}>
          {profile.headline} · {profile.subHeadline}
        </div>
        <div style={{ display: "flex", marginTop: 48, gap: 24, fontSize: 24, color: "#808080" }}>
          <span>Python</span><span>·</span><span>SQL</span><span>·</span>
          <span>Machine Learning</span><span>·</span><span>Power BI</span>
        </div>
      </div>
    ),
    size
  );
}
