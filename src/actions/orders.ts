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
  try {
    const parsed = OrderSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: 'Invalid order data: ' + parsed.error.message };
    }

    const recaptchaResult = await verifyRecaptcha(parsed.data.token);
    if (!recaptchaResult.success) {
      const errorDetails = recaptchaResult.errorCodes 
        ? `Codes: ${recaptchaResult.errorCodes.join(',')}` 
        : `Score: ${recaptchaResult.score || 'N/A'}`;
      return { success: false, error: `Google reCAPTCHA verification failed. (${errorDetails})` };
    }

    const { items, token, ...customerData } = parsed.data;
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const orderNumber = generateOrderNumber();

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
    
    // Attempt sending notifications, but log if they fail so they don't block order completion
    try {
      await sendOrderConfirmationEmail(emailPayload);
    } catch (e) {
      console.error('Failed to send customer order confirmation email:', e);
    }

    try {
      await sendAdminOrderNotification(emailPayload);
    } catch (e) {
      console.error('Failed to send admin order notification email:', e);
    }

    // Telegram alert intentionally NOT sent here.
    // It fires only after the customer confirms payment by clicking
    // "I've Paid" on the /orders/pay page — see pay/page.tsx.

    revalidatePath('/admin/orders');
    return { success: true, orderNumber: order.orderNumber, orderId: order.id };
  } catch (err: any) {
    console.error('Order creation critical error:', err);
    return { success: false, error: err.message || 'An unexpected error occurred while placing the order' };
  }
}

// Called from /orders/pay when customer clicks "I've Paid — Notify via WhatsApp"
export async function sendPaymentConfirmedAlert(orderNumber: string, amount: number) {
  try {
    // Fetch order details from DB to include customer name + items
    const order = await db.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    const name  = order ? `${order.firstName} ${order.lastName}` : 'Customer';
    const phone = order?.phone || 'N/A';
    const itemSummary = order?.items.map(i => `  • ${i.name} ×${i.qty}`).join('\n') || '';
    const total = amount || order?.total || 0;

    await sendTelegramAlert(
      `💰 <b>PAYMENT CONFIRMED</b> #${orderNumber}\n` +
      `👤 ${name}\n` +
      `📞 ${phone}\n` +
      `💵 ₹${total.toLocaleString('en-IN')}\n\n` +
      `${itemSummary}\n\n` +
      `✅ Customer clicked "I've Paid" — verify UPI and confirm order.\n` +
      `🔗 <a href="https://harmukhthreads.com/admin/orders">View in Admin</a>`
    );
    return { ok: true };
  } catch (e) {
    console.error('Failed to send payment confirmed Telegram alert:', e);
    return { ok: false };
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

export async function deleteOrder(orderId: string) {
  await db.order.delete({
    where: { id: orderId },
  });
  revalidatePath('/admin/orders');
}

export async function markOrdersAsRead() {
  await db.order.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  });
}
