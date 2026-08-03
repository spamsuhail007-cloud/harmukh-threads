'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect, Suspense } from 'react';

const PIXEL_ID = '2905540416447225';

function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
  }, [pathname, searchParams]);

  return null;
}

export function FacebookPixel() {
  useEffect(() => {
    // Fallback if script is loaded but not initialized
    if (typeof window !== 'undefined') {
      (window as any).fbq = (window as any).fbq || function() {
        ((window as any).fbq.q = (window as any).fbq.q || []).push(arguments);
      };
      (window as any).fbq.l = +new Date();
    }
  }, []);

  return (
    <>
      <Script
        id="fb-pixel"
        src="https://connect.facebook.net/en_US/fbevents.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== 'undefined') {
            (window as any).fbq('init', PIXEL_ID);
            (window as any).fbq('track', 'PageView');
          }
        }}
      />
      <Suspense fallback={null}>
        <NavigationEvents />
      </Suspense>
    </>
  );
}
