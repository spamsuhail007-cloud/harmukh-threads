import Link from 'next/link';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="logo-text">✦ Harmukh Threads</span>
            <p>Custodians of 600 years of Kashmiri craft — connecting master weavers with discerning homes across the world.</p>
          </div>
          <div className="footer-col">
            <h4>Collections</h4>
            <ul>
              <li><Link href="/collections?cat=Rugs">Hand-knotted Rugs</Link></li>
              <li><Link href="/collections?cat=Pashmina">Pashmina Shawls</Link></li>
              <li><Link href="/collections?cat=Furnishings">Silk Furnishings</Link></li>
              <li><Link href="/collections?cat=Woodcraft">Walnut Woodcraft</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Heritage</h4>
            <ul>
              <li><Link href="/story">Our Story</Link></li>
              <li><Link href="/story#artisans">The Artisans</Link></li>
              <li><Link href="/story#process">The Process</Link></li>
              <li><Link href="/story#gi">GI Certification</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Help</h4>
            <ul>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/collections">Shop All</Link></li>
              <li><a href="mailto:hello@harmukh.in">hello@harmukh.in</a></li>
              <li><a href="tel:+91-194-247-0000">+91 194 247 0000</a></li>
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
