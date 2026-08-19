import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@nivo/bar', '@nivo/core', '@nivo/heatmap', '@nivo/line', '@nivo/pie'],
};

export default nextConfig;
