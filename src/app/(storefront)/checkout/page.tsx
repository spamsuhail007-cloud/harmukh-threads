'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/providers/CartProvider';
import { formatPrice } from '@/lib/utils';
import { createOrder } from '@/actions/orders';
import { saveAbandonedCart } from '@/actions/abandonedCarts';
import { INDIAN_STATES } from '@/data/indianLocations';

type FieldErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  state?: string;
  city?: string;
  pincode?: string;
};

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Form states
  const [selectedState, setSelectedState] = useState('Jammu & Kashmir');
  const [selectedCity, setSelectedCity] = useState('Srinagar');
  const [customCity, setCustomCity] = useState('');
  const [phone, setPhone] = useState('');

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Get available cities for currently selected state
  const availableCities = INDIAN_STATES.find(s => s.state === selectedState)?.cities || [];

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

  // Update default city when state changes
  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const newCities = INDIAN_STATES.find(s => s.state === stateName)?.cities || [];
    setSelectedCity(newCities[0] || 'Other');
    setCustomCity('');
    if (fieldErrors.state) setFieldErrors(prev => ({ ...prev, state: undefined }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);
    if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: undefined }));
  };

  const triggerDebouncedAutoSave = () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const formEl = document.getElementById('checkout-form') as HTMLFormElement | null;
      if (!formEl) return;
      const fd = new FormData(formEl);
      const firstName = (fd.get('firstName') as string || '').trim();
      const lastName  = (fd.get('lastName') as string || '').trim();
      const email     = (fd.get('email') as string || '').trim();
      const rawPhone  = phone.trim();
      const address   = (fd.get('address') as string || '').trim();
      const effectiveCity = selectedCity === 'Other' ? customCity.trim() : selectedCity;
      const pincode   = (fd.get('pincode') as string || '').trim();

      if (!rawPhone && !email) return;

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
        phone: rawPhone ? `+91 ${rawPhone}` : '',
        address: `${address}${selectedState ? `, ${selectedState}` : ''}`,
        city: effectiveCity,
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

  const validateForm = (fd: FormData): FieldErrors => {
    const errs: FieldErrors = {};
    const firstName = (fd.get('firstName') as string || '').trim();
    const lastName  = (fd.get('lastName') as string || '').trim();
    const email     = (fd.get('email') as string || '').trim();
    const address   = (fd.get('address') as string || '').trim();
    const pincode   = (fd.get('pincode') as string || '').trim();
    const effectiveCity = selectedCity === 'Other' ? customCity.trim() : selectedCity;

    if (!firstName || firstName.length < 2) {
      errs.firstName = 'Please enter a valid first name (at least 2 letters)';
    }

    if (!lastName || lastName.length < 1) {
      errs.lastName = 'Please enter your last name';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errs.email = 'Please enter a valid email address (e.g. name@example.com)';
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      errs.phone = 'Please enter a valid 10-digit Indian mobile number (e.g. 8491006127)';
    }

    if (!address || address.length < 5) {
      errs.address = 'Please enter a complete street address (at least 5 characters)';
    }

    if (!selectedState) {
      errs.state = 'Please select your state';
    }

    if (!effectiveCity || effectiveCity.length < 2) {
      errs.city = 'Please select or type your city name';
    }

    const pincodeRegex = /^\d{6}$/;
    if (!pincode || !pincodeRegex.test(pincode)) {
      errs.pincode = 'Please enter a valid 6-digit Indian PIN code';
    }

    return errs;
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);

    // Form validation check
    const validationErrors = validateForm(fd);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError('⚠️ Please fix the highlighted fields in the form to proceed.');
      
      // Scroll smoothly to first invalid field
      const firstKey = Object.keys(validationErrors)[0];
      const el = document.getElementById(firstKey);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
      return;
    }

    setFieldErrors({});
    setLoading(true);
    setError('');

    try {
      const effectiveCity = selectedCity === 'Other' ? customCity.trim() : selectedCity;
      const data = {
        firstName: (fd.get('firstName') as string).trim(),
        lastName: (fd.get('lastName') as string).trim(),
        email: (fd.get('email') as string).trim(),
        phone: `+91${phone.trim()}`,
        address: `${(fd.get('address') as string).trim()}, ${selectedState}`,
        city: effectiveCity,
        pincode: (fd.get('pincode') as string).trim(),
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
          
          <form onSubmit={handleSubmit} id="checkout-form" onChange={triggerDebouncedAutoSave} noValidate>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: 'var(--space-lg)' }}>Shipping Information</h2>
            
            <div className="form-row">
              {/* First Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className={`form-input${fieldErrors.firstName ? ' input-error' : ''}`}
                  placeholder="e.g. Rahul"
                  onChange={() => {
                    if (fieldErrors.firstName) setFieldErrors(prev => ({ ...prev, firstName: undefined }));
                  }}
                />
                {fieldErrors.firstName && (
                  <div style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                    ⚠️ {fieldErrors.firstName}
                  </div>
                )}
              </div>

              {/* Last Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className={`form-input${fieldErrors.lastName ? ' input-error' : ''}`}
                  placeholder="e.g. Sharma"
                  onChange={() => {
                    if (fieldErrors.lastName) setFieldErrors(prev => ({ ...prev, lastName: undefined }));
                  }}
                />
                {fieldErrors.lastName && (
                  <div style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                    ⚠️ {fieldErrors.lastName}
                  </div>
                )}
              </div>
            </div>

            <div className="form-row">
              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input${fieldErrors.email ? ' input-error' : ''}`}
                  placeholder="you@example.com"
                  onChange={() => {
                    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }));
                  }}
                />
                {fieldErrors.email && (
                  <div style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                    ⚠️ {fieldErrors.email}
                  </div>
                )}
              </div>

              {/* Phone Number with +91 Badge */}
              <div className="form-group">
                <label className="form-label" htmlFor="phone">Phone Number (WhatsApp) *</label>
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  <div style={{
                    background: 'var(--surface-container-high)',
                    border: `1px solid ${fieldErrors.phone ? '#dc2626' : 'var(--outline-variant)'}`,
                    borderRight: 'none',
                    borderTopLeftRadius: 'var(--radius-sm)',
                    borderBottomLeftRadius: 'var(--radius-sm)',
                    padding: '0 12px',
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: 'var(--on-surface)',
                    flexShrink: 0
                  }}>
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={handlePhoneChange}
                    className={`form-input${fieldErrors.phone ? ' input-error' : ''}`}
                    placeholder="9876543210"
                    maxLength={10}
                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, height: '46px' }}
                  />
                </div>
                {fieldErrors.phone && (
                  <div style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                    ⚠️ {fieldErrors.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="form-label" htmlFor="address">Street Address / House No. / Landmark *</label>
              <input
                type="text"
                id="address"
                name="address"
                className={`form-input${fieldErrors.address ? ' input-error' : ''}`}
                placeholder="e.g. House No. 42, Malabagh, Near Naseem Bagh"
                onChange={() => {
                  if (fieldErrors.address) setFieldErrors(prev => ({ ...prev, address: undefined }));
                }}
              />
              {fieldErrors.address && (
                <div style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                  ⚠️ {fieldErrors.address}
                </div>
              )}
            </div>

            {/* State & City Dropdowns */}
            <div className="form-row">
              {/* State Dropdown */}
              <div className="form-group">
                <label className="form-label" htmlFor="state">State / UT *</label>
                <select
                  id="state"
                  name="state"
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className={`form-select${fieldErrors.state ? ' input-error' : ''}`}
                  style={{ height: '46px' }}
                >
                  {INDIAN_STATES.map(s => (
                    <option key={s.state} value={s.state}>{s.state}</option>
                  ))}
                </select>
                {fieldErrors.state && (
                  <div style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                    ⚠️ {fieldErrors.state}
                  </div>
                )}
              </div>

              {/* City Dropdown */}
              <div className="form-group">
                <label className="form-label" htmlFor="city">City / District *</label>
                <select
                  id="city"
                  name="city"
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    if (fieldErrors.city) setFieldErrors(prev => ({ ...prev, city: undefined }));
                  }}
                  className={`form-select${fieldErrors.city ? ' input-error' : ''}`}
                  style={{ height: '46px' }}
                >
                  {availableCities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="Other">Other City...</option>
                </select>
                {fieldErrors.city && (
                  <div style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                    ⚠️ {fieldErrors.city}
                  </div>
                )}
              </div>
            </div>

            {/* Custom City input if Other selected */}
            {selectedCity === 'Other' && (
              <div className="form-group" style={{ marginTop: '-8px', marginBottom: 'var(--space-md)' }}>
                <label className="form-label" htmlFor="customCity">Type Your City Name *</label>
                <input
                  type="text"
                  id="customCity"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  className="form-input"
                  placeholder="Enter your city/town name"
                />
              </div>
            )}

            {/* Pincode */}
            <div className="form-group">
              <label className="form-label" htmlFor="pincode">PIN Code (6 digits) *</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                maxLength={6}
                className={`form-input${fieldErrors.pincode ? ' input-error' : ''}`}
                placeholder="e.g. 190006"
                onChange={() => {
                  if (fieldErrors.pincode) setFieldErrors(prev => ({ ...prev, pincode: undefined }));
                }}
              />
              {fieldErrors.pincode && (
                <div style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                  ⚠️ {fieldErrors.pincode}
                </div>
              )}
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
                  After submitting your details, you&apos;ll be taken to a secure UPI payment page.
                  Pay with any UPI app — Google Pay, PhonePe, Paytm, or your bank app.
                  Your order will be confirmed once payment is verified.
                </div>
              </div>
            </div>

            {/* Form Error Banner */}
            {error && (
              <div className="form-error" style={{
                marginBottom: 'var(--space-md)',
                padding: '12px 16px',
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#991b1b',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}

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
