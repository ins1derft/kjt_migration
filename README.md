# Monorepo: Next.js 16 + Laravel 12 + MoonShine 4 + PostgreSQL 18 + Nginx

Everything runs through `./docker/compose.sh` (dev/prod). Next.js serves the public site; Laravel serves API and MoonShine admin. MoonShine assets are served directly by Nginx/Laravel (never via Next).

## Quick start
```bash
# Development (hot reload for Next/Laravel)
./docker/compose.sh development up --build
./docker/compose.sh development ps
./docker/compose.sh development down

# Production (standalone Next, optimized PHP)
./docker/compose.sh production up -d --build
./docker/compose.sh production down
```

## Services (dev compose)
- frontend: Next.js 16 dev server on :3000 (also proxied by Nginx :8080)
- backend-php: PHP-FPM 8.3 + Laravel 12 + MoonShine 4
- nginx: routes `/` to Next, `/api`, `/admin`, `/build`, `/storage`, `/vendor/moonshine` to Laravel
- postgres: official `postgres:18-alpine` with volume `postgres-data`

## MoonShine builder (dev-lnk/moonshine-builder)
- Config: `backend/config/moonshine_builder.php` (`builds_dir` -> `backend/builds`)
- Commands (run inside PHP container):
  ```bash
  ./docker/compose.sh development run --rm backend-php php artisan moonshine:build
  ./docker/compose.sh development run --rm backend-php php artisan moonshine:project-schema
  ```
  Use interactive modes (`table`, `json`, `console`) to generate schemas; resources land under `app/MoonShine/Resources/*`.

## API contract
- GET `/api/posts` → list of posts (id, title, slug, body, published_at)
- GET `/api/posts/{slug}` → single post

## Next.js
- `frontend/next.config.mjs` sets `output: 'standalone'` and dev rewrites `/api/*` → `http://nginx/api/*` (overridable via `NEXT_API_PROXY`).
- Pages: `/` lists posts, `/blog/[slug]` shows a post; data loaded from Laravel API.

## Laravel
- Post model + migration (`database/migrations/*posts_table.php`).
- MoonShine Post resource with CRUD pages (`app/MoonShine/Resources/Post/*`).
- `bootstrap/app.php` wires `routes/api.php` for API separation.

## Docker / Nginx
- `docker/development.compose.yml` mounts source for hot reload.
- `docker/production.compose.yml` uses built images (no code mounts for Next/PHP; Nginx mounts `backend/public` for assets).
- Nginx configs (`nginx/nginx.dev.conf`, `nginx/nginx.prod.conf`) isolate Laravel/MoonShine assets with `^~` blocks and proxy Next for everything else.

## Env files (root)
- `.env.development` and `.env.production` feed compose. Update Postgres creds and `NEXT_PUBLIC_API_URL` as needed. `APP_KEY` is prefilled for convenience.

## Helper scripts
- `scripts/db-migrate.sh [environment]` → run Laravel migrations via compose wrapper.

