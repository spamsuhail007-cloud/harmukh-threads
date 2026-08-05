'use client';
import { useState, FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/providers/CartProvider';
import { formatPrice } from '@/lib/utils';
import { createOrder } from '@/actions/orders';
import { saveAbandonedCart } from '@/actions/abandonedCarts';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { executeRecaptcha } = useGoogleReCaptcha();
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq && items.length > 0) {
      (window as any).fbq('track', 'InitiateCheckout', {
        content_ids: items.map(i => i.product.id),
        content_type: 'product',
        num_items: items.reduce((s, i) => s + i.qty, 0),
        value: total,
        currency: 'INR'
      });
    }
  }, []);

  const triggerDebouncedAutoSave = () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const formEl = document.getElementById('checkout-form') as HTMLFormElement | null;
      if (!formEl) return;
      const fd = new FormData(formEl);
      const firstName = (fd.get('firstName') as string || '').trim();
      const lastName  = (fd.get('lastName') as string || '').trim();
      const email     = (fd.get('email') as string || '').trim();
      const phone     = (fd.get('phone') as string || '').trim();
      const address   = (fd.get('address') as string || '').trim();
      const city      = (fd.get('city') as string || '').trim();
      const pincode   = (fd.get('pincode') as string || '').trim();

      if (!phone && !email) return;

      let sessionId = typeof window !== 'undefined' ? sessionStorage.getItem('ht_checkout_session') : null;
      if (!sessionId && typeof window !== 'undefined') {
        sessionId = `ac_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        sessionStorage.setItem('ht_checkout_session', sessionId);
      }

      saveAbandonedCart({
        sessionId: sessionId || undefined,
        firstName: firstName || 'Prospect',
        lastName,
        email,
        phone,
        address,
        city,
        pincode,
        items: items.map(i => ({
          name: i.product.name,
          image: i.product.images[0],
          price: i.product.price,
          qty: i.qty,
        })),
        total,
      }).catch(err => console.error('Failed to auto-save abandoned cart lead:', err));
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: 'var(--space-3xl) 0', textAlign: 'center' }}>
        <h1 className="section-title" style={{ marginBottom: 'var(--space-md)' }}>Checkout</h1>
        <p style={{ color: 'var(--on-surface-variant)', marginBottom: 'var(--space-xl)' }}>Your bag is empty.</p>
        <button className="btn btn-primary" onClick={() => router.push('/collections')}>Return to Shop</button>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    const formEl = e.currentTarget;
    setLoading(true);
    setError('');

    try {
      const fd = new FormData(formEl);
      const data = {
        firstName: fd.get('firstName'),
        lastName: fd.get('lastName'),
        email: fd.get('email'),
        phone: fd.get('phone'),
        address: fd.get('address'),
        city: fd.get('city'),
        pincode: fd.get('pincode'),
        paymentMethod: 'UPI',
        items: items.map(i => ({
          productId: i.product.id,
          name: i.product.name,
          image: i.product.images[0],
          price: i.product.price,
          qty: i.qty,
        })),
      };

      const res = await createOrder(data);

      if (res.success && res.orderNumber) {
        clear();
        router.push(`/orders/pay?order=${res.orderNumber}&amount=${total}`);
      } else {
        setError(res.error || 'Failed to place order.');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred placing your order. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div style={{ background: 'var(--surface-container-lowest)', padding: 'var(--space-2xl) 0', paddingTop: 'calc(var(--navbar-height) + var(--space-2xl))' }}>
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: 'var(--space-xl)' }}>Secure Checkout</h1>
        
        <div className="grid-checkout-layout">
          
          <form onSubmit={handleSubmit} id="checkout-form" onChange={triggerDebouncedAutoSave}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: 'var(--space-lg)' }}>Shipping Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">First Name</label>
                <input required type="text" id="firstName" name="firstName" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="lastName">Last Name</label>
                <input required type="text" id="lastName" name="lastName" className="form-input" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input required type="email" id="email" name="email" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="phone">Phone</label>
                <input required type="tel" id="phone" name="phone" className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="address">Address</label>
              <input required type="text" id="address" name="address" className="form-input" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="city">City</label>
                <input required type="text" id="city" name="city" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="pincode">Pincode</label>
                <input required type="text" id="pincode" name="pincode" className="form-input" />
              </div>
            </div>

            {/* Payment info banner */}
            <div style={{
              marginTop: 'var(--space-xl)',
              padding: 'var(--space-md) var(--space-lg)',
              background: 'linear-gradient(135deg, #fef9c3, #fefce8)',
              border: '1px solid #fde047',
              borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              marginBottom: 'var(--space-xl)'
            }}>
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>📱</span>
              <div>
                <div style={{ fontWeight: 700, marginBottom: '4px', color: '#713f12' }}>Pay via UPI after placing order</div>
                <div style={{ fontSize: '0.85rem', color: '#92400e', lineHeight: 1.6 }}>
                  After submitting your details, you'll be taken to a secure UPI payment page.
                  Pay with any UPI app — Google Pay, PhonePe, Paytm, or your bank app.
                  Your order will be confirmed once payment is verified.
                </div>
              </div>
            </div>

            {error && <div className="form-error" style={{ marginBottom: 'var(--space-md)' }}>{error}</div>}

            <button
              type="submit"
              className="btn btn-primary btn-full"
              style={{ padding: '16px', fontSize: '1.1rem' }}
              disabled={loading}
            >
              {loading ? 'Saving order…' : `Continue to Payment — ${formatPrice(total)}`}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--on-surface-variant)', marginTop: '10px' }}>
              🔒 Your information is secure and encrypted
            </p>
            <p style={{ fontSize: '11px', color: '#a08060', textAlign: 'center', marginTop: '16px', lineHeight: '1.4' }}>
              This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'underline'}}>Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'underline'}}>Terms of Service</a> apply.
            </p>
          </form>

          <aside style={{ background: 'var(--surface-container)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-md)' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: 'var(--space-lg)' }}>Order Summary</h2>
            <div style={{ marginBottom: 'var(--space-xl)' }}>
              {items.map(item => (
                <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={item.product.images[0]} alt="" style={{ width: 48, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                      <span style={{ position: 'absolute', top: -6, right: -6, background: 'var(--on-surface-variant)', color: '#fff', fontSize: '0.65rem', padding: '1px 6px', borderRadius: '10px' }}>{item.qty}</span>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{item.product.name}</div>
                      <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.8rem' }}>
                        {item.product.category}
                        {(((item.product as any).minOrderQty && (item.product as any).minOrderQty > 1) || item.product.category === 'Cushion Covers') && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600, display: 'block', marginTop: '2px' }}>
                            Min. Order Qty: {(item.product as any).minOrderQty || (item.product.category === 'Cushion Covers' ? 2 : 1)} pcs
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 600 }}>{formatPrice(item.product.price * item.qty)}</div>
                </div>
              ))}
            </div>

            {items.some(i => ((i.product as any).minOrderQty && (i.product as any).minOrderQty > 1) || i.product.category === 'Cushion Covers') && (
              <div style={{
                background: 'var(--primary-fixed)',
                color: 'var(--primary)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 600,
                marginBottom: 'var(--space-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ fontSize: '0.9rem' }}>ℹ️</span>
                <span>Some items in your order have a minimum order quantity requirement.</span>
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--surface-container-high)', paddingTop: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)', color: 'var(--on-surface-variant)' }}>
                <span>Subtotal</span><span>{formatPrice(total)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)', color: 'var(--on-surface-variant)' }}>
                <span>Shipping</span><span>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--surface-container-high)', fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600 }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>{formatPrice(total)}</span>
              </div>
            </div>

            {/* UPI apps */}
            <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '8px' }}>ACCEPTED PAYMENT</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>📱 All UPI Apps Accepted</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '4px' }}>Google Pay · PhonePe · Paytm · BHIM · Bank UPI</div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
