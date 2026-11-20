import type { Metadata } from 'next';
import { Noto_Serif, Inter } from 'next/font/google';
import Script from 'next/script';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { Analytics } from '@vercel/analytics/react';

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif-google',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans-google',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Harmukh Threads — Premium Kashmir Handicrafts', template: '%s | Harmukh Threads' },
  description: 'Hand-knotted rugs and exquisite cushion covers. Each piece carries 600 years of tradition. Direct from master artisans in Kashmir.',
  keywords: ['Kashmir rugs', 'cushion covers', 'Kashmir handicrafts', 'hand-knotted rug', 'authentic Kashmir', 'Harmukh Threads'],
  openGraph: {
    title: 'Harmukh Threads — Premium Kashmir Handicrafts',
    description: 'Hand-knotted rugs and exquisite cushion covers. 600 years of tradition, delivered to your doorstep.',
    type: 'website',
    siteName: 'Harmukh Threads',
    images: [{ url: '/harmukhlogo.webp', width: 400, height: 356 }]
  },
  metadataBase: new URL('https://harmukhthreads.com'),
  verification: {
    google: 'zpnQeh1_ikeL9SbySBI-QPOKimlz9F9CkGFa00qdXf8',
  },
  alternates: {
    canonical: '/',
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://harmukhthreads.com/#organization',
      'name': 'Harmukh Threads',
      'url': 'https://harmukhthreads.com',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://harmukhthreads.com/harmukhlogo.webp',
        'width': 400,
        'height': 356,
      },
      'sameAs': [
        'https://www.instagram.com/harmukhthreads',
      ],
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+918715086355',
        'contactType': 'customer support',
        'areaServed': 'IN',
        'availableLanguage': ['English', 'Hindi', 'Kashmiri'],
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://harmukhthreads.com/#website',
      'url': 'https://harmukhthreads.com',
      'name': 'Harmukh Threads',
      'description': 'Hand-knotted rugs and exquisite cushion covers direct from Kashmir master artisans.',
      'publisher': {
        '@id': 'https://harmukhthreads.com/#organization',
      },
      'potentialAction': {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': 'https://harmukhthreads.com/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${notoSerif.variable} ${inter.variable}`}>
      <head>
        <link rel="preload" as="image" href="/hero-loom.webp" type="image/webp" fetchPriority="high" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Meta Pixel Code (deferred afterInteractive for 0ms TBT) */}
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
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
            alt=""
          />
        </noscript>
      </head>
      <body>
        <NextTopLoader color="var(--primary)" showSpinner={false} height={3} />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
