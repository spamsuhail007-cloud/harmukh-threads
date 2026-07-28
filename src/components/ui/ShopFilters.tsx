'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { Suspense } from 'react';

interface ShopFiltersProps {
  currentCategory: string;
}

const RUG_SIZES = [
  '2x3 ft', '2.5x4 ft', '3x5 ft', '4x6 ft', 
  '5x8 ft', '6x9 ft', '8x10 ft', '9x12 ft'
];

const COVER_SIZES = [
  '16x16 in', '18x18 in', '20x20 in', '22x22 in', 
  '24x24 in', '12x20 in', '14x22 in'
];

function ShopFiltersInner({ currentCategory }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentSize = searchParams.get('size') || '';
  const urlMaxPrice = searchParams.get('maxPrice');
  
  const MAX_POSSIBLE_PRICE = 50000;
  const initialPrice = urlMaxPrice ? parseInt(urlMaxPrice, 10) : MAX_POSSIBLE_PRICE;
  
  const [priceRange, setPriceRange] = useState(initialPrice);

  useEffect(() => {
    setPriceRange(urlMaxPrice ? parseInt(urlMaxPrice, 10) : MAX_POSSIBLE_PRICE);
  }, [urlMaxPrice]);

  const updateFilters = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/collections?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange(parseInt(e.target.value, 10));
  };

  const applyPriceFilter = () => {
    if (priceRange >= MAX_POSSIBLE_PRICE) updateFilters('maxPrice', '');
    else updateFilters('maxPrice', priceRange.toString());
  };

  const isRugs = currentCategory === 'Rugs';
  const isCovers = currentCategory === 'Cushion Covers';
  const showSizes = isRugs || isCovers || currentCategory === 'All';

  let availableSizes: string[] = [];
  if (isRugs) availableSizes = RUG_SIZES;
  else if (isCovers) availableSizes = COVER_SIZES;
  else availableSizes = [...RUG_SIZES, ...COVER_SIZES];

  const activeFiltersCount = (currentSize ? 1 : 0) + (urlMaxPrice ? 1 : 0);

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="category-tab"
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '8px 16px',
          background: isOpen ? 'var(--surface-container-high)' : '#fff',
          borderColor: activeFiltersCount > 0 ? 'var(--primary)' : 'var(--outline-variant)',
          color: activeFiltersCount > 0 ? 'var(--primary)' : 'inherit'
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
        </svg>
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <span style={{ 
            background: 'var(--primary)', 
            color: '#fff', 
            borderRadius: '50%', 
            width: '18px', 
            height: '18px', 
            fontSize: '0.7rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            {activeFiltersCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{ 
          position: 'absolute', 
          top: 'calc(100% + 12px)', 
          right: 0, 
          width: 'min(320px, 90vw)', 
          background: '#fff', 
          borderRadius: 'var(--radius-lg)', 
          boxShadow: 'var(--shadow-float)', 
          border: '1px solid var(--outline-variant)',
          padding: '24px',
          zIndex: 1000,
          animation: 'fadeInUp 0.2s ease forwards'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Filter Options</h4>
            <button 
              onClick={() => {
                updateFilters('size', '');
                updateFilters('maxPrice', '');
                setIsOpen(false);
              }}
              style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 500 }}
            >
              Reset All
            </button>
          </div>

          {/* Price Section */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--on-surface-variant)' }}>Price Range</label>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
                Up to {priceRange >= MAX_POSSIBLE_PRICE ? 'Any' : `₹${priceRange.toLocaleString('en-IN')}`}
              </span>
            </div>
            <input 
              type="range" 
              min="1000" 
              max={MAX_POSSIBLE_PRICE} 
              step="500" 
              value={priceRange}
              onChange={handlePriceChange}
              onMouseUp={applyPriceFilter}
              onTouchEnd={applyPriceFilter}
              style={{ 
                width: '100%',
                cursor: 'pointer', 
                accentColor: 'var(--primary)',
                height: '6px',
                borderRadius: '3px',
                background: 'var(--surface-container)'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.7rem', color: 'var(--on-surface-variant)' }}>
              <span>₹1,000</span>
              <span>₹50,000+</span>
            </div>
          </div>

          {/* Size Section */}
          {showSizes && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--on-surface-variant)', marginBottom: '8px' }}>
                {isCovers ? 'Cover Size' : isRugs ? 'Rug Size' : 'Select Size'}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <select 
                  className="form-input" 
                  style={{ gridColumn: 'span 2', margin: 0, padding: '10px 12px' }}
                  value={currentSize}
                  onChange={(e) => updateFilters('size', e.target.value)}
                >
                  <option value="">All Sizes</option>
                  {availableSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <button 
            onClick={() => setIsOpen(false)}
            className="btn btn-primary btn-full"
            style={{ marginTop: '8px', padding: '10px' }}
          >
            Apply Filters
          </button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}

export function ShopFilters(props: ShopFiltersProps) {
  return (
    <Suspense fallback={<div style={{ height: '56px', width: '350px', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }} />}>
      <ShopFiltersInner {...props} />
    </Suspense>
  );
}
