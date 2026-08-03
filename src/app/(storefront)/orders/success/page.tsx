import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { PurchasePixelTrack } from '@/components/ui/PurchasePixelTrack';

export default async function SuccessPage({
  searchParams
}: {
  searchParams: Promise<{ order?: string; amount?: string }>
}) {
  const params = await searchParams;
  const orderNumber = params.order || 'HT-2026-0000';
  const amount = Number(params.amount || 0);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #fef9f5 0%, #f5ede4 100%)',
      padding: 'calc(var(--navbar-height) + var(--space-2xl)) var(--space-md) var(--space-3xl)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center'
    }}>
      {/* Meta Pixel: Track Purchase on Thank You Page */}
      <PurchasePixelTrack orderNumber={orderNumber} amount={amount} />

      <div style={{ width: '100%', maxWidth: '580px' }}>

        {/* Card Container */}
        <div style={{
          background: '#fff',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          border: '1px solid var(--outline-variant)'
        }}>

          {/* Top Header */}
          <div style={{
            background: 'linear-gradient(135deg, #5c3d1e, #3d1f00)',
            padding: '32px 24px',
            textAlign: 'center',
            color: '#fef9f5'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🎉</div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 700, margin: '0 0 6px 0' }}>
              Thank You for Your Order!
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#c9a882', margin: 0, letterSpacing: '0.04em' }}>
              Harmukh Threads · Custodians of Kashmiri Craft
            </p>
          </div>

          {/* Payment Verification Pending Banner */}
          <div style={{
            background: '#fef3c7',
            borderBottom: '1px solid #fde047',
            padding: '20px 24px',
            textAlign: 'center'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '6px 16px', borderRadius: '99px', color: '#92400e', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', border: '1px solid #fde047' }}>
              <span>⏳</span>
              <span>Payment Verification Pending</span>
            </div>
            <p style={{ color: '#78350f', fontSize: '0.875rem', margin: 0, lineHeight: 1.6 }}>
              We&apos;ve received your payment notice. Our team is verifying your transaction with our bank. Once confirmed, we will dispatch your handcrafted items.
            </p>
          </div>

          {/* Order Summary Box */}
          <div style={{ padding: '28px 24px' }}>

            <div style={{
              background: 'var(--surface-container-low)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>
                  Order Reference
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginTop: '2px' }}>
                  #{orderNumber}
                </div>
              </div>

              {amount > 0 && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>
                    Amount Paid
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--on-surface)', marginTop: '2px' }}>
                    {formatPrice(amount)}
                  </div>
                </div>
              )}
            </div>

            {/* Next steps timeline */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: '14px' }}>
                What Happens Next?
              </div>

              <div style={{ display: 'flex', gap: '14px', marginBottom: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>✓</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--on-surface)' }}>1. Order Received</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', marginTop: '2px' }}>Your order details have been securely logged into our system.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', marginBottom: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fef3c7', color: '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>⏳</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--on-surface)' }}>2. Payment Verification (Current Step)</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', marginTop: '2px' }}>Our accounts team is verifying your UPI payment. You will receive an official confirmation email upon verification.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--surface-container-high)', color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>3</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--on-surface-variant)' }}>3. Artisan Preparation &amp; Shipping</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', marginTop: '2px' }}>Your item will be quality checked in Srinagar and dispatched with tracking.</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <Link
                href={`/orders/track?order=${orderNumber}`}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '14px', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                🔍 Track Order Status
              </Link>
              <Link
                href="/collections"
                className="btn btn-primary"
                style={{ flex: 1, padding: '14px', justifyContent: 'center', display: 'inline-flex', alignItems: 'center' }}
              >
                Return to Shop →
              </Link>
            </div>

            {/* Need assistance contact strip */}
            <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '20px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
              Need help or have questions about your order?<br />
              Contact us on{' '}
              <a href="https://wa.me/918491006127" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}>
                WhatsApp (+91 84910 06127)
              </a>{' '}
              or email <strong style={{ color: 'var(--on-surface)' }}>harmukhthreads@gmail.com</strong>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
