import { getOrders, markOrdersAsRead } from '@/actions/orders';
import { OrderRow } from './OrderRow';
import { ReadMarker } from '@/components/ui/ReadMarker';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <>
      <ReadMarker action={markOrdersAsRead} />
      <h1 className="admin-page-title">Orders</h1>
      <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginBottom: 'var(--space-md)' }}>
        Click any row to expand customer contact details, order items, and UPI payment info.
      </p>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center' }}>No orders yet.</td></tr>
            ) : (
              orders.map(order => <OrderRow key={order.id} order={order} />)
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
