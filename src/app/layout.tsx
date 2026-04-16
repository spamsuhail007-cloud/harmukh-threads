import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: { default: 'Harmukh Threads — Premium Kashmir Handicrafts', template: '%s | Harmukh Threads' },
  description: 'Hand-knotted rugs and exquisite pillow covers. Each piece carries 600 years of tradition.',
  keywords: ['Kashmir rugs', 'pillow covers', 'Kashmir handicrafts', 'hand-knotted rug', 'authentic Kashmir'],
  openGraph: {
    title: 'Harmukh Threads — Premium Kashmir Handicrafts',
    description: 'Hand-knotted rugs and exquisite pillow covers.',
    type: 'website',
  },
  metadataBase: new URL('https://harmukhthreads.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
