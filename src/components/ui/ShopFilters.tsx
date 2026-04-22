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
  
  const currentSize = searchParams.get('size') || '';
  const urlMaxPrice = searchParams.get('maxPrice');
  
  const MAX_POSSIBLE_PRICE = 50000;
  const initialPrice = urlMaxPrice ? parseInt(urlMaxPrice, 10) : MAX_POSSIBLE_PRICE;
  
  const [priceRange, setPriceRange] = useState(initialPrice);

  // Sync state with URL
  useEffect(() => {
    setPriceRange(urlMaxPrice ? parseInt(urlMaxPrice, 10) : MAX_POSSIBLE_PRICE);
  }, [urlMaxPrice]);

  const updateFilters = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/collections?${params.toString()}`);
  }, [searchParams, router]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange(parseInt(e.target.value, 10));
  };

  const applyPriceFilter = () => {
    if (priceRange >= MAX_POSSIBLE_PRICE) {
      updateFilters('maxPrice', '');
    } else {
      updateFilters('maxPrice', priceRange.toString());
    }
  };

  // Determine which sizes to show
  const isRugs = currentCategory === 'Rugs';
  const isCovers = currentCategory === 'Pillow Covers';
  const showSizes = isRugs || isCovers || currentCategory === 'All';

  let availableSizes: string[] = [];
  if (isRugs) availableSizes = RUG_SIZES;
  else if (isCovers) availableSizes = COVER_SIZES;
  else availableSizes = [...RUG_SIZES, ...COVER_SIZES]; // All category

  return (
    <div style={{ display: 'flex', gap: 'var(--space-xl)', flexWrap: 'wrap', alignItems: 'center', background: '#fff', padding: '12px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}>
      
      {/* Price Slider Filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '220px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', fontWeight: 500 }}>Max Price</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
            {priceRange >= MAX_POSSIBLE_PRICE ? 'Any Price' : `₹${priceRange.toLocaleString('en-IN')}`}
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
          style={{ cursor: 'pointer', accentColor: 'var(--primary)' }}
        />
      </div>

      {/* Size Filter */}
      {showSizes && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', fontWeight: 500 }}>
            {isCovers ? 'Cover Size:' : isRugs ? 'Rug Size:' : 'Size:'}
          </span>
          <select 
            className="form-input" 
            style={{ width: 'auto', padding: '6px 30px 6px 12px', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', margin: 0 }}
            value={currentSize}
            onChange={(e) => updateFilters('size', e.target.value)}
          >
            <option value="">All Sizes</option>
            {availableSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      )}
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
