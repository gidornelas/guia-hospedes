import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Railway inicia a aplicação com `npm start` / `next start`.
  // Evitamos `output: 'standalone'` para não gerar incompatibilidade de runtime.
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
