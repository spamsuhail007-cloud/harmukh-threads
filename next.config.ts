import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Setting unoptimized to true stops Vercel from processing images through their servers.
    // Since we now use Cloudinary (with f_auto/q_auto), Cloudinary handles all optimization
    // and Vercel will stop charging you for "Image Optimization Transformations".
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
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
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
