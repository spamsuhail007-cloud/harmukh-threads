import { db } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const STATUS_STEPS = [
  { key: 'PENDING',    label: 'Order Placed',  icon: '📋' },
  { key: 'CONFIRMED',  label: 'Confirmed',      icon: '✅' },
  { key: 'PROCESSING', label: 'Processing',     icon: '🔨' },
  { key: 'SHIPPED',    label: 'Shipped',         icon: '🚚' },
  { key: 'DELIVERED',  label: 'Delivered',       icon: '🏠' },
];

const STATUS_ORDER = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

function OrderTimeline({ status }: { status: string }) {
  const currentIdx = STATUS_ORDER.indexOf(status);
  const isCancelled = status === 'CANCELLED';

  return (
    <div className="track-timeline">
      {STATUS_STEPS.map((step, i) => {
        const done = !isCancelled && i <= currentIdx;
        const active = !isCancelled && i === currentIdx;
        return (
          <div key={step.key} className={`track-step${done ? ' done' : ''}${active ? ' active' : ''}`}>
            <div className="track-step-icon">
              {done ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <span>{step.icon}</span>
              )}
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`track-connector${done && i < currentIdx ? ' done' : ''}`} />
            )}
            <div className="track-step-label">{step.label}</div>
          </div>
        );
      })}
      {isCancelled && (
        <div className="track-cancelled-note">This order has been cancelled.</div>
      )}
    </div>
  );
}

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; order?: string }>;
}) {
  const params = await searchParams;
  const email = params.email?.trim().toLowerCase() || '';
  const orderNumber = params.order?.trim().toUpperCase() || '';

  let order = null;
  let notFoundError = false;

  if (email && orderNumber) {
    order = await db.order.findFirst({
      where: { email: { equals: email, mode: 'insensitive' }, orderNumber },
      include: { items: true },
    });
    if (!order) notFoundError = true;
  }

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  return (
    <div className="track-root">
      <div className="container track-container">
        {/* Header */}
        <div className="track-header">
          <h1 className="track-title">Track Your Order</h1>
          <p className="track-subtitle">
            Enter your email and order number to see the latest status of your order.
          </p>
        </div>

        {/* Search form */}
        <form method="GET" action="/orders/track" className="track-form">
          <div className="track-form-grid">
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="track-email">Email Address</label>
              <input
                id="track-email"
                className="form-input"
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                defaultValue={email}
                autoComplete="email"
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="track-order">Order Number</label>
              <input
                id="track-order"
                className="form-input"
                type="text"
                name="order"
                required
                placeholder="e.g. HT-2026-0001"
                defaultValue={orderNumber}
                style={{ textTransform: 'uppercase' }}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary track-submit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Track Order
          </button>
        </form>

        {/* Not found error */}
        {notFoundError && (
          <div className="track-error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            No order found with that email and order number. Please double-check and try again.
          </div>
        )}

        {/* Order result */}
        {order && (
          <div className="track-result">
            {/* Status banner */}
            <div className="track-status-banner">
              <div>
                <div className="track-order-num">Order #{order.orderNumber}</div>
                <div className="track-placed-on">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
              <span className={`badge badge-${
                order.status === 'DELIVERED' ? 'gi' :
                order.status === 'SHIPPED' ? 'new' :
                order.status === 'CANCELLED' ? 'sale' : 'secondary'
              }`}>
                {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
              </span>
            </div>

            {/* Timeline */}
            <OrderTimeline status={order.status} />

            {/* Items */}
            <div className="track-section">
              <h2 className="track-section-title">Items Ordered</h2>
              <div className="track-items">
                {order.items.map(item => (
                  <div key={item.id} className="track-item">
                    <div className="track-item-img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="track-item-info">
                      <div className="track-item-name">{item.name}</div>
                      <div className="track-item-meta">
                        Qty: {item.qty} · {formatPrice(item.price)} each
                      </div>
                    </div>
                    <div className="track-item-total">{formatPrice(item.price * item.qty)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals + Address */}
            <div className="track-footer-grid">
              <div className="track-section">
                <h2 className="track-section-title">Delivery Address</h2>
                <div className="track-address">
                  {order.firstName} {order.lastName}<br />
                  {order.address}<br />
                  {order.city}, {order.pincode}<br />
                  {order.country}
                </div>
              </div>
              <div className="track-section">
                <h2 className="track-section-title">Order Summary</h2>
                <div className="track-summary-row">
                  <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="track-summary-row">
                  <span>Shipping</span><span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
                </div>
                <div className="track-summary-row track-summary-total">
                  <span>Total</span><span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="track-help">
              <span>Need help with your order?</span>
              <Link href="/contact" className="track-help-link">Contact Us →</Link>
            </div>
          </div>
        )}

        {/* No query yet — show help tips */}
        {!email && !orderNumber && (
          <div className="track-tips">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <p>Your order number was shown on the confirmation page and in your confirmation email.</p>
            <p>It looks like <strong>HT-2026-XXXX</strong>.</p>
          </div>
        )}
      </div>
    </div>
  );
}
