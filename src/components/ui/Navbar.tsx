'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/components/providers/CartProvider';

export function Navbar() {
  const pathname = usePathname();
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/collections', label: 'Shop' },
    { href: '/collections?cat=Rugs', label: 'Rugs' },
    { href: '/story', label: 'Our Story' },
    { href: '/contact', label: 'Contact Us' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.includes('?')) return pathname + (typeof window !== 'undefined' ? window.location.search : '') === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo" style={{ display: 'flex', alignItems: 'center' }}>
          <Image src="/harmukhlogo.png" alt="Harmukh Threads" width={150} height={40} style={{ objectFit: 'contain', width: 'auto', height: '40px' }} priority />
        </Link>

        <nav className="navbar-nav" aria-label="Main navigation">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-link${isActive(l.href) ? ' active' : ''}${l.label === 'Contact Us' ? ' nav-link-cta' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="navbar-actions">
          <button
            className="icon-btn"
            onClick={openCart}
            aria-label={`Shopping bag, ${count} items`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {count > 0 && <span className="cart-badge">{count}</span>}
          </button>

          <button
            className={`hamburger${mobileOpen ? ' open' : ''}`}
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="mobile-nav open" aria-label="Mobile navigation">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-link${isActive(l.href) ? ' active' : ''}`}
              style={{ fontSize: '1rem', padding: '10px 0' }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
