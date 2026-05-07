# Beta Tracker

Hi Iam Linus and this is my work in progress full-stack software Engineer project. With this I try to combine two of my biggest interests, climbing and programming :D
And this is my way to a Community App and personal bouldering tracking app.
I've been part of the Cologne climbing community for years. Information about what's set on the walls, who climbed what, when the next event is. it lives scattered across Instagram stories, gym WhatsApp groups, and word of mouth. Half the picture, half the time. Two events on the same evening because nobody talked.

Beta Tracker is the tool I wanted to exist. A single place where the community keeps track of itself: boulders survive the wall reset as a record, grades and quality settle through community ratings, and the trust to validate uploads is earned per gym instead of handed out. A gym can use it as a public board, a route setter to publish their work, a solo climber as a personal logbook, each works on its own, none depends on the others. No single point of failure, no one person to maintain it all.

It will start in Cologne because that's where I climb. The design isn't tied there, any climber, setter, or gym, anywhere, can start a community on its own and let it grow outward.

The project started as a smaller idea in my Software Engineering bootcamp. I shelved it, came back with some more thoughts, and so I am rebuilding it from the ground up.

## Status

Active rebuild. Backend covers all 11 domains; the per-gym validation, trust and roles redesign is the current focus. Frontend has auth + dashboard, the rest is next. Honest snapshot: [`docs/current-state.md`](docs/current-state.md).

## Stack

- **Backend** — Express 5 · Prisma 6 · PostgreSQL 16 · Zod · JWT (HTTP-only cookies + refresh) · strict TypeScript (no `any`, no `!`, no `@ts-ignore`)
- **Frontend** — React 19 · Vite 7 · Tailwind v4 · react-router v7 · i18next (EN/DE)
- **Repo** — pnpm workspace monorepo · Postgres in Docker for local dev

Reasoning behind every choice: [`docs/decision-log.md`](docs/decision-log.md).

## Documentation

- [`architecture.md`](docs/architecture.md) — layering, data model, auth flow
- [`validation-system.md`](docs/validation-system.md) — per-gym trust + roles (the part I find most interesting to design)
- [`current-state.md`](docs/current-state.md) — what's built, what isn't
- [`decision-log.md`](docs/decision-log.md) — decisions and alternatives
- [`roadmap.md`](docs/roadmap.md) — milestone sequence
- [`glossary.md`](docs/glossary.md) — domain + technical vocabulary

## License

AGPL-3.0 — see [`LICENSE`](LICENSE) and [`NOTICE.md`](NOTICE.md).
