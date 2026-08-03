import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: { default: 'Harmukh Threads — Premium Kashmir Handicrafts', template: '%s | Harmukh Threads' },
  description: 'Hand-knotted rugs and exquisite cushion covers. Each piece carries 600 years of tradition. Direct from master artisans in Kashmir.',
  keywords: ['Kashmir rugs', 'cushion covers', 'Kashmir handicrafts', 'hand-knotted rug', 'authentic Kashmir', 'Harmukh Threads'],
  openGraph: {
    title: 'Harmukh Threads — Premium Kashmir Handicrafts',
    description: 'Hand-knotted rugs and exquisite cushion covers. 600 years of tradition, delivered to your doorstep.',
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
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2905540416447225');
              fbq('track', 'PageView');
            `
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2905540416447225&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body>
        <NextTopLoader color="var(--primary)" showSpinner={true} height={5} />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
