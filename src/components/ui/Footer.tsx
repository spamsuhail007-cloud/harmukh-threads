import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" style={{ display: 'inline-block', marginBottom: 'var(--space-md)' }}>
              <Image src="/harmukhlogo.png" alt="Harmukh Threads" width={150} height={40} style={{ objectFit: 'contain', width: 'auto', height: '40px' }} />
            </Link>
            <p>Custodians of 600 years of Kashmiri craft — connecting master weavers with discerning homes across the world.</p>
          </div>
          <div className="footer-col">
            <h4>Collections</h4>
            <ul>
              <li><Link href="/collections?cat=Rugs">Hand-knotted Rugs</Link></li>
              <li><Link href="/collections?cat=Pillow%20Covers">Pillow Covers</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Heritage</h4>
            <ul>
              <li><Link href="/story">Our Story</Link></li>
              <li><Link href="/story#artisans">The Artisans</Link></li>
              <li><Link href="/story#process">The Process</Link></li>
              <li><Link href="/story#process">Our Craft</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Help</h4>
            <ul>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/returns">Return Policy</Link></li>
              <li><Link href="/collections">Shop All</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><a href="mailto:harmukhthreads@gmail.com">harmukhthreads@gmail.com</a></li>
              <li><a href="tel:+91-849-100-6127">+91 84910 06127</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© {new Date().getFullYear()} Harmukh Threads. All rights reserved.</span>
          <span className="footer-copy">
            Handcrafted with <svg width="1em" height="1em" viewBox="0 0 24 24" fill="#e11d48" style={{ display: 'inline-block', verticalAlign: '-0.125em', animation: 'heartbeat 1.5s ease-in-out infinite' }}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> by <a href="https://wa.me/917006604148?text=I%20like%20the%20website%20design" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Frixl</a>
          </span>
          <style>{`
            @keyframes heartbeat {
              0%, 100% { transform: scale(1); }
              15% { transform: scale(1.2); }
              30% { transform: scale(1); }
              45% { transform: scale(1.2); }
              60% { transform: scale(1); }
            }
          `}</style>
        </div>
      </div>
    </footer>
  );
}
