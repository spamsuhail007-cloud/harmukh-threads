import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import EditProductForm from './EditProductForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });

  if (!product) notFound();

  return <EditProductForm product={product} />;
}
