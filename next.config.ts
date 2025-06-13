import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/finance-management",
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
};

export default nextConfig;
