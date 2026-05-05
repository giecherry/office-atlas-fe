# OfficeAtlas Frontend

OfficeAtlas is a project for exploring workplace locations on an interactive map. The frontend is built with Next.js, React, Leaflet, Zustand, and Tailwind CSS.

The app supports two ways to use it:

- Real login/register through the OfficeAtlas backend and Supabase.
- Demo mode with a local demo user and static location data, so the portfolio demo still works when Supabase is paused or unavailable.

## Features

- Login and registration screens.
- Automatic auth availability check before enabling account login.
- `Try demo` flow for portfolio visitors.
- Interactive Leaflet map with office markers.
- Search, selection, detail panels, nearby discovery, navigation helpers, and saved favorites.
- Per-user persisted favorites through local Zustand storage.

## Demo Mode

Demo mode is intentionally frontend-only. It creates a local demo session and loads data from:

```text
app/data/demoLocations.ts
```

Use this file to replace or extend the demo locations shown in the portfolio version. The location shape is defined in:

```text
app/types/location.ts
```

Real Supabase-backed data is still loaded through the backend when a real user logs in.

## Environment

Create a `.env.local` file if the backend is not running on the default URL:

```bash
NEXT_PUBLIC_BACKEND_BASE_URL=http://localhost:3001
```

If the backend or Supabase is unavailable, the login form is disabled and visitors can use `Try demo`.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful Scripts

```bash
npm run dev
npm run build
npm run lint
```

## Project Status

This project is functional as a portfolio demo and still keeps the real backend/Supabase architecture in place. Planned improvements can build on the same structure without requiring the demo deployment to keep a database active at all times.
