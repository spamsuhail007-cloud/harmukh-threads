'use client';
import { useState, useTransition } from 'react';
import { updateOrderStatus } from '@/actions/orders';
import { type Order, type OrderItem } from '@prisma/client';
import { formatPrice } from '@/lib/utils';

type OrderWithItems = Order & { items: OrderItem[] };

const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || 'yourname@upi';
const UPI_NAME = process.env.NEXT_PUBLIC_UPI_NAME || 'Harmukh Threads';

function buildUpiUrl(amountRupees: number, orderNumber: string) {
  const amountStr = amountRupees.toFixed(2);
  const note = `HT-${orderNumber}`;
  return `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=${amountStr}&cu=INR&tn=${encodeURIComponent(note)}`;
}

function buildQrUrl(upiUrl: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}&ecc=M&color=3d1f00&bgcolor=fef9f5`;
}

export function OrderRow({ order }: { order: OrderWithItems }) {
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleStatus = (status: string) => {
    startTransition(() => {
      updateOrderStatus(order.id, status);
    });
  };

  const statusBadge = (s: string) => {
    switch (s) {
      case 'PENDING': return 'badge-warn';
      case 'CONFIRMED': return 'badge-primary';
      case 'SHIPPED': return 'badge-secondary';
      case 'DELIVERED': return 'badge-success';
      case 'CANCELLED': return 'badge-error';
      default: return 'badge-secondary';
    }
  };

  const upiUrl = buildUpiUrl(order.total, order.orderNumber);
  const qrUrl = buildQrUrl(upiUrl);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <tr style={{ cursor: 'pointer' }} onClick={() => setExpanded(v => !v)}>
        <td className="name-col">
          <span style={{ marginRight: 6 }}>{expanded ? '▼' : '▶'}</span>
          {order.orderNumber}
        </td>
        <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
        <td>
          <div style={{ fontWeight: 600 }}>{order.firstName} {order.lastName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>{order.city}, {order.country}</div>
        </td>
        <td className="msg-col" style={{ maxWidth: '200px' }}>
          {order.items.map(i => `${i.qty}× ${i.name}`).join(', ')}
        </td>
        <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{formatPrice(order.total)}</td>
        <td>
          <span className={`badge ${statusBadge(order.status)}`}>{order.status}</span>
        </td>
        <td onClick={e => e.stopPropagation()}>
          <select
            style={{ padding: '4px', fontSize: '0.75rem', borderRadius: '4px' }}
            value={order.status}
            onChange={(e) => handleStatus(e.target.value)}
            disabled={isPending}
          >
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={7} style={{ background: 'var(--surface-container-lowest)', padding: '0' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '1px',
              background: 'var(--outline-variant)',
              borderTop: '2px solid var(--primary)',
            }}>

              {/* ── Customer Contact Details ── */}
              <div style={{ background: 'var(--surface-container-low)', padding: '16px 20px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)', marginBottom: '12px' }}>
                  📋 Customer Details
                </div>
                <InfoRow label="Full Name" value={`${order.firstName} ${order.lastName}`} />
                <InfoRow label="Email" value={order.email} isLink={`mailto:${order.email}`} />
                <InfoRow label="Phone" value={order.phone} isLink={`tel:${order.phone}`} />
                <InfoRow label="Address" value={order.address} />
                <InfoRow label="City" value={order.city} />
                <InfoRow label="Pincode" value={order.pincode} />
                <InfoRow label="Country" value={order.country} />
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <a
                    href={`mailto:${order.email}`}
                    style={{ fontSize: '0.75rem', padding: '5px 12px', background: 'var(--primary)', color: 'var(--on-primary)', borderRadius: '99px', textDecoration: 'none', fontWeight: 600 }}
                  >
                    ✉️ Email
                  </a>
                  <a
                    href={`tel:${order.phone}`}
                    style={{ fontSize: '0.75rem', padding: '5px 12px', background: '#25D366', color: '#fff', borderRadius: '99px', textDecoration: 'none', fontWeight: 600 }}
                  >
                    📞 Call
                  </a>
                  <a
                    href={`https://wa.me/91${order.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.75rem', padding: '5px 12px', background: '#25D366', color: '#fff', borderRadius: '99px', textDecoration: 'none', fontWeight: 600 }}
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>

              {/* ── Order Items ── */}
              <div style={{ background: 'var(--surface-container-low)', padding: '16px 20px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)', marginBottom: '12px' }}>
                  🛍️ Order Items
                </div>
                {order.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt="" width={40} height={50} style={{ objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>Qty: {item.qty} × {formatPrice(item.price)}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)', flexShrink: 0 }}>{formatPrice(item.price * item.qty)}</div>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '10px', marginTop: '4px' }}>
                  <InfoRow label="Subtotal" value={formatPrice(order.subtotal)} />
                  <InfoRow label="Shipping" value={order.shipping === 0 ? 'Free' : formatPrice(order.shipping)} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontWeight: 700, fontSize: '1rem', color: 'var(--primary)' }}>
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <InfoRow label="Payment Method" value={order.paymentMethod} />
                  <InfoRow label="Payment Status" value={order.paymentStatus} />
                  <InfoRow label="Order Date" value={new Date(order.createdAt).toLocaleString('en-IN')} />
                </div>
              </div>

              {/* ── UPI Payment Details ── */}
              <div style={{ background: 'var(--surface-container-low)', padding: '16px 20px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)', marginBottom: '12px' }}>
                  💳 UPI Payment Info
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrUrl} alt="UPI QR" width={90} height={90} style={{ borderRadius: '6px', border: '1px solid var(--outline-variant)', background: '#fef9f5', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '2px' }}>UPI ID</div>
                    <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.85rem', wordBreak: 'break-all' }}>{UPI_ID}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '6px', marginBottom: '2px' }}>Amount Due</div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary)' }}>{formatPrice(order.total)}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '4px' }}>Ref: HT-{order.orderNumber}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <button
                    onClick={() => handleCopy(UPI_ID)}
                    style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', borderRadius: '99px', cursor: 'pointer' }}
                  >
                    {copied ? '✅ Copied!' : '📋 Copy UPI ID'}
                  </button>
                  <button
                    onClick={() => handleCopy(upiUrl)}
                    style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', borderRadius: '99px', cursor: 'pointer' }}
                  >
                    🔗 Copy Payment Link
                  </button>
                </div>

                <div style={{ fontSize: '0.75rem', background: '#fef9c3', border: '1px solid #fde047', borderRadius: '6px', padding: '8px 10px', color: '#713f12', lineHeight: 1.5 }}>
                  <strong>To send payment request to customer:</strong><br />
                  Share UPI ID <strong>{UPI_ID}</strong> and ask them to pay <strong>{formatPrice(order.total)}</strong> with note <strong>HT-{order.orderNumber}</strong>.
                </div>

                {order.notes && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--on-surface-variant)', marginBottom: '4px' }}>Notes</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>{order.notes}</div>
                  </div>
                )}
              </div>

            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function InfoRow({ label, value, isLink }: { label: string; value: string; isLink?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px', gap: '8px' }}>
      <span style={{ fontSize: '0.72rem', color: 'var(--on-surface-variant)', flexShrink: 0 }}>{label}</span>
      {isLink ? (
        <a href={isLink} style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--primary)', textDecoration: 'none', textAlign: 'right', wordBreak: 'break-all' }}>{value}</a>
      ) : (
        <span style={{ fontSize: '0.82rem', fontWeight: 500, textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
      )}
    </div>
  );
}
