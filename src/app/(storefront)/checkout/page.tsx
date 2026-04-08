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
      router.push(`/orders/success?order=${res.orderNumber}`);
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
            
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: 'var(--space-lg)', marginTop: 'var(--space-xl)' }}>Payment Method</h2>
            <div style={{ padding: 'var(--space-md)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-md)', background: 'var(--primary-fixed)', marginBottom: 'var(--space-xl)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', cursor: 'pointer', fontWeight: 600, color: 'var(--primary)' }}>
                <input type="radio" name="paymentMethod" value="COD" defaultChecked style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} />
                Cash on Delivery (Pay at your doorstep)
              </label>
            </div>

            {error && <div className="form-error" style={{ marginBottom: 'var(--space-md)' }}>{error}</div>}

            <button type="submit" className="btn btn-primary btn-full" style={{ padding: '16px', fontSize: '1.1rem' }} disabled={loading}>
              {loading ? 'Processing...' : `Place Order — ${formatPrice(total)}`}
            </button>
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
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)', color: 'var(--on-surface-variant)' }}>
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--surface-container-high)', fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--on-surface)' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>{formatPrice(total)}</span>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
