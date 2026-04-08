import { getOrders } from '@/actions/orders';
import { OrderRow } from './OrderRow';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <>
      <h1 className="admin-page-title">Orders</h1>
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
              <tr><td colSpan={7} style={{ textAlign: 'center' }}>No orders found.</td></tr>
            ) : (
              orders.map(order => <OrderRow key={order.id} order={order} />)
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
