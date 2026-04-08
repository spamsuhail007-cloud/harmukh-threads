import { getAdminStats } from '@/actions/admin';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  return (
    <>
      <h1 className="admin-page-title">Dashboard Overview</h1>
      
      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Revenue</div>
          <div className="admin-stat-value">{formatPrice(stats.totalRevenue)}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Active Orders</div>
          <div className="admin-stat-value">{stats.pendingOrders}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Orders</div>
          <div className="admin-stat-value" style={{ color: 'var(--on-surface-variant)' }}>{stats.totalOrders}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Low Stock Alerts</div>
          <div className="admin-stat-value" style={{ color: stats.lowStockProducts > 0 ? 'var(--error)' : 'var(--on-surface-variant)' }}>
            {stats.lowStockProducts}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)' }}>
        <div style={{ background: 'var(--surface-container-low)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)' }}>Quick Actions</h3>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <Link href="/admin/products/new" className="btn btn-primary btn-sm">Add New Product</Link>
            <Link href="/admin/inventory" className="btn btn-secondary btn-sm">Manage Inventory</Link>
          </div>
        </div>
        <div style={{ background: 'var(--surface-container-low)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)' }}>Recent Activity</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>See Orders and Messages tabs for latest updates.</p>
        </div>
      </div>
    </>
  );
}
