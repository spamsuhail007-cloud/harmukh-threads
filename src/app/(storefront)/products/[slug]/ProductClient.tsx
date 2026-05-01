'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/components/providers/CartProvider';
import { type Product, type Review } from '@prisma/client';
import { ProductCard } from '@/components/ui/ProductCard';
import { EnquiryModal } from '@/components/ui/EnquiryModal';

type ProductClientProps = {
  product: Product & { reviews: Review[] };
  relatedProducts: Product[];
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

/* ── Notify-when-back-in-stock form ── */
function NotifyForm({ productId }: { productId: string }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');
    try {
      const res = await fetch('/api/notify-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, productId }),
      });
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  };

  if (state === 'done') {
    return (
      <div className="notify-success">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        We&apos;ll notify you at <strong>{email}</strong> when this item is back in stock!
      </div>
    );
  }

  return (
    <div className="notify-form-wrap">
      <p className="notify-label">Get notified when this comes back in stock</p>
      <form className="notify-form" onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-input notify-input"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-secondary notify-btn" disabled={state === 'loading'}>
          {state === 'loading' ? 'Saving…' : 'Notify Me'}
        </button>
      </form>
      {state === 'error' && (
        <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '6px' }}>
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}

/* ── Share buttons ── */
function ShareButtons({ product }: { product: Product }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : `https://harmukh-threads.vercel.app/products/${product.slug}`;
  const text = `Check out ${product.name} on Harmukh Threads — ${formatPrice(product.price)}`;

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(url); } catch { /* fallback */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="share-row">
      <span className="share-label">Share:</span>
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="share-btn share-whatsapp" aria-label="Share on WhatsApp">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.13.558 4.122 1.533 5.851L0 24l6.311-1.516A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.796 9.796 0 01-5.028-1.382l-.36-.214-3.742.899.944-3.64-.235-.374A9.786 9.786 0 012.182 12C2.182 6.579 6.579 2.182 12 2.182S21.818 6.579 21.818 12 17.421 21.818 12 21.818z"/>
        </svg>
        WhatsApp
      </a>
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="share-btn share-twitter" aria-label="Share on X / Twitter">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        X
      </a>
      <button onClick={copyLink} className="share-btn share-copy" aria-label="Copy link">
        {copied ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
            Copy Link
          </>
        )}
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   Main ProductClient component
══════════════════════════════════════════════════ */
export function ProductClient({ product, relatedProducts }: ProductClientProps) {
  const [mainIdx, setMainIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
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

  const resetAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    if (totalImages > 1) autoplayRef.current = setInterval(goNext, 6000);
  }, [goNext, totalImages]);

  useEffect(() => {
    resetAutoplay();
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [resetAutoplay]);

  const handleThumbClick = (i: number) => { setMainIdx(i); resetAutoplay(); };
  const handlePrev = () => { goPrev(); resetAutoplay(); };
  const handleNext = () => { goNext(); resetAutoplay(); };

  const specs = Array.isArray((product as any).specifications) 
    ? (product as any).specifications as { label: string; value: string }[] 
    : [];
  const hasSpecs = specs.length > 0;

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

      {/* ── 2-col layout ── */}
      <div className="container pdp-layout">

        {/* ══ Gallery ══ */}
        <div className="pdp-gallery">
          {totalImages > 1 && (
            <div className="pdp-thumbs">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => handleThumbClick(i)} aria-label={`View image ${i + 1}`}
                  className={`pdp-thumb${mainIdx === i ? ' active' : ''}`}>
                  <Image src={img} alt={`Thumbnail ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}

          <div className="pdp-main-image-wrap">
            <div className="pdp-main-image-btn" style={{ cursor: 'default' }}>
              {totalImages > 1 && (
                <span className="pdp-counter">{mainIdx + 1} / {totalImages}</span>
              )}
              {product.badge && (
                <span className={`badge ${product.badgeType || 'badge-primary'} pdp-badge`}>
                  {product.badge}
                </span>
              )}
              <div className="pdp-main-image-inner">
                <Image key={mainIdx} src={product.images[mainIdx]}
                  alt={`${product.name} — view ${mainIdx + 1}`}
                  fill priority style={{ objectFit: 'contain' }} />
              </div>
              {totalImages > 1 && (
                <>
                  <button className="pdp-arrow pdp-arrow-left" onClick={handlePrev} aria-label="Previous image">‹</button>
                  <button className="pdp-arrow pdp-arrow-right" onClick={handleNext} aria-label="Next image">›</button>
                </>
              )}
              {totalImages > 1 && (
                <div className="pdp-dots-inline">
                  {product.images.map((_, i) => (
                    <button key={i} className={`pdp-dot-inline${mainIdx === i ? ' active' : ''}`}
                      onClick={() => handleThumbClick(i)} aria-label={`Go to image ${i + 1}`} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══ Info panel ══ */}
        <div className="pdp-info">
          <p className="pdp-category">{product.category}</p>
          <h1 className="pdp-title">{product.name}</h1>

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

          <div className="pdp-price-row">
            <span className="pdp-price">{formatPrice(product.price)}</span>
            {isOnSale && (
              <>
                <del className="pdp-original-price">{formatPrice(product.originalPrice!)}</del>
                <span className="pdp-discount-badge">SAVE {discountPct}%</span>
              </>
            )}
          </div>

          <div className="pdp-divider" />

          {product.stock > 0 && product.stock <= 5 && (
            <p className="pdp-low-stock">⚡ Only {product.stock} left — order soon!</p>
          )}

          {/* CTA */}
          {product.stock > 0 ? (
            <div className="pdp-cta-group">
              <button className="btn btn-primary pdp-btn-add" onClick={handleAdd}>
                {added ? '✓ Added to Bag!' : (
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
              <button className="btn btn-secondary pdp-btn-enquire" onClick={() => setEnquiryOpen(true)}>Enquire</button>
            </div>
          ) : (
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <button className="btn btn-primary pdp-btn-add" disabled style={{ width: '100%', opacity: 0.5 }}>
                Out of Stock
              </button>
              {/* Notify me form */}
              <NotifyForm productId={product.id} />
            </div>
          )}

          {/* Share buttons */}
          <ShareButtons product={product} />

          {/* ── Trust Badges ── */}
          <div style={{ 
            marginTop: 'var(--space-xl)', 
            padding: 'var(--space-lg)', 
            background: 'linear-gradient(135deg, #fdfbf7 0%, #f7f0e6 100%)',
            border: '1px solid var(--outline-variant)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)'
          }}>
            <h3 style={{ 
              fontSize: '0.85rem', 
              color: 'var(--primary)', 
              fontWeight: 700, 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Handmade Guarantee
            </h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>
              Every thread in this masterpiece is hand-woven by master artisans in Kashmir. We guarantee 100% authenticity and museum-grade quality.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
              {[
                { label: 'Authentic Art', icon: '🎨' },
                { label: 'Secure Delivery', icon: '📦' },
                { label: 'Direct from Artisans', icon: '🤝' }
              ].map((badge) => (
                <div key={badge.label} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  fontSize: '0.75rem', 
                  fontWeight: 600,
                  color: 'var(--on-surface)',
                  background: 'white',
                  padding: '4px 10px',
                  borderRadius: '99px',
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                  <span>{badge.icon}</span> {badge.label}
                </div>
              ))}
            </div>
          </div>

          {/* ── Description ── */}
          <div className="pdp-section">
            <h2 className="pdp-section-title">Description</h2>
            <div className="pdp-description" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {product.description.split('\n').filter(p => p.trim() !== '').map((paragraph, i) => (
                <p key={i} style={{ margin: 0, lineHeight: 1.6 }}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* ── Specifications ── */}
          {hasSpecs && (
            <div className="pdp-section">
              <h2 className="pdp-section-title">Specifications</h2>
              <div className="pdp-specs">
                {specs.filter(r => r.label && r.value).map((row, i) => (
                  <div className="pdp-spec-row" key={row.label + i}
                    style={{ background: i % 2 === 0 ? 'var(--surface-container-low)' : 'transparent' }}>
                    <span className="pdp-spec-label">{row.label}</span>
                    <span className="pdp-spec-value">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Care & Notes ── */}
          {(product as any).productNote && (
            <div className="pdp-note-list" style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-lg)', background: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-md)', color: 'var(--on-surface)', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Care & Notes
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(product as any).productNote
                  .split(/(?:\.\s+|\n+)/)
                  .map((p: string) => p.trim().replace(/\.$/, ''))
                  .filter((p: string) => p.length > 0)
                  .map((point: string, i: number) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '3px' }}>
                       <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Trust strip ── */}
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
                            style={{ width: `${product.reviews.length ? (count / product.reviews.length) * 100 : 0}%` }} />
                        </div>
                        <span className="pdp-bar-count">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
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
                        <div style={{ marginLeft: 'auto' }}><StarRating rating={r.rating} /></div>
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

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <div className="related-section">
          <div className="container">
            <h2 className="related-title">You May Also Like</h2>
            <div className="related-grid">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Enquiry Modal ── */}
      {enquiryOpen && (
        <EnquiryModal
          productName={product.name}
          onClose={() => setEnquiryOpen(false)}
        />
      )}
    </div>
  );
}
