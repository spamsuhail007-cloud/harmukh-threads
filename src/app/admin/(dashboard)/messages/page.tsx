import { getMessages, markMessagesAsRead } from '@/actions/contact';
import { MessageRow } from './MessageRow';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const messages = await getMessages();
  await markMessagesAsRead();

  return (
    <>
      <h1 className="admin-page-title">Messages & Enquiries</h1>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sender</th>
              <th>Date</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center' }}>No messages found.</td></tr>
            ) : (
              messages.map(msg => <MessageRow key={msg.id} msg={msg} />)
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
