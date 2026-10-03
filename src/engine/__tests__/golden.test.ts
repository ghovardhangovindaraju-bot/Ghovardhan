import { describe, expect, it } from 'vitest';

import { calculateGrossMargin, calculateLandedCost, replayLedger } from '../costing';

describe('fuel cost engine', () => {
  it('calculates landed cost for a load', () => {
    const result = calculateLandedCost({
      productCost: '118000',
      freight: '4200',
      insurance: '800',
      duty: '5300',
      litres: '220000',
    });

    expect(result.total.toFixed(2)).toBe('128300.00');
    expect(result.perLitre.toFixed(4)).toBe('0.5832');
  });

  it('calculates gross margin from sale price and landed cost', () => {
    const result = calculateGrossMargin({
      landedCostPerLitre: '0.5832',
      sellingPricePerLitre: '0.6600',
      litres: '220000',
    });

    expect(result.grossProfit.toFixed(2)).toBe('16896.00');
    expect(result.marginPct.toFixed(2)).toBe('11.64');
  });

  it('replays stock events to rebuild weighted average cost', () => {
    const result = replayLedger([
      { type: 'purchase', litres: '200000', unitCost: '0.52' },
      { type: 'purchase', litres: '50000', unitCost: '0.56' },
      { type: 'sale', litres: '150000' },
    ]);

    expect(result.totalLitres.toFixed(0)).toBe('100000');
    expect(result.inventoryValue.toFixed(2)).toBe('52800.00');
    expect(result.wac.toFixed(4)).toBe('0.5280');
  });
});
