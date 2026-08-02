import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { RecaptchaProvider } from '@/components/ui/RecaptchaProvider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Handcrafted Kashmiri Rugs & Cushion Covers | Harmukh Threads',
  description:
    'Authentic hand-knotted Kashmiri rugs and cushion covers crafted by master artisans. Each piece personally inspected before delivery. Shop now and transform your home.',
  robots: { index: false, follow: false }, // keep campaign page out of search results
};

export default function SaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <RecaptchaProvider>
      <main style={{ minHeight: '100vh', background: '#fcf9f2' }}>
        {children}
      </main>
      <WhatsAppButton />
    </RecaptchaProvider>
  );
}
