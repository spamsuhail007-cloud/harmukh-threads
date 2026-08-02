'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/components/providers/CartProvider';
import { formatPrice, optimizeCloudinaryUrl } from '@/lib/utils';
import { type Product } from '@prisma/client';

// ── Facebook Pixel helpers ──────────────────────────────────────────────────
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq?: (...args: any[]) => void;
  }
}

function fbEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', event, data);
  }
}

// ── Card ───────────────────────────────────────────────────────────────────
export function SaleProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const isOOS = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const cartProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    price: product.price,
    images: product.images,
    stock: product.stock,
    minOrderQty: product.minOrderQty ?? undefined,
  };

  function handleAddToCart() {
    if (isOOS) return;
    setAdding(true);
    add(cartProduct);
    // FB: AddToCart event
    fbEvent('AddToCart', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      content_category: product.category,
      value: product.price,
      currency: 'INR',
    });
    setTimeout(() => setAdding(false), 800);
  }

  function handleBuyNow() {
    if (isOOS) return;
    add(cartProduct);
    // FB: InitiateCheckout event
    fbEvent('InitiateCheckout', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: product.price,
      currency: 'INR',
      num_items: 1,
    });
    router.push('/checkout');
  }

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid #e5e2db',
      boxShadow: '0 2px 12px rgba(44,38,34,0.06)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* ── Clickable Image ─────────────────────────── */}
      <Link
        href={`/products/${product.slug}`}
        style={{ display: 'block', position: 'relative', aspectRatio: '1/1', overflow: 'hidden', background: '#f0eee7' }}
        onClick={() =>
          fbEvent('ViewContent', {
            content_ids: [product.id],
            content_name: product.name,
            content_type: 'product',
            value: product.price,
            currency: 'INR',
          })
        }
      >
        <Image
          src={optimizeCloudinaryUrl(product.images[0])}
          alt={product.name}
          fill
          style={{ objectFit: 'cover', transition: 'transform 0.35s ease' }}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Badges */}
        {isOOS && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(28,28,24,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Sold Out
            </span>
          </div>
        )}
        {isLowStock && !isOOS && (
          <span style={{
            position: 'absolute', bottom: 10, left: 10,
            background: '#f59e0b', color: '#fff',
            fontSize: '0.7rem', fontWeight: 700,
            padding: '4px 10px', borderRadius: '99px',
          }}>
            Only {product.stock} left!
          </span>
        )}
        {product.badge && !isOOS && (
          <span style={{
            position: 'absolute', top: 10, left: 10,
            background: '#9b4000', color: '#fff',
            fontSize: '0.7rem', fontWeight: 700,
            padding: '4px 10px', borderRadius: '99px',
          }}>
            {product.badge}
          </span>
        )}
      </Link>

      {/* ── Body ───────────────────────────────────── */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#765a24' }}>
          {product.category}
        </div>

        {/* Name → product page */}
        <Link
          href={`/products/${product.slug}`}
          style={{ textDecoration: 'none' }}
          onClick={() =>
            fbEvent('ViewContent', {
              content_ids: [product.id],
              content_name: product.name,
              content_type: 'product',
              value: product.price,
              currency: 'INR',
            })
          }
        >
          <h3 style={{
            fontFamily: 'var(--font-serif, serif)',
            fontSize: '0.95rem', fontWeight: 700,
            color: '#1c1c18', lineHeight: 1.3, margin: 0,
          }}>
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 700, color: '#9b4000', fontSize: '1rem' }}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <del style={{ fontSize: '0.8rem', color: '#8b7266' }}>
              {formatPrice(product.originalPrice)}
            </del>
          )}
        </div>

        {/* Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {'★★★★★'.split('').map((s, i) => (
            <span key={i} style={{ color: '#f59e0b', fontSize: '0.7rem' }}>{s}</span>
          ))}
          <span style={{ fontSize: '0.65rem', color: '#8b7266', marginLeft: '2px' }}>Artisan Made</span>
        </div>

        {/* ── Buttons ─────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
          {/* Buy Now */}
          <button
            onClick={handleBuyNow}
            disabled={isOOS}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              background: isOOS ? '#e5e2db' : 'linear-gradient(135deg, #9b4000, #c25303)',
              color: isOOS ? '#8b7266' : '#fff',
              border: 'none', borderRadius: '10px',
              padding: '11px 12px',
              fontWeight: 700, fontSize: '0.82rem',
              cursor: isOOS ? 'not-allowed' : 'pointer',
              letterSpacing: '0.02em',
              width: '100%',
            }}
          >
            ⚡ Buy Now
          </button>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={isOOS || adding}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              background: 'transparent',
              color: isOOS ? '#8b7266' : '#9b4000',
              border: `1.5px solid ${isOOS ? '#e5e2db' : '#9b4000'}`,
              borderRadius: '10px',
              padding: '10px 12px',
              fontWeight: 600, fontSize: '0.82rem',
              cursor: isOOS ? 'not-allowed' : 'pointer',
              width: '100%',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              if (!isOOS) {
                (e.currentTarget as HTMLButtonElement).style.background = '#fff5f0';
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            {adding ? '✓ Added!' : isOOS ? 'Out of Stock' : '🛍 Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
