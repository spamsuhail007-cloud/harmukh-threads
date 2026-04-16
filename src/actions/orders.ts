'use server';
import { db } from '@/lib/db';
import { generateOrderNumber } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from '@/lib/email';

const OrderSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(8),
  address: z.string().min(5),
  city: z.string().min(1),
  pincode: z.string().min(4),
  country: z.string().default('India'),
  paymentMethod: z.string().default('COD'),
  items: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    image: z.string(),
    price: z.number(),
    qty: z.number().min(1),
  })),
});

export async function createOrder(data: unknown) {
  const parsed = OrderSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: 'Invalid order data' };
  }

  const { items, ...customerData } = parsed.data;
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const orderNumber = generateOrderNumber();

  try {
    const order = await db.order.create({
      data: {
        ...customerData,
        orderNumber,
        subtotal,
        shipping: 0,
        total: subtotal,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            name: item.name,
            image: item.image,
            price: item.price,
            qty: item.qty,
          })),
        },
      },
    });
    revalidatePath('/admin/orders');
    return { success: true, orderNumber: order.orderNumber, orderId: order.id };
  } catch (err) {
    console.error('Order creation error:', err);
    return { success: false, error: 'Failed to create order' };
  }
}

export async function getOrders() {
  return db.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateOrderStatus(orderId: string, status: string) {
  await db.order.update({
    where: { id: orderId },
    data: { status: status as never },
  });

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (order) {
    const orderData = {
      orderNumber: order.orderNumber,
      firstName: order.firstName,
      lastName: order.lastName,
      email: order.email,
      phone: order.phone,
      address: order.address,
      city: order.city,
      pincode: order.pincode,
      country: order.country,
      total: order.total,
      subtotal: order.subtotal,
      shipping: order.shipping,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      items: order.items.map(i => ({
        name: i.name,
        image: i.image,
        price: i.price,
        qty: i.qty,
      })),
    };

    if (status === 'CONFIRMED') {
      await sendOrderConfirmationEmail(orderData);
    } else if (['SHIPPED', 'DELIVERED', 'CANCELLED'].includes(status)) {
      await sendOrderStatusEmail(orderData, status);
    }
  }

  revalidatePath('/admin/orders');
}
