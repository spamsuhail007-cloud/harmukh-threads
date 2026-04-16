'use client';

import { useState, useEffect, useCallback, FormEvent, useRef } from 'react';
import { submitContactForm } from '@/actions/contact';

interface EnquiryModalProps {
  productName: string;
  onClose: () => void;
}

export function EnquiryModal({ productName, onClose }: EnquiryModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const backdropRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Close on Escape
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);
  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  // Close on backdrop click (not panel click)
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) onClose();
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const name    = fd.get('name') as string;
    const email   = fd.get('email') as string;
    const phone   = fd.get('phone') as string;
    const message = fd.get('message') as string;
    const subject = `Product Enquiry: ${productName}`;
    const fullMessage = `Phone/WhatsApp: ${phone}\n\n${message}`;
    const res = await submitContactForm({ name, email, subject, message: fullMessage });
    setLoading(false);
    if (res.success) setSuccess(true);
    else setError(res.error || 'Something went wrong. Please try again.');
  }

  return (
    <div className="enq-backdrop" ref={backdropRef} onClick={handleBackdrop} role="dialog" aria-modal="true">
      <div className="enq-panel">

        {/* ── Header ── */}
        <div className="enq-header">
          <div>
            <p className="enq-kicker">Product Enquiry</p>
            <h2 className="enq-title">{productName}</h2>
          </div>
          <button className="enq-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="enq-body">
          {success ? (
            <div className="enq-success">
              <div className="enq-success-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3>Enquiry Sent!</h3>
              <p>Thank you for your interest in <strong>{productName}</strong>. Our team will reach out within 24 hours.</p>
              <button className="btn btn-primary" onClick={onClose}>Done</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="enq-form">
              <p className="enq-intro">
                Share your details and we&apos;ll get back with pricing and availability.
              </p>

              {/* Row: Name + Email */}
              <div className="enq-grid-2">
                <div className="enq-field">
                  <label className="enq-label" htmlFor="enq-name">Name <span className="enq-req">*</span></label>
                  <input id="enq-name" name="name" type="text" className="form-input enq-input" placeholder="Rahul Sharma" required />
                </div>
                <div className="enq-field">
                  <label className="enq-label" htmlFor="enq-email">Email <span className="enq-req">*</span></label>
                  <input id="enq-email" name="email" type="email" className="form-input enq-input" placeholder="you@example.com" required />
                </div>
              </div>

              {/* Phone */}
              <div className="enq-field">
                <label className="enq-label" htmlFor="enq-phone">Phone / WhatsApp <span className="enq-req">*</span></label>
                <input id="enq-phone" name="phone" type="tel" className="form-input enq-input" placeholder="+91 98765 43210" required />
              </div>

              {/* Message */}
              <div className="enq-field">
                <label className="enq-label" htmlFor="enq-message">Message <span className="enq-req">*</span></label>
                <textarea id="enq-message" name="message" className="form-textarea enq-input" rows={3}
                  placeholder={`I'm interested in ${productName}. Could you share more details…`} required />
              </div>

              {error && <p className="form-error" style={{ margin: 0 }}>{error}</p>}

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span className="contact-spinner" /> Sending…
                  </span>
                ) : 'Send Enquiry ✦'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
