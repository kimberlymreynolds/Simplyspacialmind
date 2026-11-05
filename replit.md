# Simply Spacial Mind

Simply Spacial is a mental health and neurodivergence wellness platform, initially focused on daily wellness tools.

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

- `site/index.html` is the current Night Garden website and source of truth for Preview and publishing.
- The Simply Spacial web workflow uses Vite with `site/` as its root. Its static build still outputs to `artifacts/simply-spacial/dist/public`.
- The earlier React wellness app remains under `artifacts/simply-spacial/src/` for reference, but is not the active website.

## Architecture decisions

- The first version stores personal entries in the user's browser, without accounts or server-side health data. This keeps the initial experience usable without collecting sensitive information on the server; it is not cross-device storage or a backup.
- Position the product as wellness support, not diagnosis, clinical treatment, or a crisis service.
- Check-ins and tool prompts are optional. Avoid streak pressure, clinical interpretations, or fabricated personal history.

## Product

Optional mood-and-energy check-ins, a personal check-in journal, grounding and breathing exercises, and a gentle task-starting tool.

## User preferences

- Keep Preview matched to the live Night Garden website. Do not replace it with the earlier wellness app.

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
