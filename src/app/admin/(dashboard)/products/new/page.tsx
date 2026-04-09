'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct } from '@/actions/admin';
import { upload } from '@vercel/blob/client';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    // 1. Handle File Upload
    const file = formData.get('imageFile') as File;
    let finalImageUrl = '';

    if (file && file.size > 0) {
      try {
        const uploadResult = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });
        
        finalImageUrl = uploadResult.url;
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Client upload failed. Vercel Token issue?');
        setIsSubmitting(false);
        return;
      }
    } else {
      setError('Please provide a product image.');
      setIsSubmitting(false);
      return;
    }

    // 2. Create the Product
    const data = {
      name: formData.get('name'),
      category: formData.get('category'),
      price: Number(formData.get('price')),
      description: formData.get('description'),
      stock: Number(formData.get('stock')),
      images: [finalImageUrl], 
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
            <label className="form-label">Product Image (Upload) *</label>
            <input 
              type="file" 
              name="imageFile" 
              accept="image/*"
              className="form-input" 
              required 
              style={{ background: 'var(--surface-container-lowest)' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const url = URL.createObjectURL(e.target.files[0]);
                  setImagePreview(url);
                }
              }}
            />
            {imagePreview && (
              <div style={{ marginTop: 'var(--space-md)' }}>
                <img src={imagePreview} alt="Preview" style={{ width: '150px', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
              </div>
            )}
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
            <Link href="/admin/inventory" className="btn btn-ghost" style={{ padding: '12px var(--space-xl)' }}>Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ padding: '12px var(--space-xl)' }}>
              {isSubmitting ? 'Uploading & Saving...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
