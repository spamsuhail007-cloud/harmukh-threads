import Link from 'next/link';
// Triggering new deployment to ensure homepage updates are picked up.
import { getFeaturedProducts } from '@/actions/products';
import { ProductCard } from '@/components/ui/ProductCard';
import { CollectionCard } from '@/components/ui/CollectionCard';
import { VideoCard } from '@/components/ui/VideoCard';

import { db } from '@/lib/db';

export const revalidate = 60; // ISR every 60s

export default async function HomePage() {
  const [featured, rugsCount, pillowsCount, videoProducts] = await Promise.all([
    getFeaturedProducts(),
    db.product.count({ where: { category: 'Rugs', isActive: true } }),
    db.product.count({ where: { category: 'Pillow Covers', isActive: true } }),
    db.product.findMany({ 
      where: { videoUrl: { not: null }, isActive: true },
      take: 10,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return (
    <>
      <section className="hero">
        <img
          src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1600&q=80"
          alt="Luxury Kashmiri Loom"
          className="hero-bg"
        />
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1 className="hero-headline">
            Heirloom Quality,<br />
            Woven for <em>Generations.</em>
          </h1>
          <p className="hero-body">
            Harmukh Threads brings the timeless elegance of Kashmiri artistry to your home. 
            Discover our curated collection of museum-quality hand-knotted rugs and 
            masterfully crafted pillow covers.
          </p>
          <div className="hero-actions">
            <Link href="/collections" className="btn btn-primary">
              Explore Collections
            </Link>
            <Link href="/story" className="btn btn-secondary">
              Our Heritage
            </Link>
          </div>
        </div>
      </section>

      {videoProducts.length > 0 && (
        <section style={{ padding: 'var(--space-2xl) 0', background: 'var(--surface-container-low)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-2xl)' }}>
              <div>
                <div className="section-kicker" style={{ color: 'var(--primary)' }}>Watch & Shop</div>
                <h2 className="section-title" style={{ color: 'var(--on-surface)' }}>Artistry in Motion</h2>
              </div>
            </div>
            
            {/* Horizontal Scrolling Video Container */}
            <div style={{
              display: 'flex',
              gap: 'var(--space-md)',
              overflowX: 'auto',
              paddingBottom: 'var(--space-md)',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none', /* Firefox */
              msOverflowStyle: 'none',  /* Internet Explorer 10+ */
            }} className="hide-scrollbar">
              {videoProducts.map(product => (
                <VideoCard key={product.id} product={product} />
              ))}
            </div>
            <style dangerouslySetInnerHTML={{__html: `
              .hide-scrollbar::-webkit-scrollbar { display: none; }
            `}} />
          </div>
        </section>
      )}

      <section className="trust-bar">
        <div className="container">
          <div className="trust-bar-grid">
            <div>
              <div className="trust-item-icon">✦</div>
              <div className="trust-item-title">Master Crafted</div>
              <div className="trust-item-sub">Authentic Kashmir Origin</div>
            </div>
            <div>
              <div className="trust-item-icon">✧</div>
              <div className="trust-item-title">Direct Trade</div>
              <div className="trust-item-sub">Fair pricing for artisans</div>
            </div>
            <div>
              <div className="trust-item-icon">✤</div>
              <div className="trust-item-title">Museum Quality</div>
              <div className="trust-item-sub">Heritage craftsmanship</div>
            </div>
            <div>
              <div className="trust-item-icon">❖</div>
              <div className="trust-item-title">Global Shipping</div>
              <div className="trust-item-sub">Secure & insured delivery</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--space-3xl) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-2xl)' }}>
            <div>
              <div className="section-kicker">Curated</div>
              <h2 className="section-title">Latest & Bestselling</h2>
            </div>
            <Link href="/collections" className="btn btn-ghost" style={{ paddingRight: 0 }}>
              View all <span>→</span>
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-lg)' }}>
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--space-xl) 0 var(--space-3xl)' }}>
        <div className="container">
          <div style={{ marginBottom: 'var(--space-2xl)', textAlign: 'center' }}>
            <h2 className="section-title">The Collections</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
            <CollectionCard
              title="Hand-knotted Rugs"
              count={`${rugsCount}`}
              image="https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&q=80"
              category="Rugs"
            />
            <CollectionCard
              title="Pillow Covers"
              count={`${pillowsCount}`}
              image="/kashmiri-pillow.png"
              category="Pillow Covers"
            />
          </div>
        </div>
      </section>
    </>
  );
}
