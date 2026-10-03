import Decimal from 'decimal.js';

export type DecimalInput = string | number | Decimal;

const toDecimal = (value: DecimalInput): Decimal => new Decimal(value.toString());

export type LandedCostInput = {
  productCost: DecimalInput;
  freight: DecimalInput;
  insurance: DecimalInput;
  duty: DecimalInput;
  litres: DecimalInput;
};

export type GrossMarginInput = {
  landedCostPerLitre: DecimalInput;
  sellingPricePerLitre: DecimalInput;
  litres: DecimalInput;
};

export type LedgerEvent =
  | {
      type: 'purchase';
      litres: DecimalInput;
      unitCost: DecimalInput;
      reference?: string;
      date?: string;
    }
  | {
      type: 'sale';
      litres: DecimalInput;
      reference?: string;
      date?: string;
    }
  | {
      type: 'adjustment';
      litres: DecimalInput;
      unitCost?: DecimalInput;
      reference?: string;
      date?: string;
    };

export function calculateLandedCost({
  productCost,
  freight,
  insurance,
  duty,
  litres,
}: LandedCostInput) {
  const total = toDecimal(productCost)
    .plus(toDecimal(freight))
    .plus(toDecimal(insurance))
    .plus(toDecimal(duty));

  const litresDecimal = toDecimal(litres);

  return {
    total,
    perLitre: total.div(litresDecimal),
  };
}

export function calculateGrossMargin({
  landedCostPerLitre,
  sellingPricePerLitre,
  litres,
}: GrossMarginInput) {
  const landed = toDecimal(landedCostPerLitre);
  const selling = toDecimal(sellingPricePerLitre);
  const litresDecimal = toDecimal(litres);
  const grossProfitPerLitre = selling.minus(landed);
  const grossProfit = grossProfitPerLitre.mul(litresDecimal);
  const marginPct = grossProfitPerLitre.div(selling).mul(100);

  return {
    grossProfitPerLitre,
    grossProfit,
    marginPct,
  };
}

export function replayLedger(events: LedgerEvent[]) {
  let totalLitres = new Decimal(0);
  let totalCost = new Decimal(0);

  for (const event of events) {
    const litres = toDecimal(event.litres);

    if (event.type === 'purchase') {
      const unitCost = toDecimal(event.unitCost);
      totalCost = totalCost.plus(litres.mul(unitCost));
      totalLitres = totalLitres.plus(litres);
      continue;
    }

    if (event.type === 'adjustment') {
      const unitCost = event.unitCost ? toDecimal(event.unitCost) : totalLitres.isZero() ? new Decimal(0) : totalCost.div(totalLitres);
      if (litres.isPositive()) {
        totalCost = totalCost.plus(litres.mul(unitCost));
        totalLitres = totalLitres.plus(litres);
      } else {
        const adjustmentLitres = litres.abs();
        const costRemoved = totalLitres.isZero() ? new Decimal(0) : totalCost.div(totalLitres).mul(adjustmentLitres);
        totalCost = totalCost.minus(costRemoved);
        totalLitres = totalLitres.minus(adjustmentLitres);
      }
      continue;
    }

    if (event.type === 'sale') {
      if (totalLitres.isZero()) continue;

      const soldLitres = Decimal.min(litres, totalLitres);
      const wacBeforeSale = totalCost.div(totalLitres);
      const costRemoved = wacBeforeSale.mul(soldLitres);

      totalCost = totalCost.minus(costRemoved);
      totalLitres = totalLitres.minus(soldLitres);
    }
  }

  const wac = totalLitres.isZero() ? new Decimal(0) : totalCost.div(totalLitres);

  return {
    totalLitres,
    totalCost,
    inventoryValue: wac.mul(totalLitres),
    wac,
  };
}
