# Product backlog

## BL-001: AP invoice approval automation
Status: In progress

Objective:
Automate invoice approval routing inside the ERP so supplier invoices are matched, reviewed and approved without spreadsheet-based finance work.

Acceptance criteria:
- Supplier invoice can be captured and stored in the ERP.
- Invoice can be matched to PO, receipt and delivery reference.
- Variances are highlighted automatically.
- Approval routing follows company policy by threshold, supplier type and cost category.
- High-value or non-standard items require second approval.
- Every approver action is logged in an audit trail.
- Approved invoices can be pushed to payable status and payment run creation.

## BL-002: Purchase contracts and cargo intake
Status: Planned

Objective:
Create the buy-side workflow for contracts, product selection, tolerances and delivery terms.

Acceptance criteria:
- Contract record includes supplier, product, quantity, tolerance, pricing and FX.
- Contract approval process is enforced before release.
- Delivery milestones and docs checklist are captured.
- Cargo can be tracked from contract to vessel to discharge.

## BL-003: Stock and landed cost engine
Status: In progress

Objective:
Create the shared engine for WAC, landed cost and cost-of-sales calculations.

Acceptance criteria:
- All costing maths is performed in `src/engine`.
- Costs are Decimal-based.
- WAC is recalculated from stock events and immutable movements.
- Landed cost can be accessed by UI, API and reporting.

## BL-004: Price sheet and rep publishing
Status: Planned

Objective:
Support daily pricing decisions and rep-level published price bands.

Acceptance criteria:
- Price sheet uses the higher of WAC and replacement cost.
- Minimum margin guard blocks unprofitable prices.
- Delivery price bands can be approved and published.
- Reps can view only the latest approved price book.

## BL-005: Scheduling and transport planning
Status: Planned

Objective:
Coordinate delivery and collection workloads across own fleet, third-party hauliers and ex-rack slots.

Acceptance criteria:
- Weekly grid shows transport allocations.
- Unallocated orders are visible and actionable.
- Haulier orders require PO approval.
- Ex-rack availability is visible to sales and operations.

## BL-006: Bank reconciliation and month-end close
Status: Planned

Objective:
Support cash control, bank matching and the month-end close process.

Acceptance criteria:
- Bank feeds are matched by delivery reference and expected movement.
- Reconciliation suggestions are generated automatically.
- FX revaluation is managed on a controlled schedule.
- Month-end close checklist and lock are enforced.

## BL-007: VAT and compliance checks
Status: Planned

Objective:
Add Making Tax Digital and compliance checks before submission.

Acceptance criteria:
- VAT return is built from the accounting ledger.
- 9-box return is generated with validation.
- Submission requires two approvers.
- Compliance exceptions are visible before HMRC upload.
