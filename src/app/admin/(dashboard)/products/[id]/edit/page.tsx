import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import EditProductForm from './EditProductForm';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await db.product.findUnique({ where: { id: params.id } });

  if (!product) notFound();

  return <EditProductForm product={product} />;
}
