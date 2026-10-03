# AP invoice approval workflow

## Purpose
This document defines the automated approval process for supplier invoices inside the ERP.

## Workflow stages
### 1. Invoice intake
- invoice is received through email upload, supplier portal or manual entry
- supplier, invoice number, date and amount are captured
- duplicate detection is run against existing supplier invoices
- invoice is tagged with supplier, company and tax configuration

### 2. Matching
The system matches the invoice to:
- purchase order
- goods receipt or delivery record
- freight or demurrage charges
- cargo finalisation result
- currency and FX rate used on the cargo

Where a mismatch exists, the system creates a variance record for human review.

### 3. Rule-based routing
Approval routing is based on:
- invoice amount
- supplier risk or category
- PO type
- cost centre or nominal code
- invoice currency
- product type
- provisional cost settlement status

Examples:
- under policy threshold: auto-approve to payable queue
- above threshold: route to buyer and finance manager
- freight variance: route to operations and procurement
- provisional cargo cost adjustment: route to procurement + finance
- unusual VAT treatment: route to tax or compliance reviewer

### 4. Second approval
The ERP should require two approvers for:
- invoice value above a policy limit
- non-standard cost adjustments
- disputed cargo settlements
- unusual FX or duty treatment
- suppliers on a review watchlist

### 5. Automated finalisation
Once approved:
- supplier invoice becomes payable
- associated cost postings are created
- stock and cost-of-sales split is applied when required
- payment run can be created without manual re-entry
- remittance advice is issued through the ERP

## Fuel-specific adjustments
Fuel invoice approval includes special handling for:

- provisional cargo pricing finalisation
- stock still held vs cost-of-sales split
- demurrage and laytime claims
- product shortfall and quality deductions
- duty and VAT treatment on imported cargo
- FX movement when costs are settled in a different currency

## Control requirements
The ERP must enforce the following:
- one approver cannot approve their own invoice
- all approval actions are logged with timestamp, approver and reason
- exception cases remain in queue until resolved
- invoice status cannot move directly from captured to approved without matching and policy checks
- period-lock prevents approval of invoices in a closed period

## Outcome
This creates a controlled and automated AP process that reduces finance admin, protects cash, and ensures a strong audit trail for supplier liabilities.
