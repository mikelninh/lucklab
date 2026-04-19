import type { NextConfig } from "next";

// Build-time date, surfaced at runtime via process.env.NEXT_PUBLIC_BUILD_DATE.
// Used by the public footer so "updated" never lies about freshness. A footer
// that lies about freshness fails Hara.
const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString().slice(0, 10),
  },
};

export default nextConfig;
