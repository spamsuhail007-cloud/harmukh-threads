'use client';

import { useState } from 'react';
import { deleteAbandonedCart, clearAllAbandonedCarts } from '@/actions/abandonedCarts';
import { formatPrice } from '@/lib/utils';

export type AbandonedLead = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  items: Array<{ name: string; image?: string; price: number; qty: number }>;
  total: number;
  status: string;
  createdAt: string;
};

export default function AbandonedCartsClient({ initialLeads }: { initialLeads: AbandonedLead[] }) {
  const [leads, setLeads] = useState<AbandonedLead[]>(initialLeads);
  const [loading, setLoading] = useState(false);

  const totalRevenueAtRisk = leads.reduce((sum, l) => sum + (l.total || 0), 0);
  const avgCartValue = leads.length > 0 ? Math.round(totalRevenueAtRisk / leads.length) : 0;

  async function handleDelete(id: string) {
    if (!confirm('Dismiss this lead?')) return;
    setLeads(prev => prev.filter(l => l.id !== id));
    await deleteAbandonedCart(id);
  }

  async function handleClearAll() {
    if (!confirm('Are you sure you want to clear all abandoned cart leads? This action cannot be undone.')) return;
    setLoading(true);
    setLeads([]);
    await clearAllAbandonedCarts();
    setLoading(false);
  }

  function getTimeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  if (leads.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', background: '#fff', borderRadius: '12px', border: '1px solid var(--outline-variant)' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🛒</div>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>
          No Abandoned Carts Found
        </h3>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>
          When a customer fills out their name, phone or address in checkout but leaves before paying, they will automatically appear here!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--outline-variant)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>
            Total Leads
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--on-surface)', marginTop: '4px' }}>
            {leads.length}
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--outline-variant)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>
            Revenue at Risk
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', marginTop: '4px' }}>
            {formatPrice(totalRevenueAtRisk)}
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--outline-variant)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>
            Average Cart Value
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--on-surface)', marginTop: '4px' }}>
            {formatPrice(avgCartValue)}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button
          onClick={handleClearAll}
          disabled={loading}
          style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
        >
          Clear All Leads
        </button>
      </div>

      {/* Cards list */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {leads.map(lead => {
          const fullName = [lead.firstName, lead.lastName].filter(Boolean).join(' ') || 'Prospect';
          const fullAddress = [lead.address, lead.city, lead.pincode].filter(Boolean).join(', ');
          const cleanPhone = (lead.phone || '').replace(/\D/g, '');

          const waMsg = encodeURIComponent(
`Hi ${lead.firstName || 'there'}, we noticed you left some items in your cart on Harmukh Threads! 🛒

Your selected items are still available. Complete your order here: https://harmukhthreads.com/checkout

Need help? We're happy to assist!`
          );

          return (
            <div
              key={lead.id}
              style={{
                background: '#fff',
                borderRadius: '12px',
                border: '1px solid var(--outline-variant)',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 2px 0', color: 'var(--on-surface)' }}>
                      {fullName}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                      ⏰ {getTimeAgo(lead.createdAt)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--primary)' }}>
                      {formatPrice(lead.total || 0)}
                    </span>
                    <button
                      onClick={() => handleDelete(lead.id)}
                      title="Dismiss lead"
                      style={{
                        background: '#f3f4f6', border: 'none', borderRadius: '50%',
                        width: '26px', height: '26px', cursor: 'pointer',
                        fontSize: '0.8rem', color: '#6b7280', display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Contact info box */}
                <div style={{ background: '#fef9f5', borderRadius: '8px', padding: '12px', marginBottom: '14px', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  {lead.phone && (
                    <div style={{ fontWeight: 700, color: '#3d1f00' }}>
                      📱 {lead.phone}
                    </div>
                  )}
                  {lead.email && (
                    <div style={{ color: '#5c3d1e' }}>
                      ✉️ {lead.email}
                    </div>
                  )}
                  {fullAddress && (
                    <div style={{ color: '#7a6550', fontSize: '0.8rem', marginTop: '4px' }}>
                      📍 {fullAddress}
                    </div>
                  )}
                </div>

                {/* Items */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--on-surface-variant)', marginBottom: '8px' }}>
                    Items Left in Cart
                  </div>
                  {Array.isArray(lead.items) && lead.items.length > 0 ? (
                    lead.items.map((item, idx) => (
                      <div key={idx} style={{ fontSize: '0.85rem', color: 'var(--on-surface)', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>• {item.name} × {item.qty}</span>
                        <span style={{ fontWeight: 600 }}>{formatPrice((item.price || 0) * (item.qty || 1))}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>No item details</div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                {cleanPhone && (
                  <a
                    href={`tel:${cleanPhone}`}
                    style={{
                      flex: 1, padding: '8px 12px', background: 'var(--primary)', color: '#fff',
                      borderRadius: '6px', textDecoration: 'none', fontWeight: 600, fontSize: '0.8rem',
                      textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                    }}
                  >
                    📞 Call
                  </a>
                )}
                {cleanPhone && (
                  <a
                    href={`https://wa.me/91${cleanPhone}?text=${waMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1, padding: '8px 12px', background: '#25D366', color: '#fff',
                      borderRadius: '6px', textDecoration: 'none', fontWeight: 600, fontSize: '0.8rem',
                      textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                    }}
                  >
                    💬 WhatsApp
                  </a>
                )}
                {lead.email && (
                  <a
                    href={`mailto:${lead.email}?subject=Your Harmukh Threads cart is waiting&body=Hi ${lead.firstName || 'there'},%0D%0A%0D%0AWe noticed you left some beautiful items in your cart!%0D%0A%0D%0AComplete your order: https://harmukhthreads.com/checkout%0D%0A%0D%0AThank you,%0D%0AHarmukh Threads`}
                    style={{
                      flex: 1, padding: '8px 12px', background: '#5c3d1e', color: '#fff',
                      borderRadius: '6px', textDecoration: 'none', fontWeight: 600, fontSize: '0.8rem',
                      textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                    }}
                  >
                    ✉️ Email
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
