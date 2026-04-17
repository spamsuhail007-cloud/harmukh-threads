import { getAdminStats } from '@/actions/admin';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function timeAgo(date: Date | string) {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  PROCESSING: '#3b82f6',
  SHIPPED: '#8b5cf6',
  DELIVERED: '#10b981',
  CANCELLED: '#ef4444',
};

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  // Merge orders and messages into a single activity feed sorted by date
  const activity = [
    ...stats.recentOrders.map((o) => {
      const addr = o.shippingAddress as any;
      const customerName = addr?.name || 'Customer';
      const productName = o.items[0]?.productName || 'an item';
      return {
        type: 'order' as const,
        id: o.id,
        label: `${customerName} ordered ${productName}`,
        sub: `${formatPrice(o.total)} · ${o.status}`,
        time: o.createdAt,
        isNew: !o.isRead,
        status: o.status,
        href: '/admin/orders',
      };
    }),
    ...stats.recentMessages.map((m) => ({
      type: 'message' as const,
      id: m.id,
      label: `${m.name} sent an enquiry`,
      sub: m.subject || 'No subject',
      time: m.createdAt,
      isNew: !m.isRead,
      status: null,
      href: '/admin/messages',
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

  return (
    <>
      <h1 className="admin-page-title">Dashboard Overview</h1>

      {/* ── Stat Cards ── */}
      <div className="admin-stat-grid" style={{ marginBottom: 'var(--space-xl)' }}>
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

      {/* ── Unread Badges Row ── */}
      {(stats.unreadOrders > 0 || stats.unreadMessages > 0) && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
          {stats.unreadOrders > 0 && (
            <Link href="/admin/orders" style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: '#fff7ed', border: '1px solid #fed7aa',
              borderRadius: '10px', padding: '12px 18px', textDecoration: 'none',
              color: '#92400e', fontWeight: 600, fontSize: '0.9rem',
            }}>
              <span style={{ background: '#f97316', color: '#fff', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                {stats.unreadOrders}
              </span>
              New Order{stats.unreadOrders > 1 ? 's' : ''} — View →
            </Link>
          )}
          {stats.unreadMessages > 0 && (
            <Link href="/admin/messages" style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: '#fffbeb', border: '1px solid #fde68a',
              borderRadius: '10px', padding: '12px 18px', textDecoration: 'none',
              color: '#78350f', fontWeight: 600, fontSize: '0.9rem',
            }}>
              <span style={{ background: '#eab308', color: '#fff', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                {stats.unreadMessages}
              </span>
              New Enquir{stats.unreadMessages > 1 ? 'ies' : 'y'} — View →
            </Link>
          )}
        </div>
      )}

      {/* ── Two-column lower section ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)' }}>

        {/* Quick Actions */}
        <div style={{ background: 'var(--surface-container-low)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)' }}>Quick Actions</h3>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
            <Link href="/admin/products/new" className="btn btn-primary btn-sm">Add New Product</Link>
            <Link href="/admin/inventory" className="btn btn-secondary btn-sm">Manage Inventory</Link>
            <Link href="/admin/reviews" className="btn btn-ghost btn-sm">Manage Reviews</Link>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div style={{ background: 'var(--surface-container-low)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
            <h3 style={{ fontSize: '1rem', margin: 0 }}>Recent Activity</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link href="/admin/orders" style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none' }}>Orders</Link>
              <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>·</span>
              <Link href="/admin/messages" style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none' }}>Messages</Link>
            </div>
          </div>

          {activity.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', margin: 0 }}>
              No activity yet. Orders and enquiries will appear here.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activity.map((item) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  href={item.href}
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px', borderRadius: '8px', background: item.isNew ? (item.type === 'order' ? '#fff7ed' : '#fffbeb') : '#fff', border: `1px solid ${item.isNew ? (item.type === 'order' ? '#fed7aa' : '#fde68a') : 'var(--outline-variant)'}`, transition: 'background 0.15s' }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem',
                    background: item.type === 'order' ? '#f97316' : '#eab308', color: '#fff',
                  }}>
                    {item.type === 'order' ? '🛍' : '✉️'}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                        {item.label}
                      </span>
                      {item.isNew && (
                        <span style={{ fontSize: '0.65rem', background: '#ef4444', color: '#fff', borderRadius: '4px', padding: '1px 5px', fontWeight: 700, flexShrink: 0 }}>NEW</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                      {item.status && (
                        <span style={{ fontSize: '0.7rem', color: STATUS_COLORS[item.status] || '#888', fontWeight: 600 }}>
                          {item.status}
                        </span>
                      )}
                      <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                        {item.sub}
                      </span>
                    </div>
                  </div>

                  {/* Time */}
                  <span style={{ fontSize: '0.72rem', color: 'var(--on-surface-variant)', flexShrink: 0, marginTop: '2px' }}>
                    {timeAgo(item.time)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
