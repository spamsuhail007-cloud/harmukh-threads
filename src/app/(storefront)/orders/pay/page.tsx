'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { formatPrice } from '@/lib/utils';

// ─── UPI config from env ───────────────────────────────────────────────────
const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || 'yourname@upi';
const UPI_NAME = process.env.NEXT_PUBLIC_UPI_NAME || 'Harmukh Threads';
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || '919000000000';

function buildUpiUrl(amountPaise: number, orderNumber: string) {
  const amountRupees = (amountPaise / 100).toFixed(2);
  const note = `HT-${orderNumber}`;
  return `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=${amountRupees}&cu=INR&tn=${encodeURIComponent(note)}`;
}

function buildQrUrl(upiUrl: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUrl)}&ecc=M&color=3d1f00&bgcolor=fef9f5`;
}

function buildWhatsAppUrl(orderNumber: string, amountPaise: number) {
  const amountRupees = (amountPaise / 100).toLocaleString('en-IN');
  const msg = `Hi! I've paid ₹${amountRupees} for my Harmukh Threads order #${orderNumber} via UPI (${UPI_ID}). Please confirm my order. 🙏`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function PayContent() {
  const params = useSearchParams();
  const router = useRouter();
  const orderNumber = params.get('order') || '';
  const amount = Number(params.get('amount') || 0);

  const upiUrl = buildUpiUrl(amount, orderNumber);
  const qrUrl = buildQrUrl(upiUrl);
  const waUrl = buildWhatsAppUrl(orderNumber, amount);

  const steps = [
    { n: 1, text: 'Open any UPI app on your phone', icon: '📱' },
    { n: 2, text: 'Scan the QR code or tap "Pay Now"', icon: '📷' },
    { n: 3, text: `Send exactly ${formatPrice(amount)}`, icon: '💸' },
    { n: 4, text: 'Add your order number in the note field', icon: '📝' },
    { n: 5, text: 'Tap the WhatsApp button to confirm', icon: '✅' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #fef9f5 0%, #f5ede4 100%)',
      padding: 'var(--space-2xl) var(--space-md)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center'
    }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🧾</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '8px' }}>
            Complete Your Payment
          </h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>
            Order <strong>#{orderNumber}</strong> is reserved for you for <strong>30 minutes</strong>.
            Pay now to confirm.
          </p>
        </div>

        {/* Amount card */}
        <div style={{
          background: 'var(--primary)', color: 'var(--on-primary)',
          borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)',
          textAlign: 'center', marginBottom: 'var(--space-lg)'
        }}>
          <div style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8, marginBottom: '8px' }}>
            Amount to Pay
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 700 }}>
            {formatPrice(amount)}
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '6px' }}>
            Including free shipping · All taxes included
          </div>
        </div>

        {/* QR + Pay Now card */}
        <div style={{
          background: '#fff', borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-md)' }}>
            Scan with any UPI app
          </div>

          {/* QR Code */}
          <div style={{
            display: 'inline-block', padding: '12px',
            border: '2px solid var(--outline-variant)',
            borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)',
            background: '#fef9f5'
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt="UPI QR Code"
              width={200}
              height={200}
              style={{ display: 'block' }}
            />
          </div>

          {/* UPI ID */}
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '4px' }}>UPI ID</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'var(--surface-container-low)', padding: '8px 16px',
              borderRadius: '99px', fontWeight: 700, fontFamily: 'monospace', fontSize: '1rem'
            }}>
              {UPI_ID}
              <button
                onClick={() => navigator.clipboard.writeText(UPI_ID)}
                title="Copy UPI ID"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--primary)' }}
              >📋</button>
            </div>
          </div>

          {/* Deep link for mobile */}
          <a
            href={upiUrl}
            style={{
              display: 'block', padding: '14px',
              background: 'var(--primary)', color: 'var(--on-primary)',
              borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '1.05rem',
              textDecoration: 'none', marginBottom: '10px',
              transition: 'opacity 0.2s'
            }}
          >
            📱 Open UPI App to Pay
          </a>
          <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
            Tap above on your phone to auto-open your UPI app with the amount pre-filled
          </p>
        </div>

        {/* Instructions */}
        <div style={{
          background: '#fff', borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
        }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', marginBottom: 'var(--space-md)', fontWeight: 700 }}>
            How to pay
          </h3>
          {steps.map(s => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                background: 'var(--surface-container-low)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)'
              }}>{s.n}</div>
              <div style={{ paddingTop: '4px', fontSize: '0.9rem', color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>
                {s.icon} {s.text}
              </div>
            </div>
          ))}
        </div>

        {/* Important note */}
        <div style={{
          background: '#fef9c3', border: '1px solid #fde047',
          borderRadius: 'var(--radius-md)', padding: 'var(--space-md)',
          marginBottom: 'var(--space-lg)', fontSize: '0.85rem', color: '#713f12'
        }}>
          <strong>Important:</strong> Please mention <strong>#{orderNumber}</strong> in the UPI payment note/remarks. This helps us match your payment to your order instantly.
        </div>

        {/* WhatsApp CTA */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px', padding: '16px',
            background: '#25D366', color: '#fff',
            borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '1.05rem',
            textDecoration: 'none', marginBottom: 'var(--space-md)',
            boxShadow: '0 4px 16px rgba(37,211,102,0.35)',
            transition: 'transform 0.15s, box-shadow 0.15s'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          I've Paid — Notify via WhatsApp
        </a>

        <button
          onClick={() => router.push('/')}
          style={{
            width: '100%', padding: '12px', background: 'none',
            border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-md)',
            cursor: 'pointer', color: 'var(--on-surface-variant)', fontSize: '0.9rem'
          }}
        >
          Return to Homepage
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: 'var(--space-lg)' }}>
          Having trouble? Contact us at{' '}
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} style={{ color: 'var(--primary)' }}>
            WhatsApp
          </a>{' '}
          and we'll help you complete your order.
        </p>
      </div>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center' }}>Loading payment…</div>}>
      <PayContent />
    </Suspense>
  );
}
