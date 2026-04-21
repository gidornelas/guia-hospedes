// Prevent NextAuth from reading Railway domain variables without protocol
process.env.VERCEL_URL = '';
process.env.RAILWAY_PUBLIC_DOMAIN = '';
process.env.RAILWAY_STATIC_URL = '';

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
