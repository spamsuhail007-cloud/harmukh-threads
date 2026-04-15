'use client';
import { updateStock, toggleProductStatus, deleteProduct } from '@/actions/admin';
import { type Product } from '@prisma/client';
import { useTransition, useState } from 'react';
import Link from 'next/link';

export function InventoryRow({ product }: { product: Product }) {
  const [isPending, startTransition] = useTransition();
  const [stock, setStock] = useState(product.stock);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleStockBlur = () => {
    if (stock !== product.stock) {
      startTransition(() => {
        updateStock(product.id, stock);
      });
    }
  };

  const handleToggle = () => {
    startTransition(() => {
      toggleProductStatus(product.id, !product.isActive);
    });
  };

  const handleDelete = () => {
    setShowConfirm(false);
    startTransition(() => {
      deleteProduct(product.id);
    });
  };

  return (
    <>
      <tr style={{ opacity: isPending ? 0.5 : 1, transition: 'opacity 200ms' }}>
        <td className="name-col">
          {product.name}
          <br />
          <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--on-surface-variant)' }}>{product.category}</span>
        </td>
        <td>
          <input 
            type="number" 
            value={stock}
            onChange={(e) => setStock(parseInt(e.target.value) || 0)}
            onBlur={handleStockBlur}
            className="stock-input"
            min="0"
            disabled={isPending}
          />
        </td>
        <td>
          <span 
            style={{ cursor: 'pointer' }}
            onClick={handleToggle}
            className={`badge ${product.isActive ? 'badge-primary' : 'badge-secondary'}`}
          >
            {product.isActive ? 'Active' : 'Draft'}
          </span>
        </td>
        <td>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link href={`/admin/products/${product.id}/edit`} className="btn-ghost" style={{ fontSize: '0.8rem', textDecoration: 'underline' }}>
              Edit
            </Link>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={isPending}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--error)',
                background: 'var(--error-container)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 10px',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
              onMouseOver={e => (e.currentTarget.style.opacity = '0.8')}
              onMouseOut={e => (e.currentTarget.style.opacity = '1')}
            >
              Delete
            </button>
          </div>
        </td>
      </tr>

      {/* Confirm dialog overlay */}
      {showConfirm && (
        <tr>
          <td colSpan={4} style={{ padding: 0, border: 'none' }}>
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(28,28,24,0.45)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                background: 'var(--surface-container-lowest)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-2xl)',
                maxWidth: '420px',
                width: '90%',
                boxShadow: 'var(--shadow-float)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-md)' }}>🗑️</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: 'var(--space-sm)', color: 'var(--on-surface)' }}>
                  Delete &ldquo;{product.name}&rdquo;?
                </h3>
                <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem', marginBottom: 'var(--space-xl)', lineHeight: 1.6 }}>
                  This action is permanent and cannot be undone. The product will be removed from all collections.
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{ background: 'var(--error)', color: 'var(--on-error)' }}
                    onClick={handleDelete}
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
