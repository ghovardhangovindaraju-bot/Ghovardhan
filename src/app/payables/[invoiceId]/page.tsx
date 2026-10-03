import Link from 'next/link';
import { notFound } from 'next/navigation';

const invoices = {
  'AP-4401': {
    supplier: 'Astra Marine',
    po: 'PO-9917',
    due: '02 Oct 2026',
    status: 'Awaiting approval',
    amount: '£184,210',
    matched: '100%',
    approvalTrail: [
      'OCR captured and tax code normalised',
      'PO matched against the delivery receipt',
      'Operations approved freight variance',
    ],
    lines: [
      { description: 'Cargo cost', value: '£171,840' },
      { description: 'Freight', value: '£9,320' },
      { description: 'Insurance', value: '£3,050' },
    ],
    notes: [
      'Payment due within 10 banking days',
      'Variances are below tolerance threshold',
      'Approval from finance is still required',
    ],
  },
  'AP-4407': {
    supplier: 'Harbour Supply',
    po: 'PO-9934',
    due: '03 Oct 2026',
    status: 'Approved',
    amount: '£92,460',
    matched: '98%',
    approvalTrail: [
      'Invoice matched and approved by buyer',
      'Finance signed off the payment run',
      'Banking scheduled for next working day',
    ],
    lines: [
      { description: 'Cargo cost', value: '£81,940' },
      { description: 'Freight', value: '£8,300' },
      { description: 'Insurance', value: '£2,220' },
    ],
    notes: [
      'No exceptions flagged against documentation',
      'Payment run created and awaiting release',
      'Supplier account remains in good standing',
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(invoices).map((invoiceId) => ({ invoiceId }));
}

export default async function PayablesDetailPage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;
  const record = invoices[invoiceId as keyof typeof invoices];

  if (!record) {
    notFound();
  }

  return (
    <main className="detail-shell">
      <header className="detail-topbar">
        <div>
          <p className="eyebrow">AP & Payables</p>
          <h1>{invoiceId}</h1>
          <div className="detail-meta">
            <span className="detail-info">Supplier: {record.supplier}</span>
            <span className="detail-info">Status: {record.status}</span>
          </div>
        </div>
        <div className="module-actions">
          <Link href="/payables" className="secondary-button">Back to list</Link>
          <button type="button" className="primary-button">Approve invoice</button>
        </div>
      </header>

      <section className="detail-grid">
        <article className="detail-panel">
          <h3>Invoice summary</h3>
          <ul className="info-list">
            <li><span>Supplier</span><strong>{record.supplier}</strong></li>
            <li><span>PO</span><strong>{record.po}</strong></li>
            <li><span>Due date</span><strong>{record.due}</strong></li>
            <li><span>Matched</span><strong>{record.matched}</strong></li>
            <li><span>Amount</span><strong>{record.amount}</strong></li>
            <li><span>Payment method</span><strong>Bank transfer</strong></li>
          </ul>
        </article>

        <article className="detail-panel">
          <h3>Finance note</h3>
          <ul className="document-list">
            {record.notes.map((note) => (
              <li key={note}><span>{note}</span><strong>Check</strong></li>
            ))}
          </ul>
        </article>
      </section>

      <section className="detail-grid">
        <article className="detail-panel">
          <h3>Approval trail</h3>
          <ul className="document-list">
            {record.approvalTrail.map((step) => (
              <li key={step}><span>{step}</span><strong>Done</strong></li>
            ))}
          </ul>
        </article>

        <article className="detail-panel">
          <h3>Line items</h3>
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Line</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {record.lines.map((line) => (
                <tr key={line.description}>
                  <td>{line.description}</td>
                  <td>{line.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>
    </main>
  );
}
