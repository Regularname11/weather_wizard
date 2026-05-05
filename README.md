# Weather Wizard

Weather Wizard is a TypeScript + React web app (Next.js App Router) that integrates with the [Open-Meteo Forecast API](https://api.open-meteo.com/v1/forecast) to search locations and display a clean daily forecast view.

#### **Live app**: check here: https://weather-wizard-rho.vercel.app/

## Tech stack

- TypeScript
- React
- Next.js
- Sass (CSS Modules)
- TanStack Query (data fetching/caching)
- Zod - schema validation (at runtime)

## Features

- Location search with Open-Meteo geocoding.
- Forecast cards for up to 10 days.
- Unit toggle (Celsius/Fahrenheit).
- Forecast range toggle (5-day / 10-day).
- Clean server routes that proxy/validate Open-Meteo requests.

## Project structure

- `app/page.tsx`: main weather UI.
- `app/page.module.scss`: page-level Sass module styles.
- `app/api/weather/search/route.ts`: geocoding endpoint.
- `app/api/weather/forecast/route.ts`: forecast endpoint.
- `lib/hooks/use-weather.ts`: weather/search React Query hooks.
- `lib/api/weather.ts`: browser API helpers.

## Local setup

### Prerequisites

- Node.js 20+ (recommended)
- npm 10+ (recommended)

### Install dependencies

```bash
npm install
```

### Run in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Quality checks

```bash
npm run lint
npm run build
```

## CI/CD

GitHub Actions workflows are included:

- `CI` (`.github/workflows/ci.yml`): runs on PRs and pushes to `main`, installs dependencies, lints, and builds.
- `Deploy` (`.github/workflows/deploy.yml`): deploys to Vercel after CI succeeds on `main`.

Set these GitHub repository secrets before deployment:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Deployment

The deployment workflow is configured for Vercel via GitHub Actions. You can also deploy manually with Vercel CLI if needed.
