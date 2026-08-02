import { Navbar } from '@/components/ui/Navbar';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { RecaptchaProvider } from '@/components/ui/RecaptchaProvider';
import Script from 'next/script';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Handcrafted Kashmiri Rugs & Cushion Covers | Harmukh Threads',
  description:
    'Authentic hand-knotted Kashmiri rugs and cushion covers crafted by master artisans. Each piece personally inspected before delivery. Shop now and transform your home.',
  robots: { index: false, follow: false },
};

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '';

export default function SaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <RecaptchaProvider>
      {/* ── Facebook Pixel ────────────────────────────── */}
      {FB_PIXEL_ID && (
        <>
          <Script id="fb-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
          {/* NoScript fallback */}
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      <Navbar />
      <CartDrawer />
      <main className="page-content" style={{ minHeight: '100vh', background: '#fcf9f2' }}>
        {children}
      </main>
      <WhatsAppButton />
    </RecaptchaProvider>
  );
}
