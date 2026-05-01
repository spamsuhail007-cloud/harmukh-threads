'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/components/providers/CartProvider';
import { SearchBar } from '@/components/ui/SearchBar';

export function Navbar() {
  const pathname = usePathname();
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setSearchOpen(false); }, [pathname]);

  // Close search on outside click
  useEffect(() => {
    if (!searchOpen) return;
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [searchOpen]);

  // Close search on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSearchOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/collections', label: 'Shop' },
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
          {/* Search icon */}
          <button
            className="icon-btn"
            onClick={() => setSearchOpen(o => !o)}
            aria-label="Open search"
            aria-expanded={searchOpen}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>

          {/* Cart */}
          <button className="icon-btn" onClick={openCart} aria-label={`Shopping bag, ${count} items`}>
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

      {/* Slide-down search panel */}
      <div
        ref={searchRef}
        className={`navbar-search-panel${searchOpen ? ' open' : ''}`}
        aria-hidden={!searchOpen}
      >
        <div className="navbar-inner" style={{ paddingTop: '10px', paddingBottom: '14px' }}>
          <SearchBar
            searchMode
            autoFocus={searchOpen}
            onClose={() => setSearchOpen(false)}
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="icon-btn"
            aria-label="Close search"
            style={{ marginLeft: '8px', flexShrink: 0 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
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
          {/* Mobile search link */}
          <Link href="/search" className="nav-link" style={{ fontSize: '1rem', padding: '10px 0' }}>
            🔍 Search
          </Link>
        </nav>
      )}
    </header>
  );
}
