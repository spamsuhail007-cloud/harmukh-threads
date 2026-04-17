'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────

interface Toast {
  id: string;
  type: 'order' | 'message';
  title: string;
  sub: string;
  href: string;
  exiting?: boolean;
}

interface NotifState {
  unreadOrders: number;
  unreadMessages: number;
  clearOrders: () => void;
  clearMessages: () => void;
}

// ─── Context ──────────────────────────────────────────────────

export const NotifContext = createContext<NotifState>({
  unreadOrders: 0,
  unreadMessages: 0,
  clearOrders: () => {},
  clearMessages: () => {},
});

export const useNotifications = () => useContext(NotifContext);

// ─── Toast Component ──────────────────────────────────────────

const TOAST_DURATION = 6000;

function ToastCard({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  return (
    <div
      className={`toast toast-${toast.type}${toast.exiting ? ' toast-exit' : ''}`}
      style={{ '--toast-duration': `${TOAST_DURATION}ms` } as React.CSSProperties}
      role="alert"
    >
      <div className="toast-icon">{toast.type === 'order' ? '🛒' : '✉️'}</div>
      <div className="toast-body">
        <div className="toast-title">{toast.title}</div>
        <div className="toast-sub">{toast.sub}</div>
        <Link href={toast.href} className="toast-action" onClick={onClose}>
          View now →
        </Link>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Dismiss">✕</button>
      <div className="toast-progress" />
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────

const POLL_INTERVAL = 30_000; // 30 seconds
const LS_KEY = 'ht_admin_last_checked';

export function AdminNotificationProvider({ children }: { children: React.ReactNode }) {
  const [unreadOrders, setUnreadOrders] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isFirstRun = useRef(true);

  const dismissToast = useCallback((id: string) => {
    // Mark exiting for animation, then remove
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 320);
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id' | 'exiting'>) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev.slice(-4), { ...toast, id }]); // keep max 5
    setTimeout(() => dismissToast(id), TOAST_DURATION);
  }, [dismissToast]);

  const poll = useCallback(async () => {
    try {
      const since = localStorage.getItem(LS_KEY) ?? new Date(Date.now() - POLL_INTERVAL).toISOString();
      const res = await fetch(`/api/admin/notifications?since=${encodeURIComponent(since)}`);
      if (!res.ok) return;
      const data = await res.json();

      const { newOrders: nO, newMessages: nM, unreadOrders: uO, unreadMessages: uM, latestOrder, latestMessage, checkedAt } = data;
      localStorage.setItem(LS_KEY, checkedAt);

      // Always update global unread badge counters from backend
      setUnreadOrders(uO);
      setUnreadMessages(uM);

      if (isFirstRun.current) {
        // On mount: don't show toast popups for backlog
        isFirstRun.current = false;
        return;
      }

      if (nO > 0) {
        addToast({
          type: 'order',
          title: nO === 1 ? 'New Order Received!' : `${nO} New Orders Received!`,
          sub: latestOrder
            ? `#${latestOrder.orderNumber} from ${latestOrder.firstName}`
            : 'Check the Orders tab for details.',
          href: '/admin/orders',
        });
      }

      if (nM > 0) {
        addToast({
          type: 'message',
          title: nM === 1 ? 'New Enquiry Received!' : `${nM} New Enquiries Received!`,
          sub: latestMessage
            ? `From ${latestMessage.name}: "${latestMessage.subject}"`
            : 'Check the Messages tab.',
          href: '/admin/messages',
        });
      }
    } catch {
      // Network error — fail silently
    }
  }, [addToast]);

  useEffect(() => {
    // Initialize lastChecked if absent
    if (!localStorage.getItem(LS_KEY)) {
      localStorage.setItem(LS_KEY, new Date().toISOString());
    }
    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearOrders = useCallback(() => {
    // Note: To persist 'read' state correctly, we'd need to update the database statuses
    // For now, this just clears the UI badge until the next poll.
    setUnreadOrders(0);
  }, []);

  const clearMessages = useCallback(() => {
    // Note: To persist 'read' state correctly, we'd need to update the database statuses
    // For now, this just clears the UI badge until the next poll.
    setUnreadMessages(0);
  }, []);

  return (
    <NotifContext.Provider value={{ unreadOrders, unreadMessages, clearOrders, clearMessages }}>
      {children}

      {/* Toast stack */}
      {toasts.length > 0 && (
        <div className="toast-container" aria-live="polite" aria-label="Notifications">
          {toasts.map(t => (
            <ToastCard key={t.id} toast={t} onClose={() => dismissToast(t.id)} />
          ))}
        </div>
      )}
    </NotifContext.Provider>
  );
}
