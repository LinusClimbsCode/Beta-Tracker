# Beta Tracker — Current State

A short list of what's built and what isn't.

## Done

- Auth: register, login, logout, refresh — JWT in HTTP-only cookies
- 11 backend domains routed end-to-end: auth, user, gym, wall, color, grade, event, boulder, boulderValidation, userBoulder, rating
- Zod validation on every mutating route
- Central error middleware mapping Zod, Prisma, and typed errors to HTTP status
- Per-gym grade definitions
- Community boulder validation: voting, weighted votes, setter auto-approval
- Two-dimensional ratings (grade rating + quality rating) with mode-based community consensus
- User-boulder ticks: project / flash / top, attempt count, completion timestamp
- Frontend: login, register, dashboard, dark mode, i18n (EN / DE)
- AuthContext + Axios 401 interceptor → redirect to `/login`
- Type contracts for every backend domain pre-written on the frontend
- Strict TypeScript everywhere (no `any`, no `!`, no `@ts-ignore`)

## Not yet

- XP awards (tick / rate / validate / approved upload)
- Trust-point + per-gym standing wiring
- Percentile-based level recalculation
- Email-verification flow
- Image upload wiring
- List-endpoint pagination
- Seed script
- `requireGymRole(gymId, minRole)` middleware
- Most frontend pages: gym list / detail, wall detail, boulder list / detail / upload / validate, profile, my-boulders, events, admin
- Frontend service modules per domain
- Domain components (GymCard, BoulderGrid, RatingForm, ValidationVote, …)
- Tests
- Deployment (planned: Coolify on a self-hosted VPS)
