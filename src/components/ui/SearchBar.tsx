'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect, useTransition } from 'react';

export function SearchBar({ initialQuery = '', currentCategory = '' }: { initialQuery?: string; currentCategory?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const [, startTransition] = useTransition();

  // Debounced navigation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value === initialQuery) return;

      const params = new URLSearchParams();
      if (currentCategory && currentCategory !== 'All') params.set('cat', currentCategory);
      if (value.trim()) params.set('q', value.trim());

      startTransition(() => {
        router.push(`/collections${params.toString() ? `?${params}` : ''}`);
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [value, currentCategory, initialQuery, router]);

  const handleClear = useCallback(() => {
    setValue('');
    const params = new URLSearchParams();
    if (currentCategory && currentCategory !== 'All') params.set('cat', currentCategory);
    router.push(`/collections${params.toString() ? `?${params}` : ''}`);
  }, [currentCategory, router]);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
      {/* Search icon */}
      <span style={{
        position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
        color: 'var(--on-surface-variant)', pointerEvents: 'none',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </span>

      <input
        type="search"
        id="product-search"
        placeholder="Search rugs, pashmina, woodcraft…"
        value={value}
        onChange={e => setValue(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 40px 10px 40px',
          border: '1.5px solid var(--outline-variant)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.9rem',
          background: '#fff',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxSizing: 'border-box',
        }}
        onFocus={e => {
          e.target.style.borderColor = 'var(--primary)';
          e.target.style.boxShadow = '0 0 0 3px rgba(92,61,30,0.12)';
        }}
        onBlur={e => {
          e.target.style.borderColor = 'var(--outline-variant)';
          e.target.style.boxShadow = 'none';
        }}
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          style={{
            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--on-surface-variant)', fontSize: '1rem', lineHeight: 1,
            padding: '4px',
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
