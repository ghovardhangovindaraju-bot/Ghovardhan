import { describe, expect, it } from 'vitest';

import { buildHo10Summary, buildProcurementSummary, buildStockSummary, buildVatSummary } from '../erp';

describe('erp sample data model', () => {
  it('aggregates procurement value and open contracts', () => {
    const summary = buildProcurementSummary([
      { id: 'c1', supplier: 'Astra Marine', product: 'ULSD 10ppm', quantityLitres: '200000', unitPrice: '1.10', eta: '2026-10-02', status: 'Approved' },
      { id: 'c2', supplier: 'Harbour Supply', product: 'Jet A1', quantityLitres: '150000', unitPrice: '1.25', eta: '2026-10-05', status: 'Draft' },
    ]);

    expect(summary.contractCount).toBe(2);
    expect(summary.approvedVolume).toBe('200000');
    expect(summary.totalContractValue).toBe('220000');
  });

  it('rebuilds stock value from receipts and issues', () => {
    const summary = buildStockSummary([
      { id: 'm1', product: 'ULSD 10ppm', location: 'Kingsbury', quantityLitres: '120000', unitCost: '0.52', direction: 'in', date: '2026-10-01' },
      { id: 'm2', product: 'ULSD 10ppm', location: 'Kingsbury', quantityLitres: '40000', unitCost: '0.58', direction: 'in', date: '2026-10-02' },
      { id: 'm3', product: 'ULSD 10ppm', location: 'Kingsbury', quantityLitres: '50000', unitCost: '0.00', direction: 'out', date: '2026-10-03' },
    ]);

    expect(summary.onHandLitres).toBe('110000');
    expect(summary.inventoryValue).toBe('58850');
  });

  it('calculates VAT and HO10 filing readiness from sample transactions', () => {
    const vat = buildVatSummary([
      { id: 'v1', period: 'October 2026', sales: '260000', purchases: '180000', vatDue: '52000', status: 'Ready' },
      { id: 'v2', period: 'September 2026', sales: '225000', purchases: '170000', vatDue: '45000', status: 'Filed' },
    ]);

    const ho10 = buildHo10Summary([
      { id: 'h1', supplier: 'Astra Marine', shipment: 'AS-1004', product: 'ULSD 10ppm', duty: '24000', filed: true, dueDate: '2026-10-20' },
      { id: 'h2', supplier: 'North Sea Bulk', shipment: 'NS-341', product: 'Gasoil', duty: '18000', filed: false, dueDate: '2026-10-25' },
    ]);

    expect(vat.totalSales).toBe('485000');
    expect(vat.netVatDue).toBe('97000');
    expect(ho10.totalDuty).toBe('42000');
    expect(ho10.outstandingCount).toBe(1);
    expect(ho10.readyToFile).toBe(false);
  });
});
