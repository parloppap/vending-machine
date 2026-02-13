import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',

  reactStrictMode: true,

  images: {
    domains: [],
    unoptimized: false,
  },
};

export default nextConfig;
