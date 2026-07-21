# SIMBIOCHEM

Website for the SIMBIOCHEM NeurIPS 2026 workshop, built with the Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Motion, Zod, OpenReview API v2 and the Google Sheets API.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Server integrations

`GET /api/openreview/submissions` queries the configurable OpenReview API v2 venue or submission invitation and caches the public response for five minutes.

`POST /api/register` validates form input with Zod, applies a basic process-local rate limit and appends accepted records to Google Sheets. For production across multiple Vercel instances, replace the process-local limiter with a shared rate-limit store and add CAPTCHA before opening public registration.

Configure the values documented in `.env.example`. Environment variables without the `NEXT_PUBLIC_` prefix stay on the server.

For Google Sheets, either provide the service-account email and private key as environment variables or place the downloaded credentials JSON in the ignored `.secrets/` directory and set `GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_FILE=.secrets/<filename>.json`. Share the spreadsheet with the service-account email and enable the Google Sheets API in the corresponding Google Cloud project.

## Security

- `.env*` files are ignored except for `.env.example`.
- `.secrets/`, PEM files and Vercel local configuration are ignored.
- Never commit service-account JSON, private keys or populated environment files.
- OpenReview and Google Sheets calls run only in server modules and Route Handlers.

## Checks

```bash
npm run lint
npm run build
```

The project is ready for deployment on Vercel after its server environment variables are configured.
