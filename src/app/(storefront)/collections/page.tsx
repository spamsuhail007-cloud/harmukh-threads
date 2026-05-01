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
    <div className="page-fade-in">
      <div className="shop-hero" style={{ padding: 'clamp(var(--space-xl), 8vw, var(--space-3xl)) 0 var(--space-lg)' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '700px' }}>
            <h1 className="section-title" style={{ 
              fontSize: 'clamp(1.75rem, 5vw, 3.5rem)', 
              lineHeight: 1.15, 
              marginBottom: 'var(--space-sm)',
              fontFamily: 'var(--font-serif)'
            }}>
              The Art of <br />
              <span style={{ color: 'var(--primary)' }}>Kashmiri Craftsmanship</span>
            </h1>
            <p style={{ 
              fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', 
              color: 'var(--on-surface-variant)', 
              marginBottom: 'var(--space-lg)',
              maxWidth: '500px',
              lineHeight: 1.5
            }}>
              Discover our curated collection of hand-knotted rugs and artisan textiles, 
              delivered directly from the looms of Kashmir to your home.
            </p>
          </div>

          <div className="trust-strip" style={{ marginTop: 'var(--space-lg)', paddingTop: 'var(--space-md)' }}>
            <div className="trust-item">
              <span className="trust-icon">🚚</span>
              <span>Free Shipping PAN India</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🔒</span>
              <span>Secure Prepaid Payments</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">✨</span>
              <span>Authentic Artisan Quality</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: 'sticky', top: 'var(--navbar-height)', zIndex: 100, background: 'rgba(252, 249, 242, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--outline-variant)', padding: 'var(--space-sm) 0' }}>
        <div className="container" style={{ padding: '0 var(--space-md)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Category filters */}
            <div style={{ 
              display: 'flex', 
              gap: 'var(--space-xs)', 
              flexWrap: 'nowrap', 
              overflowX: 'auto', 
              paddingBottom: '4px', 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              flex: '1 1 100%'
            }}>
              {categories.map(cat => {
                const active = cat === currentCategory && !searchQuery;
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
                    className={`category-tab ${active ? 'active' : ''}`}
                    style={{ whiteSpace: 'nowrap', padding: '8px 16px', fontSize: '0.75rem' }}
                  >
                    {cat}
                  </Link>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', flex: '1 1 100%', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, maxWidth: '300px' }}>
                <SearchBar initialQuery={searchQuery} currentCategory={currentCategory} />
              </div>
              <ShopFilters currentCategory={currentCategory} />
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-xl) var(--space-md)' }}>
        {/* Trust Banner - Secondary */}
        {!searchQuery && currentCategory === 'All' && (
          <div style={{ 
            background: 'var(--surface-container-low)', 
            padding: 'var(--space-md)', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: 'var(--space-lg)',
            border: '1px dashed var(--outline-variant)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-sm)',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '1rem' }}>🛡️</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--on-surface-variant)', lineHeight: 1.4 }}>
              100% Secure Shopping. Pre-paid orders for faster, insured delivery across India.
            </span>
          </div>
        )}

        {/* Search result info */}
        {searchQuery && (
          <div style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>
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
              style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'underline' }}
            >
              Clear
            </Link>
          </div>
        )}

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0', color: 'var(--on-surface-variant)' }}>
            {searchQuery
              ? `No products found for "${searchQuery}".`
              : 'No products found.'}
          </div>
        ) : (
          <div className="product-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(150px, 45vw, 280px), 1fr))', 
            gap: 'clamp(var(--space-sm), 3vw, var(--space-lg))' 
          }}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
