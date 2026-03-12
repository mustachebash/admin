![](https://github.com/mustachebash/admin/workflows/Continuous%20Integration/badge.svg) ![](https://github.com/mustachebash/admin/workflows/Deployment/badge.svg)

# Mustache Bash Admin

Web-based administration tools for managing tickets, sales, guest lists, and event operations.

## Quick Start

```bash
npm install
npm start        # dev server at http://localhost:5173
npm run build    # production build (runs tsc first)
npm run preview  # preview production build locally
```

## Scripts

```bash
npm start             # Vite dev server with HMR
npm run build         # Type-check then build for production
npm run preview       # Serve the production build
npm run type-check    # TypeScript type checking only
npm run lint          # ESLint
npm run lint:fix      # ESLint with auto-fix
npm run format        # Prettier (writes files)
npm run format:check  # Prettier (check only)
```

## Stack

- **React 18** with TypeScript 5
- **Vite 5** — dev server and production bundler
- **React Router v6** — client-side routing
- **CSS Modules** — scoped component styles; global base styles in `base.css` / `variables.css`
- **Chart.js / react-chartjs-2** — dashboard charts
- **html5-qrcode** — QR code scanning for check-in
- **classnames** — conditional class composition
- **date-fns** — date formatting
- **JWT / Google OAuth** — authentication (`@react-oauth/google`)

## Environment

Copy and configure before running locally:

- `.env.development` — local API base URL, sandbox payment gateway config
- `.env.production` — production API base URL, live payment gateway config

All env vars are prefixed `VITE_` and read through `src/config.ts`.

## Project Structure

```
src/
├── index.tsx               # App entry, React 18 root
├── App.tsx                 # Router setup
├── config.ts               # Env var exports
├── base.css                # Global resets and base styles
├── variables.css           # CSS custom properties
├── types/                  # Shared TypeScript types
├── utils/                  # apiClient, helpers
├── components/             # Shared components (Header, Container, FlexRow, etc.)
├── views/                  # Top-level route views
├── guests/                 # Guests module (views, components)
├── orders/                 # Orders module (views, components)
├── transactions/           # Transactions module (views, components)
└── promos/                 # Promos module (views, components)
```

## Roles

Access is gated by user role: `root`, `god`, `admin`, `write`, `doorman`, `read`.

- **doorman** — check-in and guests only
- **write** — adds orders and promos
- **admin** — adds inspect and settings
- **god / root** — full access

## Requirements

- Node.js 18+ (developed on v25)
- npm 9+

## License

Private — Wild Feather LLC
