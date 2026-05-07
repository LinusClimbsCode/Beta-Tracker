# Beta Tracker — Frontend

React 19 + Vite + Tailwind v4. See the [root README](../README.md) for project overview.

## Layout

```
src/
  App.tsx           React Router config
  pages/            Full-page components
  components/       Reusable UI (primitives + shell)
  context/          AuthContext, ThemeContext
  hooks/            Custom hooks (useAuth)
  services/         Axios + auth.service
  types/            Backend API contract types
  constants/        API routes, etc.
  i18n.ts           i18next setup (EN/DE)
public/locales/     Translation JSON (en/, de/)
```

## Commands

```bash
pnpm dev       # Vite dev server
pnpm build     # tsc + vite build
pnpm preview   # serve production build
pnpm lint      # eslint
```

Path alias: `@/` → `src/`.

Currently routes only `/login`, `/register`, `/` (dashboard); the rest is Milestone 2 (see [`docs/roadmap.md`](../docs/roadmap.md)).
