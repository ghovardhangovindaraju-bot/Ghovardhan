import Decimal from 'decimal.js';

export type ApprovalRole = 'buyer' | 'finance' | 'operations' | 'tax';

export type InvoiceApprovalInput = {
  amount: string | number;
  policyThreshold: string | number;
  matched: boolean;
  periodClosed: boolean;
  submitterId: string;
  approvers: Record<ApprovalRole, string>;
  freightVariance?: boolean;
  nonStandardCost?: boolean;
  provisionalSettlement?: boolean;
  supplierOnWatchlist?: boolean;
  unusualVat?: boolean;
  unusualFx?: boolean;
  unusualDuty?: boolean;
};

export type RequiredApproval = {
  role: ApprovalRole;
  userId: string;
};

export type InvoiceApprovalRoute = {
  status: 'auto-approved' | 'pending-approval' | 'blocked';
  requiredApprovals: RequiredApproval[];
  requiresDualApproval: boolean;
  reason?: 'period-closed' | 'invoice-unmatched' | 'submitter-is-approver' | 'approver-conflict';
};

export function routeInvoiceApproval(input: InvoiceApprovalInput): InvoiceApprovalRoute {
  if (input.periodClosed) {
    return { status: 'blocked', requiredApprovals: [], requiresDualApproval: false, reason: 'period-closed' };
  }

  if (!input.matched) {
    return { status: 'blocked', requiredApprovals: [], requiresDualApproval: false, reason: 'invoice-unmatched' };
  }

  const highValue = new Decimal(input.amount).greaterThanOrEqualTo(input.policyThreshold);
  const requiresBuyer = highValue
    || Boolean(input.nonStandardCost)
    || Boolean(input.provisionalSettlement)
    || Boolean(input.supplierOnWatchlist)
    || Boolean(input.freightVariance)
    || Boolean(input.unusualFx)
    || Boolean(input.unusualDuty);
  const requiresFinance = highValue
    || Boolean(input.nonStandardCost)
    || Boolean(input.provisionalSettlement)
    || Boolean(input.supplierOnWatchlist)
    || Boolean(input.unusualVat)
    || Boolean(input.unusualFx)
    || Boolean(input.unusualDuty);
  const requiresOperations = Boolean(input.freightVariance);
  const requiresTax = Boolean(input.unusualVat) || Boolean(input.unusualDuty);
  const requiresDualApproval = highValue
    || Boolean(input.nonStandardCost)
    || Boolean(input.provisionalSettlement)
    || Boolean(input.supplierOnWatchlist)
    || Boolean(input.unusualVat)
    || Boolean(input.unusualFx)
    || Boolean(input.unusualDuty)
    || Boolean(input.freightVariance);

  if (!requiresBuyer && !requiresFinance && !requiresOperations && !requiresTax) {
    return { status: 'auto-approved', requiredApprovals: [], requiresDualApproval: false };
  }

  const requiredApprovals: RequiredApproval[] = [];
  if (requiresBuyer) requiredApprovals.push({ role: 'buyer', userId: input.approvers.buyer });
  if (requiresOperations) requiredApprovals.push({ role: 'operations', userId: input.approvers.operations });
  if (requiresFinance) requiredApprovals.push({ role: 'finance', userId: input.approvers.finance });
  if (requiresTax) requiredApprovals.push({ role: 'tax', userId: input.approvers.tax });

  if (requiredApprovals.some((approval) => approval.userId === input.submitterId)) {
    return { status: 'blocked', requiredApprovals: [], requiresDualApproval, reason: 'submitter-is-approver' };
  }

  const distinctApprovers = new Set(requiredApprovals.map((approval) => approval.userId));
  if (requiresDualApproval && distinctApprovers.size < 2) {
    return { status: 'blocked', requiredApprovals: [], requiresDualApproval, reason: 'approver-conflict' };
  }

  return { status: 'pending-approval', requiredApprovals, requiresDualApproval };
}