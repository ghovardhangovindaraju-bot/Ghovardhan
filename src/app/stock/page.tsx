'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { buildStockSummary, defaultStockMovementForm, sampleStockMovements, type StockMovement } from '@/lib/erp';

export default function StockPage() {
  const [movements, setMovements] = useState<StockMovement[]>(sampleStockMovements);
  const [form, setForm] = useState(defaultStockMovementForm());

  const summary = useMemo(() => buildStockSummary(movements), [movements]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextMovement: StockMovement = {
      ...form,
      id: `SM-${movements.length + 1}`,
    };

    setMovements((current) => [nextMovement, ...current]);
    setForm(defaultStockMovementForm());
  };

  const kpis = [
    { label: 'Available stock', value: `${Number(summary.onHandLitres).toLocaleString()} L` },
    { label: 'Inventory value', value: `£${Number(summary.inventoryValue).toLocaleString()}` },
    { label: 'WAC', value: `£${Number(summary.weightedAverageCost).toFixed(4)}/L` },
    { label: 'Tank coverage', value: '11.4 days' },
  ];

  return (
    <main className="module-shell">
      <header className="module-header">
        <div>
          <p className="eyebrow">Stock</p>
          <h1>Inventory and tank level control</h1>
        </div>
        <div className="module-actions">
          <Link href="/" className="secondary-button">Dashboard</Link>
        </div>
      </header>

      <section className="detail-card" style={{ marginBottom: 20 }}>
        <div className="detail-header">
          <h3>Add stock movement</h3>
          <span className="status-chip">Live</span>
        </div>
        <form onSubmit={handleSubmit} className="cargo-form" style={{ marginTop: 16 }}>
          <div className="form-grid">
            <label>
              <span>Product</span>
              <input value={form.product} onChange={(event) => setForm((current) => ({ ...current, product: event.target.value }))} />
            </label>
            <label>
              <span>Location</span>
              <input value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} />
            </label>
            <label>
              <span>Qty (L)</span>
              <input value={form.quantityLitres} onChange={(event) => setForm((current) => ({ ...current, quantityLitres: event.target.value }))} />
            </label>
            <label>
              <span>Unit cost (£/L)</span>
              <input value={form.unitCost} onChange={(event) => setForm((current) => ({ ...current, unitCost: event.target.value }))} />
            </label>
            <label>
              <span>Direction</span>
              <select value={form.direction} onChange={(event) => setForm((current) => ({ ...current, direction: event.target.value as StockMovement['direction'] }))}>
                <option value="in">In</option>
                <option value="out">Out</option>
              </select>
            </label>
            <label>
              <span>Date</span>
              <input type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} />
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="primary-button">Add movement</button>
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
              <th>Product</th>
              <th>Location</th>
              <th>Direction</th>
              <th>Litres</th>
              <th>Unit cost</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((row) => (
              <tr key={row.id}>
                <td>{row.product}</td>
                <td>{row.location}</td>
                <td>{row.direction === 'in' ? 'In' : 'Out'}</td>
                <td>{Number(row.quantityLitres).toLocaleString()} L</td>
                <td>£{Number(row.unitCost).toFixed(2)}</td>
                <td>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
