import Decimal from 'decimal.js';

export type DecimalInput = string | number | Decimal;

const toDecimal = (value: DecimalInput): Decimal => new Decimal(value.toString());

export type ProcurementStatus = 'Draft' | 'Approved' | 'In transit' | 'Received';
export type StockDirection = 'in' | 'out';
export type JournalStatus = 'Draft' | 'Posted' | 'Reviewed';

export type ProcurementContract = {
  id: string;
  supplier: string;
  product: string;
  quantityLitres: string;
  unitPrice: string;
  eta: string;
  status: ProcurementStatus;
};

export type StockMovement = {
  id: string;
  product: string;
  location: string;
  quantityLitres: string;
  unitCost: string;
  direction: StockDirection;
  date: string;
};

export type JournalEntry = {
  id: string;
  description: string;
  amount: string;
  type: 'debit' | 'credit';
  status: JournalStatus;
};

export type VatReturn = {
  id: string;
  period: string;
  sales: string;
  purchases: string;
  vatDue: string;
  status: 'Draft' | 'Ready' | 'Filed';
};

export type Ho10Entry = {
  id: string;
  supplier: string;
  shipment: string;
  product: string;
  duty: string;
  filed: boolean;
  dueDate: string;
};

export function buildProcurementSummary(contracts: ProcurementContract[]) {
  const approvedContracts = contracts.filter((contract) => contract.status === 'Approved' || contract.status === 'In transit' || contract.status === 'Received');
  const approvedVolume = approvedContracts.reduce((sum, contract) => sum.plus(toDecimal(contract.quantityLitres)), new Decimal(0));
  const totalContractValue = approvedContracts.reduce((sum, contract) => sum.plus(toDecimal(contract.quantityLitres).mul(toDecimal(contract.unitPrice))), new Decimal(0));

  return {
    contractCount: contracts.length,
    approvedVolume: approvedVolume.toFixed(0),
    totalContractValue: totalContractValue.toFixed(0),
    openCount: contracts.filter((contract) => contract.status !== 'Received').length,
  };
}

export function buildStockSummary(movements: StockMovement[]) {
  let onHandUnits = new Decimal(0);
  let inventoryCost = new Decimal(0);

  for (const movement of movements) {
    const qty = toDecimal(movement.quantityLitres);
    if (movement.direction === 'in') {
      const unitCost = toDecimal(movement.unitCost || '0');
      inventoryCost = inventoryCost.plus(qty.mul(unitCost));
      onHandUnits = onHandUnits.plus(qty);
      continue;
    }

    if (onHandUnits.isZero()) continue;

    const weightedAverage = inventoryCost.div(onHandUnits);
    const costRemoved = weightedAverage.mul(qty);
    inventoryCost = inventoryCost.minus(costRemoved);
    onHandUnits = onHandUnits.minus(qty);
  }

  return {
    onHandLitres: onHandUnits.toFixed(0),
    inventoryValue: inventoryCost.toFixed(0),
    weightedAverageCost: onHandUnits.isZero() ? '0' : inventoryCost.div(onHandUnits).toFixed(4),
  };
}

export function buildVatSummary(vatReturns: VatReturn[]) {
  const totalSales = vatReturns.reduce((sum, entry) => sum.plus(toDecimal(entry.sales)), new Decimal(0));
  const totalPurchases = vatReturns.reduce((sum, entry) => sum.plus(toDecimal(entry.purchases)), new Decimal(0));
  const netVatDue = vatReturns.reduce((sum, entry) => sum.plus(toDecimal(entry.vatDue)), new Decimal(0));

  return {
    totalSales: totalSales.toFixed(0),
    totalPurchases: totalPurchases.toFixed(0),
    netVatDue: netVatDue.toFixed(0),
  };
}

export function buildHo10Summary(entries: Ho10Entry[]) {
  const totalDuty = entries.reduce((sum, entry) => sum.plus(toDecimal(entry.duty)), new Decimal(0));
  const outstandingCount = entries.filter((entry) => !entry.filed).length;
  const filedCount = entries.filter((entry) => entry.filed).length;

  return {
    totalDuty: totalDuty.toFixed(0),
    outstandingCount,
    filedCount,
    readyToFile: outstandingCount === 0,
  };
}

export function defaultContractForm(): ProcurementContract {
  return {
    id: '',
    supplier: '',
    product: '',
    quantityLitres: '0',
    unitPrice: '0',
    eta: '',
    status: 'Draft',
  };
}

export function defaultStockMovementForm(): StockMovement {
  return {
    id: '',
    product: 'ULSD 10ppm',
    location: 'Kingsbury',
    quantityLitres: '0',
    unitCost: '0',
    direction: 'in',
    date: new Date().toISOString().slice(0, 10),
  };
}

export function defaultVatReturn(): VatReturn {
  return {
    id: '',
    period: 'October 2026',
    sales: '0',
    purchases: '0',
    vatDue: '0',
    status: 'Draft',
  };
}

export function defaultHo10Entry(): Ho10Entry {
  return {
    id: '',
    supplier: '',
    shipment: '',
    product: '',
    duty: '0',
    filed: false,
    dueDate: new Date().toISOString().slice(0, 10),
  };
}

export const sampleContracts: ProcurementContract[] = [
  { id: 'PC-2026-104', supplier: 'Astra Marine', product: 'ULSD 10ppm', quantityLitres: '1250000', unitPrice: '1.12', eta: '2026-10-02', status: 'Approved' },
  { id: 'PC-2026-108', supplier: 'North Sea Bulk', product: 'Gasoil', quantityLitres: '980000', unitPrice: '1.08', eta: '2026-10-04', status: 'In transit' },
  { id: 'PC-2026-110', supplier: 'Harbour Supply', product: 'Jet A1', quantityLitres: '640000', unitPrice: '1.18', eta: '2026-10-06', status: 'Draft' },
];

export const sampleStockMovements: StockMovement[] = [
  { id: 'SM-001', product: 'ULSD 10ppm', location: 'Kingsbury', quantityLitres: '120000', unitCost: '0.52', direction: 'in', date: '2026-10-01' },
  { id: 'SM-002', product: 'ULSD 10ppm', location: 'Kingsbury', quantityLitres: '40000', unitCost: '0.58', direction: 'in', date: '2026-10-02' },
  { id: 'SM-003', product: 'ULSD 10ppm', location: 'Kingsbury', quantityLitres: '50000', unitCost: '0.00', direction: 'out', date: '2026-10-03' },
];

export const sampleVatReturns: VatReturn[] = [
  { id: 'VAT-10', period: 'October 2026', sales: '260000', purchases: '180000', vatDue: '52000', status: 'Ready' },
  { id: 'VAT-09', period: 'September 2026', sales: '225000', purchases: '170000', vatDue: '45000', status: 'Filed' },
];

export const sampleHo10Entries: Ho10Entry[] = [
  { id: 'HO10-01', supplier: 'Astra Marine', shipment: 'AS-1004', product: 'ULSD 10ppm', duty: '24000', filed: true, dueDate: '2026-10-20' },
  { id: 'HO10-02', supplier: 'North Sea Bulk', shipment: 'NS-341', product: 'Gasoil', duty: '18000', filed: false, dueDate: '2026-10-25' },
];

export const sampleJournalEntries: JournalEntry[] = [
  { id: 'JNL-4402', description: 'Delivery stock receipt', amount: '162400', type: 'debit', status: 'Posted' },
  { id: 'JNL-4411', description: 'Freight accrual', amount: '18540', type: 'credit', status: 'Draft' },
  { id: 'JNL-4420', description: 'VAT reallocation', amount: '27160', type: 'credit', status: 'Reviewed' },
];
