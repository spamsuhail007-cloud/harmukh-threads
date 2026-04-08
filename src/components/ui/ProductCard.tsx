import Image from 'next/image';
import Link from 'next/link';
import { type Product } from '@prisma/client';
import { formatPrice } from '@/lib/utils';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="product-card">
      <div className="product-card-image">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={400}
          height={500}
          priority={false}
        />
        {product.stock === 0 && (
          <div className="out-of-stock-overlay">
            <span className="out-of-stock-label">Out of Stock</span>
          </div>
        )}
        {product.badge && product.stock > 0 && (
          <span className={`badge ${product.badgeType || 'badge-primary'} product-card-badge`}>
            {product.badge}
          </span>
        )}
      </div>
      <div className="product-card-body">
        <div className="product-card-category">{product.category}</div>
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-price">
          {formatPrice(product.price)}
          {product.originalPrice && <del>{formatPrice(product.originalPrice)}</del>}
        </div>
      </div>
    </Link>
  );
}
