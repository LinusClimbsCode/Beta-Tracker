# Beta Tracker — Architecture

## At a glance

A two-tier monorepo. A React 19 SPA (Vite) talks to a stateless Express 5 API over HTTPS, sending HTTP-only cookies for auth. The API persists everything in Postgres via Prisma. Both apps share strict-TypeScript discipline (no `any`, no `!`, no `@ts-ignore`). State lives in Postgres; the frontend keeps only auth and theme in React Context. Every workflow (validation voting, rating consensus, XP awards) runs synchronously inside the request that triggered it.

---

## Backend layering

```mermaid
flowchart TB
    subgraph Express["Express 5 — src/server.ts"]
        direction TB
        Routes["<b>Routes</b> — src/routes/*.routes.ts"]
        Mw["<b>Middleware</b><br/>requireAuth · JWT verify from cookie<br/>validate.&lt;domain&gt; · Zod parse on body / query<br/>errorHandler · maps ZodError, Prisma errors, typed errors → HTTP"]
        Ctrl["<b>Controllers</b> — src/controllers/*.controller.ts<br/>Thin: parse req → call service → shape response"]
        Svc["<b>Services</b> — src/services/*.service.ts<br/>All business logic and DB queries"]
        PC["<b>Prisma client singleton</b> — src/db/prisma.ts"]
        Routes --> Mw --> Ctrl --> Svc --> PC
    end
    PC --> DB[("PostgreSQL")]
```

Routes → middleware → controllers → services → Prisma. Each layer has one reason to change. Controllers stay thin so the same service can be reused if a non-HTTP entry point ever appears (a CLI seeder, a scheduled job). Path alias `#/` → `src/`.

---

## Frontend layering

```mermaid
flowchart TB
    subgraph React["React 19 SPA — Vite"]
        direction TB
        Router["<b>Router</b> — react-router-dom v7 in src/App.tsx"]
        Pages["<b>Pages</b> — src/pages/*"]
        Components["<b>Components</b> — primitives, shell, domain components"]
        Services["<b>Services</b> — Axios wrappers per domain<br/>shared instance: withCredentials · 401 → /login interceptor"]
        State["<b>Context</b> — AuthContext · ThemeContext"]
        Types["<b>Types</b> — src/types/*, mirrors backend contracts"]
        Router --> Pages
        Pages --> Components
        Pages --> Services
        Pages --> State
        Services --> Types
        State --> Types
    end
    subgraph Cross["Cross-cutting"]
        I18N["<b>i18next</b> EN / DE<br/>JSON locales lazy-loaded from public/locales/"]
        Tailwind["<b>Tailwind v4</b><br/>dark mode via <code>dark</code> class on &lt;html&gt;"]
    end
    Components -.-> I18N
    Components -.-> Tailwind
```

Pages call services. Cross-cutting client state lives in two Context providers — auth and theme. There's no global store: Postgres is the source of truth, so the frontend doesn't need one. Path alias `@/` → `src/`.

---

## Data model

```mermaid
erDiagram
    User ||--o{ UserBoulder : ticks
    User ||--o{ Rating : rates
    User ||--o{ BoulderValidation : votes_on
    User ||--o{ Boulder : uploaded
    User ||--o{ RefreshToken : holds

    Gym ||--o{ Wall : has
    Gym ||--o{ Grade : defines
    Gym ||--o{ Event : hosts

    Wall ||--o{ Boulder : contains
    Color ||--o{ Boulder : marked_with
    Grade ||--o{ Boulder : graded_at
    User ||--o{ Boulder : verified_setter

    Boulder ||--o{ UserBoulder : tracked_by
    Boulder ||--o{ Rating : rated_by
    Boulder ||--o{ BoulderValidation : voted_by
```

The spine is **User → Gym → Wall → Boulder**. Around each boulder sit three community interactions: ticks (`UserBoulder`), ratings (`Rating`), and validation votes (`BoulderValidation`). Setters are either registered users (`verifiedSetterId`) or free-text names. Grades are per-gym — one gym's "V3" is not another's.

Full schema in [`backend/prisma/schema.prisma`](../backend/prisma/schema.prisma).

---

## Auth flow

```mermaid
sequenceDiagram
    autonumber
    participant U as User (browser)
    participant FE as Frontend (React)
    participant API as Backend (Express)
    participant DB as Postgres

    U->>FE: enter email + password
    FE->>API: POST /auth/login
    API->>DB: findUserByEmail
    DB-->>API: user row
    API->>API: bcrypt.compare(password, user.passwordHash)
    API->>API: sign access JWT (~30m) + refresh JWT (~30d)
    API->>DB: store refresh token (RefreshToken)
    API-->>FE: 200 OK + Set-Cookie (HttpOnly, Secure, SameSite)
    FE->>FE: AuthContext.login() → calls /auth/me
    FE->>API: GET /auth/me (cookie auto-sent)
    API->>API: requireAuth verifies JWT
    API->>DB: findUserById
    DB-->>API: user
    API-->>FE: user object
```

JWT-based: a short access token (~30m) and a longer refresh token (~30d), both stored as HTTP-only, Secure, SameSite cookies. Refresh tokens are stored server-side so they're revocable on logout. The Axios interceptor catches 401s and redirects to `/login`.

HTTP-only cookies can't be read by JavaScript, which closes the XSS-driven token-theft vector you get with `localStorage`. The CSRF trade-off is mitigated by `SameSite` and an explicit CORS allow-list.

---

## Tech stack

| Concern         | Choice                                                |
| --------------- | ----------------------------------------------------- |
| Package manager | pnpm workspaces                                       |
| Backend         | Node 22+ · Express 5 · Prisma 6 · PostgreSQL 16       |
| Validation      | Zod 4                                                 |
| Auth            | JWT (jsonwebtoken) + bcryptjs + HTTP-only cookies     |
| Frontend        | React 19 · Vite 7 · Tailwind v4 · react-router-dom 7  |
| HTTP            | Axios                                                 |
| i18n            | i18next (EN / DE)                                     |
| Image upload    | Multer (local disk)                                   |
