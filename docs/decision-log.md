# Beta Tracker — Decisions

The major decisions that shape the project. Short and opinionated.

---

## Stack

- **Express 5** for async-safe handlers without try/catch wrappers.
- **Prisma 6** for end-to-end types from schema to controller.
- **PostgreSQL 16**, locally via Docker.
- **Zod 4** for runtime validation that mirrors TS types.
- **React 19 + Vite 7** for the SPA.
- **Tailwind v4** with dark mode via `dark` on `<html>`.
- **react-router-dom v7** for SPA routing.
- **Axios** with `withCredentials` and a 401 interceptor.
- **i18next** for bilingual EN / DE.
- **Multer 2** local disk for v1 image upload (MinIO is the OSS-aligned upgrade path).
- **pnpm workspaces**, **Node 22+**.

---

## TypeScript

- `strict: true` + `noUncheckedIndexedAccess` + `noImplicitOverride`.
- No `any`, no `!`, no `@ts-ignore` — fix the type, don't bypass it.
- `verbatimModuleSyntax: true` + `import type` for type-only imports.
- No enums — string literal unions only.
- React 19's automatic JSX transform — no `import React`.
- Path aliases: `#/` → backend `src/`, `@/` → frontend `src/`.

---

## Backend architecture

- **Layered:** Routes → Middleware → Controllers → Services → Prisma. Each layer has one reason to change.
- **Thin controllers.** Logic and DB queries live in services so a non-HTTP entry point (CLI seeder, scheduled job) can reuse them.
- **Central error middleware.** Maps `ZodError`, Prisma `P2002` / `P2025`, and a small typed-error vocabulary (`NotFoundError`, `ForbiddenError`, `ConflictError`, `UnauthorizedError`) to HTTP status. No try/catch wrappers in handlers.
- **Single Prisma client singleton** in `src/db/prisma.ts`, to avoid pool exhaustion under hot reload.

---

## Auth

- **JWT in HTTP-only cookies** (Secure, SameSite). Resists XSS-driven token theft. CSRF mitigated by SameSite + an explicit CORS allow-list.
- **Access (~30m) + refresh (~30d)**, refresh stored server-side in `RefreshToken` so it's revocable on logout.
- **bcryptjs** for password hashing — pure JS, no native dependency. Argon2 is the planned upgrade once the email-verification work lands.
- **Email verification is the activation gate.** Until verified, a user's `validationPower` is 0 and they can't affect content.

---

## Data model

- **Single `Boulder` table with a status field** (`pending` / `approved` / `rejected`) — simpler than a separate-submissions design, and the community can interact with pending boulders before approval.
- **Per-gym `Grade` definitions.** One gym's "V3" is not another's.
- **Many-to-many `Boulder ↔ Color`.** A boulder can be marked with multiple tape colours.
- **`UserBoulder`** is the personal climbing-logbook row: project / flash / top, attempts, completedAt.
- **Two rating dimensions** — `gradeRating` (easy / appropriate / hard) and `qualityRating` (liked / neutral / disliked). Difficulty perception and enjoyment are different signals.
- **Setter** is either a registered user (`verifiedSetterId`) or free text (`unverifiedSetterName`) — keeps attribution honest without forcing accounts.

---

## Validation, trust & roles

The most interesting design problem in the project. Full design in [`validation-system.md`](validation-system.md). Key choices:

- **Per-gym trust** rather than a global score — local reputation matters.
- **Tiered voting weight** (1 / 2 / 3) by per-gym trust (0–49 / 50–99 / 100+). Lets gym-locals carry weight without sidelining newcomers.
- **Five paths to Gym Setter** at any gym — community votes, moderator fast-tracks, or auto-graduation at 25+ approved uploads.
- **Cross-gym CGM discount** — proven moderators face a lower trust bar at each new gym, but still earn local trust natively.
- **Roles lapse with inactivity** (6 / 12 months) and are re-earnable.
- **Reports + auto-quarantine** at 2 reports within ~72 hours.
