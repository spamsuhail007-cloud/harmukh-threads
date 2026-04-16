'use server';
import { db } from '@/lib/db';
import { generateOrderNumber } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { sendOrderConfirmationEmail, sendOrderStatusEmail, sendAdminOrderNotification } from '@/lib/email';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { sendTelegramAlert } from '@/lib/telegram';

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
  token: z.string().min(1),
});

export async function createOrder(data: unknown) {
  const parsed = OrderSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: 'Invalid order data' };
  }

  const isValidBot = await verifyRecaptcha(parsed.data.token);
  if (!isValidBot) {
    return { success: false, error: 'Google reCAPTCHA verification failed. Are you a bot?' };
  }

  const { items, token, ...customerData } = parsed.data;
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

    const emailPayload = { 
      ...customerData, 
      orderNumber, 
      items, 
      total: subtotal, 
      subtotal, 
      shipping: 0, 
      paymentStatus: 'PENDING' 
    };
    await sendOrderConfirmationEmail(emailPayload);
    await sendAdminOrderNotification(emailPayload);

    const itemSummary = items.map(i => `  • ${i.name} ×${i.qty}`).join('\n');
    await sendTelegramAlert(
      `🛒 <b>NEW ORDER</b> #${orderNumber}\n` +
      `👤 ${customerData.firstName} ${customerData.lastName}\n` +
      `📞 ${customerData.phone}\n` +
      `💰 ₹${subtotal.toLocaleString('en-IN')}\n\n` +
      `${itemSummary}\n\n` +
      `🔗 <a href="https://harmukhthreads.com/admin/orders">View in Admin</a>`
    );

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
    } else if (['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(status)) {
      await sendOrderStatusEmail(orderData, status);
    }

    const statusEmoji: Record<string, string> = {
      CONFIRMED: '✅', PROCESSING: '⏳', SHIPPED: '✈️', DELIVERED: '🎁', CANCELLED: '❌'
    };
    await sendTelegramAlert(
      `${statusEmoji[status] || '📦'} Order <b>#${order.orderNumber}</b> → <b>${status}</b>\n` +
      `👤 ${order.firstName} ${order.lastName}\n` +
      `💰 ₹${order.total.toLocaleString('en-IN')}`
    );
  }

  revalidatePath('/admin/orders');
}
