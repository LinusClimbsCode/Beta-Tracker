# Beta Tracker — Validation, Trust & Roles

Who can do what, how rights are earned, how content gets approved, how people get promoted, how inactive roles lapse, and how bad behaviour is handled. The most design-dense part of the project, and the area I find most interesting to build.

---

## 1. Actor model

```mermaid
flowchart TB
    classDef base fill:#eef,stroke:#669,color:#336,stroke-width:2px
    classDef tier fill:#efe,stroke:#696,color:#363
    classDef role fill:#fed,stroke:#a60,color:#630
    classDef app fill:#fee,stroke:#a33,color:#600

    User["<b>User</b><br/>every account starts here<br/>baseline: browse · tick · rate · vote (after activation)"]:::base

    subgraph Auto["Per-gym tier — automatic, from trust at that gym"]
        direction LR
        Beg["Beginner — 0–49"]:::tier
        Mid["Mid — 50–99"]:::tier
        Pow["Power — 100+"]:::tier
    end

    subgraph Add["Add-on roles — extras that stack on top of User"]
        direction TB
        GS["<b>Gym Setter @ Gym X</b><br/>per-gym"]:::role
        GM["<b>Gym Moderator @ Gym X</b><br/>per-gym · appointed by Gym Admin"]:::role
        CGM["<b>Community Gym Mod @ Gym X</b><br/>per-gym · earned through trust"]:::role
        GA["<b>Gym Admin @ Gym X</b><br/>per-gym · claimed gym operator"]:::role
        AA["<b>App Admin</b><br/>app-wide override"]:::app
    end

    User --> Auto
    User --> Add
```

- **User** — the baseline. Every account is a User. Browse, tick boulders for a personal logbook, rate, and (after activation) vote on validations. Everything below is an extra layered on top.
- **App Admin** — me. Single user, can override anything app-wide. (As a fast action to prevent trolling or abusing and confirm the Gym Admins )
- **Gym Admin** — the gym operator who has claimed their listing. Optional: many gyms run fully community-maintained.
- **Gym Moderator** — appointed by Gym Admin; the gym vouches for them.
- **Community Gym Moderator** — earned through trust at that specific gym.
- **Gym Setter** — per-gym setter rights. Multiple promotion paths.
- **Per-gym tier (Beginner / Mid / Power)** — every User automatically has a tier at every gym they have trust at, derived from that trust (0–49 / 50–99 / 100+). The same person can be Power at one gym and Beginner at another. Tier is not a role — it's a derived facet of being a User.

### Two core principles

1. **Per-gym scoping.** Trust, roles, and most rights are scoped to a specific gym. A Power user at Gym A is not automatically anything at Gym B.
2. **Two parallel promotion paths.** *Gym-driven* (appointed by Gym Admin/Mod, when the gym is claimed) and *community-driven* (earned through trust + community votes, always available — just slower).

---

## 2. Trust vs. XP

| | Trust points | Experience points (XP) |
|---|---|---|
| Scope | Per-gym | App-wide |
| What it does | Grants rights — voting weight, promotion eligibility, role progression | Vanity / progression display |
| Earned from | Approved upload, aligned vote, rating on approved boulder *(all per-gym)* | Tick, rate, validate-vote, upload-approved |
| Decay | Inactivity discount (see §6) | None |

XP exists for the gamification feel. Trust is the actual political currency of the app.

---

## 3. Boulder validation

How a boulder transitions from `pending` to `approved`. Two paths.

```mermaid
flowchart LR
    classDef state fill:#efe,stroke:#696,color:#363
    Pending(["status: <b>pending</b>"]):::state
    Approved(["status: <b>approved</b>"]):::state
    Rejected(["status: <b>rejected</b>"]):::state
    Modreview(["flagged for moderator review"]):::state

    Pending -- "Path A — community votes<br/>sum of validationPower at this gym<br/>≥ requiredValidationPoints" --> Approved
    Pending -- "Path B — verified setter at this gym<br/>auto-confirms" --> Approved
    Pending -- "5 rejects" --> Rejected
    Pending -- "3+ rejects" --> Modreview
    Modreview --> Approved
    Modreview --> Rejected
```

### Vote weight

Email verification is the activation gate. After verification, vote weight derives from the voter's trust at the gym where the boulder lives:

| State | validationPower |
|---|---|
| Registered, email **not** verified | 0 (inert) |
| Activated, 0–49 trust at this gym | 1 |
| Activated, 50–99 trust at this gym | 2 |
| Activated, 100+ trust at this gym | 3 |

Each vote stores the voter's `validationPower` at vote time, so retroactive trust changes don't rewrite past sums.

### Required validation points

Set at upload time from uploader's trust at the same gym:

| Uploader trust at this gym | requiredValidationPoints |
|---|---|
| 0–49 | 3 |
| 50–99 | 2 |
| 100+ | 1 |

If the uploader is a Gym Setter at this gym → instant approval.

### What this delivers

- A fresh user uploads → 3 newbie votes (1+1+1) reaches threshold.
- A Power user uploads at their home gym → 1 newbie vote approves it.
- A user with no trust at Gym X uploads at Gym X → treated as fresh user there, regardless of trust elsewhere.

---

## 4. Promotion to Gym Setter

Five paths. Pick whichever clears first.

```mermaid
flowchart LR
    classDef path fill:#ffd,stroke:#990,color:#660
    classDef user fill:#eef,stroke:#669,color:#336

    NU["<b>Normal user</b><br/>at Gym X"]:::user

    P1["<b>Path 1 — community vote</b><br/>7 normal users approve"]:::path
    P2["<b>Path 2 — community gym mod vote</b><br/>3 community gym mods approve"]:::path
    P3["<b>Path 3 — gym mod fast-track</b><br/>1 gym moderator approves"]:::path
    P4["<b>Path 4 — gym admin fast-track</b><br/>1 gym admin approves"]:::path
    P5["<b>Path 5 — auto-graduation</b><br/>25+ approved uploads at Gym X"]:::path

    GS["<b>Gym Setter @ Gym X</b>"]:::user

    NU --> P1 --> GS
    NU --> P2 --> GS
    NU --> P3 --> GS
    NU --> P4 --> GS
    NU --> P5 --> GS
```

Same approver-rank-tiered pattern as boulder validation: higher-rank approvers, fewer needed.

---

## 5. Promotion to Community Gym Moderator

Trust-only path. The threshold *decreases* the more gyms you've already moderated as a Community Gym Mod — rewarding cross-gym track record while still requiring local skin in the game.

| Promotion to N-th CGM role | Trust required at the new gym |
|---|---|
| 1st (no prior CGM roles) | 1500 |
| 2nd | 1250 |
| 3rd | 1000 |
| 4th+ | 750 (floor) |

`threshold = max(750, 1500 − 250 × prior_CGM_count)`. Trust still has to be earned natively at the new gym — cross-gym trust does not transfer directly.

---

## 6. Inactivity, lapse and re-earn

Roles aren't permanent. They lapse if the holder stops contributing.

```mermaid
stateDiagram-v2
    [*] --> Active: granted
    Active --> Lapsed_6mo: 6 months no activity at this gym
    Lapsed_6mo --> Active: re-earn 250 trust
    Lapsed_6mo --> Lapsed_12mo: 12 months no activity total
    Lapsed_12mo --> Active: re-earn 500 trust
    Active --> Quarantined: 2 reports in short window
    Quarantined --> Active: cleared by higher hierarchy
    Quarantined --> Revoked: violation confirmed
    Revoked --> [*]
```

- 6 months no activity at the gym → role enters `lapsed_6mo`. Restore: 250 fresh trust at that gym.
- 12 months no activity → `lapsed_12mo`. Restore: 500 fresh trust.
- "Activity" = any tick / vote / rating / upload at that gym while holding the role.
- Lapsed roles keep their history (grant date, reasons). They just lose active rights until re-earned.

---

## 7. Reports & quarantine

Bad-actor handling without admin micromanagement.

```mermaid
flowchart TB
    classDef state fill:#efe,stroke:#696,color:#363
    classDef bad fill:#fee,stroke:#a33,color:#600

    A["Any user can report:<br/>another user, a boulder, a vote, a rating, a comment"]
    B["Report queued for review"]
    C{"2+ reports on the<br/>same target<br/>within short window?"}
    Q(["Target auto-quarantined"]):::bad
    R["Higher-hierarchy reviewer investigates"]
    Cleared(["Cleared — restored"]):::state
    Revoked(["Violation confirmed — role revoked,<br/>account flagged, possible ban"]):::bad

    A --> B --> C
    C -- "yes" --> Q --> R
    C -- "no" --> R
    R --> Cleared
    R --> Revoked
```

- Anyone can report any user, boulder, vote, rating, or comment.
- 2 reports against the same target within ~72 hours → automatic quarantine pending review.
- Quarantine effect: voting power and promotion paths suspended at all gyms. Browsing and ticking own boulders still allowed. Resolves only when a higher-hierarchy reviewer rules.
- "Higher hierarchy" = whoever outranks the reported user in the gym where the alleged violation happened. App Admin always qualifies.
- Quarantine cap ~14 days — protects against reports going un-investigated forever.
