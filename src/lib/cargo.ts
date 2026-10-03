export type CargoFormState = {
  supplier: string;
  product: string;
  vesselName: string;
  quantityLitres: string;
  quantityCbm: string;
  quantityMt: string;
  densityKgPerL: string;
  pricePerLitre: string;
  pricePerMt: string;
  eta: string;
  currency: string;
  status: string;
  notes: string;
  totalValue?: string;
};

export function defaultCargoForm(): CargoFormState {
  return {
    supplier: '',
    product: '',
    vesselName: '',
    quantityLitres: '',
    quantityCbm: '',
    quantityMt: '',
    densityKgPerL: '0.84',
    pricePerLitre: '',
    pricePerMt: '',
    eta: '',
    currency: 'GBP',
    status: 'Draft',
    notes: '',
  };
}

const toNumeric = (value: string | undefined, fallback = 0) => {
  const cleaned = String(value ?? '').replace(/[^\d.]/g, '');
  const numeric = Number(cleaned || fallback);
  return Number.isFinite(numeric) ? numeric : fallback;
};

export function recalculateCargoQuantities(
  draft: Partial<CargoFormState>,
  changedField: keyof Pick<CargoFormState, 'quantityLitres' | 'quantityCbm' | 'quantityMt' | 'densityKgPerL'>,
): CargoFormState {
  const form = { ...defaultCargoForm(), ...draft };
  const density = Math.max(toNumeric(form.densityKgPerL, 0.84), 0.0001);

  const litresFromInput = () => {
    if (changedField === 'quantityLitres') {
      return toNumeric(form.quantityLitres, 0);
    }

    if (changedField === 'quantityCbm') {
      return toNumeric(form.quantityCbm, 0) * 1000;
    }

    if (changedField === 'quantityMt') {
      return (toNumeric(form.quantityMt, 0) * 1000) / density;
    }

    return toNumeric(form.quantityLitres, 0);
  };

  const litres = litresFromInput();
  const cbm = litres / 1000;
  const mt = (litres * density) / 1000;

  return {
    ...form,
    quantityLitres: litres === 0 ? '' : litres.toFixed(3).replace(/\.0+$|(?<=\..*?)0+$/g, '').replace(/\.$/, ''),
    quantityCbm: cbm === 0 ? '' : cbm.toFixed(3).replace(/\.0+$|(?<=\..*?)0+$/g, '').replace(/\.$/, ''),
    quantityMt: mt === 0 ? '' : mt.toFixed(3).replace(/\.0+$|(?<=\..*?)0+$/g, '').replace(/\.$/, ''),
    densityKgPerL: density.toFixed(3).replace(/\.0+$|(?<=\..*?)0+$/g, '').replace(/\.$/, ''),
  };
}

export function normaliseCargoFormInput(input: Partial<CargoFormState>): CargoFormState {
  const form = recalculateCargoQuantities({ ...defaultCargoForm(), ...input }, 'quantityLitres');
  const supplier = form.supplier.trim();
  const product = form.product.trim();
  const vesselName = form.vesselName.trim();
  const quantityLitres = String(form.quantityLitres ?? '').trim();
  const quantityCbm = String(form.quantityCbm ?? '').trim();
  const quantityMt = String(form.quantityMt ?? '').trim();
  const pricePerLitre = String(form.pricePerLitre ?? '').trim();
  const pricePerMt = String(form.pricePerMt ?? '').trim();
  const eta = String(form.eta ?? '').trim();
  const currency = (form.currency ?? 'GBP').trim() || 'GBP';
  const status = (form.status ?? 'Draft').trim() || 'Draft';
  const notes = (form.notes ?? '').trim();

  const litresValue = toNumeric(quantityLitres, 0);
  const mtValue = toNumeric(quantityMt, 0);
  const priceLitreValue = toNumeric(pricePerLitre, 0);
  const priceMtValue = toNumeric(pricePerMt, 0);

  const estimatedValue = priceMtValue > 0 && mtValue > 0
    ? mtValue * priceMtValue
    : priceLitreValue > 0 && litresValue > 0
      ? litresValue * priceLitreValue
      : 0;

  return {
    supplier,
    product,
    vesselName,
    quantityLitres,
    quantityCbm,
    quantityMt,
    densityKgPerL: String(form.densityKgPerL ?? '0.84').trim(),
    pricePerLitre,
    pricePerMt,
    eta,
    currency,
    status,
    notes,
    totalValue: estimatedValue.toFixed(0),
  };
}

export function formatUomQuantity(values: { litres?: string; cbm?: string; mt?: string }) {
  const litreText = values.litres ? `${values.litres} L` : '0 L';
  const cbmText = values.cbm ? `${values.cbm} CBM` : '0 CBM';
  const mtText = values.mt ? `${values.mt} MT` : '0 MT';
  return `${litreText} / ${cbmText} / ${mtText}`;
}
