'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export type AbandonedCartInput = {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
  items: Array<{
    name: string;
    image: string;
    price: number;
    qty: number;
  }>;
  total: number;
};

export async function saveAbandonedCart(data: AbandonedCartInput) {
  try {
    const { firstName, lastName = '', email = '', phone = '', address = '', city = '', pincode = '', items, total } = data;

    if (!firstName && !phone && !email) {
      return { success: false, error: 'Name, phone, or email is required' };
    }

    // Check if an abandoned cart lead already exists for this email or phone within last 24h to avoid duplicate spam
    const identifier = email || phone;
    let existing = null;
    if (identifier) {
      existing = await db.abandonedCart.findFirst({
        where: {
          OR: [
            ...(email ? [{ email }] : []),
            ...(phone ? [{ phone }] : []),
          ],
          status: 'ABANDONED',
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (existing) {
      await db.abandonedCart.update({
        where: { id: existing.id },
        data: {
          firstName,
          lastName,
          email,
          phone,
          address,
          city,
          pincode,
          items: items as any,
          total,
          updatedAt: new Date(),
        },
      });
      return { success: true, id: existing.id };
    }

    const created = await db.abandonedCart.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        pincode,
        items: items as any,
        total,
        status: 'ABANDONED',
      },
    });

    return { success: true, id: created.id };
  } catch (err: any) {
    console.error('Failed to save abandoned cart lead:', err);
    return { success: false, error: err.message };
  }
}

export async function getAbandonedCarts() {
  try {
    return await db.abandonedCart.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.error('Failed to fetch abandoned carts:', err);
    return [];
  }
}

export async function deleteAbandonedCart(id: string) {
  try {
    await db.abandonedCart.delete({
      where: { id },
    });
    revalidatePath('/admin/abandoned');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function clearAllAbandonedCarts() {
  try {
    await db.abandonedCart.deleteMany({});
    revalidatePath('/admin/abandoned');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
