'use server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { slugify } from '@/lib/utils';

export async function updateStock(productId: string, stock: number) {
  await db.product.update({ where: { id: productId }, data: { stock } });
  revalidatePath('/');
  revalidatePath('/admin/inventory');
}

export async function toggleProductStatus(productId: string, isActive: boolean) {
  await db.product.update({ where: { id: productId }, data: { isActive } });
  revalidatePath('/');
  revalidatePath('/admin/inventory');
  revalidatePath('/collections');
}

const ProductSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.coerce.number().min(1),
  originalPrice: z.coerce.number().optional(),
  badge: z.string().optional(),
  badgeType: z.string().optional(),
  description: z.string().min(10),
  specifications: z.any().optional(),
  productNote: z.string().optional(),
  images: z.array(z.string().url()).min(1),
  stock: z.coerce.number().min(0),
});

export async function createProduct(data: unknown) {
  console.log('[createProduct] Incoming data:', JSON.stringify(data).substring(0, 500) + '...');
  const parsed = ProductSchema.safeParse(data);
  if (!parsed.success) {
    console.error('[createProduct] Validation failed:', parsed.error);
    return { success: false, error: 'Invalid product data: ' + parsed.error.issues[0]?.message };
  }

  const slug = slugify(parsed.data.name);
  console.log('[createProduct] Parsed successfully, generated slug:', slug);
  try {
    const start = Date.now();
    await db.product.create({ data: { ...parsed.data, slug } });
    console.log('[createProduct] Database create finished in', Date.now() - start, 'ms');
    
    revalidatePath('/');
    revalidatePath('/collections');
    revalidatePath('/admin/inventory');
    return { success: true };
  } catch (err: any) {
    console.error('[createProduct] Catch block error:', err);
    return { success: false, error: `Failed to create product. ${err.message || 'Slug may already exist.'}` };
  }
}

export async function updateProduct(id: string, data: unknown) {
  const parsed = ProductSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: 'Invalid product data' };

  try {
    await db.product.update({ where: { id }, data: parsed.data });
    revalidatePath('/');
    revalidatePath('/collections');
    revalidatePath('/admin/inventory');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to update product.' };
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.product.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/collections');
    revalidatePath('/admin/inventory');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to delete product.' };
  }
}

export async function getAdminStats() {
  const [totalOrders, totalProducts, pendingOrders, lowStockProducts, unreadOrders, unreadMessages] = await Promise.all([
    db.order.count(),
    db.product.count(),
    db.order.count({ where: { status: 'PENDING' } }),
    db.product.count({ where: { stock: { lte: 3 }, isActive: true } }),
    db.order.count({ where: { isRead: false } }),
    db.contactMessage.count({ where: { isRead: false } }),
  ]);

  const revenueAgg = await db.order.aggregate({
    _sum: { total: true },
    where: { paymentStatus: 'PAID' },
  });

  const recentOrders = await db.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      createdAt: true,
      total: true,
      status: true,
      isRead: true,
      items: {
        take: 1,
        select: { productName: true },
      },
      shippingAddress: true,
    },
  });

  const recentMessages = await db.contactMessage.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      createdAt: true,
      name: true,
      subject: true,
      isRead: true,
    },
  });

  return {
    totalOrders,
    totalProducts,
    pendingOrders,
    lowStockProducts,
    totalRevenue: revenueAgg._sum.total ?? 0,
    unreadOrders,
    unreadMessages,
    recentOrders,
    recentMessages,
  };
}
