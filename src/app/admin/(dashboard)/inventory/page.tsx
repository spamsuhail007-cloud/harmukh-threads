import { db } from '@/lib/db';
import { InventoryRow } from './InventoryRow';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>Inventory</h1>
        <Link href="/admin/products/new" className="btn btn-primary btn-sm">Add Product</Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Quick Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center' }}>No products found.</td></tr>
            ) : (
              products.map(p => <InventoryRow key={p.id} product={p} />)
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
