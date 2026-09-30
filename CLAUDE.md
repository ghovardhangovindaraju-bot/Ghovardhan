# Fuel ERP (working name: WAC Console)

Cloud ERP for small and mid-sized fuel importers, distributors, blenders and stockholders who can't justify SAP.
Positioning: **order → load → margin → compliance**, with true landed cost and profit on every load, in any currency.
Do not drift into routing, scheduling or in-cab systems; integrate with those instead.

## Read first
- `docs/PRODUCT.md` – what we're building and for whom
- `docs/CALCULATIONS.md` – every costing rule, with worked examples
- `docs/COMPLIANCE.md` – HO10, HO50, RDCO, RTFO rules and open questions
- `docs/BACKLOG.md` – ordered work items with acceptance criteria (work top-down)
- `docs/DECISIONS.md` – architecture decisions; add one when you make a significant choice
- `docs/design/*.png` – approved screen designs; new screens must follow them

## Stack
TypeScript everywhere · Next.js (app router) · PostgreSQL via Prisma · Vitest · decimal.js.
Hosting target: UK region. Sign-in: managed provider (see BL-003), never hand-rolled auth.

## Non-negotiable rules
1. **All costing maths lives in `src/engine/`** and is pure (no database, no network). UI, API and reports call `replayLedger`; they never re-implement formulas.
2. **Decimal only** for money, litres, densities and rates. No JS floats in ledger maths.
3. **Event-sourced ledger**: stock movements are immutable `LedgerEvent`s. Corrections are new events. WAC is always rebuilt from events.
4. **Golden tests must pass**: `src/engine/__tests__/golden.test.ts` holds values agreed with the Excel beta. If a rule changes on purpose, update `docs/CALCULATIONS.md` and the golden values in the same PR and explain why.
5. **Every business row has `companyId`** and every query filters by it. Access is checked per screen (Edit/View/Hidden) on the server, including the API.
6. **Audit everything** that changes data, and every AI suggestion, in `AuditLog`.
7. **Compliance logic** (HO10, HO50, RDCO, RTFO, duty) needs a human sign-off: mark PRs that touch it with the `compliance` label and list what a co-founder must check.
8. Sample data only in `src/lib/demo-data.ts`. Never commit real customer data or secrets.

## Commands
- `npm test` – run all tests (must pass before any PR)
- `npm run typecheck` – TypeScript check (must pass)
- `npm run dev` – local app on http://localhost:3000

## How to work (humans and agents)
- Pick the top open item in `docs/BACKLOG.md` unless asked for something specific.
- Plan briefly, write or update tests first for engine changes, implement, run `npm test` and `npm run typecheck`.
- Keep PRs small: one backlog item per PR. Title `BL-xxx: <summary>`. In the description: what changed, how it was tested, anything a co-founder must check.
- Update the backlog item's status and any docs you changed.
- Use the project sub-agents in `.claude/agents/` where they fit: `engine-guardian` for any change touching `src/engine`, `compliance-reviewer` for excise/RTFO work, `ui-builder` for screens, `qa-tester` before opening a PR.

## Style
UK English in the UI. Sentence case. Units always explicit (L15, CBM, MT, £/L). Numbers right-aligned, tabular.
