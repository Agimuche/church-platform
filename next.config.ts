import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Development-friendly: accept any https image host (S3, CloudFront, CDN, etc).
    // Tighten this to your actual media domains before deploying to production.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
