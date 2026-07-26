# SIMBIOCHEM II

Website for **The 2nd SIMBIOCHEM Workshop** — *Machine Learning for Simulations
in Biology and Chemistry* — a NeurIPS 2026 workshop in Sydney, Australia.

Built with the Next.js App Router, TypeScript, Tailwind CSS v4, Motion, Zod, the
OpenReview API v2 and the Google Sheets API.

## Quick start

```bash
npm install
npm run dev            # http://localhost:3000
```

The site runs immediately with the local dev config in `.env.local`. For Google
Sheets, admin passwords and deployment, follow **[SETUP.md](./SETUP.md)**.

## What's inside

- **Home** (`/`) — parallax hero (molecular-dynamics field + Sydney skyline +
  logo, moving with scroll and pointer), mission, first-edition highlights,
  speakers + panel, live agenda, sponsors + tiers, call-for-papers band,
  organisers + advisors, and the Sydney venue.
- **Call for papers** (`/call-for-papers`) — deadlines, the NeurIPS 2026 LaTeX
  template (downloadable), submission instructions, and a detailed, mandatory
  **conflict-of-interest** section aligned with NeurIPS' COI guidelines.
- **Volunteer** (`/volunteer`) — a native Programme Committee sign-up form that
  replicates the Google Form and appends to the same spreadsheet.
- **Previous editions** (`/previous-editions/copenhagen`) — SIMBIOCHEM I at
  EurIPS 2025, with stats, awards and Nature spotlights.
- **Admin** (`/admin`) — a password-protected, drag-and-drop agenda editor.

### Design

The palette is derived by colour theory from four brands — Novo Nordisk True
Blue (`#001965`) as the base, AITHYRA teal (`#0EA5A0`) as secondary, NVIDIA green
(`#76B900`) as the vivid CTA/motion accent, and MIT red (`#750014`) as a rare
emphasis (awards, deadlines, the COI notice). Blue → teal → green are analogous
and harmonious; red is the single complementary pop. Tokens live in
`src/app/globals.css`.

## Server integrations

- `POST /api/volunteer` — validates the Programme Committee form (Zod), checks
  origin/content-type/size, rate-limits, and appends to the `Volunteers` tab.
- `POST /api/register` — same protections; appends to `Registrations`. Fails
  closed unless `REGISTRATION_ENABLED=true`.
- `GET /api/openreview/submissions` — cached public OpenReview data (5 min).
- `POST /api/admin/login` · `POST /api/admin/logout` — admin session.
- `GET|PUT /api/admin/agenda` — read/write the agenda (session + CSRF).

Sheet values use `RAW` input mode so user input can't become a formula. All
Google/OpenReview calls run only in server modules and route handlers.

## Admin console

`/admin` is protected by a username + scrypt-hashed password, an HMAC-signed
HttpOnly `SameSite=Strict` session cookie, CSRF double-submit tokens, same-origin
checks and login rate-limiting. The drag-and-drop editor writes the agenda to
`data/agenda.json` (or `AGENDA_DATA_DIR`), which the public site reads live.

Local dev login: `admin` / `Simbiochem!2026-admin` — **change before going
public** (`npm run setup` or `npm run admin:hash`).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` / `build` / `start` / `lint` | Standard Next.js |
| `npm run setup` | Interactive `.env.local` wizard (hashes password, makes secret, chmod 600) |
| `npm run setup:sheets` | Validate the service account, create tabs + headers |
| `npm run admin:hash '<pw>'` | Print an `ADMIN_PASSWORD_HASH` + `SESSION_SECRET` |

## Configuration & deployment

See **[SETUP.md](./SETUP.md)** for the full step-by-step: Google service-account
creation, sharing the spreadsheet, initialising tabs, securing the admin
password, and deploying to Hostinger (Node.js 22, server-rendered).

## Security

- `.env.local`, `.secrets/`, `*.pem` and `/data/` are git-ignored — keep them so.
- Only `NEXT_PUBLIC_GA_ID` is exposed to the browser; every other secret stays
  server-side.
- The service account can access only spreadsheets explicitly shared with it.
- Rotate keys/passwords if exposed; restrict and prune the spreadsheet data.
- The in-process rate limiter resets on restart and isn't shared across
  instances — add a CAPTCHA or shared store before wide public promotion.
