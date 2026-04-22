'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

interface ShopFiltersProps {
  currentCategory: string;
}

import { Suspense } from 'react';

function ShopFiltersInner({ currentCategory }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentSize = searchParams.get('size') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';

  const updateFilters = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/collections?${params.toString()}`);
  }, [searchParams, router]);

  return (
    <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', alignItems: 'center' }}>
      {/* Price Filter */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', fontWeight: 500 }}>Price:</span>
        <select 
          className="form-input" 
          style={{ width: 'auto', padding: '6px 30px 6px 12px', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}
          value={`${currentMinPrice}-${currentMaxPrice}`}
          onChange={(e) => {
            const val = e.target.value;
            const params = new URLSearchParams(searchParams.toString());
            if (val === '') {
              params.delete('minPrice');
              params.delete('maxPrice');
            } else if (val === '0-5000') {
              params.set('minPrice', '0');
              params.set('maxPrice', '5000');
            } else if (val === '5000-10000') {
              params.set('minPrice', '5000');
              params.set('maxPrice', '10000');
            } else if (val === '10000-') {
              params.set('minPrice', '10000');
              params.delete('maxPrice');
            }
            router.push(`/collections?${params.toString()}`);
          }}
        >
          <option value="-">Any Price</option>
          <option value="0-5000">Under ₹5,000</option>
          <option value="5000-10000">₹5,000 - ₹10,000</option>
          <option value="10000-">Above ₹10,000</option>
        </select>
      </div>

      {/* Size Filter (Only show for Rugs) */}
      {(currentCategory === 'Rugs' || currentCategory === 'All') && (
        <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', fontWeight: 500 }}>Size:</span>
          <select 
            className="form-input" 
            style={{ width: 'auto', padding: '6px 30px 6px 12px', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}
            value={currentSize}
            onChange={(e) => updateFilters('size', e.target.value)}
          >
            <option value="">All Sizes</option>
            <option value="2x3 ft">2x3 ft</option>
            <option value="2.5x4 ft">2.5x4 ft</option>
            <option value="3x5 ft">3x5 ft</option>
            <option value="4x6 ft">4x6 ft</option>
            <option value="5x8 ft">5x8 ft</option>
            <option value="6x9 ft">6x9 ft</option>
            <option value="8x10 ft">8x10 ft</option>
            <option value="9x12 ft">9x12 ft</option>
          </select>
        </div>
      )}
    </div>
  );
}

export function ShopFilters(props: ShopFiltersProps) {
  return (
    <Suspense fallback={<div style={{ height: '36px' }} />}>
      <ShopFiltersInner {...props} />
    </Suspense>
  );
}
