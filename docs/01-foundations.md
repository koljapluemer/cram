@docs

# 01 – Project Foundations & Tooling

1. Restructure `src/` so top-level folders match the spec: `app`, `dumb`, `entities`, `features`, `meta-features`, `pages`. Move existing files into the closest matching slice; keep cross-import rules enforceable from day one.
2. In `src/app/`, create the minimal Vue entry point (`main.ts`, `App.vue`) that wires Vite, registers Tailwind/Daisy styles, and renders a single `<RouterView />` wrapped in a layout container that respects responsive spacing.
3. Configure Vue Router in `src/app/router.ts`, exporting a factory that the root app uses. Stub routes for dashboard, situation practice, community submissions, and moderation so later tasks can fill them in.
4. Install and configure ESLint + Prettier for Vue 3 + TypeScript. Add `lint` and `lint:fix` npm scripts and ensure Vite uses the same tsconfig paths. Treat lint errors as blockers for future tasks.
5. Add a global DaisyUI toast system: create a `app/providers/toast.ts` helper that mounts a top-level toast container in `App.vue` and exposes typed functions other slices can import.
6. Define base utility styles and light layout primitives (e.g., `dumb/layout/PageShell.vue`, `dumb/feedback/ToastHost.vue`) that wrap children with consistent spacing instead of sprinkling ad-hoc divs later.
7. Document architectural guardrails via TypeScript path aliases or lint rules (e.g., `eslint-import-resolver` config) so higher layers cannot import forbidden folders.
