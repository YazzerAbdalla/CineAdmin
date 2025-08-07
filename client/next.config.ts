import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Wildcard (any domain)
        pathname: "/**", // Allow any path
      },
    ],
    unoptimized: true, // Disable built-in image optimization
  },
};

export default nextConfig;
