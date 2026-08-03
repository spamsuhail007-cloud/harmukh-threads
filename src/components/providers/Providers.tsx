'use client';
import { CartProvider } from './CartProvider';
import { FacebookPixel } from './FacebookPixel';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <FacebookPixel />
      {children}
    </CartProvider>
  );
}
