import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    // Silence root inference warning by explicitly setting project root
    root: __dirname,
  },
};

export default nextConfig;
