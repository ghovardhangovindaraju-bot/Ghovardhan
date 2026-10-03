import Link from 'next/link';
import { notFound } from 'next/navigation';

const contracts = {
  'PC-2026-104': {
    supplier: 'Astra Marine',
    product: 'ULSD 10ppm',
    vesselName: 'MV Ocean Crest',
    quantity: '1,250,000 L',
    eta: '02 Oct 2026',
    status: 'Approved',
    terms: 'FOB / CIF split with freight cap',
    incoterm: 'CIF',
    currency: 'USD',
    price: '$710.40 / MT',
    totalValue: '$1,648,360',
    vesselStatus: 'Discharging',
    voyageNo: 'VY-4421',
    route: 'Santos → Teesport',
    lastReport: 'Cargo outturn and draft survey updated at 09:15',
    progress: 74,
    loadingPort: 'Santos',
    dischargePort: 'Teesport',
    approvalTrail: [
      'Buyer reviewed pricing and margin guard',
      'Finance approved landed cost assumptions',
      'Operations confirmed vessel booking',
    ],
    lineItems: [
      { description: 'Product cost', value: '$1,420,000' },
      { description: 'Freight', value: '$165,420' },
      { description: 'Insurance', value: '$18,600' },
      { description: 'Duty', value: '$44,340' },
    ],
    documents: ['Commercial invoice', 'Bill of lading', 'Quality certificate', 'Customs declaration'],
  },
  'PC-2026-108': {
    supplier: 'North Sea Bulk',
    product: 'Gasoil',
    vesselName: 'MV North Star',
    quantity: '980,000 L',
    eta: '04 Oct 2026',
    status: 'Awaiting sign-off',
    terms: 'Delivered to rack with tolerance ±0.75%',
    incoterm: 'DAP',
    currency: 'GBP',
    price: '£595.80 / MT',
    totalValue: '£1,013,640',
    vesselStatus: 'Arrival window',
    voyageNo: 'VY-4519',
    route: 'Rotterdam → Immingham',
    lastReport: 'Customs release and berth window are under review',
    progress: 42,
    loadingPort: 'Rotterdam',
    dischargePort: 'Immingham',
    approvalTrail: [
      'Buyer requested additional freight check',
      'Finance review pending final duty estimate',
      'Operations still awaiting terminal slot confirmation',
    ],
    lineItems: [
      { description: 'Product cost', value: '£865,000' },
      { description: 'Freight', value: '£108,200' },
      { description: 'Insurance', value: '£11,600' },
      { description: 'Duty', value: '£28,840' },
    ],
    documents: ['Pricing sheet', 'Supplier confirmation', 'Quality certificate', 'Delivery schedule'],
  },
};

export async function generateStaticParams() {
  return Object.keys(contracts).map((contractId) => ({ contractId }));
}

export default async function ProcurementDetailPage({
  params,
}: {
  params: Promise<{ contractId: string }>;
}) {
  const { contractId } = await params;
  const record = contracts[contractId as keyof typeof contracts];

  if (!record) {
    notFound();
  }

  return (
    <main className="detail-shell">
      <header className="detail-topbar">
        <div>
          <p className="eyebrow">Procurement</p>
          <h1>{contractId}</h1>
          <div className="detail-meta">
            <span className="detail-info">Supplier: {record.supplier}</span>
            <span className="detail-info">Vessel: {record.vesselName}</span>
            <span className="detail-info">Status: {record.status}</span>
          </div>
        </div>
        <div className="module-actions">
          <Link href="/procurement" className="secondary-button">Back to list</Link>
          <button type="button" className="primary-button">Approve contract</button>
        </div>
      </header>

      <section className="detail-grid">
        <article className="detail-panel">
          <h3>Contract summary</h3>
          <ul className="info-list">
            <li><span>Product</span><strong>{record.product}</strong></li>
            <li><span>Vessel</span><strong>{record.vesselName}</strong></li>
            <li><span>Quantity</span><strong>{record.quantity}</strong></li>
            <li><span>ETA</span><strong>{record.eta}</strong></li>
            <li><span>Incoterm</span><strong>{record.incoterm}</strong></li>
            <li><span>Currency</span><strong>{record.currency}</strong></li>
            <li><span>Price</span><strong>{record.price}</strong></li>
          </ul>
        </article>

        <article className="detail-panel">
          <h3>Terms and value</h3>
          <ul className="info-list">
            <li><span>Terms</span><strong>{record.terms}</strong></li>
            <li><span>Total value</span><strong>{record.totalValue}</strong></li>
            <li><span>Supplier risk</span><strong>Low</strong></li>
            <li><span>Lead time</span><strong>7 days</strong></li>
            <li><span>Demurrage</span><strong>£1,250 / day</strong></li>
            <li><span>Last update</span><strong>Today 09:42</strong></li>
          </ul>
        </article>
      </section>

      <section className="detail-grid">
        <article className="detail-panel">
          <h3>Vessel operations</h3>
          <div className="status-row">
            <span className="status-chip">{record.vesselStatus}</span>
            <span className="detail-info">Voyage {record.voyageNo}</span>
          </div>
          <div className="progress-bar" aria-label={`${record.vesselName} voyage progress`}>
            <span className="progress-fill" style={{ width: `${record.progress}%` }} />
          </div>
          <ul className="info-list">
            <li><span>Route</span><strong>{record.route}</strong></li>
            <li><span>Loading port</span><strong>{record.loadingPort}</strong></li>
            <li><span>Discharge port</span><strong>{record.dischargePort}</strong></li>
            <li><span>Last report</span><strong>{record.lastReport}</strong></li>
          </ul>
        </article>

        <article className="detail-panel">
          <h3>Voyage snapshot</h3>
          <ul className="info-list">
            <li><span>Vessel</span><strong>{record.vesselName}</strong></li>
            <li><span>ETA</span><strong>{record.eta}</strong></li>
            <li><span>Status</span><strong>{record.vesselStatus}</strong></li>
            <li><span>Survey</span><strong>Marine inspection scheduled</strong></li>
            <li><span>Risk flag</span><strong>Low</strong></li>
          </ul>
        </article>
      </section>

      <section className="detail-grid">
        <article className="detail-panel">
          <h3>Approval trail</h3>
          <ul className="document-list">
            {record.approvalTrail.map((step) => (
              <li key={step}><span>{step}</span><strong>Completed</strong></li>
            ))}
          </ul>
        </article>

        <article className="detail-panel">
          <h3>Documents</h3>
          <ul className="document-list">
            {record.documents.map((doc) => (
              <li key={doc}><span>{doc}</span><strong>Ready</strong></li>
            ))}
          </ul>
        </article>
      </section>

      <article className="detail-panel">
        <h3>Cost build-up</h3>
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {record.lineItems.map((item) => (
              <tr key={item.description}>
                <td>{item.description}</td>
                <td>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </main>
  );
}
