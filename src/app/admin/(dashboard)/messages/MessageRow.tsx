'use client';
import { useState, useTransition } from 'react';
import { updateMessageStatus, deleteMessage } from '@/actions/contact';
import { type ContactMessage } from '@prisma/client';

export function MessageRow({ msg }: { msg: ContactMessage }) {
  const [isPending, startTransition] = useTransition();

  const handleStatus = (status: string) => {
    startTransition(() => {
      updateMessageStatus(msg.id, status);
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to permanently delete this message?')) {
      startTransition(() => {
        deleteMessage(msg.id);
      });
    }
  };

  return (
    <tr>
      <td className="name-col">{msg.name}<br/><span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--on-surface-variant)' }}>{msg.email}</span></td>
      <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
      <td style={{ fontWeight: 600 }}>{msg.subject}</td>
      <td className="msg-col">{msg.message}</td>
      <td>
        <span className={`badge ${msg.status === 'NEW' ? 'badge-primary' : msg.status === 'REPLIED' ? 'badge-warn' : 'badge-success'}`}>
          {msg.status}
        </span>
      </td>
      <td>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select 
            style={{ padding: '4px', fontSize: '0.75rem', borderRadius: '4px' }}
            value={msg.status}
            onChange={(e) => handleStatus(e.target.value)}
            disabled={isPending}
          >
            <option value="NEW">New</option>
            <option value="REPLIED">Replied</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          <button 
            type="button"
            className="btn btn-outline btn-sm"
            style={{ padding: '4px 8px', color: 'var(--error)' }}
            onClick={handleDelete}
            disabled={isPending}
            title="Delete Message"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}
