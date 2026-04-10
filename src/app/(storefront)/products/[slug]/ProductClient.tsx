'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/components/providers/CartProvider';
import { type Product, type Review } from '@prisma/client';

type ProductClientProps = {
  product: Product & { reviews: Review[] };
};

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} width={size} height={size} viewBox="0 0 24 24" fill={star <= rating ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export function ProductClient({ product }: ProductClientProps) {
  const [mainImage, setMainImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const { add } = useCart();

  const avgRating = product.reviews.length
    ? Math.round(product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length)
    : 0;
  const ratingCounts = [5, 4, 3, 2, 1].map(n => ({
    star: n,
    count: product.reviews.filter(r => r.rating === n).length
  }));

  const handleAdd = () => {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') setMainImage(i => (i + 1) % product.images.length);
    if (e.key === 'ArrowLeft') setMainImage(i => (i - 1 + product.images.length) % product.images.length);
    if (e.key === 'Escape') setLightboxOpen(false);
  }, [product.images.length]);

  const hasSpecs = product.dimensions || product.material || product.origin || product.weaveTime || product.knotDensity
    || (product as any).weight || (product as any).shape || (product as any).rugType
    || (product as any).embroidery || (product as any).fabric || (product as any).craft;
  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const discountPct = isOnSale ? Math.round((1 - product.price / product.originalPrice!) * 100) : 0;

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div className="container" style={{ padding: 'var(--space-md) var(--space-lg)', borderBottom: '1px solid var(--outline-variant)' }}>
        <nav style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <span>›</span>
          <Link href="/collections" style={{ color: 'inherit', textDecoration: 'none' }}>Collections</Link>
          <span>›</span>
          <span style={{ color: 'var(--on-surface)' }}>{product.name}</span>
        </nav>
      </div>

      <div className="container" style={{ padding: 'var(--space-2xl) var(--space-lg)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3xl)', alignItems: 'start' }}>

          {/* ── LEFT: Image Gallery ── */}
          <div style={{ position: 'sticky', top: '100px' }}>
            {/* Main Image */}
            <div
              onClick={() => setLightboxOpen(true)}
              style={{
                aspectRatio: '4/5', borderRadius: 'var(--radius-lg)',
                overflow: 'hidden', marginBottom: 'var(--space-md)',
                cursor: 'zoom-in', position: 'relative',
                background: 'var(--surface-container-low)'
              }}
            >
              <Image
                src={product.images[mainImage]}
                alt={`${product.name} – view ${mainImage + 1}`}
                fill
                priority
                style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
              {product.badge && (
                <div style={{
                  position: 'absolute', top: '16px', left: '16px',
                  background: 'var(--primary)', color: 'var(--on-primary)',
                  padding: '4px 12px', borderRadius: '99px',
                  fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em'
                }}>
                  {product.badge}
                </div>
              )}
              {product.images.length > 1 && (
                <div style={{
                  position: 'absolute', bottom: '16px', right: '16px',
                  background: 'rgba(0,0,0,0.5)', color: '#fff',
                  padding: '4px 10px', borderRadius: '99px', fontSize: '0.75rem'
                }}>
                  {mainImage + 1} / {product.images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(i)}
                    style={{
                      width: '72px', height: '72px', flexShrink: 0,
                      borderRadius: 'var(--radius-sm)', overflow: 'hidden',
                      border: mainImage === i
                        ? '2px solid var(--primary)'
                        : '2px solid var(--outline-variant)',
                      padding: 0, cursor: 'pointer',
                      transition: 'border-color 0.2s, transform 0.2s',
                      transform: mainImage === i ? 'scale(1.05)' : 'scale(1)',
                      position: 'relative'
                    }}
                  >
                    <Image src={img} alt={`View ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div>
            <div style={{ marginBottom: 'var(--space-sm)' }}>
              <span style={{
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'var(--primary)'
              }}>
                {product.category}
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              lineHeight: 1.15, marginBottom: 'var(--space-md)', fontWeight: 700
            }}>
              {product.name}
            </h1>

            {/* Rating summary */}
            {product.reviews.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-md)' }}>
                <StarRating rating={avgRating} />
                <span style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
                  {avgRating}.0 ({product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''})
                </span>
              </div>
            )}

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
              <span style={{
                fontFamily: 'var(--font-serif)', fontSize: '2rem',
                fontWeight: 700, color: 'var(--primary)'
              }}>
                {formatPrice(product.price)}
              </span>
              {isOnSale && (
                <>
                  <del style={{ color: 'var(--on-surface-variant)', fontSize: '1.1rem' }}>
                    {formatPrice(product.originalPrice!)}
                  </del>
                  <span style={{
                    background: '#dcfce7', color: '#16a34a',
                    padding: '2px 10px', borderRadius: '99px',
                    fontSize: '0.8rem', fontWeight: 700
                  }}>
                    {discountPct}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Trust badges */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)',
              background: 'var(--surface-container-low)',
              borderRadius: 'var(--radius-md)', padding: 'var(--space-md)'
            }}>
              {[
                { icon: '🚚', label: 'Free Shipping', sub: 'Pan India' },
                { icon: '✅', label: 'Authentic', sub: 'Handcrafted' },
                { icon: '🔄', label: 'Easy Returns', sub: '7-day policy' },
              ].map(b => (
                <div key={b.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{b.icon}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>{b.label}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--on-surface-variant)' }}>{b.sub}</div>
                </div>
              ))}
            </div>

            {/* Add to Cart */}
            <div style={{ marginBottom: 'var(--space-xl)' }}>
              {product.stock > 0 && product.stock <= 5 && (
                <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 600 }}>
                  ⚠️ Only {product.stock} left in stock!
                </p>
              )}
              <button
                className="btn btn-primary btn-full"
                style={{
                  padding: '18px', fontSize: '1.05rem', letterSpacing: '0.05em',
                  marginBottom: 'var(--space-sm)',
                  transition: 'transform 0.15s, box-shadow 0.15s'
                }}
                disabled={product.stock === 0}
                onClick={handleAdd}
                onMouseEnter={e => { if (product.stock > 0) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                {product.stock === 0 ? '✗ Out of Stock' : added ? '✓ Added to Bag!' : '🛒 Add to Bag'}
              </button>
            </div>

            {/* Tab Navigation */}
            <div style={{ borderBottom: '2px solid var(--outline-variant)', marginBottom: 'var(--space-lg)' }}>
              <div style={{ display: 'flex', gap: 0 }}>
                {[
                  { key: 'description', label: 'Description' },
                  { key: 'specs', label: 'Specifications' },
                  { key: 'reviews', label: `Reviews (${product.reviews.length})` },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    style={{
                      padding: '10px 20px', border: 'none', background: 'none',
                      cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
                      color: activeTab === tab.key ? 'var(--primary)' : 'var(--on-surface-variant)',
                      borderBottom: activeTab === tab.key ? '2px solid var(--primary)' : '2px solid transparent',
                      marginBottom: '-2px', transition: 'color 0.2s'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'description' && (
              <div>
                <div style={{ lineHeight: 1.9, color: 'var(--on-surface-variant)', fontSize: '1rem', marginBottom: 'var(--space-lg)' }}>
                  {product.description}
                </div>
                {(product as any).productNote && (
                  <div style={{
                    background: '#fef9c3', border: '1px solid #fde047',
                    borderRadius: 'var(--radius-sm)', padding: '12px 16px',
                    fontSize: '0.875rem', color: '#713f12'
                  }}>
                    <strong>Note:</strong> {(product as any).productNote}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div>
                {hasSpecs ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {[
                        { label: 'Dimensions', value: product.dimensions },
                        { label: 'Weight', value: (product as any).weight },
                        { label: 'Shape', value: (product as any).shape },
                        { label: 'Type of Rug', value: (product as any).rugType },
                        { label: 'Material', value: product.material },
                        { label: 'Fabric', value: (product as any).fabric },
                        { label: 'Embroidery Thread', value: (product as any).embroidery },
                        { label: 'Craft', value: (product as any).craft },
                        { label: 'Origin', value: product.origin },
                        { label: 'Weave Time', value: product.weaveTime },
                        { label: 'Knot Density', value: product.knotDensity },
                      ].filter(row => row.value).map((row, i) => (
                        <tr key={row.label} style={{ background: i % 2 === 0 ? 'var(--surface-container-low)' : 'transparent' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.8rem', color: 'var(--on-surface)', textTransform: 'uppercase', letterSpacing: '0.08em', width: '42%', borderBottom: '1px solid var(--outline-variant)' }}>
                            {row.label}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '0.95rem', color: 'var(--on-surface-variant)', borderBottom: '1px solid var(--outline-variant)' }}>{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: 'var(--on-surface-variant)' }}>No specifications added yet.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {product.reviews.length > 0 ? (
                  <>
                    {/* Rating breakdown */}
                    <div style={{ display: 'flex', gap: 'var(--space-xl)', marginBottom: 'var(--space-xl)', padding: 'var(--space-lg)', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ textAlign: 'center', flexShrink: 0 }}>
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', fontWeight: 700, lineHeight: 1 }}>{avgRating}.0</div>
                        <StarRating rating={avgRating} size={20} />
                        <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '4px' }}>{product.reviews.length} reviews</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        {ratingCounts.map(({ star, count }) => (
                          <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '0.75rem', width: '12px' }}>{star}</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                            <div style={{ flex: 1, height: '6px', background: 'var(--outline-variant)', borderRadius: '99px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${product.reviews.length ? (count / product.reviews.length) * 100 : 0}%`, background: '#f59e0b', borderRadius: '99px' }} />
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', width: '20px' }}>{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Review list */}
                    {product.reviews.map(r => (
                      <div key={r.id} style={{ marginBottom: 'var(--space-lg)', paddingBottom: 'var(--space-lg)', borderBottom: '1px solid var(--outline-variant)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{r.author}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                            {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                        <StarRating rating={r.rating} />
                        <p style={{ marginTop: '8px', lineHeight: 1.7, color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>&ldquo;{r.text}&rdquo;</p>
                      </div>
                    ))}
                  </>
                ) : (
                  <p style={{ color: 'var(--on-surface-variant)', textAlign: 'center', padding: 'var(--space-2xl) 0' }}>
                    No reviews yet. Be the first to review this product!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            outline: 'none'
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
            style={{ position: 'absolute', top: '20px', right: '24px', background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer', lineHeight: 1 }}
          >✕</button>

          {product.images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setMainImage(i => (i - 1 + product.images.length) % product.images.length); }}
                style={{ position: 'absolute', left: '20px', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: '1.5rem', width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer' }}
              >‹</button>
              <button
                onClick={(e) => { e.stopPropagation(); setMainImage(i => (i + 1) % product.images.length); }}
                style={{ position: 'absolute', right: '20px', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: '1.5rem', width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer' }}
              >›</button>
            </>
          )}

          <div
            onClick={e => e.stopPropagation()}
            style={{ position: 'relative', width: '90vmin', height: '90vmin', maxWidth: '800px', maxHeight: '800px' }}
          >
            <Image
              src={product.images[mainImage]}
              alt={product.name}
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
