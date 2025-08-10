import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
      allowedOrigins: [
        'localhost:3000', 
        'w5w76s26-3000.usw3.devtunnels.ms'
      ]
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "n1s0kuokso1u7fpy.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
