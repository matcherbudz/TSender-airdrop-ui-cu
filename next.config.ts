import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // means when we build our application its built as a static site
  images: {
    unoptimized: true // optimized images only work on the server. Uploading to IPFS we don't want anything that would run  on server
  },
}

export default nextConfig
