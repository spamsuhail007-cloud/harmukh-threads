import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/actions/products';
import { formatPrice } from '@/lib/utils';
import { SaleProductCard } from './SaleProductCard';

export const revalidate = 120;

const WA_NUMBER = '918491006127';

function waLink(message: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ─── Page ─────────────────────────────────────────────────────────────────
export default async function SaleLandingPage() {
  const products = await getProducts();
  const activeProducts = products.filter(p => p.stock > 0);
  const displayProducts = activeProducts.length > 0 ? activeProducts : products;

  const mainWaMsg = "Hi! I saw your ad and I'm interested in your Kashmiri handcrafted pieces. Can you help me? 🙏";

  return (
    <div style={{ fontFamily: 'var(--font-sans, sans-serif)', color: '#1c1c18' }}>

      {/* ── Top Trust Bar ───────────────────────────────────────── */}
      <div style={{
        background: '#1c1c18',
        color: '#ffb692',
        textAlign: 'center',
        padding: '10px 16px',
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>
        ✦ Free Shipping Across India &nbsp;·&nbsp; Every Piece Hand-Inspected &nbsp;·&nbsp; Direct from Kashmir Artisans ✦
      </div>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(160deg, #1c1c18 0%, #3a2a20 55%, #9b4000 100%)',
        color: '#fcf9f2',
        padding: 'clamp(3rem, 8vw, 5rem) 1.25rem clamp(2.5rem, 7vw, 4rem)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circle */}
        <div style={{
          position: 'absolute', right: '-80px', top: '-80px',
          width: '360px', height: '360px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(155,64,0,0.4) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', left: '-60px', bottom: '-60px',
          width: '280px', height: '280px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(118,90,36,0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px', margin: '0 auto' }}>
          {/* Pill badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,219,203,0.12)', border: '1px solid rgba(255,182,146,0.3)',
            borderRadius: '99px', padding: '6px 18px', marginBottom: '1.5rem',
          }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#ffb692' }}>
              🪡 Handcrafted in Kashmir — Since Generations
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-serif, serif)',
            fontSize: 'clamp(2rem, 6vw, 3.8rem)',
            fontWeight: 700, lineHeight: 1.15,
            marginBottom: '1.25rem', color: '#ffffff',
          }}>
            Transform Your Home with<br />
            <em style={{ color: '#ffb692', fontStyle: 'italic' }}>Authentic Kashmiri Craftsmanship</em>
          </h1>

          <p style={{
            fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
            color: 'rgba(252,249,242,0.78)', lineHeight: 1.75,
            maxWidth: '560px', margin: '0 auto 2rem',
          }}>
            Hand-knotted rugs and cushion covers woven by master artisans — each piece personally checked for quality before it leaves our hands.
          </p>

          {/* Hero CTAs */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={waLink(mainWaMsg)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#25D366', color: '#fff',
                padding: '14px 28px', borderRadius: '12px',
                fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
            <Link
              href="/collections"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(255,255,255,0.1)', color: '#fcf9f2',
                border: '1px solid rgba(255,255,255,0.25)',
                padding: '14px 24px', borderRadius: '12px',
                fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
              }}
            >
              Browse All Products →
            </Link>
          </div>

          {/* Micro trust */}
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {['🔒 Secure Payments', '🚚 Free Shipping', '✦ Quality Inspected', '🤝 1,200+ Artisan Families'].map(t => (
              <span key={t} style={{ fontSize: '0.75rem', color: 'rgba(252,249,242,0.6)', fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Social Proof Strip ──────────────────────────────────── */}
      <div style={{
        background: '#fff5f0', borderTop: '1px solid #dfc0b3', borderBottom: '1px solid #dfc0b3',
        padding: '18px 24px',
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {'★★★★★'.split('').map((s, i) => <span key={i} style={{ color: '#f59e0b', fontSize: '1rem' }}>{s}</span>)}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1c1c18' }}>4.9 / 5</span>
            <span style={{ fontSize: '0.8rem', color: '#574238' }}>· 200+ happy customers</span>
          </div>
          <div style={{ width: '1px', height: '20px', background: '#dfc0b3' }} />
          <span style={{ fontSize: '0.8rem', color: '#574238', fontWeight: 500 }}>🏆 Trusted by homes across India, UAE & UK</span>
          <div style={{ width: '1px', height: '20px', background: '#dfc0b3' }} />
          <span style={{ fontSize: '0.8rem', color: '#574238', fontWeight: 500 }}>📦 Same-day dispatch on most orders</span>
        </div>
      </div>

      {/* ── Product Grid ─────────────────────────────────────────── */}
      <div style={{ padding: 'clamp(2rem, 6vw, 4rem) 1.25rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9b4000', marginBottom: '8px' }}>
            Our Collection
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, color: '#1c1c18', marginBottom: '8px' }}>
            Handpicked for Your Home
          </h2>
          <p style={{ color: '#574238', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '520px', margin: '0 auto' }}>
            Every piece below is hand-knotted or hand-stitched by Kashmiri master weavers — no two are exactly alike.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(150px, 44vw, 260px), 1fr))',
          gap: 'clamp(12px, 3vw, 20px)',
        }}>
          {displayProducts.map(product => (
            <SaleProductCard key={product.id} product={product} />
          ))}
        </div>

        {displayProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#574238' }}>
            <p>Loading our collection... <a href={waLink(mainWaMsg)} style={{ color: '#9b4000' }}>WhatsApp us</a> for a personal catalogue.</p>
          </div>
        )}
      </div>

      {/* ── Why Harmukh Threads ─────────────────────────────────── */}
      <div style={{ background: '#f0eee7', padding: 'clamp(2.5rem, 7vw, 4.5rem) 1.25rem' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9b4000', marginBottom: '8px' }}>
              The Harmukh Difference
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 700, color: '#1c1c18' }}>
              Why Thousands Choose Us
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {[
              {
                icon: '🧵',
                title: 'Authentic Artisan Craft',
                desc: 'Every piece is hand-knotted or hand-stitched by skilled craftsmen from the Kashmir valley — no machine imitations, ever.',
              },
              {
                icon: '🔍',
                title: 'Personally Inspected',
                desc: 'Before any order ships, our team inspects every piece for weave quality, colour consistency, and finishing. What reaches you is perfect.',
              },
              {
                icon: '🚚',
                title: 'Free Shipping, PAN India',
                desc: 'We deliver free across India, right to your door. Your piece is carefully packed to protect it during transit.',
              },
              {
                icon: '💬',
                title: 'Personal WhatsApp Support',
                desc: 'Have a question about size, colour, or material? Chat with us directly on WhatsApp before you decide — no bots, real people.',
              },
            ].map(item => (
              <div key={item.title} style={{
                background: '#ffffff', borderRadius: '14px',
                padding: '1.5rem', border: '1px solid #dfc0b3',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{item.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.05rem', fontWeight: 700, color: '#1c1c18', marginBottom: '8px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#574238', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Testimonials ────────────────────────────────────────── */}
      <div style={{ padding: 'clamp(2.5rem, 7vw, 4.5rem) 1.25rem', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 700, color: '#1c1c18' }}>
            What Our Customers Say
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {[
            {
              name: 'Priya S.',
              location: 'Mumbai',
              review: 'Absolutely stunning rug — the colours are even richer in person. Arrived beautifully packed. Will definitely order again!',
              product: 'Hand-knotted Rug',
            },
            {
              name: 'Arjun M.',
              location: 'Bengaluru',
              review: 'Ordered cushion covers as a housewarming gift. The recipient was so impressed. The craftsmanship is unlike anything from a regular store.',
              product: 'Cushion Covers Set',
            },
            {
              name: 'Fatima K.',
              location: 'Dubai, UAE',
              review: 'The WhatsApp support was so helpful — they sent me extra photos and helped me pick the right size. Shipped surprisingly fast too.',
              product: 'Hand-knotted Rug',
            },
          ].map(t => (
            <div key={t.name} style={{
              background: '#ffffff', borderRadius: '14px',
              padding: '1.5rem', border: '1px solid #e5e2db',
              boxShadow: '0 2px 8px rgba(44,38,34,0.04)',
            }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
                {'★★★★★'.split('').map((s, i) => <span key={i} style={{ color: '#f59e0b', fontSize: '0.9rem' }}>{s}</span>)}
              </div>
              <p style={{ fontSize: '0.875rem', color: '#574238', lineHeight: 1.7, margin: '0 0 14px', fontStyle: 'italic' }}>
                &ldquo;{t.review}&rdquo;
              </p>
              <div style={{ borderTop: '1px solid #f0eee7', paddingTop: '12px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1c1c18' }}>{t.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#8b7266' }}>{t.location} · {t.product}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scarcity Block ──────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #1c1c18, #3a2a20)',
        color: '#fcf9f2',
        padding: 'clamp(2.5rem, 7vw, 4rem) 1.25rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🪡</div>
          <h2 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>
            Hand-crafted in Limited Batches
          </h2>
          <p style={{ color: 'rgba(252,249,242,0.75)', lineHeight: 1.75, marginBottom: '2rem', fontSize: '0.95rem' }}>
            Each rug and cushion cover takes days to weeks to weave by hand. We do not mass-produce. Once a piece is sold, there may not be another like it — order before it&rsquo;s gone.
          </p>
          <a
            href={waLink(mainWaMsg)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: '#25D366', color: '#fff',
              padding: '16px 36px', borderRadius: '12px',
              fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(37,211,102,0.4)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Enquire Now on WhatsApp
          </a>
          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'rgba(252,249,242,0.5)' }}>
            We reply within minutes · Mon–Sat, 9am–8pm IST
          </p>
        </div>
      </div>

      {/* ── Minimal Footer ──────────────────────────────────────── */}
      <div style={{ background: '#1c1c18', padding: '1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '10px' }}>
          <Link href="/" style={{ fontSize: '0.75rem', color: 'rgba(252,249,242,0.5)', textDecoration: 'none' }}>Home</Link>
          <Link href="/collections" style={{ fontSize: '0.75rem', color: 'rgba(252,249,242,0.5)', textDecoration: 'none' }}>Shop</Link>
          <Link href="/returns" style={{ fontSize: '0.75rem', color: 'rgba(252,249,242,0.5)', textDecoration: 'none' }}>Policy</Link>
          <Link href="/privacy" style={{ fontSize: '0.75rem', color: 'rgba(252,249,242,0.5)', textDecoration: 'none' }}>Privacy</Link>
          <Link href="/contact" style={{ fontSize: '0.75rem', color: 'rgba(252,249,242,0.5)', textDecoration: 'none' }}>Contact</Link>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'rgba(252,249,242,0.3)', margin: 0 }}>
          © {new Date().getFullYear()} Harmukh Threads. Handcrafted in Kashmir.
        </p>
      </div>

    </div>
  );
}
