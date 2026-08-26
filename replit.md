# MirrorX

MirrorX is a dark Web3 portfolio dashboard for monitoring multi-chain balances, activity, referrals, and withdrawal settings.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/mirrorx/src/` — responsive dashboard UI, routes, shell, and brand components
- `artifacts/api-server/src/routes/mirrorx.ts` — dashboard, wallet, activity, referral, and settings API
- `lib/api-spec/openapi.yaml` — source of truth for API contracts
- `lib/db/src/schema/mirrorx.ts` — Drizzle schema for users, balances, transactions, referrals, receipts, settings, and audit logs
- `artifacts/mirrorx/src/index.css` — global dark theme tokens and visual system

## Architecture decisions

- The workspace uses React + Vite for web artifacts and Drizzle ORM for PostgreSQL, so the requested Next.js/Prisma concepts are mapped onto the existing supported stack rather than introducing a second toolchain.
- API contracts are OpenAPI-first and generated into the shared React client and Zod package.
- The initial dashboard is backed by seeded development data for the admin preview account; authentication and user-scoped data can be layered on with Clerk in a later phase.
- Secrets stay in Replit Secrets; public chain addresses and product configuration are environment variables.

## Product

The first phase provides an overview of portfolio value and performance, multi-chain wallet balances, recent transaction activity, referral rewards, and public withdrawal/support settings.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Run `pnpm --filter @workspace/api-spec run codegen` after changing `lib/api-spec/openapi.yaml`.
- The shared API server is routed under `/api`; the MirrorX web artifact is routed at `/`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
