import { getProductBySlug } from '@/actions/products';
import { notFound } from 'next/navigation';
import { ProductClient } from './ProductClient';
import type { Metadata } from 'next';

export const revalidate = 60; // ISR every 60s

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description.substring(0, 160),
    openGraph: {
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductClient product={product} />;
}
