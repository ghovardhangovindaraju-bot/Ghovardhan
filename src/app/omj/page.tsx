'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

const initialPrices = [
  { product: 'EN590', bid: '£81.25', ask: '£81.48', change: '+0.42%', status: 'Tight', updated: '2 min ago' },
  { product: 'ULS D', bid: '£88.10', ask: '£88.42', change: '+0.28%', status: 'Active', updated: '4 min ago' },
  { product: 'Jet A1', bid: '£93.30', ask: '£93.70', change: '-0.12%', status: 'Stable', updated: '6 min ago' },
  { product: 'Gasoil', bid: '£79.66', ask: '£79.95', change: '+0.18%', status: 'Watch', updated: '8 min ago' },
];

export default function OmjPage() {
  const [connected, setConnected] = useState(false);
  const [priceFeed, setPriceFeed] = useState(initialPrices);
  const [formData, setFormData] = useState({ account: 'omj@northseafuels.com', password: '' });

  const handleConnect = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConnected(true);
  };

  const refreshPrices = () => {
    setPriceFeed((current) =>
      current.map((row) => {
        if (row.change.startsWith('-')) {
          return { ...row, updated: 'just now' };
        }

        const numericChange = Number(row.change.replace('%', '').replace('+', '')) + 0.04;
        return {
          ...row,
          updated: 'just now',
          change: `+${numericChange.toFixed(2)}%`,
        };
      }),
    );
  };

  return (
    <main className="module-shell">
      <header className="detail-topbar">
        <div>
          <p className="eyebrow">Market data</p>
          <h1>OMJ pricing</h1>
        </div>
        <div className="module-actions">
          <Link href="/" className="secondary-button">
            Back to dashboard
          </Link>
          <button type="button" className="primary-button" onClick={refreshPrices}>
            Refresh feed
          </button>
        </div>
      </header>

      <section className="detail-grid">
        <div className="detail-panel">
          <div className="detail-header">
            <h3>OMJ connection</h3>
            <span className="status-badge">{connected ? 'Connected' : 'Not connected'}</span>
          </div>

          {!connected ? (
            <form onSubmit={handleConnect} className="cargo-form">
              <label>
                <span>OMJ account</span>
                <input
                  type="email"
                  value={formData.account}
                  onChange={(event) => setFormData((current) => ({ ...current, account: event.target.value }))}
                />
              </label>

              <label>
                <span>Password</span>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                  placeholder="Enter OMJ password"
                />
              </label>

              <button type="submit" className="primary-button">
                Connect account
              </button>
            </form>
          ) : (
            <div className="confirmation-box">
              <strong>Connected to OMJ</strong>
              <p style={{ margin: 0, color: '#d8f3e6' }}>{formData.account}</p>
              <p style={{ margin: '10px 0 0', color: '#d8f3e6' }}>Live market feed is active and refreshed automatically every 60 seconds.</p>
            </div>
          )}
        </div>

        <div className="detail-panel">
          <div className="detail-header">
            <h3>Summary</h3>
            <span className="status-chip">Live</span>
          </div>

          <div className="omj-grid">
            <div className="kpi-card">
              <p className="label">Best bid</p>
              <strong>£88.10</strong>
            </div>
            <div className="kpi-card">
              <p className="label">Best ask</p>
              <strong>£88.42</strong>
            </div>
            <div className="kpi-card">
              <p className="label">Spread</p>
              <strong>£0.32</strong>
            </div>
            <div className="kpi-card">
              <p className="label">Alert status</p>
              <strong>2 watch</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="detail-panel" style={{ marginTop: 22 }}>
        <div className="detail-header">
          <h3>Live price board</h3>
          <span className="status-chip">Updated {priceFeed[0]?.updated ?? 'now'}</span>
        </div>

        <table className="omj-price-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Bid</th>
              <th>Ask</th>
              <th>Change</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {priceFeed.map((row) => (
              <tr key={row.product}>
                <td>{row.product}</td>
                <td>{row.bid}</td>
                <td>{row.ask}</td>
                <td>{row.change}</td>
                <td><span className="status-badge">{row.status}</span></td>
                <td>{row.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
