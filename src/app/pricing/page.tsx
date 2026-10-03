import Link from 'next/link';

const kpis = [
  { label: 'Current price', value: '£1.28 / L' },
  { label: 'Margin guard', value: '11.2%' },
  { label: 'Live market', value: '+£0.04 / L' },
  { label: 'Approved bands', value: '6 sites' },
];

const rows = [
  { product: 'ULSD 10ppm', site: 'Kingsbury', litres: '1,250,000 L', cbm: '1,250 CBM', mt: '1,050 MT', price: '£1.28 / L', status: 'Approved' },
  { product: 'Gasoil', site: 'Immingham', litres: '980,000 L', cbm: '980 CBM', mt: '823 MT', price: '£1.19 / L', status: 'Review' },
  { product: 'Jet A1', site: 'Middlesbrough', litres: '640,000 L', cbm: '640 CBM', mt: '538 MT', price: '£1.34 / L', status: 'Published' },
];

export default function PricingPage() {
  return (
    <main className="module-shell">
      <header className="module-header">
        <div>
          <p className="eyebrow">Pricing</p>
          <h1>Price sheets and margin guard</h1>
        </div>
        <div className="module-actions">
          <Link href="/" className="secondary-button">Dashboard</Link>
          <button type="button" className="primary-button">Publish pricing</button>
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
            <h3>Price logic</h3>
            <span className="status-chip">Live</span>
          </div>
          <div className="workflow-list">
            <div className="workflow-item">
              <div className="workflow-status"><span className="workflow-dot" /></div>
              <div>
                <strong>Replacement cost</strong>
                <p>Daily benchmark calculated from supplier and freight data.</p>
                <small>Complete</small>
              </div>
            </div>
            <div className="workflow-item">
              <div className="workflow-status"><span className="workflow-dot" /></div>
              <div>
                <strong>WAC comparison</strong>
                <p>Higher of WAC or replacement cost protects gross margin.</p>
                <small>Complete</small>
              </div>
            </div>
            <div className="workflow-item">
              <div className="workflow-status"><span className="workflow-dot" /></div>
              <div>
                <strong>Margin guard</strong>
                <p>Minimum margin floor enforced before release to sales teams.</p>
                <small>Pending</small>
              </div>
            </div>
          </div>
        </article>

        <article className="detail-card">
          <div className="detail-header">
            <h3>Approved bands</h3>
            <span className="status-chip">6 sites</span>
          </div>
          <ul className="exception-list">
            <li>Kingsbury band: £1.21–£1.38 / L with 11% minimum margin.</li>
            <li>Immingham band: £1.14–£1.30 / L with regional freight uplift.</li>
            <li>Middlesbrough band: £1.26–£1.42 / L with supplier premium applied.</li>
          </ul>
        </article>
      </section>

      <section className="module-table-wrap">
        <table className="module-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Site</th>
              <th>Litres</th>
              <th>CBM</th>
              <th>MT</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.product + row.site}>
                <td>{row.product}</td>
                <td>{row.site}</td>
                <td>{row.litres}</td>
                <td>{row.cbm}</td>
                <td>{row.mt}</td>
                <td>{row.price}</td>
                <td><span className="status-badge">{row.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
