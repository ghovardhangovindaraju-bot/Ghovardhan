# Fuel ERP (working name: WAC Console)

Cloud ERP for small and mid-sized fuel companies: orders, stock at 15°C, landed and hedged cost, blends, profit per load, HMRC and RTFO compliance. See `docs/PRODUCT.md`.

## What's in here
- `src/engine/` – the costing engine (VCF, landed cost, hedges, WAC replay, blends, GP per load, unit/currency quotes), with golden tests matching the Excel beta
- `src/app/` – starter Next.js app (dashboard running the engine on sample data)
- `prisma/schema.prisma` – multi-tenant data model with an event-sourced ledger
- `docs/` – product, calculation rules, compliance, backlog, decisions, screen designs
- `CLAUDE.md` – rules every developer and AI agent follows
- `.claude/agents/` – specialist sub-agents: `engine-guardian`, `compliance-reviewer`, `ui-builder`, `qa-tester`
- `.claude/skills/` – `ship-next` (build the next backlog item) and `fix-bug`
- `.github/workflows/` – CI (tests + typecheck) and `@claude` automation

## Run locally
```bash
npm install
npm test            # engine golden tests
npm run dev         # http://localhost:3000
```
Database work starts at BL-002 (copy `.env.example` to `.env`).

## How the agent keeps building
**In Claude Code** (developer co-founder): open the repo and say "use the ship-next skill" or "ship BL-004". Claude reads `CLAUDE.md`, takes the next backlog item, uses the sub-agents, runs tests and opens a PR.

**From GitHub** (either co-founder, no coding needed): open an issue with the Feature or Bug template, which ends with `@claude …`. Claude builds it and opens a PR for review. You can also comment `@claude` on any PR to ask for changes.

**One-time GitHub setup** (repo admin):
1. Easiest: in Claude Code inside this repo run `/install-github-app` and follow the prompts.
2. Or manually: install the Claude GitHub App (https://github.com/apps/claude) on this repo and add a repository secret `ANTHROPIC_API_KEY` (or `CLAUDE_CODE_OAUTH_TOKEN` from `claude setup-token`, and change the input in `.github/workflows/claude.yml`).
3. Protect `main`: require CI to pass and one human approval before merge.

Docs: https://code.claude.com/docs/en/github-actions · https://code.claude.com/docs/en/sub-agents

## Rules of thumb
- Humans approve every merge. The agent never merges its own PRs.
- Anything touching HMRC/RTFO gets the `compliance` label and a co-founder check.
- Golden tests only change on purpose, with the reason in the PR.
