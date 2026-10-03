import { describe, expect, it } from 'vitest';

import { defaultCargoForm, normaliseCargoFormInput, recalculateCargoQuantities } from '../cargo';

describe('cargo form helpers', () => {
  it('creates a default blank cargo draft with all three UOM fields', () => {
    expect(defaultCargoForm()).toMatchObject({
      supplier: '',
      product: '',
      vesselName: '',
      quantityLitres: '',
      quantityCbm: '',
      quantityMt: '',
      densityKgPerL: '0.84',
      pricePerLitre: '',
      eta: '',
      currency: 'GBP',
      status: 'Draft',
    });
  });

  it('normalises submitted cargo details and calculates a total value', () => {
    const result = normaliseCargoFormInput({
      supplier: '  Astra Marine  ',
      product: ' ULSD 10ppm ',
      vesselName: ' MV Ocean Crest ',
      quantityLitres: '1250000',
      quantityCbm: '1250',
      quantityMt: '1050',
      densityKgPerL: '0.84',
      pricePerLitre: ' 1.28 ',
      eta: '2026-10-02',
      currency: 'GBP',
      status: 'Draft',
    });

    expect(result).toMatchObject({
      supplier: 'Astra Marine',
      product: 'ULSD 10ppm',
      vesselName: 'MV Ocean Crest',
      quantityLitres: '1250000',
      quantityCbm: '1250',
      quantityMt: '1050',
      densityKgPerL: '0.84',
      pricePerLitre: '1.28',
      eta: '2026-10-02',
      currency: 'GBP',
      status: 'Draft',
    });
    expect(result.totalValue).toBe('1600000');
  });

  it('derives MT and CBM when a cargo quantity is entered in litres', () => {
    const result = recalculateCargoQuantities(
      {
        quantityLitres: '1250000',
        densityKgPerL: '0.84',
      },
      'quantityLitres',
    );

    expect(result.quantityLitres).toBe('1250000');
    expect(result.quantityCbm).toBe('1250');
    expect(result.quantityMt).toBe('1050');
  });
});
