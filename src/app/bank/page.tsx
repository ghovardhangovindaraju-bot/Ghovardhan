import Link from 'next/link';

const kpis = [
  { label: 'Bank balance', value: '£4.8m' },
  { label: 'Reconciliations', value: '96%' },
  { label: 'Pending suggestions', value: '12' },
  { label: 'FX exposure', value: '£640k' },
];

const rows = [
  { date: '01 Oct', reference: 'DEL-44981', amount: '£148,520', status: 'Matched' },
  { date: '01 Oct', reference: 'DEL-45010', amount: '£63,290', status: 'Review' },
  { date: '02 Oct', reference: 'DEL-45024', amount: '£92,800', status: 'Auto-suggested' },
];

export default function BankPage() {
  return (
    <main className="module-shell">
      <header className="module-header">
        <div>
          <p className="eyebrow">Bank</p>
          <h1>Cash and reconciliation</h1>
        </div>
        <div className="module-actions">
          <Link href="/" className="secondary-button">Dashboard</Link>
          <button type="button" className="primary-button">Refresh feeds</button>
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

      <section className="module-table-wrap">
        <table className="module-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Delivery ref</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.reference}>
                <td>{row.date}</td>
                <td>{row.reference}</td>
                <td>{row.amount}</td>
                <td><span className="status-badge">{row.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
