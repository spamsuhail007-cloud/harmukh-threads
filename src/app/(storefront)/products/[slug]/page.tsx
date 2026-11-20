import { getProductBySlug, getRelatedProducts } from '@/actions/products';
import { notFound } from 'next/navigation';
import { ProductClient } from './ProductClient';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description.substring(0, 160),
    openGraph: {
      title: `${product.name} | Harmukh Threads`,
      description: product.description.substring(0, 160),
      images: [product.images[0]],
      url: `https://harmukhthreads.com/products/${slug}`,
    },
    alternates: {
      canonical: `/products/${slug}`,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.category, product.slug, 4);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.slug,
    brand: {
      '@type': 'Brand',
      name: 'Harmukh Threads',
    },
    offers: {
      '@type': 'Offer',
      url: `https://harmukhthreads.com/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
