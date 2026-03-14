# Mustache Bash Admin

## Overview
React SPA for internal event management. Handles check-in, dashboard, guest inspection, promos, orders, and transactions. Served by Vite dev server on port 8080 in development.

## Tech Stack
- **Framework**: React 18 + React Router 6
- **Build**: Vite + TypeScript
- **Auth**: Google OAuth (`@react-oauth/google`) + JWT decode
- **Charts**: Chart.js + react-chartjs-2
- **QR scanning**: html5-qrcode (check-in flow)
- **Utilities**: lodash, date-fns, classnames

## Project Structure
```
src/
├── index.tsx           # App entry
├── App.tsx             # Root component + routing
├── config.ts           # Runtime config
├── UserContext.tsx     # Auth/user context
├── EventContext.tsx    # Current event context
├── ErrorBoundary.tsx
├── views/              # Top-level page components
│   ├── CheckInView.tsx
│   ├── DashboardView.tsx
│   ├── InspectView.tsx
│   ├── LoginView.tsx
│   └── SettingsView.tsx
├── components/         # Shared UI components
├── guests/             # Guest-related components/hooks
├── orders/             # Order-related components/hooks
├── promos/             # Promo-related components/hooks
├── transactions/       # Transaction components/hooks
├── types/              # TypeScript type definitions
├── utils/              # Shared utilities
└── img/                # Static images
```

## Commands
```bash
npm start         # vite dev server (used in Docker)
npm run build     # tsc check + vite build → dist/
npm test          # eslint + tsc --noEmit + prettier check
npm run format    # prettier --write src/**/*.{ts,tsx,css}
npm run lint:fix  # eslint --fix
```

## Path Alias
`@` maps to `./src` — use `@/components/Foo` etc.

## CSS Modules
Scoped CSS modules with camelCase locals, format: `[name]__[local]___[hash:base64:5]`.

## Dev Server
- Port: 8080
- Allowed hosts: `*.localhost`, `admin-mustachebash.local.mrstache.io`

## Production Build
Multi-stage Docker build → nginx serving static files via `admin.mustachebash.conf`.
Requires `.env.production` at build time.
