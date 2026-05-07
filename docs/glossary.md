# Beta Tracker — Glossary

Climbing-domain and project-specific terms. Useful if you've never climbed, don't speak German, or are new to the codebase.

---

## Climbing

- **Gym** — an indoor climbing facility (a real-world business). Top-level entity in the app.
- **Wall** — a specific climbing surface inside a gym (e.g. "The Cave," "Slab Section"). Walls get *reset* every few weeks.
- **Reset** — the recurring event when a gym strips boulders off a wall and a setter installs new ones. The whole reason the app exists: without a record, every reset wipes the boulder history.
- **Boulder** — a single climbing problem on a wall. Has a setter, a grade, a colour, and a community-driven set of ratings and validations.
- **Setter** — the person who built a boulder. Either a registered user or just a name.
- **Tick** — recording that you've attempted or completed a boulder. The verb is "to tick a boulder."
- **Project**  — a boulder you're working on but haven't completed yet.
- **Flash** — completing a boulder *on the very first attempt*. The most prestigious tick state.
- **Top** — completing a boulder after multiple attempts. The default success state.
- **Grade** — the difficulty rating. Different gyms use different systems (numeric, French, American, colour-based), so grades are gym-scoped.

---

## Roles

- **App Admin** — full app-wide override authority. Single user (me).
- **Gym Admin** — the real-world gym operator who has *claimed* their gym. Optional — many gyms run unclaimed.
- **Gym Moderator** — per-gym moderator appointed by the Gym Admin. No trust requirement; the gym vouches for them.
- **Community Gym Moderator** — per-gym moderator who *earned* the role through trust at that gym. Always available, including at unclaimed gyms.
- **Gym Setter** — per-gym setter status; lets the holder upload boulders that auto-approve.
- **User tiers — Beginner / Mid / Power** — display names for the three trust tiers at a given gym (0–49 / 50–99 / 100+). The same person can be Power at one gym and Beginner at another.
- **Activation** — the transition from "registered but inert" to "active user with baseline rights." Triggered by email verification.
- **Quarantine** — temporary "rights suspended pending review" state, triggered automatically by 2+ reports against the same user in a short window.
- **Lapsed role** — a per-gym role whose holder has been inactive at that gym for 6+ months. Re-earnable with fresh trust.

---

## Trust, validation & gamification

- **Trust points** — the political currency of the app. Per-gym scoped. Earned from approved uploads, aligned votes, and ratings on approved boulders.
- **validationPower** — the weight of a single user's vote when validating a boulder. Derived from per-gym trust: 0 (unverified), 1 (Beginner), 2 (Mid), 3 (Power).
- **requiredValidationPoints** — the points a pending boulder needs to be approved. Set at upload time, scaled by uploader's trust at that gym.
- **Aligned vote** — a vote that turned out to match the final outcome. Rewards careful voting.
- **Cross-gym discount** — the trust threshold to become a Community Gym Moderator at a new gym decreases the more gyms you've already moderated, while still requiring local trust.
- **Experience Points (XP)** — app-wide gamification points. Vanity / progression display only — does not grant rights.
- **Level** *(Newbie / Regular / HallenOG)* — app-wide percentile-based tier from XP. Top 10% = HallenOG, top 30% = Regular, rest = Newbie.
- **HallenOG** — the top-10% XP tier. *Hallen* = halls (German for gyms); *OG* = "original gangster," slang for established veteran. An internal joke.

---

## Validation states

- **pending** — the default for a boulder uploaded by a non-setter. Visible to everyone, but not in the official record yet.
- **approved** — community votes (or setter confirmation) reached the threshold. Officially in the record. Triggers XP and trust awards.
- **rejected** — 5+ rejections (auto), or moderator-led rejection.
- **Path A — community vote** — sum of voters' `validationPower` reaches `requiredValidationPoints`.
- **Path B — verified setter auto-confirm** — the user tagged as `verifiedSetterId` confirms they set it. Instant approval.

---

## Rating dimensions

- **Grade rating** — per-user feedback on whether the setter's grade is correct: `easy` / `appropriate` / `hard`.
- **Quality rating** — per-user feedback on whether the boulder is fun: `liked` / `neutral` / `disliked`.
- **Community grade** — the mode (most-common value) of all `gradeRating` submissions for a boulder.
- **Community feedback** — the mode of all `qualityRating` submissions.

---

## Tech

- **Monorepo** — single repo with `backend/` and `frontend/` packages, managed by pnpm workspaces.
- **Path alias `#/` and `@/`** — `#/foo` → backend `src/foo`; `@/foo` → frontend `src/foo`. Avoids `../../../` chains.
- **Strict TypeScript** — `strict: true`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`. No `any`, no `!`, no `@ts-ignore`.
- **JWT in HTTP-only cookies** — auth tokens stored in cookies that JavaScript cannot read. Resists XSS-driven theft.
- **Refresh token** — long-lived (30d) token stored server-side; used to obtain a fresh access token without re-login.
- **Tailwind v4** — utility-first CSS, dark mode via `dark` class on `<html>`.
- **i18next + i18next-http-backend** — bilingual EN / DE, JSON locales lazy-loaded from `public/locales/`.
- **Prisma client singleton** — single instance exported from `db/prisma.ts` to avoid pool exhaustion under hot reload.
