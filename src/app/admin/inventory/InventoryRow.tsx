'use client';
import { updateStock, toggleProductStatus } from '@/actions/admin';
import { type Product } from '@prisma/client';
import { useTransition, useState } from 'react';
import Link from 'next/link';

export function InventoryRow({ product }: { product: Product }) {
  const [isPending, startTransition] = useTransition();
  const [stock, setStock] = useState(product.stock);

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

  return (
    <tr>
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
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Note: product edit page to be fully implemented next. Using alert for now since edit form is complex, but the link is prepared. */}
          <button onClick={() => alert('Editing full products via UI is a Phase 2 item. You can edit via Prisma Studio for now.')} className="btn-ghost" style={{ fontSize: '0.8rem', textDecoration: 'underline' }}>
            Edit
          </button>
        </div>
      </td>
    </tr>
  );
}
