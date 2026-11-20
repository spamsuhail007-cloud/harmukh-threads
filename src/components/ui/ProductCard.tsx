import Image from 'next/image';
import Link from 'next/link';
import { type Product } from '@prisma/client';
import { formatPrice, optimizeCloudinaryUrl } from '@/lib/utils';
import { getArticleBySlug } from '@/lib/articles';

export function ProductCard({ product }: { product: Product }) {
  const article = getArticleBySlug(product.slug);

  return (
    <Link href={`/products/${product.slug}`} className="product-card">
      <div className="product-card-image">
        <Image
          src={optimizeCloudinaryUrl(product.images[0], 600)}
          alt={product.name}
          width={400}
          height={400}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
          priority={false}
        />
        {article && (
          <span style={{
            position: 'absolute', top: '10px', left: '10px',
            background: 'rgba(30, 20, 10, 0.85)', backdropFilter: 'blur(4px)', color: '#fef9f5',
            fontSize: '0.72rem', fontWeight: 700,
            padding: '3px 9px', borderRadius: '4px',
            letterSpacing: '0.05em', zIndex: 2,
          }}>
            #{article.code}
          </span>
        )}
        {product.stock === 0 && (
          <div className="out-of-stock-overlay">
            <span className="out-of-stock-label">Out of Stock</span>
          </div>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <span style={{
            position: 'absolute', bottom: '10px', left: '10px',
            background: '#f59e0b', color: '#fff',
            fontSize: '0.7rem', fontWeight: 700,
            padding: '3px 10px', borderRadius: '99px',
            letterSpacing: '0.04em', zIndex: 1,
          }}>
            Only {product.stock} left!
          </span>
        )}
        {product.badge && product.stock > 0 && (
          <span className={`badge ${product.badgeType || 'badge-primary'} product-card-badge`}>
            {product.badge}
          </span>
        )}
      </div>
      <div className="product-card-body">
        <div className="product-card-category">{article ? `${article.code} · ${product.category}` : product.category}</div>
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-price">
          {formatPrice(product.price)}
          {product.originalPrice && <del>{formatPrice(product.originalPrice)}</del>}
        </div>
      </div>
    </Link>
  );
}
