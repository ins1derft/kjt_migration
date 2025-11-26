# Архитектура монорепозитория

Монорепо объединяет публичный фронтенд на Next.js 16 (App Router) и бэкенд на Laravel 12 с админкой MoonShine 4 и PostgreSQL 18. Трафик всегда проходит через Nginx; оркестрация только через `docker/compose.sh`.

## Поток запросов (runtime)
```
Браузер → Nginx (:8080 dev / :80 prod)
  ├─ /admin, /api, /build, /storage, /vendor → php-fpm (backend-php) → PostgreSQL
  └─ остальное (/,_next, статические) → Next.js (frontend)
Next.js при загрузке данных дергает /api/* (через Nginx) → Laravel → PostgreSQL
```

## Фронтенд (директория `frontend/`)
- Next.js 16, App Router, SSR.
- Главные маршруты:
  - `/` (`app/page.tsx`) — серверный компонент, раз в 30 с реалидация списка постов из `/api/posts`.
  - `/blog/[slug]` — детальная страница поста, `cache: "no-store"`.
- Конфиг: `next.config.mjs` (`output: "standalone"`). В dev переписывает `/api/*` на `http://nginx/api/*` или `NEXT_API_PROXY`; в прод переписываний нет.
- Метаданные и шрифты задаются в `app/layout.tsx` (Geist/Geist Mono). Стили — CSS Modules + `app/globals.css`.
- Переменные окружения, доступные клиенту: `NEXT_PUBLIC_API_URL` (по умолчанию `http://localhost:8080/api`).

## Бэкенд Laravel (директория `backend/`)
- Вход: `public/index.php`; API и админка обслуживаются через Nginx.
- Основные маршруты (`routes/api.php`):
  - `GET /api/health` → `{ ok: true }`
  - `GET /api/posts` → все посты, сортировка `published_at desc, created_at desc`
  - `GET /api/posts/{slug}` → пост по slug или 404
- Веб-роут `/` (стандартный `welcome`), остальное закрыто MoonShine.

### Модели и таблицы (кастомные)
| Модель | Таблица | Ключевые поля/касты | Связи |
|---|---|---|---|
| `Post` | `posts` | `title`, `slug` (unique), `body`, `published_at` (cast datetime) | — |
| `Page` | `pages` | `slug` unique, `title`, `type`, `status` (draft/published), `blocks` jsonb (LayoutsCast), SEO-поля, `published_at`; accessor `blocks_array` | — |
| `Article` | `articles` | `slug` unique, `title`, `type`, `excerpt`, `body`, `featured_image`, `status`, SEO, `published_at` (cast datetime) | `categories` many-to-many `ArticleCategory` |
| `ArticleCategory` | `article_categories` | `slug` unique, `name`, `group`, `parent_id` self-FK | `articles` m2m, `parent`/`children` |
| `Game` | `games` | `slug` unique, `title`, `genre`, `target_age`, `excerpt`, `body`, `hero_image`, SEO | `categories` m2m `GameCategory` |
| `GameCategory` | `game_categories` | `slug` unique, `name`, `description` | `games` m2m |
| `Product` | `products` | `slug` unique, `name`, `subtitle`, `excerpt`, `description`, `hero_image`, `product_type`, `default_cta_label`, SEO | `variants` hasMany, `industries` m2m |
| `ProductVariant` | `product_variants` | FK `product_id`, `name`, `sku`, `price` decimal(12,2), `label`, `specs` jsonb (cast array), `position` | `product` belongsTo |
| `Industry` | `industries` | `slug` unique, `name`, `group` | `products` m2m |
| `StoreProduct` | `store_products` | `slug` unique, `name`, `excerpt`, `description`, `image`, `price`, `is_available` bool, SEO | `categories` m2m `StoreCategory` |
| `StoreCategory` | `store_categories` | `slug` unique, `name`, `parent_id` self-FK | `products` m2m, `parent`/`children` |
| `Form` | `forms` | `code` unique, `title`, `config` jsonb (cast array) | `leads` hasMany via `form_code` |
| `Lead` | `leads` | `form_code`, `payload` jsonb, `source_url`, `utm` jsonb (casts array) | — |
| `User` | `users` | стандартный Laravel, `password` hashed | — |

### Pivot-таблицы
- `article_article_category` (article_id, article_category_id, PK составной, cascade).
- `game_game_category` (game_id, game_category_id).
- `industry_product` (industry_id, product_id).
- `store_category_store_product` (store_product_id, store_category_id).

### MoonShine (админка)
- Провайдер `App\Providers\MoonShineServiceProvider` регистрирует все ресурсы; layout `App\MoonShine\Layouts\MoonShineLayout` (палитра Purple, кастомное меню).
- Адрес админки: `/admin` (prefix из `config/moonshine.php`), аутентификация `moonshine` guard.
- Ресурсы (CRUD):
  - **Контент:** `PostResource`, `PageResource` (конструктор блоков: hero, features_grid, games_list, news_list, quote_form), `ArticleResource` (типы: news/case_study/blog/in_press, категории m2m), `ArticleCategoryResource` (иерархия категорий).
  - **Игры:** `GameResource` (genre/target_age, hero_image, m2m категории), `GameCategoryResource`.
  - **Продукты:** `ProductResource` (industries m2m, SEO), `ProductVariantResource` (price/sku/specs JSON, сортировка `position`), `IndustryResource` (группы government/healthcare/public/other).
  - **Магазин:** `StoreProductResource` (availability switcher, price, categories m2m), `StoreCategoryResource` (self-parent).
  - **Формы и лиды:** `FormResource` (JSON-конфиг форм: submit_label, success_message, поля с типами text/email/phone/textarea/select/checkbox), `LeadResource` (payload, utm JSON).
  - **Системные:** `MoonShineUserResource`, `MoonShineUserRoleResource` (стандартные ресурсы пакета).
- Все CRUD-страницы используют валидации уникальности slug/code и базовые required-правила; загрузки файлов ведутся на диск `public` в подкаталоги `seo/`, `pages/hero`, `articles`, `games`, `products`, `store`.

## Инфраструктура
- **Оркестрация:** `docker/compose.sh <environment> …` (обязательное использование). Композ-файлы: `docker/development.compose.yml`, `docker/production.compose.yml`. Env-файлы: `.env.development`, `.env.production`.
- **Сервисы (dev):**
  - `frontend`: Next dev server на 3000, код смонтирован.
  - `backend-php`: PHP-FPM 8.3, Laravel код смонтирован.
  - `nginx`: слушает :8080, подхватывает `nginx/nginx.dev.conf`.
  - `postgres`: `postgres:18-alpine`, volume `postgres-data`.
- **Сервисы (prod):** сборка prod-образов Next/Laravel/Nginx, порт :80; `APP_DEBUG=false`.
- **Nginx:** `nginx/nginx.*.conf` — роутинг `/admin` и `/api` в php-fpm, статические Laravel ассеты (`/build`,`/storage`,`/vendor`) обслуживаются напрямую; остальное проксируется в Next (в prod кэширование выключено через `proxy_cache_bypass`).
- **База данных:** host `postgres`, port `5432`; миграции покрывают все сущности, дополнительные изменения в схеме допускаются только через миграции.

## Взаимодействие данных
- Фронтенд пока использует только сущность `Post` (чтение через API). Остальные сущности управляются через админку и могут быть добавлены в публичный API при расширении.
- Структурированные контент-блоки страниц (`pages.blocks`) сохраняются как LayoutsCast и доступны как массив через аксессор `blocks_array` для возможных API/рендеринга.
- Формы: структура хранится в `forms.config`, а отправленные данные — в `leads.payload`/`utm`; связи завязаны на `form_code`.

## Работа и дальнейшее расширение
- Для локального запуска соблюдайте контракт: проверяйте `./docker/compose.sh development ps`, далее `./docker/compose.sh development up --build` при необходимости.
- Новые схемы добавляйте миграциями; новые админские CRUD — через MoonShine resources (при генерации прописывать в `MoonShineServiceProvider` и меню `MoonShineLayout`).
- Ключевые точки расширения фронтенда: подключение новых API (pages, articles, products), использование `NEXT_PUBLIC_API_URL` для прокси через Nginx.
