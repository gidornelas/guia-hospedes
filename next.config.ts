require('./global-error-handler.js');

// Early URL patch for Railway proxy compatibility
const OriginalURL = globalThis.URL;
(globalThis as any).URL = class extends OriginalURL {
  constructor(input: string | URL, base?: string | URL) {
    if (typeof base === 'string' && base && !base.startsWith('http') && !base.startsWith('file')) {
      base = `https://${base}`;
    }
    if (typeof input === 'string' && input && !input.startsWith('http') && !input.startsWith('/') && !input.startsWith('file') && !input.startsWith('data:')) {
      if (input.includes('.') && !input.includes(' ')) {
        input = `https://${input}`;
      }
    }
    super(input, base);
  }
};

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
