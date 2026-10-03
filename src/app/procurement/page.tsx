'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { buildProcurementSummary, defaultContractForm, sampleContracts, type ProcurementContract } from '@/lib/erp';

export default function ProcurementPage() {
  const [contracts, setContracts] = useState<ProcurementContract[]>(sampleContracts);
  const [form, setForm] = useState(defaultContractForm());

  const summary = useMemo(() => buildProcurementSummary(contracts), [contracts]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextContract: ProcurementContract = {
      ...form,
      id: `PC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${contracts.length + 1}`,
    };

    setContracts((current) => [nextContract, ...current]);
    setForm(defaultContractForm());
  };

  const kpis = [
    { label: 'Open cargoes', value: String(summary.openCount) },
    { label: 'Approved volume', value: `${Number(summary.approvedVolume).toLocaleString()} L` },
    { label: 'Contracts pending', value: String(Math.max(contracts.length - 1, 0)) },
    { label: 'Value at risk', value: `£${Number(summary.totalContractValue).toLocaleString()}` },
  ];

  return (
    <main className="module-shell">
      <header className="module-header">
        <div>
          <p className="eyebrow">Procurement</p>
          <h1>Purchase contracts and cargo tracking</h1>
        </div>
        <div className="module-actions">
          <Link href="/" className="secondary-button">Dashboard</Link>
          <Link href="/procurement/new" className="primary-button">New contract</Link>
        </div>
      </header>

      <section className="detail-card" style={{ marginBottom: 20 }}>
        <div className="detail-header">
          <h3>Add procurement contract</h3>
          <span className="status-chip">Live</span>
        </div>
        <form onSubmit={handleSubmit} className="cargo-form" style={{ marginTop: 16 }}>
          <div className="form-grid">
            <label>
              <span>Supplier</span>
              <input value={form.supplier} onChange={(event) => setForm((current) => ({ ...current, supplier: event.target.value }))} placeholder="Astra Marine" />
            </label>
            <label>
              <span>Product</span>
              <input value={form.product} onChange={(event) => setForm((current) => ({ ...current, product: event.target.value }))} placeholder="ULSD 10ppm" />
            </label>
            <label>
              <span>Qty (L)</span>
              <input value={form.quantityLitres} onChange={(event) => setForm((current) => ({ ...current, quantityLitres: event.target.value }))} placeholder="1250000" />
            </label>
            <label>
              <span>Unit price (£/L)</span>
              <input value={form.unitPrice} onChange={(event) => setForm((current) => ({ ...current, unitPrice: event.target.value }))} placeholder="1.12" />
            </label>
            <label>
              <span>ETA</span>
              <input type="date" value={form.eta} onChange={(event) => setForm((current) => ({ ...current, eta: event.target.value }))} />
            </label>
            <label>
              <span>Status</span>
              <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as ProcurementContract['status'] }))}>
                <option value="Draft">Draft</option>
                <option value="Approved">Approved</option>
                <option value="In transit">In transit</option>
                <option value="Received">Received</option>
              </select>
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="primary-button">Add contract</button>
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
              <th>Contract</th>
              <th>Supplier</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Unit price</th>
              <th>ETA</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.supplier}</td>
                <td>{row.product}</td>
                <td>{Number(row.quantityLitres).toLocaleString()} L</td>
                <td>£{Number(row.unitPrice).toFixed(2)}/L</td>
                <td>{row.eta || 'TBC'}</td>
                <td><span className="status-badge">{row.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
