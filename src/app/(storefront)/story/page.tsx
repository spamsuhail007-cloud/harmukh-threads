import Link from 'next/link';

export default function StoryPage() {
  return (
    <>
      <section className="artisan-hero">
        <img
          src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1600&q=80"
          alt="Weaver at loom"
          className="artisan-hero-bg"
        />
        <div className="artisan-hero-overlay"></div>
        <div className="container artisan-hero-content">
          <h1>Hands that weave<br />history.</h1>
          <p>
            In the secluded valleys of Kashmir, time moves differently. Here, a single rug
            takes months to knot. A finely crafted pillow cover takes weeks to weave. Discover the
            artisans behind Harmukh Threads.
          </p>
        </div>
      </section>

      <section className="container artisan-section" id="process">
        <div className="artisan-grid">
          <div>
            <div className="section-kicker">The Process</div>
            <h2 className="section-title" style={{ marginBottom: 'var(--space-md)' }}>Slow Craft in a Fast World</h2>
            <p className="section-lead" style={{ marginBottom: 'var(--space-lg)' }}>
              Unlike industrial manufacturing, our process relies entirely on human hands, 
              passed down through generations of families in Srinagar, Anantnag, and Pampore.
              Each knot in our rugs is tied individually. Each thread in our pillow covers is 
              spun on a traditional <em>charkha</em>.
            </p>
            <p className="section-lead">
              This is not just textile creation; it is an act of meditation and preservation.
              By choosing Harmukh, you help keep these ancient karkhanas (workshops) alive.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80"
            alt="Hand knotting process"
            className="artisan-img"
          />
        </div>
      </section>

      <section style={{ background: 'var(--surface-container-low)' }}>
        <div className="container artisan-stat-grid">
          <div>
            <div className="artisan-stat-num">300+</div>
            <div className="artisan-stat-label">Master Artisans</div>
          </div>
          <div>
            <div className="artisan-stat-num">100%</div>
            <div className="artisan-stat-label">Handcrafted</div>
          </div>
          <div>
            <div className="artisan-stat-num">Zero</div>
            <div className="artisan-stat-label">Synthetic Dyes</div>
          </div>
        </div>
      </section>

      <section className="container artisan-section" id="artisans">
        <div className="artisan-grid">
          <img
            src="/cusioncover.png"
            alt="Handcrafted Kashmiri Cushion Cover"
            className="artisan-img"
          />
          <div>
            <div className="section-kicker">Our Commitment</div>
            <h2 className="section-title" style={{ marginBottom: 'var(--space-md)' }}>Authenticity You Can Trust</h2>
            <p className="section-lead" style={{ marginBottom: 'var(--space-xl)' }}>
              Kashmiri crafts represent centuries of tradition. Every Harmukh piece is sourced directly
              from master artisans in Kashmir, ensuring authenticity of origin, traditional methods of
              creation, and fair compensation for the craftspeople who make them.
            </p>
            <Link href="/collections" className="btn btn-secondary">
              Shop Authentic Pieces
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
