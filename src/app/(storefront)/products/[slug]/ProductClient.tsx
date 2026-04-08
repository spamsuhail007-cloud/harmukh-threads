'use client';
import { useState } from 'react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/components/providers/CartProvider';
import { type Product, type Review } from '@prisma/client';

type ProductClientProps = {
  product: Product & { reviews: Review[] };
};

export function ProductClient({ product }: ProductClientProps) {
  const [mainImage, setMainImage] = useState(0);
  const [added, setAdded] = useState(false);
  const { add } = useCart();

  const handleAdd = () => {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div style={{ padding: 'var(--space-2xl) 0' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 1fr', gap: 'var(--space-3xl)' }}>
        
        {/* Images */}
        <div>
          <div style={{ aspectRatio: '4/5', background: 'var(--surface-container)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 'var(--space-md)' }}>
            <Image
              src={product.images[mainImage]}
              alt={product.name}
              width={600}
              height={750}
              priority
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-md)' }}>
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setMainImage(i)}
                style={{
                  aspectRatio: '1', borderRadius: 'var(--radius-sm)', overflow: 'hidden',
                  border: mainImage === i ? '2px solid var(--primary)' : '2px solid transparent'
                }}
              >
                <Image src={img} alt="Thumbnail" width={100} height={100} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="section-kicker" style={{ marginBottom: 'var(--space-md)' }}>{product.category}</div>
          <h1 className="section-title" style={{ marginBottom: 'var(--space-sm)' }}>{product.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--primary)' }}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <del style={{ color: 'var(--on-surface-variant)' }}>{formatPrice(product.originalPrice)}</del>
            )}
            {product.badge && (
              <span className={`badge ${product.badgeType || 'badge-primary'}`}>{product.badge}</span>
            )}
          </div>

          <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: 'var(--space-xl)' }}>
            {product.description}
          </p>

          {/* Specs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)', background: 'var(--surface-container-low)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)' }}>
            {product.dimensions && <div><span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dimensions</span><span style={{ fontWeight: 600 }}>{product.dimensions}</span></div>}
            {product.material && <div><span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Material</span><span style={{ fontWeight: 600 }}>{product.material}</span></div>}
            {product.origin && <div><span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Origin</span><span style={{ fontWeight: 600 }}>{product.origin}</span></div>}
            {product.weaveTime && <div><span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Craft Time</span><span style={{ fontWeight: 600 }}>{product.weaveTime}</span></div>}
          </div>

          <button
            className="btn btn-primary btn-full"
            style={{ padding: '16px', fontSize: '1.1rem', marginBottom: 'var(--space-lg)' }}
            disabled={product.stock === 0}
            onClick={handleAdd}
          >
            {product.stock === 0 ? 'Out of Stock' : added ? '✓ Added to Bag' : 'Add to Bag'}
          </button>

          {/* Reviews */}
          <div style={{ borderTop: '1px solid var(--surface-container-high)', paddingTop: 'var(--space-xl)', marginTop: 'var(--space-xl)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: 'var(--space-lg)' }}>Customer Reviews ({product.reviews.length})</h3>
            {product.reviews.map(r => (
              <div key={r.id} style={{ marginBottom: 'var(--space-md)', paddingBottom: 'var(--space-md)', borderBottom: '1px solid var(--surface-container-low)' }}>
                <div style={{ display: 'flex', gap: '4px', color: '#f59e0b', marginBottom: '4px' }}>
                  {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                </div>
                <p style={{ fontSize: '0.9rem', marginBottom: '6px' }}>&quot;{r.text}&quot;</p>
                <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>— {r.author}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
