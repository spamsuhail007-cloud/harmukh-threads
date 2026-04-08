'use client';
import { useState, FormEvent } from 'react';
import { submitContactForm } from '@/actions/contact';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get('name'),
      email: fd.get('email'),
      subject: fd.get('subject'),
      message: fd.get('message'),
    };

    const res = await submitContactForm(data);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } else {
      setError(res.error || 'Failed to submit form.');
    }
  }

  return (
    <div className="container" style={{ padding: 'var(--space-3xl) 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="section-title" style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Contact Us</h1>
        <p className="section-lead" style={{ textAlign: 'center', margin: '0 auto var(--space-3xl)' }}>
          Have a question about a piece, or want to discuss a custom commission? 
          Reach out to our team in Srinagar. We typically respond within 24 hours.
        </p>

        <div className="grid-contact-layout">
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: 'var(--space-md)' }}>Direct Contact</h3>
            <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: 'var(--space-lg)', lineHeight: 1.8 }}>
              <strong>Email:</strong><br/>
              hello@harmukh.in<br/><br/>
              <strong>Phone / WhatsApp:</strong><br/>
              +91 194 247 0000<br/><br/>
              <strong>Studio (By Appointment):</strong><br/>
              Residency Road<br/>
              Srinagar, Kashmir 190001
            </div>
          </div>

          <div style={{ background: 'var(--surface-container-low)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-md)' }}>
            {success ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-2xl) 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🕊️</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: 'var(--space-sm)' }}>Message Sent</h3>
                <p style={{ color: 'var(--on-surface-variant)' }}>Thank you for reaching out. We will get back to you shortly.</p>
                <button className="btn btn-secondary" style={{ marginTop: 'var(--space-lg)' }} onClick={() => setSuccess(false)}>Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input type="text" id="name" name="name" className="form-input" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" id="email" name="email" className="form-input" required />
                </div>
                <div className="form-group">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <select id="subject" name="subject" className="form-select" required>
                    <option value="">Select a topic...</option>
                    <option value="Product Inquiry">Product Inquiry</option>
                    <option value="Custom Commission">Custom Commission</option>
                    <option value="Order Status">Order Status</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea id="message" name="message" className="form-textarea" required rows={5}></textarea>
                </div>
                {error && <div className="form-error" style={{ marginBottom: 'var(--space-md)' }}>{error}</div>}
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
