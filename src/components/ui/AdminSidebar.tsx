'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNotifications } from '@/components/providers/AdminNotificationProvider';

interface AdminSidebarProps {
  email: string;
  signOutAction: () => Promise<void>;
}

export function AdminSidebar({ email, signOutAction }: AdminSidebarProps) {
  const pathname = usePathname();
  const { newOrders, newMessages, clearOrders, clearMessages } = useNotifications();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-title">Dashboard</div>
      <Link href="/admin" className={`admin-tab${pathname === '/admin' ? ' active' : ''}`}>
        Overview
      </Link>

      <div className="admin-sidebar-title" style={{ marginTop: 'var(--space-md)' }}>Management</div>

      {/* Orders — with live notification badge */}
      <Link
        href="/admin/orders"
        className={`admin-tab${isActive('/admin/orders') ? ' active' : ''}`}
        onClick={clearOrders}
      >
        <span style={{ flex: 1 }}>Orders</span>
        {newOrders > 0 && (
          <span
            className="admin-notif-pill"
            title={`${newOrders} new order${newOrders > 1 ? 's' : ''}`}
          >
            {newOrders > 99 ? '99+' : newOrders}
          </span>
        )}
      </Link>

      {/* Messages — with live notification badge */}
      <Link
        href="/admin/messages"
        className={`admin-tab${isActive('/admin/messages') ? ' active' : ''}`}
        onClick={clearMessages}
      >
        <span style={{ flex: 1 }}>Messages</span>
        {newMessages > 0 && (
          <span
            className="admin-notif-pill"
            title={`${newMessages} new enquir${newMessages > 1 ? 'ies' : 'y'}`}
          >
            {newMessages > 99 ? '99+' : newMessages}
          </span>
        )}
      </Link>

      <Link
        href="/admin/inventory"
        className={`admin-tab${isActive('/admin/inventory') ? ' active' : ''}`}
      >
        Inventory
      </Link>

      {/* Account / Sign out */}
      <div style={{ marginTop: 'auto', padding: 'var(--space-lg)' }}>
        <div
          style={{
            fontSize: '0.75rem',
            color: 'var(--on-surface-variant)',
            marginBottom: '8px',
            wordBreak: 'break-all',
          }}
        >
          Logged in as {email}
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="btn btn-ghost btn-sm btn-full"
            style={{ justifyContent: 'flex-start' }}
          >
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
