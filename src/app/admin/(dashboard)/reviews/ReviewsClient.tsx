'use client';

import { useState, useTransition } from 'react';
import { createReview, deleteReview } from '@/actions/reviews';

type ProductRow = {
  id: string;
  name: string;
  images: string[];
  reviews: any[];
};

export function ReviewsClient({ products }: { products: ProductRow[] }) {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(products[0]?.id || null);
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    author: '',
    rating: 5,
    text: ''
  });

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    startTransition(async () => {
      const res = await createReview({
        productId: selectedProductId,
        ...form
      });
      if (res.success) {
        setForm({ author: '', rating: 5, text: '' });
      } else {
        alert(res.error || 'Failed to create review');
      }
    });
  };

  const handleDelete = (reviewId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this review?')) return;
    startTransition(async () => {
      const res = await deleteReview(reviewId);
      if (!res.success) {
        alert(res.error || 'Failed to delete review');
      }
    });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 300px) 1fr', gap: '24px', alignItems: 'start' }}>
      {/* ── Sidebar: Product List ── */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--outline-variant)', overflow: 'hidden' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--outline-variant)', fontWeight: 600, background: 'var(--surface-container-lowest)' }}>
          Select a Product
        </div>
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {products.map(p => (
            <div 
              key={p.id}
              onClick={() => setSelectedProductId(p.id)}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--outline-variant)',
                cursor: 'pointer',
                background: selectedProductId === p.id ? 'var(--primary-container)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'background 0.2s',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.images[0]} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '4px' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: selectedProductId === p.id ? 'var(--on-primary-container)' : 'var(--on-surface)' }}>
                  {p.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                  {p.reviews.length} Review{p.reviews.length !== 1 && 's'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Panel ── */}
      {selectedProduct && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Create Review Form */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--outline-variant)', padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Add Review for {selectedProduct.name}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', maxWidth: '600px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Reviewer Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={form.author}
                    onChange={e => setForm({...form, author: e.target.value})}
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <select 
                    className="form-input" 
                    value={form.rating}
                    onChange={e => setForm({...form, rating: Number(e.target.value)})}
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Review Text</label>
                <textarea 
                  className="form-input" 
                  rows={4} 
                  required 
                  value={form.text}
                  onChange={e => setForm({...form, text: e.target.value})}
                  placeholder="What did the customer think about this product?"
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ justifySelf: 'start' }}
                disabled={isPending}
              >
                {isPending ? 'Adding...' : 'Add Review'}
              </button>
            </form>
          </div>

          {/* Existing Reviews */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--outline-variant)', padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Existing Reviews</h2>
            {selectedProduct.reviews.length === 0 ? (
              <p style={{ color: 'var(--on-surface-variant)' }}>No reviews yet for this product.</p>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {selectedProduct.reviews.map(review => (
                  <div key={review.id} style={{ padding: '16px', border: '1px solid var(--outline-variant)', borderRadius: '8px', display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <strong style={{ fontSize: '1rem' }}>{review.author}</strong>
                        <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ margin: 0, color: 'var(--on-surface-variant)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                        {review.text}
                      </p>
                    </div>
                    <div>
                      <button 
                        onClick={() => handleDelete(review.id)}
                        disabled={isPending}
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--error)', padding: '6px 12px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
