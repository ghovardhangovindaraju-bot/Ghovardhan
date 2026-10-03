'use client';

import Link from 'next/link';
import { useState } from 'react';

import { sampleJournalEntries, type JournalEntry } from '@/lib/erp';

export default function GeneralLedgerPage() {
  const [entries, setEntries] = useState<JournalEntry[]>(sampleJournalEntries);
  const [form, setForm] = useState({ description: '', amount: '', type: 'debit' as JournalEntry['type'], status: 'Draft' as JournalEntry['status'] });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEntries((current) => [
      {
        id: `JNL-${current.length + 4401}`,
        description: form.description,
        amount: form.amount,
        type: form.type,
        status: form.status,
      },
      ...current,
    ]);

    setForm({ description: '', amount: '', type: 'debit', status: 'Draft' });
  };

  const kpis = [
    { label: 'Trial balance', value: 'Balanced' },
    { label: 'Open journals', value: String(entries.length) },
    { label: 'FX revalue', value: '£174k' },
    { label: 'Close status', value: 'In progress' },
  ];

  return (
    <main className="module-shell">
      <header className="module-header">
        <div>
          <p className="eyebrow">General ledger</p>
          <h1>Nominal codes, journals and close</h1>
        </div>
        <div className="module-actions">
          <Link href="/" className="secondary-button">Dashboard</Link>
        </div>
      </header>

      <section className="detail-card" style={{ marginBottom: 20 }}>
        <div className="detail-header">
          <h3>Add journal entry</h3>
          <span className="status-chip">Editable</span>
        </div>
        <form onSubmit={handleSubmit} className="cargo-form" style={{ marginTop: 16 }}>
          <div className="form-grid">
            <label>
              <span>Description</span>
              <input value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
            </label>
            <label>
              <span>Amount</span>
              <input value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} />
            </label>
            <label>
              <span>Type</span>
              <select value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as JournalEntry['type'] }))}>
                <option value="debit">Debit</option>
                <option value="credit">Credit</option>
              </select>
            </label>
            <label>
              <span>Status</span>
              <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as JournalEntry['status'] }))}>
                <option value="Draft">Draft</option>
                <option value="Posted">Posted</option>
                <option value="Reviewed">Reviewed</option>
              </select>
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="primary-button">Add journal</button>
          </div>
        </form>
      </section>

      <section className="kpi-grid">
        {kpis.map((kpi) => (
          <article key={kpi.label} className="kpi-card">
            <p className="label">{kpi.label}</p>
            <strong>{kpi.value}</strong>
          </article>
        ))}
      </section>

      <section className="module-table-wrap">
        <table className="module-table">
          <thead>
            <tr>
              <th>Journal</th>
              <th>Description</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.description}</td>
                <td>{row.type}</td>
                <td>£{Number(row.amount).toLocaleString()}</td>
                <td><span className="status-badge">{row.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
