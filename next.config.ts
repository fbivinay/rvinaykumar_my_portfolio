import type { NextConfig } from "next";

/**
 * Production config.
 * - reactStrictMode for correctness
 * - poweredByHeader off (security hygiene)
 * - long-cache immutable headers for fonts
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
