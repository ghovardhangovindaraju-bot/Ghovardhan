'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import {
  defaultCargoForm,
  normaliseCargoFormInput,
  recalculateCargoQuantities,
  type CargoFormState,
} from '@/lib/cargo';

export default function NewCargoPage() {
  const [form, setForm] = useState<CargoFormState>(defaultCargoForm());
  const [savedCargo, setSavedCargo] = useState<CargoFormState | null>(null);

  const preview = useMemo(() => normaliseCargoFormInput(form), [form]);

  const updateField = (field: keyof CargoFormState, value: string) => {
    if (field === 'quantityLitres' || field === 'quantityCbm' || field === 'quantityMt' || field === 'densityKgPerL') {
      setForm((current) => recalculateCargoQuantities({ ...current, [field]: value }, field));
      return;
    }

    setForm((current) => ({ ...current, [field]: value }));
  };

  const totalFormat = (value: string | undefined) => {
    const numeric = Number(value ?? 0);
    return Number.isFinite(numeric) ? `£${numeric.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '£0';
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = normaliseCargoFormInput(form);
    setSavedCargo(parsed);
    setForm(parsed);
  };

  return (
    <main className="detail-shell">
      <header className="detail-topbar">
        <div>
          <p className="eyebrow">Procurement</p>
          <h1>Add cargo details</h1>
        </div>
        <div className="module-actions">
          <Link href="/procurement" className="secondary-button">Back to contracts</Link>
        </div>
      </header>

      <section className="detail-grid">
        <article className="detail-panel">
          <h3>New cargo entry</h3>
          <form onSubmit={onSubmit} className="cargo-form">
            <div className="shipping-banner" aria-label="Shipping operation summary">
              <div>
                <p className="eyebrow light">Shipping operation</p>
                <strong>{form.vesselName || 'Vessel not assigned'}</strong>
              </div>
              <div className="shipping-meta">
                <span>Route: {form.eta ? 'Atlantic window' : 'Awaiting ETA'}</span>
                <span>ETA: {form.eta || 'TBC'}</span>
              </div>
            </div>

            <div className="uom-strip" aria-label="Cargo units of measure">
              <span className="uom-pill">LITRES</span>
              <span className="uom-pill">CBM</span>
              <span className="uom-pill">MT</span>
              <span className="uom-pill ship-pill">VESSEL OPS</span>
            </div>

            <div className="form-grid">
              <label>
                <span>Supplier</span>
                <input value={form.supplier} onChange={(event) => updateField('supplier', event.target.value)} placeholder="Astra Marine" />
              </label>

              <label>
                <span>Product</span>
                <input value={form.product} onChange={(event) => updateField('product', event.target.value)} placeholder="ULSD 10ppm" />
              </label>

              <label>
                <span>Vessel name</span>
                <input value={form.vesselName} onChange={(event) => updateField('vesselName', event.target.value)} placeholder="MV Ocean Crest" />
              </label>

              <label>
                <span>Density (kg/L)</span>
                <input value={form.densityKgPerL} onChange={(event) => updateField('densityKgPerL', event.target.value)} placeholder="0.84" />
              </label>

              <label>
                <span>Litres (L)</span>
                <input value={form.quantityLitres} onChange={(event) => updateField('quantityLitres', event.target.value)} placeholder="1250000" />
              </label>

              <label>
                <span>CBM (m³)</span>
                <input value={form.quantityCbm} onChange={(event) => updateField('quantityCbm', event.target.value)} placeholder="1250" />
              </label>

              <label>
                <span>MT (metric tonnes)</span>
                <input value={form.quantityMt} onChange={(event) => updateField('quantityMt', event.target.value)} placeholder="1050" />
              </label>

              <label>
                <span>Price per litre</span>
                <input value={form.pricePerLitre} onChange={(event) => updateField('pricePerLitre', event.target.value)} placeholder="1.28" />
              </label>

              <label>
                <span>Price per MT</span>
                <input value={form.pricePerMt} onChange={(event) => updateField('pricePerMt', event.target.value)} placeholder="960.00" />
              </label>

              <label>
                <span>ETA</span>
                <input type="date" value={form.eta} onChange={(event) => updateField('eta', event.target.value)} />
              </label>

              <label>
                <span>Currency</span>
                <select value={form.currency} onChange={(event) => updateField('currency', event.target.value)}>
                  <option value="GBP">GBP</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </label>
            </div>

            <label className="full-width">
              <span>Notes</span>
              <textarea value={form.notes} onChange={(event) => updateField('notes', event.target.value)} rows={4} placeholder="Delivery notes, timing, or exceptions" />
            </label>

            <div className="form-actions">
              <button type="submit" className="primary-button">Save cargo</button>
              <Link href="/procurement" className="secondary-button">Cancel</Link>
            </div>
          </form>
        </article>

        <article className="detail-panel">
          <h3>Draft summary</h3>
          <ul className="info-list">
            <li><span>Supplier</span><strong>{preview.supplier || 'Not set'}</strong></li>
            <li><span>Product</span><strong>{preview.product || 'Not set'}</strong></li>
            <li><span>Vessel</span><strong>{preview.vesselName || 'Not assigned'}</strong></li>
            <li><span>UOM quantity</span><strong>{`${preview.quantityLitres || '0'} L / ${preview.quantityCbm || '0'} CBM / ${preview.quantityMt || '0'} MT`}</strong></li>
            <li><span>Price / L</span><strong>{preview.pricePerLitre ? `£${preview.pricePerLitre}` : 'Not set'}</strong></li>
            <li><span>Price / MT</span><strong>{preview.pricePerMt ? `£${preview.pricePerMt}` : 'Not set'}</strong></li>
            <li><span>ETA</span><strong>{preview.eta || 'Not selected'}</strong></li>
            <li><span>Estimated value</span><strong>{preview.totalValue ? `£${Number(preview.totalValue).toLocaleString()}` : '£0'}</strong></li>
          </ul>

          <div className="shipping-summary">
            <div className="summary-row">
              <span>Voyage state</span>
              <strong>{preview.vesselName ? 'Cargo planned' : 'Awaiting vessel'}</strong>
            </div>
            <div className="summary-row">
              <span>Port call</span>
              <strong>{preview.eta ? 'Cargo ready for discharge' : 'Waiting for ETA'}</strong>
            </div>
            <div className="progress-bar" aria-label="Cargo planning progress">
              <span className="progress-fill" style={{ width: `${preview.vesselName ? 72 : 22}%` }} />
            </div>
            <div className="summary-row small-row">
              <span>Estimated value</span>
              <strong>{totalFormat(preview.totalValue)}</strong>
            </div>
          </div>

          {savedCargo && (
            <div className="confirmation-box">
              <p className="label">Saved</p>
              <strong>{savedCargo.vesselName || savedCargo.supplier}</strong>
              <p>{savedCargo.product} · {savedCargo.supplier} · {savedCargo.quantityLitres} L · {savedCargo.quantityCbm} CBM · {savedCargo.quantityMt} MT · {savedCargo.eta || 'No ETA yet'}</p>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
