import Link from 'next/link';

const kpis = [
  { label: 'Awaiting approval', value: '14' },
  { label: 'Matched to PO', value: '92%' },
  { label: 'Overdue', value: '£418k' },
  { label: 'Provisional settlements', value: '3' },
];

const rows = [
  { invoice: 'AP-4401', supplier: 'Astra Marine', po: 'PO-9917', amount: '£184,210', due: '02 Oct', status: 'Awaiting approval' },
  { invoice: 'AP-4407', supplier: 'Harbour Supply', po: 'PO-9934', amount: '£92,460', due: '03 Oct', status: 'Approved' },
  { invoice: 'AP-4410', supplier: 'North Sea Bulk', po: 'PO-9941', amount: '£211,800', due: '05 Oct', status: 'Variance review' },
];

const workflow = [
  { name: 'Capture', text: 'Invoice uploaded and OCR parsed', state: 'Complete' },
  { name: 'Match', text: 'PO, receipt and delivery reference reconciled', state: 'Complete' },
  { name: 'Approval', text: 'Buyer and finance sign-off required', state: 'Pending' },
  { name: 'Finalise', text: 'Provisional settlement split into stock and COGS', state: 'Queued' },
];

export default function PayablesPage() {
  return (
    <main className="module-shell">
      <header className="module-header">
        <div>
          <p className="eyebrow">AP & Payables</p>
          <h1>Supplier invoicing and approvals</h1>
        </div>
        <div className="module-actions">
          <Link href="/" className="secondary-button">Dashboard</Link>
          <button type="button" className="primary-button">New invoice</button>
        </div>
      </header>

      <section className="kpi-grid">
        {kpis.map((kpi) => (
          <article key={kpi.label} className="kpi-card">
            <p className="label">{kpi.label}</p>
            <strong>{kpi.value}</strong>
          </article>
        ))}
      </section>

      <section className="detail-grid-two">
        <article className="detail-card">
          <div className="detail-header">
            <h3>Approval workflow</h3>
            <span className="status-chip">Auto-routed</span>
          </div>
          <div className="workflow-list">
            {workflow.map((item) => (
              <div key={item.name} className="workflow-item">
                <div className="workflow-status">
                  <span className="workflow-dot" />
                </div>
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.text}</p>
                  <small>{item.state}</small>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="detail-card">
          <div className="detail-header">
            <h3>Exception queue</h3>
            <span className="status-chip">2 items</span>
          </div>
          <ul className="exception-list">
            <li>North Sea Bulk invoice differs by £12,610 against provisional cargo cost.</li>
            <li>Harbour Supply freight line needs operations approval before payable release.</li>
          </ul>
        </article>
      </section>

      <section className="module-table-wrap">
        <table className="module-table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Supplier</th>
              <th>PO</th>
              <th>Amount</th>
              <th>Due</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.invoice}>
                <td>
                  <Link href={`/payables/${row.invoice}`} className="link-inline">
                    {row.invoice}
                  </Link>
                </td>
                <td>{row.supplier}</td>
                <td>{row.po}</td>
                <td>{row.amount}</td>
                <td>{row.due}</td>
                <td><span className="status-badge">{row.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
