'use client';
import { useState, FormEvent } from 'react';
import { submitContactForm } from '@/actions/contact';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { executeRecaptcha } = useGoogleReCaptcha();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!executeRecaptcha) {
      setError('reCAPTCHA not loaded yet. Please try again in a moment.');
      setLoading(false);
      return;
    }

    try {
      const token = await executeRecaptcha('contact_form');

      const fd = new FormData(e.currentTarget);
      const data = {
        name: fd.get('name'),
        email: fd.get('email'),
        subject: fd.get('subject'),
        message: fd.get('message'),
        token,
      };

      const res = await submitContactForm(data);
      if (res.success) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        setError(res.error || 'Failed to submit form.');
      }
    } catch (err) {
      setError('An error occurred generating security token. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="contact-page">
      {/* Hero Banner */}
      <div className="contact-hero">
        <div className="contact-hero-overlay" />
        <div className="container contact-hero-content">
          <div className="section-kicker" style={{ color: 'rgba(255,219,203,0.85)' }}>We&apos;d Love to Hear From You</div>
          <h1 className="contact-hero-title">Get in Touch</h1>
          <p className="contact-hero-sub">
            Have a question about a piece, or want to discuss a custom commission?<br />
            Our team in Srinagar typically responds within 24 hours.
          </p>
        </div>
      </div>

      <div className="container contact-body">
        <div className="contact-layout">

          {/* Left — Info Cards */}
          <aside className="contact-info-col">
            <div className="contact-info-card">
              <div className="contact-info-icon">✉</div>
              <div>
                <div className="contact-info-label">Email Us</div>
                <a href="mailto:hello@harmukh.in" className="contact-info-value contact-link">hello@harmukh.in</a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">☎</div>
              <div>
                <div className="contact-info-label">Phone / WhatsApp</div>
                <a href="tel:+911942470000" className="contact-info-value contact-link">+91 194 247 0000</a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">⌖</div>
              <div>
                <div className="contact-info-label">Studio (By Appointment)</div>
                <div className="contact-info-value">Residency Road<br />Srinagar, Kashmir 190001</div>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">◷</div>
              <div>
                <div className="contact-info-label">Studio Hours</div>
                <div className="contact-info-value">Mon – Sat, 10am – 6pm IST</div>
              </div>
            </div>

            <div className="contact-promise">
              <div className="contact-promise-icon">✦</div>
              <p>Every message is personally read by our team — no bots, no templates.</p>
            </div>
          </aside>

          {/* Right — Form */}
          <div className="contact-form-col">
            {success ? (
              <div className="contact-success">
                <div className="contact-success-icon">🕊️</div>
                <h2>Message Sent!</h2>
                <p>Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                <button className="btn btn-secondary" onClick={() => setSuccess(false)}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="contact-form-title">Send Us a Message</h2>
                <p className="contact-form-sub">Fill in the form and we&apos;ll reach out shortly.</p>
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">Your Name</label>
                      <input type="text" id="name" name="name" className="form-input" placeholder="e.g. Rahul Sharma" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input type="email" id="email" name="email" className="form-input" placeholder="you@example.com" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">Topic</label>
                    <select id="subject" name="subject" className="form-select" required>
                      <option value="">Select a topic...</option>
                      <option value="Product Inquiry">Product Inquiry</option>
                      <option value="Custom Commission">Custom Commission</option>
                      <option value="Order Status">Order Status</option>
                      <option value="Wholesale">Wholesale Enquiry</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="message" className="form-label">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      className="form-textarea"
                      placeholder="Tell us what you have in mind..."
                      required
                      rows={6}
                    />
                  </div>
                  {error && <div className="form-error" style={{ marginBottom: 'var(--space-md)' }}>{error}</div>}
                  <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                    {loading ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="contact-spinner" /> Sending...
                      </span>
                    ) : (
                      <>Send Message ✦</>
                    )}
                  </button>
                  <p style={{ fontSize: '11px', color: '#a08060', textAlign: 'center', marginTop: '16px', lineHeight: '1.4' }}>
                    This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'underline'}}>Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'underline'}}>Terms of Service</a> apply.
                  </p>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
