import Link from 'next/link';
import { getProducts, getCategories } from '@/actions/products';
import { ProductCard } from '@/components/ui/ProductCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { ShopFilters } from '@/components/ui/ShopFilters';

export const dynamic = 'force-dynamic'; // search needs to be dynamic

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string; size?: string; minPrice?: string; maxPrice?: string }>;
}) {
  const params = await searchParams;
  const currentCategory = params.cat || 'All';
  const searchQuery = params.q || '';
  const currentSize = params.size || '';
  const minPrice = params.minPrice ? parseInt(params.minPrice, 10) : undefined;
  const maxPrice = params.maxPrice ? parseInt(params.maxPrice, 10) : undefined;

  const [products, dbCategories] = await Promise.all([
    getProducts(
      currentCategory === 'All' ? undefined : currentCategory,
      searchQuery || undefined,
      minPrice,
      maxPrice,
      currentSize || undefined
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
          <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap', alignItems: 'center', justifyItems: 'space-between', marginBottom: 'var(--space-lg)' }}>
            <div style={{ flex: '1 1 300px' }}>
              <SearchBar initialQuery={searchQuery} currentCategory={currentCategory} />
            </div>
            <ShopFilters currentCategory={currentCategory} />
          </div>

          {/* Category filters */}
          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
            {categories.map(cat => {
              const active = cat === currentCategory && !searchQuery;
              
              // Build href preserving existing params (except cat)
              // We'll also drop size if switching to a non-Rugs category
              const newParams = new URLSearchParams();
              if (searchQuery) newParams.set('q', searchQuery);
              if (cat !== 'All') newParams.set('cat', cat);
              if (minPrice !== undefined) newParams.set('minPrice', minPrice.toString());
              if (maxPrice !== undefined) newParams.set('maxPrice', maxPrice.toString());
              if (currentSize && (cat === 'Rugs' || cat === 'All')) newParams.set('size', currentSize);
              
              const queryString = newParams.toString();
              const href = `/collections${queryString ? `?${queryString}` : ''}`;
              
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
              href={`/collections?${new URLSearchParams(
                Object.entries({
                  cat: currentCategory !== 'All' ? currentCategory : '',
                  size: currentSize,
                  minPrice: minPrice?.toString() || '',
                  maxPrice: maxPrice?.toString() || '',
                }).filter(([, v]) => v !== '')
              ).toString()}`}
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
