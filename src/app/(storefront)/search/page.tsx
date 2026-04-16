import { getProducts } from '@/actions/products';
import { ProductCard } from '@/components/ui/ProductCard';
import { SearchBar } from '@/components/ui/SearchBar';

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() || '';

  const products = query ? await getProducts(undefined, query) : [];

  return (
    <div className="search-root">
      {/* Hero search bar */}
      <div className="search-hero">
        <div className="container">
          <h1 className="search-hero-title">Search</h1>
          <div className="search-hero-bar">
            <SearchBar initialQuery={query} currentCategory="All" searchMode />
          </div>
          {query && (
            <p className="search-result-meta">
              {products.length} result{products.length !== 1 ? 's' : ''} for{' '}
              <strong>&ldquo;{query}&rdquo;</strong>
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container search-results">
        {!query && (
          <div className="search-empty-state">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p>Type something above to search our collection — rugs and pillow covers.</p>
          </div>
        )}

        {query && products.length === 0 && (
          <div className="search-empty-state">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p>No products found for <strong>&ldquo;{query}&rdquo;</strong>.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Try a broader term or browse our <a href="/collections" style={{ color: 'var(--primary)' }}>collections</a>.</p>
          </div>
        )}

        {products.length > 0 && (
          <div className="search-grid">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
