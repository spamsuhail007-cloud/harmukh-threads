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
            takes months to knot. A finely crafted cushion cover takes weeks to weave. Discover the
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
              Each knot in our rugs is tied individually. Each thread in our cushion covers is 
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

      <section style={{ background: 'var(--surface-container-low)', padding: 'clamp(var(--space-lg), 6vw, var(--space-3xl)) 0' }}>
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
            <div className="artisan-stat-num">600+</div>
            <div className="artisan-stat-label">Years of Tradition</div>
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

      <section className="container" style={{ padding: 'var(--space-xl) 0 var(--space-3xl)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: 'var(--space-md)' }}>Connect With Our Studio</h2>
        <p style={{ color: 'var(--on-surface-variant)', maxWidth: '540px', margin: '0 auto var(--space-lg)', lineHeight: 1.6 }}>
          Want to know more about our weavers, inspect piece details, or enquire about custom sizing? Reach us directly via WhatsApp or Email.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://wa.me/918491006127" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            💬 Chat on WhatsApp
          </a>
          <a href="mailto:harmukhthreads@gmail.com" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            ✉️ Email Us
          </a>
        </div>
      </section>
    </>
  );
}
