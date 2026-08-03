'use client';

import { useEffect } from 'react';

export function PurchasePixelTrack({ orderNumber, amount }: { orderNumber: string; amount: number }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        value: amount || 0,
        currency: 'INR',
        content_type: 'product'
      });
      console.log(`[Meta Pixel] Purchase event tracked on Thank You page for #${orderNumber} (₹${amount})`);
    }
  }, [orderNumber, amount]);

  return null;
}
