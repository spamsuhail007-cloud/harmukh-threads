import Link from 'next/link';

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const params = await searchParams;
  const orderNumber = params.order || 'HT-2026-0000';

  return (
    <div className="success-wrap">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h1>Order Confirmed</h1>
        <p>
          Thank you for choosing Harmukh Threads. Your order has been placed and is currently being processed.
          We will reach out to you shortly to confirm delivery details.
        </p>
        <div className="success-order-id">
          Order Number: <strong>{orderNumber}</strong>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href={`/orders/track?order=${orderNumber}`}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Track Order
          </Link>
          <Link href="/" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
