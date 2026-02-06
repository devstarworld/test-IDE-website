import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // Required for static export
  },
  // Disable pages that require server-side features
  // These pages will not be included in the static export
}

export default nextConfig;