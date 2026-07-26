# SIMBIOCHEM — setup & configuration manual

A step-by-step guide to configuring the site locally and on Hostinger, and to
connecting the volunteer/registration forms to your Google Sheet. Follow the
sections in order. **Everything secret stays in git-ignored files — never commit
`.env.local` or the service-account JSON.**

---

## 0. One-time: install & run locally

```bash
npm install
npm run dev            # http://localhost:3000
```

The site runs immediately. The **admin console** works out of the box with the
local dev credentials in `.env.local`:

- URL: <http://localhost:3000/admin/login>
- Username: `admin`
- Password: `Simbiochem!2026-admin`  ← change this before going public (Section 3).

The **volunteer form** renders and validates immediately, but only *saves* once
you finish Section 2 (Google Sheets).

---

## 1. Configure everything with the wizard (recommended)

```bash
npm run setup
```

This asks for each value (site URL, GA ID, admin username/password, spreadsheet
ID, service-account path, feature flags), then writes `.env.local` with
permissions `600`. It **hashes** the admin password and **generates** a session
secret for you — secrets are never echoed to the terminal. Press Enter to keep
the shown default. You can re-run it any time; leaving the password blank keeps
the current one.

Prefer to edit by hand? Copy `.env.example` to `.env.local` and fill it in. To
hash a password manually: `npm run admin:hash 'your-password'`.

> ⚠️ In `.env` files the admin hash uses `:` as a separator (not `$`) because
> dotenv would otherwise expand `$`. The tooling already does this — don't
> change it.

---

## 2. Connect Google Sheets (volunteer + registration saving)

Both forms append to **one spreadsheet**, on two tabs:
`Registrations` and `Volunteers`. This is the same spreadsheet your Google Form
already uses.

### 2.1 Create a Google Cloud service account

1. Go to <https://console.cloud.google.com/> and create (or pick) a project.
2. Enable the **Google Sheets API**:
   <https://console.cloud.google.com/apis/library/sheets.googleapis.com>
3. **APIs & Services → Credentials → Create credentials → Service account.**
   Give it a name (e.g. `simbiochem-sheets`). Do **not** grant it a project
   role and do **not** enable domain-wide delegation.
4. Open the new service account → **Keys → Add key → Create new key → JSON**.
   A JSON file downloads.

### 2.2 Store the key safely

```bash
mkdir -p .secrets
mv ~/Downloads/<that-file>.json .secrets/service-account.json
chmod 600 .secrets/service-account.json
```

`.secrets/` is git-ignored. Point the env at it (the wizard defaults to this):

```dotenv
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_FILE=.secrets/service-account.json
GOOGLE_SHEETS_SPREADSHEET_ID=1pxCkRSf6BPh4D7zduboVPfbkvm9hiKIbBzZMIWny3S8
```

### 2.3 Share the spreadsheet with the service account

Open `.secrets/service-account.json` and copy the `client_email`
(looks like `simbiochem-sheets@<project>.iam.gserviceaccount.com`).

In the Google Sheet: **Share → add that email as Editor.** Share only this one
spreadsheet — not a whole Drive folder.

### 2.4 Initialise the tabs and headers

```bash
npm run setup:sheets
```

This authenticates, prints the service-account email (to double-check sharing),
creates the `Registrations` and `Volunteers` tabs if missing, and writes header
rows. It never deletes data and is safe to re-run. If you see a `403`, the sheet
isn't shared with the service account yet — do 2.3 and re-run.

> The `Volunteers` tab created here is where native volunteer sign-ups land. If
> you want them in the *existing* Google-Form response tab instead, set
> `GOOGLE_SHEETS_VOLUNTEERS_RANGE=<that tab name>!A:I` and re-run.

### 2.5 Test end-to-end

With `npm run dev` running, submit the form at
<http://localhost:3000/volunteer>. A new row should appear on the `Volunteers`
tab within seconds. (Registration is off by default — set
`REGISTRATION_ENABLED=true` to test it too.)

---

## 3. Secure the admin console before going public

```bash
npm run setup           # choose a strong password when prompted
# or, manually:
npm run admin:hash 'a-long-strong-password'   # paste output into .env.local
```

Set a distinct `ADMIN_USERNAME`. The wizard already generated a random
`SESSION_SECRET`; keep it secret and stable (changing it logs everyone out).

Admin protections in place: scrypt-hashed password, HMAC-signed HttpOnly
`SameSite=Strict` session cookie (8-hour expiry), CSRF double-submit token,
same-origin checks, and login rate-limiting.

---

## 4. Deploy to Hostinger

This is a **server-rendered** Next.js app (not a static export). Use Hostinger's
**Deploy Web App** flow on a Business Web Hosting or Cloud plan with **Node.js 22**.
Deploying from GitHub gives automatic builds on each push.

1. Push this repo to GitHub (secrets are git-ignored and will **not** be pushed).
2. In Hostinger, create the Node.js web app from the repo; build `npm run build`,
   start `npm run start`.
3. In the app's **Environment Variables** section, set the same keys as
   `.env.local`, but with production values:
   - `SITE_URL=https://your-domain` (your real HTTPS origin — required for the
     form origin checks to pass)
   - `NEXT_PUBLIC_GA_ID=G-VWS9V4TY11`
   - `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`
   - `VOLUNTEER_ENABLED=true`, `REGISTRATION_ENABLED` as desired
   - `GOOGLE_SHEETS_SPREADSHEET_ID`, `GOOGLE_SHEETS_RANGE`,
     `GOOGLE_SHEETS_VOLUNTEERS_RANGE`
   - **Credentials:** either upload the JSON to a path and set
     `GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_FILE`, **or** paste
     `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
     (the key may contain literal `\n`).
   - Optional `AGENDA_DATA_DIR` pointing at a writable, persistent directory if
     the app root isn't writable (the admin agenda editor writes JSON there).
4. Deploy, confirm HTTPS works, sign into `/admin/login`, and submit one test on
   `/volunteer` to confirm a row lands in the sheet.

The agenda the admin edits is stored in `data/agenda.json` (or `AGENDA_DATA_DIR`).
Ensure that directory persists across deploys/restarts on your plan.

---

## 5. Security checklist

- `.env.local`, `.secrets/`, `*.pem` and `/data/` are git-ignored — keep them so.
- Never put a secret in a `NEXT_PUBLIC_*` variable (those ship to the browser).
  Only the GA ID is public by design.
- Google Sheet writes use `RAW` input mode, so user input can't become a
  spreadsheet formula.
- The service account can touch **only** spreadsheets explicitly shared with it.
- Rotate the service-account key and admin password if either is ever exposed.
- Restrict the spreadsheet to organisers who need the data; delete exports when
  no longer needed.
- The in-process rate limiter resets on restart and isn't shared across
  instances. Before advertising the forms widely, add a CAPTCHA or a shared
  rate-limit store.

---

## Quick command reference

| Command | What it does |
|---|---|
| `npm run dev` | Run locally at :3000 |
| `npm run build` / `npm run start` | Production build / serve |
| `npm run lint` | Lint |
| `npm run setup` | Interactive `.env.local` wizard (hashes password, makes secret) |
| `npm run setup:sheets` | Validate Google auth + create tabs/headers |
| `npm run admin:hash '<pw>'` | Print an `ADMIN_PASSWORD_HASH` + a `SESSION_SECRET` |
