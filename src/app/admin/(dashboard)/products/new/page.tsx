'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct } from '@/actions/admin';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const imageUrl = formData.get('imageUrl') as string;
    
    const data = {
      name: formData.get('name'),
      category: formData.get('category'),
      price: Number(formData.get('price')),
      description: formData.get('description'),
      stock: Number(formData.get('stock')),
      images: [imageUrl], // Wrap single image URL in array
      dimensions: formData.get('dimensions') || undefined,
      material: formData.get('material') || undefined,
      origin: formData.get('origin') || undefined,
    };

    const result = await createProduct(data);
    if (!result.success) {
      setError(result.error || 'Failed to create product');
      setIsSubmitting(false);
    } else {
      router.push('/admin/inventory');
      router.refresh(); // Ensure layout clears cache
    }
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
        <Link href="/admin/inventory" className="btn btn-ghost" style={{ padding: '8px' }}>← Back</Link>
        <h1 className="admin-page-title" style={{ margin: 0 }}>Add New Product</h1>
      </div>

      <div style={{ background: 'var(--surface-container-low)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-md)' }}>
        {error && (
          <div style={{ background: '#ffebee', color: '#c62828', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-lg)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--space-lg)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input type="text" name="name" className="form-input" required placeholder="e.g. Kashmir Silk Rug" />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select name="category" className="form-input" required>
                <option value="Rugs">Rugs</option>
                <option value="Pashmina">Pashmina</option>
                <option value="Furnishings">Furnishings</option>
                <option value="Woodcraft">Woodcraft</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input type="number" name="price" className="form-input" required min="1" placeholder="99.99" />
            </div>
            <div className="form-group">
              <label className="form-label">Initial Stock *</label>
              <input type="number" name="stock" className="form-input" required min="0" defaultValue="1" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Main Image URL *</label>
            <input type="url" name="imageUrl" className="form-input" required placeholder="https://images.unsplash.com/photo-..." />
            <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', marginTop: '4px' }}>
              Paste a direct link to an image. (We will setup direct file uploads via Vercel Blob later)
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea name="description" className="form-input" required rows={4} style={{ resize: 'vertical' }} placeholder="Detail the craftsmanship, history, and beauty of the piece..."></textarea>
          </div>

          <div style={{ borderTop: '1px solid var(--outline-variant)', marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)' }}>
            <h3 style={{ marginBottom: 'var(--space-md)', fontSize: '1.1rem' }}>Optional Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label">Dimensions</label>
                <input type="text" name="dimensions" className="form-input" placeholder="e.g. 5x7 ft" />
              </div>
              <div className="form-group">
                <label className="form-label">Material</label>
                <input type="text" name="material" className="form-input" placeholder="e.g. Pure Wool" />
              </div>
              <div className="form-group">
                <label className="form-label">Origin</label>
                <input type="text" name="origin" className="form-input" placeholder="e.g. Srinagar" />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Product...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
