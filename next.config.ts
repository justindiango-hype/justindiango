import type { NextConfig } from "next";

// Set NEXT_PUBLIC_BASE_PATH=/justindiango when building for GitHub Pages
// (the GitHub Action does this). Leave it empty for Vercel or a custom domain.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "export", // plain static files in /out, so any host can serve it
  basePath,
  trailingSlash: true,
  images: { unoptimized: true }, // static hosts can't resize images on the fly
};

export default nextConfig;
