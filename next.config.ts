import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  devIndicators: false,
  output: "export",
  basePath: "/portfolio",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
