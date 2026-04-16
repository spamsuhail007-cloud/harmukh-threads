'use client';

import { useState, useEffect, useCallback, FormEvent, useRef } from 'react';
import { createPortal } from 'react-dom';
import { submitContactForm } from '@/actions/contact';

interface EnquiryModalProps {
  productName: string;
  onClose: () => void;
}

export function EnquiryModal({ productName, onClose }: EnquiryModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Wait for client mount (portal needs document.body)
  useEffect(() => { setMounted(true); }, []);

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
    const fullMessage = `Phone/WhatsApp: ${phone}\n\n${message}`;
    const res = await submitContactForm({ name, email, subject, message: fullMessage });
    setLoading(false);
    if (res.success) setSuccess(true);
    else setError(res.error || 'Something went wrong.');
  }

  if (!mounted) return null;

  const modal = (
    <>
      {/* ── BACKDROP ── */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 999998,
        }}
      />

      {/* ── PANEL — always dead-centre ── */}
      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 999999,
          width: 'min(92vw, 480px)',
          maxHeight: '85vh',
          overflowY: 'auto',
          background: '#fff',
          borderRadius: '14px',
          boxShadow: '0 25px 80px rgba(0,0,0,0.3)',
        }}
      >
        {/* ── HEADER ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 20px 14px',
          borderBottom: '1px solid #eee',
        }}>
          <div>
            <div style={{
              fontSize: '0.6rem',
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase' as const,
              color: '#5c3d1e',
              marginBottom: '2px',
            }}>
              Product Enquiry
            </div>
            <div style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#1c1c18',
              lineHeight: 1.3,
            }}>
              {productName}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: '#f3f0eb',
              border: 'none',
              borderRadius: '50%',
              width: 30,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '16px',
              color: '#666',
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* ── BODY ── */}
        <div style={{ padding: '16px 20px 22px' }}>
          {success ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '12px',
              padding: '20px 0 10px',
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: '#dcfce7', color: '#16a34a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1c1c18' }}>
                Enquiry Sent!
              </div>
              <div style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.6, maxWidth: 300 }}>
                Thank you for your interest in <strong>{productName}</strong>. Our team will reach out within 24 hours.
              </div>
              <button
                onClick={onClose}
                style={{
                  marginTop: '8px',
                  padding: '10px 32px',
                  background: '#5c3d1e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.82rem', color: '#666', lineHeight: 1.5, marginBottom: '2px' }}>
                Share your details and we&apos;ll get back with pricing &amp; availability.
              </div>

              {/* Name */}
              <Field label="Name" required>
                <input name="name" type="text" placeholder="Rahul Sharma" required style={inputStyle} />
              </Field>

              {/* Email */}
              <Field label="Email" required>
                <input name="email" type="email" placeholder="you@example.com" required style={inputStyle} />
              </Field>

              {/* Phone */}
              <Field label="Phone / WhatsApp" required>
                <input name="phone" type="tel" placeholder="+91 98765 43210" required style={inputStyle} />
              </Field>

              {/* Message */}
              <Field label="Message" required>
                <textarea
                  name="message"
                  rows={3}
                  required
                  placeholder={`I'm interested in ${productName}. Could you share more details…`}
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                />
              </Field>

              {error && (
                <div style={{ color: '#dc2626', fontSize: '0.8rem' }}>{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px',
                  background: '#5c3d1e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: loading ? 'wait' : 'pointer',
                  fontSize: '0.92rem',
                  opacity: loading ? 0.7 : 1,
                  marginTop: '4px',
                }}
              >
                {loading ? 'Sending…' : 'Send Enquiry ✦'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );

  return createPortal(modal, document.body);
}

/* ── Reusable field wrapper ── */
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <label style={{
        fontSize: '0.72rem',
        fontWeight: 600,
        color: '#1c1c18',
        letterSpacing: '0.02em',
      }}>
        {label} {required && <span style={{ color: '#5c3d1e' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

/* ── Shared input style ── */
const inputStyle: React.CSSProperties = {
  padding: '9px 12px',
  fontSize: '0.88rem',
  border: '1.5px solid #ddd',
  borderRadius: '8px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  background: '#fafaf8',
  transition: 'border-color 0.15s',
};
