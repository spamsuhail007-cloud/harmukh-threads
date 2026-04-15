import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'en.wikipedia.org',
      },
      {
        // Catch-all: allow any https image source (for admin-uploaded product images)
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
