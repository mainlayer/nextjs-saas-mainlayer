import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable experimental features if needed
  experimental: {
    // Server Actions are enabled by default in Next.js 15
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
}

export default nextConfig
