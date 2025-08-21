import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Skip type checking during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip ESLint during build  
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;