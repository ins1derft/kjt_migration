# AGENTS handbook

This repo uses the `docker/compose.sh` wrapper for every orchestration task. Never call `docker compose` directly.

## Agent contract
- MUST use `./docker/compose.sh` for all stack actions (up/down/build/exec/run/logs).
- MUST route HTTP through Nginx; never expose Next.js or php-fpm directly.
- MUST apply schema changes only via Laravel migrations.
- MUST keep `APP_DEBUG=false` in production.
- MUST call MCP Context7 before editing framework codebase/configs (Laravel, Next.js, Docker/Nginx) when uncertain.
- MUST avoid touching `.env.production` unless explicitly instructed.
- MUST pair functional testing of user flows with UX/UI checks via MCP `chrome-devtools` against Nginx endpoint (`http://localhost:8080`).
- MUST inspect browser console and network tab (via MCP `chrome-devtools`) for errors/warnings during test runs and treat persistent errors as bugs.

## Agent quick actions
- [DEV] Start stack: first check `./docker/compose.sh development ps`; if services already show `Up`, skip start; otherwise run `./docker/compose.sh development up --build`.
- [DEV] Stop stack: `./docker/compose.sh development down`
- [DEV] Tail logs: `./docker/compose.sh development logs -f <service>`
- [DEV] Run artisan: `./docker/compose.sh development run --rm backend-php php artisan <cmd>`
- [DEV] Frontend dev server: `./docker/compose.sh development run --rm frontend npm run dev`
- [DEV] Backend tests: `./docker/compose.sh development run --rm backend-php php artisan test`
- [DEV] Frontend lint/tests: `./docker/compose.sh development run --rm frontend npm run lint`
- [DEV] Apply migrations: `./docker/compose.sh development run --rm backend-php php artisan migrate --force`
- [PROD] Start stack: first check `./docker/compose.sh production ps`; if services already show `Up`, skip start; otherwise run `./docker/compose.sh production up -d --build`.

## Run stack
- Dev (hot reload, mounts): run `./docker/compose.sh development ps` first; only issue `./docker/compose.sh development up --build` when services are not already `Up`.
- Stop: `./docker/compose.sh development down`
- Check containers: `./docker/compose.sh development ps`
- Prod (detached, built images): run `./docker/compose.sh production ps` first; only issue `./docker/compose.sh production up -d --build` when services are not already `Up`.
- Stop prod: `./docker/compose.sh production down`
- Logs (all services): `./docker/compose.sh development logs --tail=200`
- Follow specific service: `./docker/compose.sh development logs -f frontend` (service names: frontend, backend-php, nginx, postgres)
- Rebuild a single service without restarting others: `./docker/compose.sh development up --build <service>`
- Purge dev data deliberately: `./docker/compose.sh development down -v` (removes volumes; only when you mean to reset)

## Debug playbooks (if symptom → do action)
- Next dev shows 404 on `/_next/webpack-hmr` → harmless; optionally run dev with webpack: `./docker/compose.sh development run --rm frontend npm run dev -- --webpack`.
- Hot reload stalled → inside frontend container: `rm -rf .next/cache`; then `./docker/compose.sh development restart frontend`.
- Env change not applied on frontend → edit `.env.development`; then `./docker/compose.sh development up --build frontend`.
- Backend 500 after config change → `./docker/compose.sh development run --rm backend-php php artisan config:clear && php artisan cache:clear`.
- Nginx 502 → check health: `./docker/compose.sh development ps`; tail culprit logs: `./docker/compose.sh development logs -f <service>`.
- UI/UX anomaly (broken layout, odd button behavior, “nothing happens” after user action) →
  - reproduce the steps in MCP `chrome-devtools` against `http://localhost:8080`,
  - capture Console errors and stack trace,
  - in Network find related requests (`/api/...`, status != 2xx), save URL, status, and payload/response,
  - attach screenshots/logs to the issue and note whether the bug reproduces on other breakpoints.

## Laravel / MoonShine (always via backend-php container)
- Pattern: `./docker/compose.sh development run --rm backend-php php artisan <cmd>`
- Migrations: `... migrate --force`
- Cache config/routes/views (prod): `... config:cache && ... route:cache && ... view:cache`
- MoonShine install scaffold: `... moonshine:install`
- Create MoonShine user: `... moonshine:user --username=<email> --name=<name> --password=<pass> --no-interaction`
- MoonShine builder:
  - Interactive build: `... moonshine:build` (table/json/console)
  - Dump schemas: `... moonshine:project-schema`
- Generate resource: `... moonshine:resource <ResourceName> --model="App\\Models\\<ModelName>" --title="<MenuTitle>"`
- Custom field skeleton: `... moonshine:field <ClassName>`
- Queue worker: `... queue:work --queue=default` (supervise per environment)
- Clear caches (dev): `... optimize:clear`
- Storage symlink (once): `... storage:link`
- Never call `env()` outside config files when using cached config; use `config()` helper.
- Production: `APP_DEBUG=false`.
- Seed data: `... db:seed --class=<SeederClass>`

## Laravel fundamentals (universal)
- Requests must route through `public/index.php`; never expose project root directly.
- Secrets live in `.env`; commit only `.env.example`. Regenerate app key via `php artisan key:generate` when missing.
- Preferred dev reset: drop DB, run `php artisan migrate:fresh --seed`, clear caches, restart queue workers.
- Validate inputs via form requests/validators; keep controllers thin and move logic to services.
- Long-running tasks belong on queues/events; avoid blocking HTTP responses.
- For APIs, wrap responses in resources/transformers to prevent leaking internal fields.

## Next.js (App Router, >=13)
- Dev server: `npm run dev` (or `npm run dev -- --webpack` to switch off Turbopack)
- Build: `npm run build`
- Start (standalone output): `npm run start`
- Config: `next.config.mjs` uses `output: "standalone"` and dev rewrite `/api/:path* -> http://nginx/api/:path*`.
- App Router defaults to Server Components; add `'use client'` only when client state/DOM APIs are required to reduce bundle size.
- Routes live in `app/...`: layouts per folder, `page.tsx` for leaf routes, metadata via `metadata` export or `generateMetadata`.
- Data fetching: `fetch` with `{ cache: 'no-store' }` for per-request data, or `{ next: { revalidate: <seconds> } }` for ISR; avoid mixing client/server fetch unintentionally.
- Env vars: server runtime reads `.env.*`; client-visible must be prefixed `NEXT_PUBLIC_`. Restart after adding new keys.
- Static assets go in `public/`; use `next/image` for optimized media.
- Lint before commit if configured: `npm run lint`; TypeScript errors fail builds in App Router.
- Mixing `pages` and `app` causes hard navigations between routers; keep routes in `app` to preserve soft transitions.

## Frontend testing & quality
- Prefer component/integration tests against App Router; stub `NEXT_PUBLIC_` env in CI.
- Use `next export` only when no dynamic server features are needed; otherwise rely on SSR/ISR.
- Keep `app/api` routes stateless; use `revalidatePath`/`revalidateTag` after mutations to refresh cached data.

## UX/UI & MCP chrome-devtools

- Always test through Nginx (`http://localhost:8080`); do not hit Next.js or php-fpm ports directly.
- Use MCP `chrome-devtools` as the primary tool for manual UX/UI runs on top of functional scenarios.

### Minimal checklist for each functional scenario

1. Page load
   - Open the URL via MCP `chrome-devtools` (e.g., `/`, key user pages, admin `/admin`).
   - Verify rendering without critical visual artifacts at main breakpoints (desktop / tablet / mobile).

2. Element interaction
   - Click main CTAs (login/register/create entities/save forms).
   - Type into main form fields (valid and intentionally invalid values).
   - Check states: hover / focus / disabled / loading where designed.

3. Network (MCP `chrome-devtools` → Network)
   - Ensure key API requests go through Nginx (`/api/...`), host is the Nginx container.
   - No “silent” 4xx/5xx for the user flow (aside from expected validation 4xx).
   - No endless retries/loops; long-polling/WS are expected and controlled.

4. Console (MCP `chrome-devtools` → Console)
   - No `Uncaught` JavaScript errors.
   - No persistent React warnings tied to key components (keys, hydration, etc.).
   - Any repeating errors/warnings are treated as bugs and logged to the backlog.

5. Layout & UX
   - Core UI elements stay accessible without horizontal scroll at target breakpoints.
   - Text is not clipped; placeholders/labels remain readable.
   - Critical actions provide clear feedback (toast, alert, button state change, etc.).

6. Regression
   - When layout/components change, repeat the UX/UI checklist for affected pages plus one level up in navigation (parent screen).

### Quick rituals with MCP `chrome-devtools`

- After bringing up the dev stack:
  - Open `/` in MCP `chrome-devtools` and verify:
    - Network: first load has no 5xx errors.
    - Console: no red errors.
- When reproducing a bug:
  - Enable MCP `chrome-devtools` → Console + Network.
  - Reproduce the user steps.
  - Capture:
    - list of problematic requests (URL, status, payload/response),
    - console error text.
  - Attach these artifacts to the ticket.

## Docker images (already wired in compose files)
- frontend dev image: `frontend/Dockerfile.dev` (Node 20, mounts)
- backend dev image: `backend/Dockerfile.dev` (PHP 8.3 FPM, Composer deps, no scripts)
- prod images: `frontend/Dockerfile` (multi-stage, standalone), `backend/Dockerfile` (composer --no-dev --no-scripts), `nginx/Dockerfile` (stable alpine)
- Keep final images lean: remove dev dependencies in production stages and scope build args to only required secrets.
- Prefer named volumes over relative host paths for portability across hosts/CI.
- Force fresh build when dependencies change: `./docker/compose.sh development build --no-cache <service>`

## Docker / Compose hygiene
- Orchestrate only through `docker/compose.sh`; avoid mixing raw `docker compose` for project services.
- Use `.env.development` / `.env.production` for Compose substitution; restart affected services after edits.
- Profiles should gate optional tooling only; core services should start without profile flags.
- Reuse YAML via anchors/aliases to keep shared env/volumes consistent; start relative bind mounts with `./` or `../` to avoid volume name collisions.
- For rootless setups, privileged ports may need sysctl `net.ipv4.ip_unprivileged_port_start=0` or CAP_NET_BIND_SERVICE on `rootlesskit`.

## MoonShine admin usage
- Admin URL: `http://localhost:8080/admin`
- Default asset paths served by Nginx: `/build/`, `/storage/`, `/vendor/moonshine/` (never proxy through Next.js).
- Configure via `config/moonshine.php` or `MoonShineServiceProvider`; ensure `use_migrations`, `use_notifications`, `use_database_notifications` are defined in one place.
- Run installation steps once (migrations, notifications, superuser), then manage via config/provider.
- Set title/logo/theme, auth guard, and middleware to align with main app.
- Register resources/pages/forms explicitly to control navigation; guard with policies/permissions to avoid overexposing models.
- Align storage with Laravel disks so `/storage` served by Nginx matches MoonShine uploads.

## Database (PostgreSQL)
- Service name inside Compose is `postgres`; connect from backend using host `postgres`, port `5432`.
- psql from host: `./docker/compose.sh development exec postgres psql -U <user> -d <database>`.
- Logical backup: `pg_dump -Fc -h postgres -U <user> <database> > backup.dump`; restore with `pg_restore -c -d <database> backup.dump`.
- Physical base backup (full data dir): `pg_basebackup -h postgres -D /var/lib/postgresql/basebackup -Ft -z -P` (ensure target volume exists and perms are correct).
- Schema changes go through migrations; avoid ad-hoc DDL in psql so environments stay aligned.
- Tune connection pools to avoid exhausting `max_connections`; align app pool size with Postgres limits.

## Deployment & production hardening
- Production start: `./docker/compose.sh production up -d --build` using prod images only.
- Run `php artisan optimize` during releases (config/route/view cache) and rebuild caches when env changes.
- Keep `APP_DEBUG=false`, set `APP_URL`, secure cookies/sessions, and supervise queue workers.
- Apply migrations before exposing new code; take backups before destructive schema changes.
- Next.js standalone serves via `npm run start`; set `NODE_ENV=production` and required `NEXT_PUBLIC_` vars at build time.
- Terminate TLS at Nginx; do not expose node or php-fpm directly.

## Observability & logging
- Aggregate logs with `./docker/compose.sh development logs -f <service>`; tail in-container logs for fine-grain issues (e.g., `/var/log/nginx/access.log`).
- Enable verbose Laravel request/SQL logging only temporarily; disable in prod to avoid PII leaks and slowdowns.
- Watch queue failures (failed_jobs/Horizon) and restart workers after deployments.

## Testing & QA
- Backend: `php artisan test` (or `phpunit`) inside backend-php; use a dedicated testing DB and refresh migrations per run.
- Frontend: `npm run lint` plus configured test runner; keep snapshots aligned with App Router output.
- Contract/API tests keep Next.js and Laravel in sync; pin shared DTOs/interfaces if used.
- For each critical user flow (auth, CRUD, checkout-like flows), pair functional tests with manual UX/UI walk-through via MCP `chrome-devtools`:
  - run the flow end-to-end via `http://localhost:8080`,
  - check layout, interactive states, console errors, and API calls in Network.
- Before merging feature branches, ensure there are no persistent console errors/warnings in MCP `chrome-devtools` for main flows.

## API & integration checks
- Hit API through Nginx: `http://localhost:8080/api/...`; avoid routing API through Next.js proxies in production.
- Validate CORS/auth headers at Laravel; configure Nginx to pass only necessary headers.
- Provide lightweight health/readiness endpoints; do not rely solely on Compose `depends_on` for readiness.

Remember: always operate through `docker/compose.sh`, keep MoonShine assets behind Nginx/Laravel, and consult MCP Context7 for fresh framework guidance before altering code or configs.
