import type { NextConfig } from "next";

// On Vercel the platform handles the output bundling itself, so we must
// NOT enable `output: "standalone"` (that mode is for self-hosting/Docker
// and breaks Vercel's build with "ENOENT next-server.js.nft.json").
const isVercel = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  // `standalone` is only useful for self-hosted deployments (Docker / VPS).
  // Vercel builds without it.
  ...(isVercel ? {} : { output: "standalone" }),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Vercel needs sharp for next/image optimization
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
