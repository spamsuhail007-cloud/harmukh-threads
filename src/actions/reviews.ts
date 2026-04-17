'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function getProductsWithReviews() {
  return db.product.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      images: true, // using images array if image doesn't exist
      reviews: {
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

const ReviewSchema = z.object({
  productId: z.string(),
  author: z.string().min(2),
  rating: z.number().min(1).max(5),
  text: z.string().min(3),
});

export async function createReview(data: unknown) {
  const parsed = ReviewSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: 'Invalid review data' };
  }

  try {
    await db.review.create({
      data: parsed.data
    });
    
    revalidatePath('/admin/reviews');
    revalidatePath('/products/[slug]', 'page');
    return { success: true };
  } catch (err) {
    console.error('Error creating review:', err);
    return { success: false, error: 'Failed to create review' };
  }
}

export async function deleteReview(reviewId: string) {
  try {
    await db.review.delete({
      where: { id: reviewId }
    });
    revalidatePath('/admin/reviews');
    revalidatePath('/products/[slug]', 'page');
    return { success: true };
  } catch (err) {
    console.error('Error deleting review:', err);
    return { success: false, error: 'Failed to delete review' };
  }
}
