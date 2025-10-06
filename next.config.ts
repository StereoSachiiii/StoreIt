import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */


   experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Set your desired limit, e.g., '10mb' or '500kb'
    },
  },
};

export default nextConfig;
