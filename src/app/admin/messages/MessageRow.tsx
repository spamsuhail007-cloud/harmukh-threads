'use client';
import { useState, useTransition } from 'react';
import { updateMessageStatus } from '@/actions/contact';
import { type ContactMessage } from '@prisma/client';

export function MessageRow({ msg }: { msg: ContactMessage }) {
  const [isPending, startTransition] = useTransition();

  const handleStatus = (status: string) => {
    startTransition(() => {
      updateMessageStatus(msg.id, status);
    });
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
      </td>
    </tr>
  );
}
