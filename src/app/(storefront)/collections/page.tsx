import Link from 'next/link';
import { getProducts } from '@/actions/products';
import { ProductCard } from '@/components/ui/ProductCard';

export const revalidate = 60; // ISR every 60s

const CATEGORIES = ['All', 'Rugs', 'Pashmina', 'Furnishings', 'Woodcraft'];

export default async function CollectionsPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const params = await searchParams;
  const currentCategory = params.cat || 'All';
  const products = await getProducts(currentCategory === 'All' ? undefined : currentCategory);

  return (
    <>
      <div style={{ background: 'var(--surface-container)', padding: 'var(--space-2xl) 0' }}>
        <div className="container">
          <h1 className="section-title" style={{ marginBottom: 'var(--space-lg)' }}>Our Collection</h1>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => {
              const active = cat === currentCategory;
              return (
                <Link
                  key={cat}
                  href={`/collections${cat === 'All' ? '' : `?cat=${cat}`}`}
                  className={`badge ${active ? 'badge-primary' : 'badge-secondary'}`}
                  style={{ padding: '8px 16px', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-2xl) var(--space-xl)' }}>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0', color: 'var(--on-surface-variant)' }}>
            No products found in this category.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-lg)' }}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
