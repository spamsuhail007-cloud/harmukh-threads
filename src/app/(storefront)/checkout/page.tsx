'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/providers/CartProvider';
import { formatPrice } from '@/lib/utils';
import { createOrder } from '@/actions/orders';

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    setLoading(true);
    setError('');

    const fd = new FormData(e.currentTarget);
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
    setLoading(false);

    if (res.success && res.orderNumber) {
      clear();
      // Redirect to UPI payment page instead of success
      router.push(`/orders/pay?order=${res.orderNumber}&amount=${total}`);
    } else {
      setError(res.error || 'Failed to place order.');
    }
  }

  return (
    <div style={{ background: 'var(--surface-container-lowest)', padding: 'var(--space-2xl) 0' }}>
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: 'var(--space-xl)' }}>Secure Checkout</h1>
        
        <div className="grid-checkout-layout">
          
          <form onSubmit={handleSubmit} id="checkout-form">
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
          </form>

          <aside style={{ background: 'var(--surface-container)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-md)', position: 'sticky', top: '100px' }}>
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
                      <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.8rem' }}>{item.product.category}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 600 }}>{formatPrice(item.product.price * item.qty)}</div>
                </div>
              ))}
            </div>

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
