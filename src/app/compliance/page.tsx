'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { buildHo10Summary, buildVatSummary, defaultHo10Entry, defaultVatReturn, sampleHo10Entries, sampleVatReturns, type Ho10Entry, type VatReturn } from '@/lib/erp';

export default function CompliancePage() {
  const [vatRows, setVatRows] = useState<VatReturn[]>(sampleVatReturns);
  const [ho10Rows, setHo10Rows] = useState<Ho10Entry[]>(sampleHo10Entries);
  const [vatForm, setVatForm] = useState(defaultVatReturn());
  const [ho10Form, setHo10Form] = useState(defaultHo10Entry());

  const vatSummary = useMemo(() => buildVatSummary(vatRows), [vatRows]);
  const ho10Summary = useMemo(() => buildHo10Summary(ho10Rows), [ho10Rows]);

  const addVat = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setVatRows((current) => [{
      ...vatForm,
      id: `VAT-${current.length + 1}`,
    }, ...current]);
    setVatForm(defaultVatReturn());
  };

  const addHo10 = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHo10Rows((current) => [{
      ...ho10Form,
      id: `HO10-${current.length + 1}`,
    }, ...current]);
    setHo10Form(defaultHo10Entry());
  };

  return (
    <main className="module-shell">
      <header className="module-header">
        <div>
          <p className="eyebrow">Compliance</p>
          <h1>VAT and HO10 filing control</h1>
        </div>
        <div className="module-actions">
          <Link href="/" className="secondary-button">Dashboard</Link>
        </div>
      </header>

      <section className="kpi-grid">
        <article className="kpi-card"><p className="label">VAT due</p><strong>£{Number(vatSummary.netVatDue).toLocaleString()}</strong></article>
        <article className="kpi-card"><p className="label">Sales</p><strong>£{Number(vatSummary.totalSales).toLocaleString()}</strong></article>
        <article className="kpi-card"><p className="label">HO10 duty</p><strong>£{Number(ho10Summary.totalDuty).toLocaleString()}</strong></article>
        <article className="kpi-card"><p className="label">Filing status</p><strong>{ho10Summary.readyToFile ? 'Ready' : `${ho10Summary.outstandingCount} open`}</strong></article>
      </section>

      <section className="detail-grid-two">
        <article className="detail-card">
          <div className="detail-header"><h3>Add VAT period</h3><span className="status-chip">Editable</span></div>
          <form onSubmit={addVat} className="cargo-form" style={{ marginTop: 16 }}>
            <div className="form-grid">
              <label><span>Period</span><input value={vatForm.period} onChange={(event) => setVatForm((current) => ({ ...current, period: event.target.value }))} /></label>
              <label><span>Sales</span><input value={vatForm.sales} onChange={(event) => setVatForm((current) => ({ ...current, sales: event.target.value }))} /></label>
              <label><span>Purchases</span><input value={vatForm.purchases} onChange={(event) => setVatForm((current) => ({ ...current, purchases: event.target.value }))} /></label>
              <label><span>VAT due</span><input value={vatForm.vatDue} onChange={(event) => setVatForm((current) => ({ ...current, vatDue: event.target.value }))} /></label>
              <label><span>Status</span><select value={vatForm.status} onChange={(event) => setVatForm((current) => ({ ...current, status: event.target.value as VatReturn['status'] }))}><option value="Draft">Draft</option><option value="Ready">Ready</option><option value="Filed">Filed</option></select></label>
            </div>
            <div className="form-actions"><button type="submit" className="primary-button">Add VAT return</button></div>
          </form>
        </article>

        <article className="detail-card">
          <div className="detail-header"><h3>Add HO10 filing</h3><span className="status-chip">Compliance</span></div>
          <form onSubmit={addHo10} className="cargo-form" style={{ marginTop: 16 }}>
            <div className="form-grid">
              <label><span>Supplier</span><input value={ho10Form.supplier} onChange={(event) => setHo10Form((current) => ({ ...current, supplier: event.target.value }))} /></label>
              <label><span>Shipment</span><input value={ho10Form.shipment} onChange={(event) => setHo10Form((current) => ({ ...current, shipment: event.target.value }))} /></label>
              <label><span>Product</span><input value={ho10Form.product} onChange={(event) => setHo10Form((current) => ({ ...current, product: event.target.value }))} /></label>
              <label><span>Duty due</span><input value={ho10Form.duty} onChange={(event) => setHo10Form((current) => ({ ...current, duty: event.target.value }))} /></label>
              <label><span>Due date</span><input type="date" value={ho10Form.dueDate} onChange={(event) => setHo10Form((current) => ({ ...current, dueDate: event.target.value }))} /></label>
              <label><span>Filed</span><select value={String(ho10Form.filed)} onChange={(event) => setHo10Form((current) => ({ ...current, filed: event.target.value === 'true' }))}><option value="false">Not filed</option><option value="true">Filed</option></select></label>
            </div>
            <div className="form-actions"><button type="submit" className="primary-button">Add HO10 item</button></div>
          </form>
        </article>
      </section>

      <section className="module-table-wrap" style={{ marginTop: 20 }}>
        <table className="module-table">
          <thead>
            <tr><th>Period</th><th>Sales</th><th>Purchases</th><th>VAT due</th><th>Status</th></tr>
          </thead>
          <tbody>
            {vatRows.map((row) => (
              <tr key={row.id}><td>{row.period}</td><td>£{Number(row.sales).toLocaleString()}</td><td>£{Number(row.purchases).toLocaleString()}</td><td>£{Number(row.vatDue).toLocaleString()}</td><td><span className="status-badge">{row.status}</span></td></tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="module-table-wrap" style={{ marginTop: 20 }}>
        <table className="module-table">
          <thead>
            <tr><th>Shipment</th><th>Supplier</th><th>Product</th><th>Duty</th><th>Filed</th><th>Due date</th></tr>
          </thead>
          <tbody>
            {ho10Rows.map((row) => (
              <tr key={row.id}><td>{row.shipment}</td><td>{row.supplier}</td><td>{row.product}</td><td>£{Number(row.duty).toLocaleString()}</td><td>{row.filed ? 'Yes' : 'No'}</td><td>{row.dueDate}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
