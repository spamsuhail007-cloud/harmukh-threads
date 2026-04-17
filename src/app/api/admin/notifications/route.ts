import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // Protect — admin only
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const sinceParam = searchParams.get('since');
  const since = sinceParam ? new Date(sinceParam) : new Date(Date.now() - 60_000);

  const [newOrdersSince, newMessagesSince, unreadOrders, unreadMessages, latestOrder, latestMessage] = await Promise.all([
    db.order.count({ where: { createdAt: { gt: since } } }),
    db.contactMessage.count({ where: { createdAt: { gt: since } } }),
    db.order.count({ where: { isRead: false } }),
    db.contactMessage.count({ where: { isRead: false } }),
    db.order.findFirst({ orderBy: { createdAt: 'desc' }, select: { id: true, orderNumber: true, firstName: true, total: true, createdAt: true } }),
    db.contactMessage.findFirst({ orderBy: { createdAt: 'desc' }, select: { id: true, name: true, subject: true, createdAt: true } }),
  ]);

  return NextResponse.json({
    newOrders: newOrdersSince,
    newMessages: newMessagesSince,
    unreadOrders,
    unreadMessages,
    latestOrder,
    latestMessage,
    checkedAt: new Date().toISOString(),
  });
}
