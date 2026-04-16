'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
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
        <svg key={star} width={size} height={size} viewBox="0 0 24 24"
          fill={star <= rating ? '#f59e0b' : 'none'}
          stroke="#f59e0b" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export function ProductClient({ product }: ProductClientProps) {
  const [mainIdx, setMainIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalImages = product.images.length;

  const avgRating = product.reviews.length
    ? Math.round(product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length)
    : 0;
  const ratingCounts = [5, 4, 3, 2, 1].map(n => ({
    star: n,
    count: product.reviews.filter(r => r.rating === n).length,
  }));

  const handleAdd = () => {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const goNext = useCallback(() => setMainIdx(i => (i + 1) % totalImages), [totalImages]);
  const goPrev = useCallback(() => setMainIdx(i => (i - 1 + totalImages) % totalImages), [totalImages]);

  // ── Auto-loop every 6 seconds ──
  const resetAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    if (totalImages > 1) {
      autoplayRef.current = setInterval(goNext, 6000);
    }
  }, [goNext, totalImages]);

  useEffect(() => {
    resetAutoplay();
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [resetAutoplay]);

  // On manual nav, restart the 6s timer
  const handleThumbClick = (i: number) => {
    setMainIdx(i);
    resetAutoplay();
  };
  const handlePrev = () => { goPrev(); resetAutoplay(); };
  const handleNext = () => { goNext(); resetAutoplay(); };

  const hasSpecs = product.dimensions || product.material || product.origin || product.weaveTime
    || product.knotDensity || (product as any).weight || (product as any).shape
    || (product as any).rugType || (product as any).embroidery
    || (product as any).fabric || (product as any).craft;

  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const discountPct = isOnSale ? Math.round((1 - product.price / product.originalPrice!) * 100) : 0;

  return (
    <div className="pdp-root">
      {/* ── Breadcrumb ── */}
      <div className="container pdp-breadcrumb">
        <nav className="pdp-breadcrumb-nav" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/collections">Collections</Link>
          <span>›</span>
          <span className="pdp-breadcrumb-current">{product.name}</span>
        </nav>
      </div>

      {/* ── Main 2-col layout ── */}
      <div className="container pdp-layout">

        {/* ══ Gallery column ══ */}
        <div className="pdp-gallery">
          {/* Thumbnail strip — left */}
          {totalImages > 1 && (
            <div className="pdp-thumbs">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => handleThumbClick(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`pdp-thumb${mainIdx === i ? ' active' : ''}`}
                >
                  <Image src={img} alt={`Thumbnail ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}

          {/* Main image card — no zoom/lightbox */}
          <div className="pdp-main-image-wrap">
            <div className="pdp-main-image-btn" style={{ cursor: 'default' }}>
              {/* Counter badge */}
              {totalImages > 1 && (
                <span className="pdp-counter">{mainIdx + 1} / {totalImages}</span>
              )}

              {/* Product badge */}
              {product.badge && (
                <span className={`badge ${product.badgeType || 'badge-primary'} pdp-badge`}>
                  {product.badge}
                </span>
              )}

              <div className="pdp-main-image-inner">
                <Image
                  key={mainIdx}
                  src={product.images[mainIdx]}
                  alt={`${product.name} — view ${mainIdx + 1}`}
                  fill
                  priority
                  style={{ objectFit: 'contain' }}
                />
              </div>

              {/* Prev / Next arrows */}
              {totalImages > 1 && (
                <>
                  <button
                    className="pdp-arrow pdp-arrow-left"
                    onClick={handlePrev}
                    aria-label="Previous image"
                  >‹</button>
                  <button
                    className="pdp-arrow pdp-arrow-right"
                    onClick={handleNext}
                    aria-label="Next image"
                  >›</button>
                </>
              )}

              {/* Dot indicators at bottom */}
              {totalImages > 1 && (
                <div className="pdp-dots-inline">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      className={`pdp-dot-inline${mainIdx === i ? ' active' : ''}`}
                      onClick={() => handleThumbClick(i)}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══ Info column ══ */}
        <div className="pdp-info">

          {/* Category */}
          <p className="pdp-category">{product.category}</p>

          {/* Title */}
          <h1 className="pdp-title">{product.name}</h1>

          {/* Rating row */}
          {product.reviews.length > 0 && (
            <div className="pdp-rating-row">
              <StarRating rating={avgRating} />
              <span className="pdp-rating-label">
                {avgRating}.0 · {product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''}
              </span>
              {product.stock > 0 && (
                <span className="pdp-in-stock">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '3px' }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  In Stock
                </span>
              )}
            </div>
          )}

          {/* Price row */}
          <div className="pdp-price-row">
            <span className="pdp-price">{formatPrice(product.price)}</span>
            {isOnSale && (
              <>
                <del className="pdp-original-price">{formatPrice(product.originalPrice!)}</del>
                <span className="pdp-discount-badge">SAVE {discountPct}%</span>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="pdp-divider" />

          {/* Stock warning */}
          {product.stock > 0 && product.stock <= 5 && (
            <p className="pdp-low-stock">⚡ Only {product.stock} left — order soon!</p>
          )}

          {/* CTA */}
          <div className="pdp-cta-group">
            <button
              className="btn btn-primary pdp-btn-add"
              disabled={product.stock === 0}
              onClick={handleAdd}
            >
              {product.stock === 0 ? 'Out of Stock' : added ? '✓ Added to Bag!' : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                  Add to Bag
                </>
              )}
            </button>
            <Link href="/contact" className="btn btn-secondary pdp-btn-enquire">
              Enquire
            </Link>
          </div>

          {/* ── Description ── */}
          <div className="pdp-section">
            <h2 className="pdp-section-title">Description</h2>
            <p className="pdp-description">{product.description}</p>
            {(product as any).productNote && (
              <div className="pdp-note">
                <strong>Note:</strong> {(product as any).productNote}
              </div>
            )}
          </div>

          {/* ── Specifications ── */}
          {hasSpecs && (
            <div className="pdp-section">
              <h2 className="pdp-section-title">Specifications</h2>
              <div className="pdp-specs">
                {[
                  { label: 'Dimensions', value: product.dimensions },
                  { label: 'Weight', value: (product as any).weight },
                  { label: 'Shape', value: (product as any).shape },
                  { label: 'Type of Rug', value: (product as any).rugType },
                  { label: 'Material', value: product.material },
                  { label: 'Fabric', value: (product as any).fabric },
                  { label: 'Embroidery', value: (product as any).embroidery },
                  { label: 'Craft', value: (product as any).craft },
                  { label: 'Origin', value: product.origin },
                  { label: 'Weave Time', value: product.weaveTime },
                  { label: 'Knot Density', value: product.knotDensity },
                ].filter(r => r.value).map((row, i) => (
                  <div className="pdp-spec-row" key={row.label}
                    style={{ background: i % 2 === 0 ? 'var(--surface-container-low)' : 'transparent' }}>
                    <span className="pdp-spec-label">{row.label}</span>
                    <span className="pdp-spec-value">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Trust strip — Secure Checkout + Free Shipping (after Specs) ── */}
          <div className="pdp-trust-strip" style={{ marginTop: 'var(--space-xl)' }}>
            <div className="pdp-trust-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Secure Checkout
            </div>
            <div className="pdp-trust-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              Free Shipping
            </div>
          </div>

          {/* ── Reviews ── */}
          <div className="pdp-section">
            <h2 className="pdp-section-title">
              Customer Reviews
              {product.reviews.length > 0 && (
                <span className="pdp-review-count">({product.reviews.length})</span>
              )}
            </h2>

            {product.reviews.length > 0 ? (
              <>
                {/* Rating summary */}
                <div className="pdp-rating-summary">
                  <div className="pdp-rating-big">
                    <div className="pdp-rating-num">{avgRating}.0</div>
                    <StarRating rating={avgRating} size={20} />
                    <div className="pdp-rating-total">{product.reviews.length} reviews</div>
                  </div>
                  <div className="pdp-rating-bars">
                    {ratingCounts.map(({ star, count }) => (
                      <div className="pdp-bar-row" key={star}>
                        <span className="pdp-bar-label">{star}</span>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="#f59e0b">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        <div className="pdp-bar-track">
                          <div className="pdp-bar-fill"
                            style={{ width: `${product.reviews.length ? (count / product.reviews.length) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="pdp-bar-count">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review cards */}
                <div className="pdp-reviews">
                  {product.reviews.map(r => (
                    <div className="pdp-review-card" key={r.id}>
                      <div className="pdp-review-header">
                        <div className="pdp-review-avatar">{r.author.charAt(0).toUpperCase()}</div>
                        <div>
                          <div className="pdp-review-author">{r.author}</div>
                          <div className="pdp-review-date">
                            {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                        <div style={{ marginLeft: 'auto' }}>
                          <StarRating rating={r.rating} />
                        </div>
                      </div>
                      <p className="pdp-review-text">&ldquo;{r.text}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="pdp-no-reviews">No reviews yet — be the first to share your experience!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
