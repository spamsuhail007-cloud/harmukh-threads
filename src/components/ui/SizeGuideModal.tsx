'use client';

import { useState } from 'react';

type RoomType = 'living' | 'bedroom' | 'entryway';

type RugSizeInfo = {
  label: string;
  feet: string;
  inches: string;
  metric: string;
  bestFor: string;
  tip: string;
};

const RUG_SIZES: RugSizeInfo[] = [
  {
    label: '2.5 ft × 4 ft',
    feet: '2.5′ × 4.0′',
    inches: '30″ × 48″',
    metric: '76 cm × 122 cm',
    bestFor: 'Bedside, Entryways, Kitchen Nooks & Foyer Accents',
    tip: 'Place on either side of a bed or right in the entryway for an inviting, plush first impression.'
  },
  {
    label: '3 ft × 5 ft',
    feet: '3.0′ × 5.0′',
    inches: '36″ × 60″',
    metric: '91 cm × 152 cm',
    bestFor: 'Small Living Rooms, Study Desks & Armchair Reading Corners',
    tip: 'Perfect under a coffee table or in front of an accent armchair with front legs sitting on the rug.'
  },
  {
    label: '4 ft × 6 ft',
    feet: '4.0′ × 6.0′',
    inches: '48″ × 72″',
    metric: '122 cm × 183 cm',
    bestFor: 'Living Rooms, Master Bedrooms & 4-Seater Dining Areas',
    tip: 'Position under the front two legs of your main sofa or across the foot of a Queen/King bed.'
  },
  {
    label: 'Custom Size',
    feet: 'Any Custom Dimensions',
    inches: 'Hand-knotted to order',
    metric: 'Custom Centimeters',
    bestFor: 'Bespoke Villas, Hallways & Grand Spaces',
    tip: 'Our Kashmiri master weavers in Srinagar can craft any custom rug length & width tailored to your floor plan.'
  }
];

export function SizeGuideModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedRoom, setSelectedRoom] = useState<RoomType>('living');
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);

  if (!isOpen) return null;

  const currentSize = RUG_SIZES[selectedSizeIdx];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(28, 28, 24, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }} onClick={onClose}>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
          border: '1px solid #e8d5c4',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #5c3d1e, #3d1f00)',
          color: '#fef9f5',
          padding: '24px 28px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTopLeftRadius: '15px', borderTopRightRadius: '15px'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9a882', fontWeight: 700 }}>
              Harmukh Threads
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 700, margin: '2px 0 0 0' }}>
              📐 Visual Size &amp; Room Fit Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none', color: '#fff',
              width: '36px', height: '36px',
              borderRadius: '50%', cursor: 'pointer',
              fontSize: '1.2rem', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px' }}>

          {/* Size Pills */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--on-surface-variant)', marginBottom: '10px' }}>
              1. Select Rug Size
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {RUG_SIZES.map((s, idx) => (
                <button
                  key={s.label}
                  onClick={() => setSelectedSizeIdx(idx)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '99px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: selectedSizeIdx === idx ? '2px solid #5c3d1e' : '1px solid #e5e7eb',
                    background: selectedSizeIdx === idx ? '#fef9f5' : '#fff',
                    color: selectedSizeIdx === idx ? '#5c3d1e' : '#4b5563',
                    boxShadow: selectedSizeIdx === idx ? '0 2px 8px rgba(92,61,30,0.15)' : 'none'
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Room Environment Tabs */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--on-surface-variant)', marginBottom: '10px' }}>
              2. Select Room Setting
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: '#f3f4f6', padding: '4px', borderRadius: '10px' }}>
              <button
                onClick={() => setSelectedRoom('living')}
                style={{
                  padding: '8px', border: 'none', borderRadius: '8px',
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                  background: selectedRoom === 'living' ? '#fff' : 'transparent',
                  color: selectedRoom === 'living' ? '#111827' : '#6b7280',
                  boxShadow: selectedRoom === 'living' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                🛋️ Living Room
              </button>

              <button
                onClick={() => setSelectedRoom('bedroom')}
                style={{
                  padding: '8px', border: 'none', borderRadius: '8px',
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                  background: selectedRoom === 'bedroom' ? '#fff' : 'transparent',
                  color: selectedRoom === 'bedroom' ? '#111827' : '#6b7280',
                  boxShadow: selectedRoom === 'bedroom' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                🛏️ Bedroom
              </button>

              <button
                onClick={() => setSelectedRoom('entryway')}
                style={{
                  padding: '8px', border: 'none', borderRadius: '8px',
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                  background: selectedRoom === 'entryway' ? '#fff' : 'transparent',
                  color: selectedRoom === 'entryway' ? '#111827' : '#6b7280',
                  boxShadow: selectedRoom === 'entryway' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                🚪 Entryway / Foyer
              </button>
            </div>
          </div>

          {/* Interactive Top-Down Floor Plan Canvas */}
          <div style={{
            background: 'linear-gradient(180deg, #faf7f2 0%, #f4eee6 100%)',
            borderRadius: '12px',
            border: '1px solid #e8d5c4',
            padding: '24px',
            textAlign: 'center',
            marginBottom: '20px',
            position: 'relative',
            minHeight: '230px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Visual Floor Diagram */}
            {selectedRoom === 'living' && (
              <div style={{ width: '100%', maxWidth: '320px', position: 'relative' }}>
                {/* Sofa */}
                <div style={{ width: '100%', height: '40px', background: '#4b382a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 600 }}>
                  Sofa / Couch
                </div>
                {/* Coffee Table */}
                <div style={{ width: '120px', height: '24px', background: '#8c6d53', borderRadius: '4px', margin: '14px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.65rem' }}>
                  Coffee Table
                </div>
                {/* Rug Overlay */}
                <div style={{
                  width: selectedSizeIdx === 0 ? '55%' : selectedSizeIdx === 1 ? '75%' : '95%',
                  height: selectedSizeIdx === 0 ? '50px' : selectedSizeIdx === 1 ? '70px' : '90px',
                  background: 'rgba(217, 119, 6, 0.25)',
                  border: '2px dashed #d97706',
                  borderRadius: '6px',
                  margin: '-50px auto 0 auto',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#92400e', fontWeight: 700, fontSize: '0.75rem',
                  boxShadow: '0 4px 12px rgba(217, 119, 6, 0.15)',
                  transition: 'all 0.3s ease-in-out'
                }}>
                  {currentSize.label}
                </div>
              </div>
            )}

            {selectedRoom === 'bedroom' && (
              <div style={{ width: '100%', maxWidth: '320px', position: 'relative' }}>
                {/* Bed */}
                <div style={{ width: '160px', height: '90px', background: '#374151', borderRadius: '8px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 600 }}>
                  Queen / King Bed
                </div>
                {/* Rug Overlay */}
                <div style={{
                  width: selectedSizeIdx === 0 ? '110px' : selectedSizeIdx === 1 ? '180px' : '240px',
                  height: selectedSizeIdx === 0 ? '60px' : selectedSizeIdx === 1 ? '80px' : '100px',
                  background: 'rgba(217, 119, 6, 0.25)',
                  border: '2px dashed #d97706',
                  borderRadius: '6px',
                  margin: '-50px auto 0 auto',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#92400e', fontWeight: 700, fontSize: '0.75rem',
                  boxShadow: '0 4px 12px rgba(217, 119, 6, 0.15)',
                  transition: 'all 0.3s ease-in-out'
                }}>
                  {currentSize.label}
                </div>
              </div>
            )}

            {selectedRoom === 'entryway' && (
              <div style={{ width: '100%', maxWidth: '320px', position: 'relative' }}>
                {/* Door */}
                <div style={{ width: '140px', height: '12px', background: '#1f2937', borderRadius: '4px', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.6rem' }}>
                  Main Entrance Door
                </div>
                {/* Rug Overlay */}
                <div style={{
                  width: selectedSizeIdx === 0 ? '120px' : selectedSizeIdx === 1 ? '180px' : '220px',
                  height: selectedSizeIdx === 0 ? '70px' : selectedSizeIdx === 1 ? '90px' : '110px',
                  background: 'rgba(217, 119, 6, 0.25)',
                  border: '2px dashed #d97706',
                  borderRadius: '6px',
                  margin: '0 auto',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#92400e', fontWeight: 700, fontSize: '0.75rem',
                  boxShadow: '0 4px 12px rgba(217, 119, 6, 0.15)',
                  transition: 'all 0.3s ease-in-out'
                }}>
                  {currentSize.label}
                </div>
              </div>
            )}

            <div style={{ fontSize: '0.75rem', color: '#78350f', marginTop: '14px', fontWeight: 600 }}>
              📍 Visualized for {selectedRoom.toUpperCase()} layout
            </div>
          </div>

          {/* Details & Pro Tip Box */}
          <div style={{ background: '#fef9f5', border: '1px solid #e8d5c4', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '12px', borderBottom: '1px solid #f0e8e0', paddingBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#7a6550', fontWeight: 700, textTransform: 'uppercase' }}>Feet</div>
                <div style={{ fontWeight: 700, color: '#3d1f00' }}>{currentSize.feet}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#7a6550', fontWeight: 700, textTransform: 'uppercase' }}>Inches</div>
                <div style={{ fontWeight: 700, color: '#3d1f00' }}>{currentSize.inches}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#7a6550', fontWeight: 700, textTransform: 'uppercase' }}>Centimeters</div>
                <div style={{ fontWeight: 700, color: '#3d1f00' }}>{currentSize.metric}</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5c3d1e', marginBottom: '4px' }}>
                🌟 Best Suited For:
              </div>
              <p style={{ fontSize: '0.85rem', color: '#3d1f00', margin: '0 0 8px 0', lineHeight: 1.5 }}>
                {currentSize.bestFor}
              </p>
              <div style={{ fontSize: '0.8rem', color: '#7a6550', fontStyle: 'italic', lineHeight: 1.5 }}>
                💡 <strong>Styling Tip:</strong> {currentSize.tip}
              </div>
            </div>
          </div>

          {/* WhatsApp Custom Size CTA */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              Need a custom dimension for your space?
            </div>
            <a
              href="https://wa.me/918491006127?text=Hi%2C%20I%20need%20a%20custom%20size%20rug%20crafted%20for%20my%20home"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#25D366', color: '#fff',
                padding: '10px 18px', borderRadius: '8px',
                fontWeight: 700, fontSize: '0.85rem',
                textDecoration: 'none', display: 'inline-flex',
                alignItems: 'center', gap: '6px'
              }}
            >
              💬 WhatsApp Us for Custom Sizes
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
