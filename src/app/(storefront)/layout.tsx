import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="page-content page-fade-in">
        {children}
      </main>
      <Footer />
    </>
  );
}
