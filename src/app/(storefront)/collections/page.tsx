import Link from 'next/link';
import { getProducts, getCategories } from '@/actions/products';
import { ProductCard } from '@/components/ui/ProductCard';
import { SearchBar } from '@/components/ui/SearchBar';

export const dynamic = 'force-dynamic'; // search needs to be dynamic

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const params = await searchParams;
  const currentCategory = params.cat || 'All';
  const searchQuery = params.q || '';

  const [products, dbCategories] = await Promise.all([
    getProducts(
      currentCategory === 'All' ? undefined : currentCategory,
      searchQuery || undefined,
    ),
    getCategories(),
  ]);

  const categories = ['All', ...dbCategories];

  return (
    <>
      <div style={{ background: 'var(--surface-container)', padding: 'var(--space-2xl) 0' }}>
        <div className="container">
          <h1 className="section-title" style={{ marginBottom: 'var(--space-lg)' }}>Our Collection</h1>

          {/* Search + Filter row */}
          <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <SearchBar initialQuery={searchQuery} currentCategory={currentCategory} />
          </div>

          {/* Category filters */}
          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
            {categories.map(cat => {
              const active = cat === currentCategory && !searchQuery;
              const href = searchQuery
                ? `/collections?q=${encodeURIComponent(searchQuery)}${cat !== 'All' ? `&cat=${cat}` : ''}`
                : `/collections${cat === 'All' ? '' : `?cat=${cat}`}`;
              return (
                <Link
                  key={cat}
                  href={href}
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
        {/* Search result info */}
        {searchQuery && (
          <div style={{ marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>
              {products.length} result{products.length !== 1 ? 's' : ''} for&nbsp;
              <strong style={{ color: 'var(--on-surface)' }}>"{searchQuery}"</strong>
            </span>
            <Link
              href={currentCategory !== 'All' ? `/collections?cat=${currentCategory}` : '/collections'}
              style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'underline' }}
            >
              Clear search
            </Link>
          </div>
        )}

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0', color: 'var(--on-surface-variant)' }}>
            {searchQuery
              ? `No products found for "${searchQuery}". Try a different search.`
              : 'No products found in this category.'}
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
