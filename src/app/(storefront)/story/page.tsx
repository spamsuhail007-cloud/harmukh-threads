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
            takes months to knot. A pashmina takes a season to weave. Discover the
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
              Each knot in our rugs is tied individually. Each thread in our pashminas is 
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

      <section className="container artisan-section" id="gi">
        <div className="artisan-grid">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80"
            alt="Pashmina weaving"
            className="artisan-img"
          />
          <div>
            <div className="section-kicker">Authentication</div>
            <h2 className="section-title" style={{ marginBottom: 'var(--space-md)' }}>The GI Promise</h2>
            <p className="section-lead" style={{ marginBottom: 'var(--space-xl)' }}>
              Kashmiri crafts are heavily counterfeited globally. To protect our artisans and our patrons,
              applicable products (like our Pashmina shawls and hand-knotted Carpets) come with a 
              Geographical Indication (GI) tag. This government-backed certification guarantees origin, 
              authenticity, and the traditional method of creation.
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
