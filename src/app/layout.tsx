import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: { default: 'Harmukh Threads — Premium Kashmir Handicrafts', template: '%s | Harmukh Threads' },
  description: 'Hand-knotted rugs and exquisite pillow covers. Each piece carries 600 years of tradition. Direct from master artisans in Kashmir.',
  keywords: ['Kashmir rugs', 'pillow covers', 'Kashmir handicrafts', 'hand-knotted rug', 'authentic Kashmir', 'Harmukh Threads'],
  openGraph: {
    title: 'Harmukh Threads — Premium Kashmir Handicrafts',
    description: 'Hand-knotted rugs and exquisite pillow covers. 600 years of tradition, delivered to your doorstep.',
    type: 'website',
    siteName: 'Harmukh Threads',
    images: [{ url: '/harmukhlogo.png', width: 800, height: 800 }]
  },
  metadataBase: new URL('https://harmukhthreads.com'),
  verification: {
    google: 'zpnQeh1_ikeL9SbySBI-QPOKimlz9F9CkGFa00qdXf8',
  },
  alternates: {
    canonical: '/',
  }
};

import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      </head>
      <body>
        <NextTopLoader color="var(--primary)" showSpinner={true} height={5} />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
