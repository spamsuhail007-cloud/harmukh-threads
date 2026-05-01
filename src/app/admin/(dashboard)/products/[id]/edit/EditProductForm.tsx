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

// ─── Video upload utility (direct browser → Cloudinary, no server size limit) ─
async function uploadVideoFile(file: File, onStatus: (s: string) => void): Promise<string> {
  onStatus('Uploading video to Cloudinary (please wait, this may take a while)…');
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', 'harmukh-threads');
  // Upload directly from browser to Cloudinary — bypasses Next.js/Vercel size limits
  const res = await fetch('https://api.cloudinary.com/v1_1/dvkfb2tnx/video/upload', {
    method: 'POST',
    body: fd,
  });
  const json = await res.json();
  if (!res.ok || !json.secure_url) throw new Error(json.error?.message || `Upload failed (${res.status})`);
  return json.secure_url as string;
}

// An image slot is either an existing URL (already uploaded) or a new File (pending upload)
type ImageSlot = { type: 'url'; url: string; preview: string } | { type: 'file'; file: File; preview: string };

export default function EditProductForm({ product }: { product: Product }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState<number | null>(null);

  const initialSpecs = Array.isArray((product as any).specifications) 
    ? (product as any).specifications as { label: string; value: string }[]
    : [];
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>(initialSpecs);
  const [price, setPrice] = useState(product.price);
  const [originalPrice, setOriginalPrice] = useState<number | ''>(product.originalPrice || '');

  const discount = typeof originalPrice === 'number' && price < originalPrice
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;

  const handleAddSpec = () => setSpecs([...specs, { label: '', value: '' }]);
  const handleRemoveSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i));
  const handleSpecChange = (i: number, key: 'label' | 'value', val: string) => {
    const newSpecs = [...specs];
    newSpecs[i][key] = val;
    setSpecs(newSpecs);
  };

  const [category, setCategory] = useState(product.category || 'Rugs');

  const [slots, setSlots] = useState<ImageSlot[]>(
    product.images.map(url => ({ type: 'url' as const, url, preview: url }))
  );

  type VideoSlot = { type: 'url'; url: string } | { type: 'file'; file: File; src: string } | null;
  const [videoSlot, setVideoSlot] = useState<VideoSlot>(
    product.videoUrl ? { type: 'url', url: product.videoUrl } : null
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
    const formData = new FormData(e.currentTarget);
    setIsSubmitting(true);
    setError('');

    const submittedPrice = Number(formData.get('price'));
    const submittedOriginalPrice = formData.get('originalPrice') ? Number(formData.get('originalPrice')) : null;

    if (submittedOriginalPrice && submittedPrice > submittedOriginalPrice) {
      setError('Selling Price cannot be greater than Regular Price.');
      setIsSubmitting(false);
      return;
    }

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

    let finalVideoUrl: string | undefined | null = undefined;
    if (videoSlot) {
      if (videoSlot.type === 'url') {
        finalVideoUrl = videoSlot.url;
      } else if (videoSlot.type === 'file') {
        try {
          setSubmitStatus('Uploading product video…');
          finalVideoUrl = await uploadVideoFile(videoSlot.file, setSubmitStatus);
        } catch (err: any) {
          setError(`Failed to upload video: ${err.message}`);
          setIsSubmitting(false);
          setSubmitStatus('');
          return;
        }
      }
    } else {
      finalVideoUrl = null;
    }

    setSubmitStatus('Saving changes…');
    const rawBadge = (formData.get('badge') as string)?.trim();
    const data = {
      name: formData.get('name'),
      category: formData.get('category'),
      price: submittedPrice,
      originalPrice: submittedOriginalPrice,
      description: formData.get('description'),
      stock: Number(formData.get('stock')),
      images: finalUrls,
      videoUrl: finalVideoUrl,
      badge: rawBadge || null,
      badgeType: rawBadge ? (formData.get('badgeType') as string) || 'badge-primary' : null,
      size: formData.get('size') || null,
      specifications: specs.filter(s => s.label.trim() && s.value.trim()),
      productNote: formData.get('productNote') || null,
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
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'var(--space-xl)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <Link href="/admin/inventory" className="btn btn-ghost" style={{ padding: '8px' }}>← Back</Link>
          <div>
            <h1 className="admin-page-title" style={{ margin: 0 }}>Edit Product</h1>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem', margin: 0 }}>{product.name}</p>
              <span style={{ color: 'var(--outline-variant)' }}>|</span>
              <Link href={`/products/${product.slug}`} target="_blank" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                View on Store <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </Link>
            </div>
          </div>
        </div>
        <button type="button" onClick={() => document.getElementById('submitBtn')?.click()} className="btn btn-primary" disabled={isSubmitting} style={{ padding: '10px 24px' }}>
          {isSubmitting ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-lg)', fontSize: '0.9rem', border: '1px solid #ef9a9a' }}>
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
        
        {/* Core Details */}
        <div style={{ background: '#fff', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--outline-variant)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-lg)', fontWeight: 600, color: '#1a1a1a' }}>Core Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Product Name *</label>
              <input type="text" name="name" className="form-input" required defaultValue={product.name} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Category *</label>
              <select name="category" className="form-input" required value={category} onChange={e => setCategory(e.target.value)}>
                <option value="Rugs">Rugs</option>
                <option value="Pillow Covers">Pillow Covers</option>
              </select>
            </div>
          </div>

          {(category === 'Rugs' || category === 'Pillow Covers') && (
            <div className="form-group" style={{ margin: 'var(--space-lg) 0 0 0' }}>
              <label className="form-label">{category === 'Rugs' ? 'Rug Size' : 'Cover Size'}</label>
              <select name="size" className="form-input" defaultValue={(product as any).size || ''} style={{ maxWidth: '50%' }}>
                <option value="">-- Select Size --</option>
                {category === 'Rugs' ? (
                  <>
                    <option value="2x3 ft">2x3 ft</option>
                    <option value="2.5x4 ft">2.5x4 ft</option>
                    <option value="3x5 ft">3x5 ft</option>
                    <option value="4x6 ft">4x6 ft</option>
                    <option value="5x8 ft">5x8 ft</option>
                    <option value="6x9 ft">6x9 ft</option>
                    <option value="8x10 ft">8x10 ft</option>
                    <option value="9x12 ft">9x12 ft</option>
                  </>
                ) : (
                  <>
                    <option value="16x16 in">16x16 in</option>
                    <option value="18x18 in">18x18 in</option>
                    <option value="20x20 in">20x20 in</option>
                    <option value="22x22 in">22x22 in</option>
                    <option value="24x24 in">24x24 in</option>
                    <option value="12x20 in">12x20 in (Lumbar)</option>
                    <option value="14x22 in">14x22 in (Lumbar)</option>
                  </>
                )}
              </select>
            </div>
          )}
        </div>

        {/* Pricing & Inventory */}
        <div style={{ background: '#fff', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--outline-variant)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-lg)', fontWeight: 600, color: '#1a1a1a' }}>Pricing & Inventory</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-lg)', alignItems: 'start' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', flexDirection: 'column' }}>
                <span>Regular Price (₹)</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)', fontWeight: 400 }}>Original price before discount</span>
              </label>
              <input type="number" name="originalPrice" className="form-input" min="1" value={originalPrice} onChange={e => setOriginalPrice(e.target.value ? Number(e.target.value) : '')} placeholder="e.g. 6000" />
            </div>
            <div className="form-group" style={{ margin: 0, position: 'relative' }}>
              <label className="form-label" style={{ display: 'flex', flexDirection: 'column' }}>
                <span>Selling Price (₹) *</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)', fontWeight: 400 }}>Actual price customer pays</span>
              </label>
              <input type="number" name="price" className="form-input" required min="1" value={price} onChange={e => setPrice(Number(e.target.value))} />
              {discount > 0 && (
                <div style={{ position: 'absolute', top: 0, right: 0, background: '#fee2e2', color: '#991b1b', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
                  Save {discount}%
                </div>
              )}
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', flexDirection: 'column' }}>
                <span>Available Stock *</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)', fontWeight: 400 }}>Quantity in warehouse</span>
              </label>
              <input type="number" name="stock" className="form-input" required min="0" defaultValue={product.stock} />
            </div>
          </div>
        </div>

        {/* Media */}
        <div style={{ background: '#fff', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--outline-variant)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-lg)', fontWeight: 600, color: '#1a1a1a' }}>Media</h2>
          
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

          {/* Video upload section */}
          <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: 'var(--space-md)', marginTop: 'var(--space-xl)' }}>
            <h3 style={{ marginBottom: 'var(--space-sm)', fontSize: '1.1rem' }}>Product Video (Optional)</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', marginBottom: 'var(--space-md)' }}>
              Upload a vertical video (9:16) for the homepage carousel. E.g., a short reel or showcase.
            </p>
            {!videoSlot ? (
              <label style={{
                display: 'inline-flex', padding: '12px 24px', background: 'var(--surface-container)',
                border: '1px dashed var(--outline-variant)', borderRadius: 'var(--radius-sm)', cursor: 'pointer'
              }}>
                <span style={{ fontSize: '0.9rem' }}>+ Choose Video (MP4, WebM)</span>
                <input
                  type="file" accept="video/*" style={{ display: 'none' }}
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      if (file.size > 50 * 1024 * 1024) {
                        alert('Video size must be less than 50MB. Please compress it first.');
                        return;
                      }
                      setVideoSlot({ type: 'file', file, src: URL.createObjectURL(file) });
                    }
                  }}
                />
              </label>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <div style={{ position: 'relative', width: '80px', height: '142px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#000' }}>
                  <video src={videoSlot.type === 'file' ? videoSlot.src : videoSlot.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted autoPlay loop playsInline />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>
                    {videoSlot.type === 'file' ? videoSlot.file.name : 'Uploaded Video'}
                  </div>
                  {videoSlot.type === 'file' && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', marginBottom: '12px' }}>
                      {(videoSlot.file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  )}
                  <button type="button" onClick={() => {
                    if (videoSlot.type === 'file') URL.revokeObjectURL(videoSlot.src);
                    setVideoSlot(null);
                  }} className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--error)' }}>
                    Remove Video
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Visibility & Badges */}
        <div style={{ background: '#fff', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--outline-variant)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-lg)', fontWeight: 600, color: '#1a1a1a' }}>Visibility & Badges</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', flexDirection: 'column' }}>
                <span>Badge Text</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)', fontWeight: 400 }}>If left empty, no badge will be displayed</span>
              </label>
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

        {/* Content & Details */}
        <div style={{ background: '#fff', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--outline-variant)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-lg)', fontWeight: 600, color: '#1a1a1a' }}>Content & Details</h2>
          
          <div className="form-group" style={{ marginBottom: 'var(--space-xl)' }}>
            <label className="form-label">Description *</label>
            <textarea name="description" className="form-input" required rows={4} style={{ resize: 'vertical' }} defaultValue={product.description} />
          </div>

          <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: 'var(--space-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Product Specifications</h3>
              <button type="button" className="btn btn-ghost" onClick={handleAddSpec} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                + Add Specification
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {specs.length === 0 && (
                <div style={{ padding: 'var(--space-xl)', textAlign: 'center', background: 'var(--surface-container)', borderRadius: 'var(--radius-md)', color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>
                  No specifications added yet. Click "+ Add Specification" to start adding custom details.
                </div>
              )}
              {specs.map((spec, i) => (
                <div key={i} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start' }}>
                  <div className="form-group" style={{ margin: 0, flex: 1 }}>
                    <input type="text" className="form-input" placeholder="Label (e.g. Material)" value={spec.label} onChange={e => handleSpecChange(i, 'label', e.target.value)} />
                  </div>
                  <div className="form-group" style={{ margin: 0, flex: 2 }}>
                    <input type="text" className="form-input" placeholder="Value (e.g. Silk & Wool)" value={spec.value} onChange={e => handleSpecChange(i, 'value', e.target.value)} />
                  </div>
                  <button type="button" onClick={() => handleRemoveSpec(i)} style={{ padding: '10px', background: 'none', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="form-group" style={{ marginTop: 'var(--space-lg)' }}>
              <label className="form-label" style={{ display: 'flex', flexDirection: 'column' }}>
                <span>Product Note</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)', fontWeight: 400 }}>Shown under Specifications (e.g., care instructions)</span>
              </label>
              <textarea name="productNote" className="form-input" rows={3} style={{ resize: 'vertical' }} placeholder="e.g. Dry clean recommended.&#10;Avoid direct sunlight for prolonged periods." defaultValue={(product as any).productNote ?? ''} />
            </div>
          </div>
        </div>
        
        {/* Hidden submit button to allow triggering from top header */}
        <button id="submitBtn" type="submit" style={{ display: 'none' }}>Submit</button>

      </form>
    </div>
    </div>
  );
}
