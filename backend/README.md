# Beta Tracker — Backend

Express 5 + Prisma + PostgreSQL. See the [root README](../README.md) for project overview.

## Layout

```
src/
  server.ts           Express entry
  routes/             HTTP routes
  controllers/        Thin request/response handlers
  services/           Business logic + DB queries
  schemas/            Zod schemas
  middleware/         Auth, error handling, validation
  errors.ts           Typed errors (NotFoundError, ForbiddenError, …)
  db/                 Prisma client singleton
  config/             Env + constants
prisma/
  schema.prisma       Data model
  migrations/         Migration history
```

## Commands

```bash
pnpm dev       # tsx + node --watch
pnpm build     # tsc
pnpm start     # run compiled output
pnpm typecheck # tsc --noEmit

npx prisma migrate dev    # apply pending migrations
npx prisma migrate status # show migration state
npx prisma studio         # DB GUI
```

Path alias: `#/` → `src/`.
