'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct } from '@/actions/admin';
import Link from 'next/link';

const MAX_IMAGES = 6;

// ─── Shared image compression utility ───────────────────────────────────────
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
        canvas.width = width;
        canvas.height = height;
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

async function uploadFile(file: File, onStatus: (s: string) => void): Promise<string> {
  onStatus('Optimizing image…');
  const optimized = await compressImage(file);
  onStatus('Uploading to Vercel Blob…');
  const fd = new FormData();
  fd.append('file', optimized);
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || `Upload failed (${res.status})`);
  return json.url as string;
}

// ─── Multi-image picker component ────────────────────────────────────────────
function ImagePicker({
  previews,
  onAdd,
  onRemove,
  onReorder,
  disabled,
}: {
  previews: { src: string; uploading?: boolean }[];
  onAdd: (files: FileList) => void;
  onRemove: (i: number) => void;
  onReorder: (from: number, to: number) => void;
  disabled: boolean;
}) {
  const [dragging, setDragging] = useState<number | null>(null);

  return (
    <div>
      <label className="form-label">
        PRODUCT IMAGES * &nbsp;
        <span style={{ fontWeight: 400, color: 'var(--on-surface-variant)', textTransform: 'none' }}>
          (first image = hero • up to {MAX_IMAGES})
        </span>
      </label>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
        {previews.map((p, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => setDragging(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => { if (dragging !== null && dragging !== i) { onReorder(dragging, i); } setDragging(null); }}
            style={{
              position: 'relative', width: '110px', height: '130px',
              borderRadius: 'var(--radius-sm)', overflow: 'hidden',
              border: i === 0 ? '2px solid var(--primary)' : '2px solid var(--outline-variant)',
              cursor: 'grab', flexShrink: 0,
              opacity: dragging === i ? 0.6 : 1,
              transition: 'opacity 0.2s, border-color 0.2s'
            }}
          >
            <img src={p.src} alt={`image ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {i === 0 && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'var(--primary)', color: 'var(--on-primary)', fontSize: '0.6rem', fontWeight: 700, textAlign: 'center', padding: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Hero
              </div>
            )}
            {p.uploading && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem' }}>
                Uploading…
              </div>
            )}
            {!disabled && (
              <button
                type="button"
                onClick={() => onRemove(i)}
                style={{ position: 'absolute', top: '4px', right: '4px', width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.75rem', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >✕</button>
            )}
          </div>
        ))}

        {previews.length < MAX_IMAGES && !disabled && (
          <label style={{
            width: '110px', height: '130px', borderRadius: 'var(--radius-sm)',
            border: '2px dashed var(--outline-variant)', display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0, gap: '8px', color: 'var(--on-surface-variant)',
            transition: 'border-color 0.2s, background 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--surface-container-low)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--outline-variant)'; e.currentTarget.style.background = ''; }}
          >
            <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>+</span>
            <span style={{ fontSize: '0.7rem', textAlign: 'center' }}>Add photo</span>
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={e => { if (e.target.files) onAdd(e.target.files); e.target.value = ''; }}
            />
          </label>
        )}
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '8px' }}>
        Drag images to reorder. First image is displayed as the main hero image.
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [error, setError] = useState('');
  const [imagePreviews, setImagePreviews] = useState<{ src: string; file: File; uploading?: boolean }[]>([]);

  const handleAddFiles = (files: FileList) => {
    const newEntries = Array.from(files)
      .slice(0, MAX_IMAGES - imagePreviews.length)
      .map(file => ({ src: URL.createObjectURL(file), file }));
    setImagePreviews(prev => [...prev, ...newEntries]);
  };

  const handleRemove = (i: number) => {
    setImagePreviews(prev => { URL.revokeObjectURL(prev[i].src); return prev.filter((_, idx) => idx !== i); });
  };

  const handleReorder = (from: number, to: number) => {
    setImagePreviews(prev => {
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

    if (imagePreviews.length === 0) {
      setError('Please add at least one product image.');
      setIsSubmitting(false);
      return;
    }

    // Upload all images sequentially
    const uploadedUrls: string[] = [];
    for (let i = 0; i < imagePreviews.length; i++) {
      try {
        setSubmitStatus(`Uploading image ${i + 1} of ${imagePreviews.length}…`);
        const url = await uploadFile(imagePreviews[i].file, setSubmitStatus);
        uploadedUrls.push(url);
      } catch (err: any) {
        setError(`Failed to upload image ${i + 1}: ${err.message}`);
        setIsSubmitting(false);
        setSubmitStatus('');
        return;
      }
    }

    setSubmitStatus('Saving product to database…');
    const formData = new FormData(e.currentTarget);
    const rawBadge = (formData.get('badge') as string)?.trim();
    const data = {
      name: formData.get('name'),
      category: formData.get('category'),
      price: Number(formData.get('price')),
      description: formData.get('description'),
      stock: Number(formData.get('stock')),
      images: uploadedUrls,
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

    const result = await createProduct(data);
    if (!result.success) {
      setError(result.error || 'Failed to create product');
      setIsSubmitting(false);
      setSubmitStatus('');
    } else {
      setSubmitStatus('Success! Redirecting…');
      router.push('/admin/inventory');
      router.refresh();
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
          <div style={{ background: '#ffebee', color: '#c62828', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-lg)', fontSize: '0.9rem' }}>
            ❌ {error}
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
                <option value="Pillow Covers">Pillow Covers</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input type="number" name="price" className="form-input" required min="1" placeholder="5000" />
            </div>
            <div className="form-group">
              <label className="form-label">Initial Stock *</label>
              <input type="number" name="stock" className="form-input" required min="0" defaultValue="1" />
            </div>
          </div>

          {/* Multi-image picker */}
          <ImagePicker
            previews={imagePreviews}
            onAdd={handleAddFiles}
            onRemove={handleRemove}
            onReorder={handleReorder}
            disabled={isSubmitting}
          />

          {/* Badge section */}
          <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: 'var(--space-md)' }}>
            <h3 style={{ marginBottom: 'var(--space-sm)', fontSize: '1.1rem' }}>Product Badge</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', marginBottom: 'var(--space-md)' }}>
              Optional pill shown on the product card (e.g. "Best Seller", "GI Tagged", "New Arrival"). Leave blank for no badge.
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
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Badge Colour Style</label>
                <select name="badgeType" className="form-input">
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
            <textarea name="description" className="form-input" required rows={4} style={{ resize: 'vertical' }} placeholder="Detail the craftsmanship, history, and beauty of the piece…" />
          </div>

          <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: 'var(--space-md)' }}>
            <h3 style={{ marginBottom: 'var(--space-md)', fontSize: '1.1rem' }}>Product Specifications</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label">Dimensions</label>
                <input type="text" name="dimensions" className="form-input" placeholder="e.g. 72x44 inches" />
              </div>
              <div className="form-group">
                <label className="form-label">Weight</label>
                <input type="text" name="weight" className="form-input" placeholder="e.g. 4.4 kg" />
              </div>
              <div className="form-group">
                <label className="form-label">Shape</label>
                <input type="text" name="shape" className="form-input" placeholder="e.g. Rectangle" />
              </div>
              <div className="form-group">
                <label className="form-label">Material / Fabric</label>
                <input type="text" name="material" className="form-input" placeholder="e.g. Pure Wool" />
              </div>
              <div className="form-group">
                <label className="form-label">Fabric Type</label>
                <input type="text" name="fabric" className="form-input" placeholder="e.g. Hand Woven" />
              </div>
              <div className="form-group">
                <label className="form-label">Embroidery</label>
                <input type="text" name="embroidery" className="form-input" placeholder="e.g. Hand Embroidery" />
              </div>
              <div className="form-group">
                <label className="form-label">Type of Rug</label>
                <input type="text" name="rugType" className="form-input" placeholder="e.g. Namda Rug" />
              </div>
              <div className="form-group">
                <label className="form-label">Craft</label>
                <input type="text" name="craft" className="form-input" placeholder="e.g. Kashmiri Namdas" />
              </div>
              <div className="form-group">
                <label className="form-label">Origin</label>
                <input type="text" name="origin" className="form-input" placeholder="e.g. Srinagar" />
              </div>
              <div className="form-group">
                <label className="form-label">Weave Time</label>
                <input type="text" name="weaveTime" className="form-input" placeholder="e.g. 3 months" />
              </div>
              <div className="form-group">
                <label className="form-label">Knot Density</label>
                <input type="text" name="knotDensity" className="form-input" placeholder="e.g. 100 knots/in²" />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 'var(--space-md)' }}>
              <label className="form-label">Product Note <span style={{ fontWeight: 400, textTransform: 'none' }}>(shown at bottom of description)</span></label>
              <input type="text" name="productNote" className="form-input" placeholder="e.g. Actual color may differ slightly due to photography effects" />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
            <Link href="/admin/inventory" className="btn btn-ghost" style={{ padding: '12px var(--space-xl)' }}>Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ padding: '12px var(--space-xl)', minWidth: '180px' }}>
              {isSubmitting ? (submitStatus || 'Working…') : `Create Product (${imagePreviews.length} image${imagePreviews.length !== 1 ? 's' : ''})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
