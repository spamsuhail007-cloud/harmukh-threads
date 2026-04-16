'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export function TrackOrderForm({ initialEmail, initialOrder }: { initialEmail: string; initialOrder: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const fd = new FormData(e.currentTarget);
    const email = fd.get('email') as string;
    const order = fd.get('order') as string;

    if (!executeRecaptcha) {
      setError('System loading, please wait a moment and try again.');
      setLoading(false);
      return;
    }

    try {
      const token = await executeRecaptcha('track_order');
      
      // Send token to an API or server action to verify and set a short-lived cookie, 
      // or simply append it. Since reCAPTCHA tokens are massive and one-time use, 
      // passing it to the server action to verify first before redirecting is cleaner.
      // But for simplicity, we pass it via query and verify in the page.
      router.push(`/orders/track?email=${encodeURIComponent(email)}&order=${encodeURIComponent(order)}&token=${encodeURIComponent(token)}`);
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="track-form">
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
            defaultValue={initialEmail}
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
            defaultValue={initialOrder}
            style={{ textTransform: 'uppercase' }}
          />
        </div>
      </div>
      {error && <div className="form-error" style={{ marginTop: '16px' }}>{error}</div>}
      <button type="submit" className="btn btn-primary track-submit" disabled={loading}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        {loading ? 'Verifying...' : 'Track Order'}
      </button>
      <p style={{ fontSize: '11px', color: '#a08060', textAlign: 'center', marginTop: '16px', lineHeight: '1.4' }}>
        This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'underline'}}>Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'underline'}}>Terms of Service</a> apply.
      </p>
    </form>
  );
}
