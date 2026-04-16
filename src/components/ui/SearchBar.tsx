'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState, useEffect, useTransition, useRef } from 'react';

interface SearchBarProps {
  initialQuery?: string;
  currentCategory?: string;
  /** When true, navigates to /search instead of /collections */
  searchMode?: boolean;
  autoFocus?: boolean;
  onClose?: () => void;
}

export function SearchBar({
  initialQuery = '',
  currentCategory = '',
  searchMode = false,
  autoFocus = false,
  onClose,
}: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // Debounced navigation — only for collections mode (not search mode where user presses Enter)
  useEffect(() => {
    if (searchMode) return; // search page navigates on Enter only

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
  }, [value, currentCategory, initialQuery, router, searchMode]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = value.trim();
      if (!q) return;
      if (searchMode) {
        router.push(`/search?q=${encodeURIComponent(q)}`);
        onClose?.();
      } else {
        const params = new URLSearchParams();
        if (currentCategory && currentCategory !== 'All') params.set('cat', currentCategory);
        if (q) params.set('q', q);
        router.push(`/collections${params.toString() ? `?${params}` : ''}`);
      }
    },
    [value, currentCategory, router, searchMode, onClose]
  );

  const handleClear = useCallback(() => {
    setValue('');
    if (!searchMode) {
      const params = new URLSearchParams();
      if (currentCategory && currentCategory !== 'All') params.set('cat', currentCategory);
      router.push(`/collections${params.toString() ? `?${params}` : ''}`);
    }
  }, [currentCategory, router, searchMode]);

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative', width: '100%', maxWidth: searchMode ? '100%' : '420px' }}>
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
        ref={inputRef}
        type="search"
        id="product-search"
        placeholder={searchMode ? 'Search our collection…' : 'Search rugs, pashmina, woodcraft…'}
        value={value}
        onChange={e => setValue(e.target.value)}
        style={{
          width: '100%',
          padding: searchMode ? '14px 44px 14px 44px' : '10px 40px 10px 40px',
          border: '1.5px solid var(--outline-variant)',
          borderRadius: 'var(--radius-md)',
          fontSize: searchMode ? '1.1rem' : '0.9rem',
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
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          style={{
            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--on-surface-variant)', fontSize: '1rem', lineHeight: 1,
            padding: '4px',
          }}
        >✕</button>
      )}
    </form>
  );
}
