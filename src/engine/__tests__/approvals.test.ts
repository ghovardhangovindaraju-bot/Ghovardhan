import { describe, expect, it } from 'vitest';

import { routeInvoiceApproval } from '../approvals';

const baseInvoice = {
  amount: '9000',
  policyThreshold: '10000',
  matched: true,
  periodClosed: false,
  submitterId: 'user-1',
  approvers: {
    buyer: 'user-2',
    finance: 'user-3',
    operations: 'user-4',
    tax: 'user-5',
  },
};

describe('AP invoice approval routing', () => {
  it('auto-approves a matched routine invoice below the threshold', () => {
    expect(routeInvoiceApproval(baseInvoice)).toEqual({
      status: 'auto-approved',
      requiredApprovals: [],
      requiresDualApproval: false,
    });
  });

  it('blocks invoices without a match or in a closed period', () => {
    expect(routeInvoiceApproval({ ...baseInvoice, matched: false }).status).toBe('blocked');
    expect(routeInvoiceApproval({ ...baseInvoice, periodClosed: true }).status).toBe('blocked');
  });

  it('routes high-value invoices to buyer and finance as distinct approvers', () => {
    const result = routeInvoiceApproval({ ...baseInvoice, amount: '10000' });

    expect(result).toEqual({
      status: 'pending-approval',
      requiredApprovals: [
        { role: 'buyer', userId: 'user-2' },
        { role: 'finance', userId: 'user-3' },
      ],
      requiresDualApproval: true,
    });
  });

  it('routes fuel-specific exceptions to the appropriate reviewers', () => {
    const result = routeInvoiceApproval({ ...baseInvoice, freightVariance: true, unusualVat: true });

    expect(result.status).toBe('pending-approval');
    expect(result.requiredApprovals).toEqual([
      { role: 'buyer', userId: 'user-2' },
      { role: 'operations', userId: 'user-4' },
      { role: 'finance', userId: 'user-3' },
      { role: 'tax', userId: 'user-5' },
    ]);
    expect(result.requiresDualApproval).toBe(true);
  });

  it('blocks a dual-approval route when roles resolve to the same person', () => {
    const result = routeInvoiceApproval({
      ...baseInvoice,
      amount: '20000',
      approvers: { ...baseInvoice.approvers, finance: 'user-2' },
    });

    expect(result.status).toBe('blocked');
    expect(result.requiredApprovals).toEqual([]);
  });

  it('blocks a route that assigns the invoice submitter as an approver', () => {
    const result = routeInvoiceApproval({
      ...baseInvoice,
      amount: '20000',
      approvers: { ...baseInvoice.approvers, buyer: 'user-1' },
    });

    expect(result.status).toBe('blocked');
    expect(result.reason).toBe('submitter-is-approver');
  });
});