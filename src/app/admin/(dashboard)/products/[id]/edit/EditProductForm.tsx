'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProduct } from '@/actions/admin';
import Link from 'next/link';
import { type Product } from '@prisma/client';

export default function EditProductForm({ product }: { product: Product }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string>(product.images[0] || '');
  const [keepExistingImage, setKeepExistingImage] = useState(true);

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 800;
          let width = img.width;
          let height = img.height;

          if (width > height && width > MAX_SIZE) {
            height = Math.round(height * MAX_SIZE / width);
            width = MAX_SIZE;
          } else if (height > width && height > MAX_SIZE) {
            width = Math.round(width * MAX_SIZE / height);
            height = MAX_SIZE;
          } else if (width > MAX_SIZE) {
            height = Math.round(height * MAX_SIZE / width);
            width = MAX_SIZE;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: 'image/webp' }));
            } else {
              reject(new Error('Compression failed'));
            }
          }, 'image/webp', 0.70);
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const file = formData.get('imageFile') as File;
    let finalImageUrl = product.images[0] || '';

    if (file && file.size > 0) {
      try {
        setSubmitStatus('Optimizing image...');
        const optimizedFile = await compressImage(file);

        setSubmitStatus('Uploading new image...');
        const fd = new FormData();
        fd.append('file', optimizedFile);

        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const json = await res.json();

        if (!res.ok) throw new Error(json.error || `Upload failed with status ${res.status}`);

        finalImageUrl = json.url;
        setSubmitStatus('Image uploaded! Saving...');
      } catch (err: any) {
        console.error(err);
        setSubmitStatus('');
        setError(err.message || 'Image upload failed.');
        setIsSubmitting(false);
        return;
      }
    } else {
      setSubmitStatus('Saving changes...');
    }

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

    const result = await updateProduct(product.id, data);
    if (!result.success) {
      setSubmitStatus('');
      setError(result.error || 'Failed to update product');
      setIsSubmitting(false);
    } else {
      setSubmitStatus('Saved! Redirecting...');
      router.push('/admin/inventory');
      router.refresh();
    }
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: 'var(--space-xl)' }}>
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <Link href="/admin/inventory" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none', fontSize: '0.875rem' }}>
          ← Back to Inventory
        </Link>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginTop: 'var(--space-sm)' }}>
          Edit Product
        </h1>
        <p style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>Editing: <strong>{product.name}</strong></p>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px 16px', marginBottom: 'var(--space-lg)', color: '#991b1b', fontSize: '0.875rem' }}>
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        <div className="card" style={{ padding: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 'var(--space-lg)' }}>Core Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div>
              <label className="form-label">PRODUCT NAME *</label>
              <input name="name" className="form-input" defaultValue={product.name} required />
            </div>
            <div>
              <label className="form-label">CATEGORY *</label>
              <select name="category" className="form-input" defaultValue={product.category} required>
                <option value="">Select category...</option>
                <option value="Rugs">Rugs</option>
                <option value="Shawls">Shawls</option>
                <option value="Wall Hangings">Wall Hangings</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="form-label">PRICE (₹) *</label>
              <input name="price" type="number" className="form-input" defaultValue={product.price} min="1" required />
            </div>
            <div>
              <label className="form-label">STOCK *</label>
              <input name="stock" type="number" className="form-input" defaultValue={product.stock} min="0" required />
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-md)' }}>
            <label className="form-label">DESCRIPTION *</label>
            <textarea name="description" className="form-input" rows={4} defaultValue={product.description} required style={{ resize: 'vertical' }} />
          </div>
        </div>

        <div className="card" style={{ padding: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 'var(--space-lg)' }}>Product Image</h2>

          {imagePreview && (
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label className="form-label">CURRENT IMAGE</label>
              <img src={imagePreview} alt="Product" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', display: 'block', border: '2px solid var(--outline-variant)' }} />
            </div>
          )}

          <label className="form-label">UPLOAD NEW IMAGE (optional — leave blank to keep current)</label>
          <input
            name="imageFile"
            type="file"
            accept="image/*"
            className="form-input"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setImagePreview(URL.createObjectURL(f));
            }}
          />
        </div>

        <div className="card" style={{ padding: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 'var(--space-lg)' }}>Optional Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)' }}>
            <div>
              <label className="form-label">DIMENSIONS</label>
              <input name="dimensions" className="form-input" defaultValue={product.dimensions || ''} placeholder="e.g. 5x7 ft" />
            </div>
            <div>
              <label className="form-label">MATERIAL</label>
              <input name="material" className="form-input" defaultValue={product.material || ''} placeholder="e.g. Pure Wool" />
            </div>
            <div>
              <label className="form-label">ORIGIN</label>
              <input name="origin" className="form-input" defaultValue={product.origin || ''} placeholder="e.g. Srinagar" />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
          <Link href="/admin/inventory" className="btn btn-ghost" style={{ padding: '12px var(--space-xl)' }}>Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ padding: '12px var(--space-xl)' }}>
            {isSubmitting ? (submitStatus || 'Saving...') : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
