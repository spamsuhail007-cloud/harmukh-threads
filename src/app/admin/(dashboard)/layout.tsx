import Link from 'next/link';
import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <>
      <Navbar />
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-title">Dashboard</div>
          <Link href="/admin" className="admin-tab">Overview</Link>
          <div className="admin-sidebar-title" style={{ marginTop: 'var(--space-md)' }}>Management</div>
          <Link href="/admin/orders" className="admin-tab">Orders</Link>
          <Link href="/admin/messages" className="admin-tab">Messages</Link>
          <Link href="/admin/inventory" className="admin-tab">Inventory</Link>
          <div style={{ marginTop: 'auto', padding: 'var(--space-lg)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '8px' }}>
              Logged in as {session.user?.email}
            </div>
            <form action={async () => { 'use server'; await signOut({ redirectTo: '/admin/login' }); }}>
              <button type="submit" className="btn btn-ghost btn-sm btn-full" style={{ justifyContent: 'flex-start' }}>Sign Out</button>
            </form>
          </div>
        </aside>
        <main className="admin-content page-fade-in">
          {children}
        </main>
      </div>
    </>
  );
}
