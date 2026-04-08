'use client';
import { useState, useTransition } from 'react';
import { updateOrderStatus } from '@/actions/orders';
import { type Order, type OrderItem } from '@prisma/client';
import { formatPrice } from '@/lib/utils';

type OrderWithItems = Order & { items: OrderItem[] };

export function OrderRow({ order }: { order: OrderWithItems }) {
  const [isPending, startTransition] = useTransition();

  const handleStatus = (status: string) => {
    startTransition(() => {
      updateOrderStatus(order.id, status);
    });
  };

  const statusBadge = (s: string) => {
    switch(s) {
      case 'PENDING': return 'badge-warn';
      case 'CONFIRMED': return 'badge-primary';
      case 'SHIPPED': return 'badge-secondary';
      case 'DELIVERED': return 'badge-success';
      case 'CANCELLED': return 'badge-error';
      default: return 'badge-secondary';
    }
  };

  return (
    <tr>
      <td className="name-col">{order.orderNumber}</td>
      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
      <td>
        <div style={{ fontWeight: 600 }}>{order.firstName} {order.lastName}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>{order.city}, {order.country}</div>
      </td>
      <td className="msg-col" style={{ maxWidth: '200px' }}>
        {order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
      </td>
      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{formatPrice(order.total)}</td>
      <td>
        <span className={`badge ${statusBadge(order.status)}`}>{order.status}</span>
      </td>
      <td>
        <select 
          style={{ padding: '4px', fontSize: '0.75rem', borderRadius: '4px' }}
          value={order.status}
          onChange={(e) => handleStatus(e.target.value)}
          disabled={isPending}
        >
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </td>
    </tr>
  );
}


