import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { AdminSidebar } from '@/components/ui/AdminSidebar';
import { AdminNotificationProvider } from '@/components/providers/AdminNotificationProvider';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  // Server action for sign out
  const signOutAction = async () => {
    'use server';
    await signOut({ redirectTo: '/admin/login' });
  };

  return (
    <AdminNotificationProvider>
      <Navbar />
      <div className="admin-layout">
        <AdminSidebar
          email={session.user?.email ?? ''}
          signOutAction={signOutAction}
        />
        <main className="admin-content page-fade-in">
          {children}
        </main>
      </div>
    </AdminNotificationProvider>
  );
}
