'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProduct } from '@/actions/admin';
import Link from 'next/link';
import { type Product } from '@prisma/client';

const MAX_IMAGES = 6;

async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 1200;
        let { width, height } = img;
        if (width > height && width > MAX_SIZE) { height = Math.round(height * MAX_SIZE / width); width = MAX_SIZE; }
        else if (height > MAX_SIZE) { width = Math.round(width * MAX_SIZE / height); height = MAX_SIZE; }
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) resolve(new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.webp', { type: 'image/webp' }));
          else reject(new Error('Compression failed'));
        }, 'image/webp', 0.80);
      };
    };
    reader.onerror = reject;
  });
}

async function uploadFile(file: File): Promise<string> {
  const optimized = await compressImage(file);
  const fd = new FormData();
  fd.append('file', optimized);
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || `Upload failed (${res.status})`);
  return json.url as string;
}

// An image slot is either an existing URL (already uploaded) or a new File (pending upload)
type ImageSlot = { type: 'url'; url: string; preview: string } | { type: 'file'; file: File; preview: string };

export default function EditProductForm({ product }: { product: Product }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState<number | null>(null);

  const [slots, setSlots] = useState<ImageSlot[]>(
    product.images.map(url => ({ type: 'url' as const, url, preview: url }))
  );

  const handleAddFiles = (files: FileList) => {
    const newSlots: ImageSlot[] = Array.from(files)
      .slice(0, MAX_IMAGES - slots.length)
      .map(file => ({ type: 'file' as const, file, preview: URL.createObjectURL(file) }));
    setSlots(prev => [...prev, ...newSlots]);
  };

  const handleRemove = (i: number) => {
    setSlots(prev => {
      if (prev[i].type === 'file') URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const handleReorder = (from: number, to: number) => {
    setSlots(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return arr;
    });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (slots.length === 0) {
      setError('Please add at least one product image.');
      setIsSubmitting(false);
      return;
    }

    // Upload any new files; keep existing URLs as-is
    const finalUrls: string[] = [];
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      if (slot.type === 'url') {
        finalUrls.push(slot.url);
      } else {
        try {
          setSubmitStatus(`Uploading new image ${i + 1}…`);
          const url = await uploadFile(slot.file);
          finalUrls.push(url);
        } catch (err: any) {
          setError(`Failed to upload image ${i + 1}: ${err.message}`);
          setIsSubmitting(false);
          setSubmitStatus('');
          return;
        }
      }
    }

    setSubmitStatus('Saving changes…');
    const formData = new FormData(e.currentTarget);
    const rawBadge = (formData.get('badge') as string)?.trim();
    const data = {
      name: formData.get('name'),
      category: formData.get('category'),
      price: Number(formData.get('price')),
      description: formData.get('description'),
      stock: Number(formData.get('stock')),
      images: finalUrls,
      badge: rawBadge || undefined,
      badgeType: rawBadge ? (formData.get('badgeType') as string) || 'badge-primary' : undefined,
      dimensions: formData.get('dimensions') || undefined,
      material: formData.get('material') || undefined,
      origin: formData.get('origin') || undefined,
      weight: formData.get('weight') || undefined,
      shape: formData.get('shape') || undefined,
      rugType: formData.get('rugType') || undefined,
      embroidery: formData.get('embroidery') || undefined,
      fabric: formData.get('fabric') || undefined,
      craft: formData.get('craft') || undefined,
      productNote: formData.get('productNote') || undefined,
    };

    const result = await updateProduct(product.id, data);
    if (!result.success) {
      setError(result.error || 'Failed to update product');
      setIsSubmitting(false);
      setSubmitStatus('');
    } else {
      setSubmitStatus('Saved! Redirecting…');
      router.push('/admin/inventory');
      router.refresh();
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-xl)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
        <Link href="/admin/inventory" className="btn btn-ghost" style={{ padding: '8px' }}>← Back</Link>
        <div>
          <h1 className="admin-page-title" style={{ margin: 0 }}>Edit Product</h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem', marginTop: '2px' }}>{product.name}</p>
        </div>
      </div>

      {error && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-lg)', fontSize: '0.9rem' }}>
          ❌ {error}
        </div>
      )}

      <div style={{ background: 'var(--surface-container-low)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-md)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--space-lg)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input type="text" name="name" className="form-input" required defaultValue={product.name} />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select name="category" className="form-input" required defaultValue={product.category}>
                <option value="Rugs">Rugs</option>
                <option value="Pillow Covers">Pillow Covers</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input type="number" name="price" className="form-input" required min="1" defaultValue={product.price} />
            </div>
            <div className="form-group">
              <label className="form-label">Stock *</label>
              <input type="number" name="stock" className="form-input" required min="0" defaultValue={product.stock} />
            </div>
          </div>

          {/* Multi-image picker */}
          <div>
            <label className="form-label">
              PRODUCT IMAGES &nbsp;
              <span style={{ fontWeight: 400, color: 'var(--on-surface-variant)', textTransform: 'none' }}>
                (first = hero • drag to reorder • up to {MAX_IMAGES})
              </span>
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
              {slots.map((slot, i) => (
                <div
                  key={i}
                  draggable
                  onDragStart={() => setDragging(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => { if (dragging !== null && dragging !== i) handleReorder(dragging, i); setDragging(null); }}
                  style={{
                    position: 'relative', width: '110px', height: '130px',
                    borderRadius: 'var(--radius-sm)', overflow: 'hidden',
                    border: i === 0 ? '2px solid var(--primary)' : '2px solid var(--outline-variant)',
                    cursor: 'grab', flexShrink: 0,
                    opacity: dragging === i ? 0.6 : 1
                  }}
                >
                  <img src={slot.preview} alt={`image ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {i === 0 && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'var(--primary)', color: 'var(--on-primary)', fontSize: '0.6rem', fontWeight: 700, textAlign: 'center', padding: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Hero
                    </div>
                  )}
                  {slot.type === 'file' && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.6rem', textAlign: 'center', padding: '2px' }}>
                      New
                    </div>
                  )}
                  {!isSubmitting && (
                    <button type="button" onClick={() => handleRemove(i)} style={{ position: 'absolute', top: '4px', right: '4px', width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.75rem', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                  )}
                </div>
              ))}

              {slots.length < MAX_IMAGES && !isSubmitting && (
                <label style={{ width: '110px', height: '130px', borderRadius: 'var(--radius-sm)', border: '2px dashed var(--outline-variant)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, gap: '8px', color: 'var(--on-surface-variant)' }}>
                  <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>+</span>
                  <span style={{ fontSize: '0.7rem', textAlign: 'center' }}>Add photo</span>
                  <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => { if (e.target.files) handleAddFiles(e.target.files); e.target.value = ''; }} />
                </label>
              )}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '8px' }}>Drag to reorder. First image is the hero image shown on listings.</p>
          </div>

          {/* Badge section */}
          <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: 'var(--space-md)' }}>
            <h3 style={{ marginBottom: 'var(--space-sm)', fontSize: '1.1rem' }}>Product Badge</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', marginBottom: 'var(--space-md)' }}>
              Optional pill shown on the product card. Leave blank to remove badge.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Badge Text</label>
                <input
                  type="text"
                  name="badge"
                  className="form-input"
                  placeholder="e.g. Best Seller, GI Tagged, New Arrival…"
                  maxLength={30}
                  defaultValue={product.badge ?? ''}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Badge Colour Style</label>
                <select name="badgeType" className="form-input" defaultValue={product.badgeType ?? 'badge-primary'}>
                  <option value="badge-primary">🟠 Amber — Best Seller / Featured</option>
                  <option value="badge-gi">🟢 Green — GI Tagged / Certified</option>
                  <option value="badge-new">🔵 Blue — New Arrival</option>
                  <option value="badge-sale">🔴 Red — Sale / Offer</option>
                  <option value="badge-secondary">🟡 Gold — Heritage / Premium</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea name="description" className="form-input" required rows={4} style={{ resize: 'vertical' }} defaultValue={product.description} />
          </div>

          <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: 'var(--space-md)' }}>
            <h3 style={{ marginBottom: 'var(--space-md)', fontSize: '1.1rem' }}>Product Specifications</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label">Dimensions</label>
                <input type="text" name="dimensions" className="form-input" placeholder="e.g. 72x44 inches" defaultValue={product.dimensions ?? ''} />
              </div>
              <div className="form-group">
                <label className="form-label">Weight</label>
                <input type="text" name="weight" className="form-input" placeholder="e.g. 4.4 kg" defaultValue={(product as any).weight ?? ''} />
              </div>
              <div className="form-group">
                <label className="form-label">Shape</label>
                <input type="text" name="shape" className="form-input" placeholder="e.g. Rectangle" defaultValue={(product as any).shape ?? ''} />
              </div>
              <div className="form-group">
                <label className="form-label">Material / Fabric</label>
                <input type="text" name="material" className="form-input" placeholder="e.g. Pure Wool" defaultValue={product.material ?? ''} />
              </div>
              <div className="form-group">
                <label className="form-label">Fabric Type</label>
                <input type="text" name="fabric" className="form-input" placeholder="e.g. Hand Woven" defaultValue={(product as any).fabric ?? ''} />
              </div>
              <div className="form-group">
                <label className="form-label">Embroidery</label>
                <input type="text" name="embroidery" className="form-input" placeholder="e.g. Hand Embroidery" defaultValue={(product as any).embroidery ?? ''} />
              </div>
              <div className="form-group">
                <label className="form-label">Type of Rug</label>
                <input type="text" name="rugType" className="form-input" placeholder="e.g. Namda Rug" defaultValue={(product as any).rugType ?? ''} />
              </div>
              <div className="form-group">
                <label className="form-label">Craft</label>
                <input type="text" name="craft" className="form-input" placeholder="e.g. Kashmiri Namdas" defaultValue={(product as any).craft ?? ''} />
              </div>
              <div className="form-group">
                <label className="form-label">Origin</label>
                <input type="text" name="origin" className="form-input" placeholder="e.g. Srinagar" defaultValue={product.origin ?? ''} />
              </div>
              <div className="form-group">
                <label className="form-label">Weave Time</label>
                <input type="text" name="weaveTime" className="form-input" placeholder="e.g. 3 months" defaultValue={product.weaveTime ?? ''} />
              </div>
              <div className="form-group">
                <label className="form-label">Knot Density</label>
                <input type="text" name="knotDensity" className="form-input" placeholder="e.g. 100 knots/in²" defaultValue={product.knotDensity ?? ''} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 'var(--space-md)' }}>
              <label className="form-label">Product Note <span style={{ fontWeight: 400, textTransform: 'none' }}>(shown at bottom of description)</span></label>
              <input type="text" name="productNote" className="form-input" placeholder="e.g. Actual color may differ slightly due to photography effects" defaultValue={(product as any).productNote ?? ''} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
            <Link href="/admin/inventory" className="btn btn-ghost" style={{ padding: '12px var(--space-xl)' }}>Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ padding: '12px var(--space-xl)', minWidth: '180px' }}>
              {isSubmitting ? (submitStatus || 'Saving…') : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
