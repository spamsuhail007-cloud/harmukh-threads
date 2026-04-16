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
              <li><a href="mailto:hello@harmukh.in">hello@harmukh.in</a></li>
              <li><a href="tel:+91-849-100-6127">+91 84910 06127</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© {new Date().getFullYear()} Harmukh Threads. All rights reserved.</span>
          <span className="footer-copy">Made with care in Kashmir 🏔️</span>
        </div>
      </div>
    </footer>
  );
}
