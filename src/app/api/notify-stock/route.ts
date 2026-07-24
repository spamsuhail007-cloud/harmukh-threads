import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { sendTelegramAlert } from '@/lib/telegram';

const Schema = z.object({
  email: z.string().email(),
  productId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, productId } = Schema.parse(body);

    // Verify product exists and fetch details for the notification
    const product = await db.product.findUnique({ 
      where: { id: productId }, 
      select: { id: true, name: true, price: true, category: true, slug: true } 
    });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    await db.stockNotification.upsert({
      where: { email_productId: { email: email.toLowerCase(), productId } },
      create: { email: email.toLowerCase(), productId },
      update: {},
    });

    // Send Telegram Alert for out-of-stock request
    await sendTelegramAlert(
      `🔔 <b>STOCK ALERT REQUEST</b>\n` +
      `📧 <b>Customer Email:</b> ${email.toLowerCase()}\n` +
      `📦 <b>Product:</b> ${product.name} (${product.category})\n` +
      `💰 <b>Price:</b> ₹${product.price.toLocaleString('en-IN')}\n\n` +
      `🔗 <a href="https://harmukhthreads.com/products/${product.slug}">View Product</a>`
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
