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
          Thank you for choosing Harmukh Threads. Your order has been placed and is currently being processed. We will send you an email confirmation shortly.
        </p>
        <div className="success-order-id">
          Order Number: <strong>{orderNumber}</strong>
        </div>
        <Link href="/" className="btn btn-primary" style={{ display: 'inline-flex' }}>
          Return to Home
        </Link>
      </div>
    </div>
  );
}
