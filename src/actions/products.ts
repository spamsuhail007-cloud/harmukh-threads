'use server';
import { db } from '@/lib/db';
import { type Product } from '@prisma/client';

export async function getProducts(category?: string, query?: string): Promise<Product[]> {
  return db.product.findMany({
    where: {
      isActive: true,
      ...(category ? { category } : {}),
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { category: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: 'asc' },
  });
}

export async function getProductBySlug(slug: string) {
  return db.product.findUnique({
    where: { slug },
    include: { reviews: { orderBy: { createdAt: 'desc' } } },
  });
}

export async function getFeaturedProducts() {
  return db.product.findMany({
    where: { isActive: true },
    take: 4,
    orderBy: { createdAt: 'asc' },
  });
}

export async function getCategories(): Promise<string[]> {
  const cats = await db.product.groupBy({
    by: ['category'],
    where: { isActive: true },
  });
  return cats.map(c => c.category);
}

export async function getRelatedProducts(
  category: string,
  excludeSlug: string,
  limit = 4
): Promise<Product[]> {
  return db.product.findMany({
    where: { isActive: true, category, NOT: { slug: excludeSlug } },
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
}

