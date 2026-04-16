import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { RecaptchaProvider } from '@/components/ui/RecaptchaProvider';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <RecaptchaProvider>
      <Navbar />
      <CartDrawer />
      <main className="page-content page-fade-in">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </RecaptchaProvider>
  );
}
