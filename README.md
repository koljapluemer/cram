# Cram Prototype

Outcome-driven language practice prototype built with Vue 3, Vite, Tailwind, and DaisyUI.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file from the template and adjust values:

   ```bash
   cp .env.example .env
   ```

   | Variable | Description |
   | --- | --- |
   | `VITE_API_BASE_URL` | Root URL for the backend API (include the `/api` suffix). |
   | `VITE_DEXIE_CLOUD_URL` | Optional Dexie Cloud endpoint. Leave empty to disable cloud sync. |

## Development

- Run the dev server: `npm run dev`
- Run lint checks: `npm run lint`
- Build for production: `npm run build`

## Project Structure

The codebase follows a feature-sliced layout:

- `app/` – global setup (router, providers, config)
- `dumb/` – reusable UI primitives (no business logic)
- `entities/` – data models and repositories
- `features/` – user-facing interactions scoped to a single entity
- `meta-features/` – orchestration when multiple features collaborate
- `pages/` – route-level views

Refer to `spec.md` and `API.md` for user requirements and backend contract details.
