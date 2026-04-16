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

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);
  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) onClose();
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    const email = fd.get('email') as string;
    const phone = fd.get('phone') as string;
    const message = fd.get('message') as string;

    const subject = `Product Enquiry: ${productName}`;
    const fullMessage = phone
      ? `Phone: ${phone}\n\n${message}`
      : message;

    const res = await submitContactForm({ name, email, subject, message: fullMessage });
    setLoading(false);
    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || 'Something went wrong. Please try again.');
    }
  }

  return (
    <div className="modal-backdrop" ref={backdropRef} onClick={handleBackdrop} role="dialog" aria-modal="true" aria-label="Product Enquiry">
      <div className="modal-panel enquiry-modal">

        {/* Header */}
        <div className="modal-header">
          <div>
            <p className="modal-kicker">Product Enquiry</p>
            <h2 className="modal-title">{productName}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {success ? (
            <div className="enquiry-success">
              <div className="enquiry-success-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3>Enquiry Sent!</h3>
              <p>
                Thank you for your interest in <strong>{productName}</strong>.
                Our team will reach out to you within 24 hours.
              </p>
              <button className="btn btn-primary" onClick={onClose} style={{ marginTop: 'var(--space-md)' }}>
                Done
              </button>
            </div>
          ) : (
            <>
              <p className="enquiry-intro">
                Fill in your details and we&apos;ll get back to you with pricing, availability, and any custom requirements.
              </p>

              <form onSubmit={handleSubmit} className="enquiry-form">
                {/* Name + Email row */}
                <div className="enquiry-row">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="enq-name">Your Name <span className="form-required">*</span></label>
                    <input
                      id="enq-name"
                      name="name"
                      type="text"
                      className="form-input"
                      placeholder="Rahul Sharma"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="enq-email">Email Address <span className="form-required">*</span></label>
                    <input
                      id="enq-email"
                      name="email"
                      type="email"
                      className="form-input"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="enq-phone">
                    Phone / WhatsApp
                    <span style={{ fontWeight: 400, color: 'var(--on-surface-variant)', marginLeft: '4px' }}>(optional)</span>
                  </label>
                  <input
                    id="enq-phone"
                    name="phone"
                    type="tel"
                    className="form-input"
                    placeholder="+91 98765 43210"
                  />
                </div>

                {/* Message */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="enq-message">Your Message <span className="form-required">*</span></label>
                  <textarea
                    id="enq-message"
                    name="message"
                    className="form-textarea"
                    rows={4}
                    placeholder={`I'm interested in the ${productName}. Could you share more details about…`}
                    required
                  />
                </div>

                {error && (
                  <div className="form-error">{error}</div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={loading}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                      <span className="contact-spinner" /> Sending…
                    </span>
                  ) : 'Send Enquiry ✦'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
