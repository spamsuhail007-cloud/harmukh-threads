'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export type AbandonedCartInput = {
  sessionId?: string;
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
    const { sessionId, firstName, lastName = '', email = '', phone = '', address = '', city = '', pincode = '', items, total } = data;

    if (!firstName && !phone && !email) {
      return { success: false, error: 'Name, phone, or email is required' };
    }

    // Deduplication check: match by sessionId, email, or phone
    let existing = null;
    if (sessionId) {
      existing = await db.abandonedCart.findUnique({
        where: { id: sessionId },
      });
    }

    if (!existing && (email || phone)) {
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
      const updated = await db.abandonedCart.update({
        where: { id: existing.id },
        data: {
          firstName: firstName || existing.firstName,
          lastName: lastName || existing.lastName,
          email: email || existing.email,
          phone: phone || existing.phone,
          address: address || existing.address,
          city: city || existing.city,
          pincode: pincode || existing.pincode,
          items: items as any,
          total,
          updatedAt: new Date(),
        },
      });
      return { success: true, id: updated.id };
    }

    // Create new lead if no match found
    const created = await db.abandonedCart.create({
      data: {
        ...(sessionId ? { id: sessionId } : {}),
        firstName: firstName || 'Prospect',
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
