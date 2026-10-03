'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';

const initialMessages = [
  {
    id: 1,
    from: 'OMJ Trading Desk',
    email: 'trading@omj.com',
    subject: 'Re: EN590 uplift confirmation',
    preview: 'Please confirm the new price band before we release the cargo.',
    status: 'Awaiting reply',
    thread: [
      { sender: 'OMJ Trading Desk', text: 'Hi team, the market has tightened. We need confirmation before we finalise the EN590 uplift.', direction: 'inbound' },
      { sender: 'You', text: 'Thanks, we will confirm before 15:00 today.', direction: 'outbound' },
    ],
  },
  {
    id: 2,
    from: 'Finance Ops',
    email: 'finance@northseafuels.com',
    subject: 'VAT return sign-off',
    preview: 'Can you sign off the final return before submission?',
    status: 'Reviewing',
    thread: [
      { sender: 'Finance Ops', text: 'The VAT return is ready for sign-off. Could you check the EC sales and duty totals?', direction: 'inbound' },
    ],
  },
  {
    id: 3,
    from: 'Supplier Desk',
    email: 'ops@suppliernet.co',
    subject: 'Delivery timing for ULSD',
    preview: 'We have a revised ETA for the next uplift window.',
    status: 'Action needed',
    thread: [
      { sender: 'Supplier Desk', text: 'The revised window is 14:30 to 17:00. Please confirm the discharge slot.', direction: 'inbound' },
    ],
  },
];

export default function MailPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedId, setSelectedId] = useState(initialMessages[0].id);
  const [replyText, setReplyText] = useState('');

  const selected = useMemo(
    () => messages.find((message) => message.id === selectedId) ?? messages[0],
    [messages, selectedId],
  );

  const handleSendReply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!replyText.trim()) return;

    setMessages((current) =>
      current.map((message) =>
        message.id === selectedId
          ? {
              ...message,
              preview: replyText.trim(),
              status: 'Replied',
              thread: [
                ...message.thread,
                { sender: 'You', text: replyText.trim(), direction: 'outbound' },
              ],
            }
          : message,
      ),
    );

    setReplyText('');
  };

  return (
    <main className="module-shell">
      <header className="detail-topbar">
        <div>
          <p className="eyebrow">Communication</p>
          <h1>Inbox</h1>
        </div>
        <div className="module-actions">
          <Link href="/" className="secondary-button">
            Back to dashboard
          </Link>
          <button type="button" className="primary-button">
            New message
          </button>
        </div>
      </header>

      <section className="mail-layout">
        <aside className="mail-panel">
          <div className="detail-header">
            <h3>Threads</h3>
            <span className="status-chip">{messages.length}</span>
          </div>

          <div className="thread-list">
            {messages.map((message) => (
              <button
                key={message.id}
                type="button"
                className={`thread-item ${message.id === selected.id ? 'active' : ''}`}
                onClick={() => setSelectedId(message.id)}
                style={{ textAlign: 'left' }}
              >
                <strong>{message.from}</strong>
                <span>{message.subject}</span>
                <small>{message.status}</small>
              </button>
            ))}
          </div>
        </aside>

        <div className="mail-panel">
          <div className="detail-header">
            <h3>{selected.subject}</h3>
            <span className="status-badge">{selected.status}</span>
          </div>

          <div className="mail-thread">
            {selected.thread.map((entry, index) => (
              <div key={`${entry.sender}-${index}`} className={`message-bubble ${entry.direction === 'outbound' ? 'outbound' : ''}`}>
                <strong>{entry.sender}</strong>
                <p style={{ margin: '8px 0 0', color: '#dfeaf8', lineHeight: 1.6 }}>{entry.text}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="mail-panel">
          <div className="detail-header">
            <h3>Reply</h3>
          </div>

          <form onSubmit={handleSendReply} className="composer">
            <label>
              <span style={{ display: 'block', marginBottom: 8, color: '#9bb0c6', fontWeight: 700 }}>To</span>
              <input value={selected.email} readOnly />
            </label>

            <label>
              <span style={{ display: 'block', marginBottom: 8, color: '#9bb0c6', fontWeight: 700 }}>Message</span>
              <textarea
                value={replyText}
                onChange={(event) => setReplyText(event.target.value)}
                placeholder="Type your response here..."
              />
            </label>

            <button type="submit" className="primary-button">
              Send reply
            </button>
          </form>
        </aside>
      </section>
    </main>
  );
}
