'use client';

import Link from 'next/link';

import { calculateGrossMargin, calculateLandedCost } from '@/engine/costing';
import { buildHo10Summary, buildProcurementSummary, buildStockSummary, buildVatSummary, sampleContracts, sampleHo10Entries, sampleStockMovements, sampleVatReturns } from '@/lib/erp';
import { sampleLoad } from '@/lib/demo-data';

const modules = [
  {
    name: 'Procurement',
    href: '/procurement',
    description: 'Contracts, cargo intake, vessel tracking and buyer approvals.',
  },
  {
    name: 'Pricing',
    href: '/pricing',
    description: 'Price sheets, margin guard bands and market comparison.',
  },
  {
    name: 'OMJ Pricing',
    href: '/omj',
    description: 'Live OMJ market feed, account login and price alerts inside the ERP.',
  },
  {
    name: 'Inbox',
    href: '/mail',
    description: 'Linked email threads and direct replies without leaving the app.',
  },
  {
    name: 'Stock',
    href: '/stock',
    description: 'Tank levels, allocations and volume in litres, CBM and MT.',
  },
  {
    name: 'AP & Payables',
    href: '/payables',
    description: 'Invoice matching, approval automation and payment control.',
  },
  {
    name: 'Bank',
    href: '/bank',
    description: 'Cash feeds, reconciliation and month-end revaluation.',
  },
  {
    name: 'General Ledger',
    href: '/gl',
    description: 'Nominal codes, journals, trial balance and financial close.',
  },
  {
    name: 'Compliance',
    href: '/compliance',
    description: 'VAT, HO10, HO50 and filing readiness across the ERP.',
  },
];

const omjPrices = [
  { product: 'EN590', bid: '£81.25', ask: '£81.48', status: 'Tight', change: '+0.42%' },
  { product: 'ULS D', bid: '£88.10', ask: '£88.42', status: 'Active', change: '+0.28%' },
  { product: 'Jet A1', bid: '£93.30', ask: '£93.70', status: 'Stable', change: '-0.12%' },
  { product: 'Gasoil', bid: '£79.66', ask: '£79.95', status: 'Watch', change: '+0.18%' },
];

const repPerformance = [
  { name: 'Aisha Khan', target: 82, actual: 88, delta: '+6%', status: 'Ahead' },
  { name: 'Ben Carter', target: 74, actual: 71, delta: '-3%', status: 'Needs push' },
  { name: 'Chloe Lewis', target: 86, actual: 83, delta: '-3%', status: 'At risk' },
  { name: 'Darren Singh', target: 78, actual: 80, delta: '+2%', status: 'On track' },
];

const sections = [
  {
    title: 'Procurement and supply',
    screens: [
      {
        name: 'Purchase contracts',
        status: 'Approval pending',
        items: ['Supplier, product, quantity and tolerance', 'Delivery terms and pricing structure', 'Currency selection and approval step'],
      },
      {
        name: 'Vessels and BL tracker',
        status: 'Cargo 3/5 live',
        items: ['Cargo timeline and projected outturn', 'Laytime, demurrage and loss tolerance', 'Documents checklist and shared logistics link'],
      },
    ],
  },
  {
    title: 'Sales and transport',
    screens: [
      {
        name: 'Price sheet',
        status: 'Ready to publish',
        items: ['Daily prices from higher of WAC and replacement cost', 'Minimum-margin guard and delivered price bands', 'Approve-and-publish to reps'],
      },
      {
        name: 'Scheduling',
        status: '6 tankers assigned',
        items: ['Weekly tanker and haulier grid', 'Ex-rack slots and unallocated orders list', 'PO required for third-party hauliers'],
      },
    ],
  },
  {
    title: 'Finance',
    screens: [
      {
        name: 'Invoicing',
        status: 'Draft review',
        items: ['Pipeline from ordered to overdue', 'Email preview for each invoice', 'Part-paid and receivable tracking'],
      },
      {
        name: 'Payables',
        status: 'Match cleared',
        items: ['Supplier invoice matched to PO, receipt and invoice', 'Provisional cargo price finalisation split', 'Stock remaining vs cost-of-sales adjustment'],
      },
      {
        name: 'Bank',
        status: 'Live feed',
        items: ['Reconciliation suggestions by delivery reference', 'Month-end bank revaluation and FX checks', 'Cash-position monitoring'],
      },
      {
        name: 'General ledger',
        status: 'Closed for period',
        items: ['Nominal codes, journals and trial balance', 'P&L, balance sheet and posting rules', 'Worked journal from one delivery'],
      },
      {
        name: 'Month-end close',
        status: '11-step checklist',
        items: ['FX revaluation with reversal on the 1st', 'Period lock and reviewer signoff', 'Checklist for team completion'],
      },
      {
        name: 'VAT return',
        status: 'Two approvers',
        items: ['Making Tax Digital 9-box return', 'Checks before HMRC submission', 'Approval workflow for compliance team'],
      },
    ],
  },
  {
    title: 'Overview',
    screens: [
      {
        name: 'Messages',
        status: 'Team chat live',
        items: ['Cargo, order and invoice threads', 'Team channels for operations and finance', 'Shared read-only logistics links'],
      },
      {
        name: 'Margin by rep',
        status: 'AI review ready',
        items: ['Gross profit per litre after haulage', 'Rep target comparison and variance', 'AI breakdown of underperformance'],
      },
    ],
  },
];

function CargoMovementVisual() {
  return (
    <section className="movement-panel" aria-labelledby="movement-title">
      <div className="movement-heading">
        <div>
          <p className="eyebrow">Sample cargo movement</p>
          <h2 id="movement-title">MGO from vessel to customer</h2>
        </div>
        <span className="movement-live-status"><span /> Discharge in progress</span>
      </div>

      <div className="movement-visual" aria-label="Illustrated cargo journey graphic">
        <svg viewBox="0 0 800 320" role="img" aria-hidden="true">
          <defs>
            <linearGradient id="skyGlow" x1="0" x2="1">
              <stop offset="0%" stopColor="#143448" />
              <stop offset="50%" stopColor="#1d4a5f" />
              <stop offset="100%" stopColor="#0d1d2a" />
            </linearGradient>
            <linearGradient id="waterGlow" x1="0" x2="1">
              <stop offset="0%" stopColor="#78d7ff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#5bc0ff" stopOpacity="0.65" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width="800" height="320" fill="url(#skyGlow)" />
          <circle cx="650" cy="52" r="36" fill="#f0c55d" opacity="0.8" />
          <path d="M0 180C120 150 165 170 250 152C370 125 430 188 530 180C630 171 690 130 800 145V320H0Z" fill="url(#waterGlow)" />
          <path d="M0 210C140 190 200 220 294 208C405 193 480 232 574 220C681 207 734 182 800 195V320H0Z" fill="#123a4e" opacity="0.75" />

          <g className="movement-route">
            <path d="M90 170C180 150 253 140 360 162C490 188 580 155 715 135" fill="none" stroke="#7fe6ff" strokeWidth="3" strokeDasharray="8 10" opacity="0.9" />
            <circle cx="90" cy="170" r="7" fill="#7fe6ff" />
            <circle cx="360" cy="162" r="7" fill="#7fe6ff" />
            <circle cx="715" cy="135" r="7" fill="#7fe6ff" />
          </g>

          <g className="movement-ship">
            <rect x="290" y="118" width="180" height="42" rx="14" fill="#d7ebf7" />
            <path d="M470 134H545L560 160H470V134Z" fill="#9ac9de" />
            <rect x="325" y="96" width="104" height="22" rx="9" fill="#152d3c" />
            <rect x="341" y="84" width="72" height="16" rx="7" fill="#e9c55a" />
            <rect x="314" y="154" width="25" height="28" rx="6" fill="#1d3342" />
            <rect x="420" y="154" width="25" height="28" rx="6" fill="#1d3342" />
            <path d="M314 154H444" stroke="#6fb8d3" strokeWidth="4" strokeLinecap="round" />
            <path d="M470 135C498 118 548 106 581 112C596 115 605 122 611 134" fill="none" stroke="#8fe9ff" strokeWidth="4" strokeLinecap="round" />
          </g>

          <g className="movement-stages-graphic">
            <rect x="72" y="228" width="110" height="52" rx="12" fill="#091923" opacity="0.7" stroke="#6ccfff" strokeOpacity="0.35" />
            <rect x="228" y="228" width="120" height="52" rx="12" fill="#091923" opacity="0.7" stroke="#6ccfff" strokeOpacity="0.35" />
            <rect x="420" y="228" width="135" height="52" rx="12" fill="#091923" opacity="0.7" stroke="#6ccfff" strokeOpacity="0.35" />
            <rect x="610" y="228" width="118" height="52" rx="12" fill="#091923" opacity="0.7" stroke="#6ccfff" strokeOpacity="0.35" />
            <text x="92" y="252" fill="#ebf7ff" fontSize="12" fontWeight="700">Vessel</text>
            <text x="246" y="252" fill="#ebf7ff" fontSize="12" fontWeight="700">Storage</text>
            <text x="440" y="252" fill="#ebf7ff" fontSize="12" fontWeight="700">Haulage</text>
            <text x="628" y="252" fill="#ebf7ff" fontSize="12" fontWeight="700">Customer</text>
          </g>
        </svg>
        <div className="movement-footage-label">Cargo route</div>
      </div>

      <div className="movement-stages">
        <div><span>01 · Vessel</span><strong>MV Mersey Trader · MGO loading</strong></div>
        <div><span>02 · Storage</span><strong>Birkenhead · Tank 04 · 78%</strong></div>
        <div><span>03 · Haulage</span><strong>NSE-14 · North Sea Energy</strong></div>
        <div><span>04 · Customer</span><strong>Mersey Fuels · delivery 14:40</strong></div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const landedCost = calculateLandedCost({
    productCost: sampleLoad.productCost,
    freight: sampleLoad.freight,
    insurance: sampleLoad.insurance,
    duty: sampleLoad.duty,
    litres: sampleLoad.litres,
  });

  const margin = calculateGrossMargin({
    landedCostPerLitre: landedCost.perLitre,
    sellingPricePerLitre: sampleLoad.sellingPricePerLitre,
    litres: sampleLoad.litres,
  });

  const procurementSummary = buildProcurementSummary(sampleContracts);
  const stockSummary = buildStockSummary(sampleStockMovements);
  const vatSummary = buildVatSummary(sampleVatReturns);
  const ho10Summary = buildHo10Summary(sampleHo10Entries);

  const formatMoney = (value: string) =>
    `£${Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  const formatPrice = (value: string) => `£${Number(value).toFixed(4)} / L`;

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <main className="dashboard-shell">
      <aside className="programme-sidebar">
        <div className="brand-block">
          <svg className="company-logo" viewBox="0 0 48 48" role="img" aria-label="North Sea Energy logo">
            <rect x="1" y="1" width="46" height="46" rx="12" fill="#12394a" stroke="#67d1ff" strokeOpacity=".55" />
            <path d="M24 8c-5 8-10 13-10 20a10 10 0 0 0 20 0c0-7-5-12-10-20Z" fill="#eab858" />
            <path d="M17 27c3-2 6-2 9 0s6 2 9 0M18 32c2-1 4-1 6 0s4 1 6 0" fill="none" stroke="#12394a" strokeLinecap="round" strokeWidth="2" />
          </svg>
          <div>
            <p className="eyebrow">Fuel ERP</p>
            <h2>North Sea Energy</h2>
            <span className="brand-product-name">WAC Console</span>
          </div>
        </div>

        <nav className="programme-nav" aria-label="Programme menu">
          {modules.map((module) => (
            <Link key={module.name} href={module.href} className="programme-tab">
              <span className="programme-tab-name">{module.name}</span>
              <span className="programme-tab-status">Live</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-card">
          <p className="label">Operations</p>
          <strong>North Sea basin</strong>
          <span>6 vessels / 12 trucks / 4 terminals</span>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="sales-header">
          <div>
            <p className="eyebrow">Company</p>
            <h1>North Sea Energy</h1>
          </div>

          <div className="sales-user-box">
            <p className="eyebrow">User</p>
            <strong>Aisha Khan</strong>
            <span>Sales Representative</span>
          </div>

          <div className="topbar-actions">
            <button type="button" className="secondary-button">
              Export
            </button>
            <button type="button" className="secondary-button" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </header>

        <CargoMovementVisual />

        <section className="sales-summary-strip">
          <div className="summary-pill">
            <span className="label">Target</span>
            <strong>82%</strong>
          </div>
          <div className="summary-pill">
            <span className="label">Booked value</span>
            <strong>£1.24m</strong>
          </div>
          <div className="summary-pill">
            <span className="label">Live OMJ</span>
            <strong>4 products</strong>
          </div>
        </section>

        <section className="sales-grid">
          <article className="section-block market-panel">
            <div className="section-header">
              <h3>Live OMJ prices</h3>
              <span>Updated 2 min ago</span>
            </div>

            <div className="market-table">
              {omjPrices.map((price) => (
                <div key={price.product} className="market-row">
                  <div className="market-product">
                    <strong>{price.product}</strong>
                    <small>{price.status}</small>
                  </div>
                  <div className="market-price">
                    <span>Bid</span>
                    <strong>{price.bid}</strong>
                  </div>
                  <div className="market-price">
                    <span>Ask</span>
                    <strong>{price.ask}</strong>
                  </div>
                  <div className="market-change">
                    <span>Change</span>
                    <strong className={price.change.startsWith('-') ? 'down' : 'up'}>{price.change}</strong>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="section-block rep-panel">
            <div className="section-header">
              <h3>Target by sales rep</h3>
              <span>Weekly</span>
            </div>

            <div className="rep-list">
              {repPerformance.map((rep) => (
                <div key={rep.name} className="rep-row">
                  <div className="rep-header">
                    <strong>{rep.name}</strong>
                    <span className="rep-status">{rep.status}</span>
                  </div>
                  <div className="rep-target-line">
                    <span>Target</span>
                    <strong>{rep.target}%</strong>
                  </div>
                  <div className="progress-track">
                    <span style={{ width: `${rep.actual}%` }} />
                  </div>
                  <div className="rep-values">
                    <span>{rep.actual}% actual</span>
                    <span>{rep.delta}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
