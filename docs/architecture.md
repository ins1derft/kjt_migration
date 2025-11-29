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
- Next.js 16, App Router, SSR. Стилизация — TailwindCSS + shadcn/ui primitives (`button`, `card`, `input`, `textarea`, `badge`), utility `cn` в `src/lib/utils.ts`.
- Главные маршруты:
- `/` (`app/page.tsx`) — статический набор PageBlock, захардкоженный в коде (hero/feature grid/stats/games_gallery/use_cases/product_cards/news_list/quote_form) и отрисованный через `renderBlocks` без клиентских API-вызовов; для блока quote_form конфиг формы подтягивается на сервере перед рендером.
  - `/blog/[slug]` — детальная страница поста, `cache: "no-store"`.
  - `(marketing)/[slug]` — любые контентные и продуктовые лендинги (about, interactive-floor и др.), данные с `/api/pages/{slug}`, блоковый рендер через реестр.
  - `/news` и `/news/[...slug]` — список статей `type=news` и детальная статья по slug последнего сегмента.
  - `/case-studies` — список `type=case_study`, карточки ведут на `/news/{slug}`.
  - `/games` и `/games/[slug]` — каталог игр и детали.
- `/store` и `/store/[slug]` — каталог и карточка StoreProduct.
- `/case-studies` — список кейсов (articles type=case_study) на Tailwind/shadcn `Card`.
- Конфиг: `next.config.mjs` (`output: "standalone"`). В dev переписывает `/api/*` на `http://nginx/api/*` или `NEXT_API_PROXY`; в прод переписываний нет.
- Глобальный каркас `app/layout.tsx` выводит шапку/футер (`src/components/layout/SiteHeader|SiteFooter`) в стилистике kidsjumptech.com: топ-бар (News, Case Studies, Testimonials/FAQs/Support + соцсети), основное меню (Home, Products & Experiences → `/games`, Industries → `/case-studies`, Why Us → `/news`, Contact → якорь `#contact`), контакты (tel/WhatsApp) и CTA Live Demo (mailto). Стили и палитра бренда/контейнер `container`/sticky nav вынесены в `app/globals.css`.
- Метаданные по умолчанию: title `Kids Jump Tech | Interactive Equipment for Kids`, description обновлён под витрину; шрифты Geist/Geist Mono. Стили — Tailwind-предустановки + дизайн-токены (HSL) в `app/globals.css`, Tailwind config `tailwind.config.js`, postcss конфиг `postcss.config.js`.
- Переменные окружения, доступные клиенту: `NEXT_PUBLIC_API_URL` (по умолчанию `http://localhost:8080/api`).
- Блоковый рендерер: типы `src/lib/blocks/types.ts`, реестр `src/lib/blocks/registry.tsx`; готовые блоки Hero, FeaturesGrid, GamesList, QuoteForm, IconBullets, Stats, LogosStrip, ComparisonTable, GamesGallery, UseCases, FAQ, ReviewsFeed, ProductCards, NewsList в `src/components/blocks/*` (все на Tailwind/shadcn). QuoteForm делится на серверную обертку (запрашивает конфиг формы) и клиентскую часть (отправка), чтобы не светить GET формы в браузере. Маркетинговые страницы используют `renderBlocks`.
- Динамическое SEO: `generateMetadata` на маркетинговых, новостных, игровых и store‑страницах читает SEO-поля из API-ответов.

## Бэкенд Laravel (директория `backend/`)
- Вход: `public/index.php`; API и админка обслуживаются через Nginx.
- Основные маршруты (`routes/api.php`):
  - `GET /api/health` → `{ ok: true }`
  - Посты (демо): `GET /api/posts`, `GET /api/posts/{slug}`.
  - Контентные страницы: `GET /api/pages/{slug}` — только `status=published`, ответ `PageResource` (`slug`, `title`, `type`, `seo{title,description,canonical,og_image}`, `blocks[{name,key,values}]`); API не перекладывает их в `layout/fields`, фронт сам мапит `name→layout`, `values→fields` при рендере.
  - Статьи: `GET /api/articles?type&category&limit&page`, `GET /api/articles/{slug}` — только опубликованные; `ArticleResource` включает SEO и категории.
  - Игры: `GET /api/games?limit`, `GET /api/games/{slug}` (`GameResource`, категории, products_used, game_type, video_url, is_indexable).
  - Продукты-лендинги: `GET /api/products?limit`, `GET /api/products/{slug}` (`ProductResource` с variants + industries).
  - Магазин: `GET /api/store/products?limit&available`, `GET /api/store/products/{slug}` (`StoreProductResource` с категориями, доступностью, specs).
  - Формы: `POST /api/forms/{code}` — валидация обязательных полей (email + required из `forms.config`), создание `Lead` с `payload`/`source_url`/`utm`, ответ `{ success: true }` 201.
- Веб-роут `/` (стандартный `welcome`), остальное закрыто MoonShine.

### Модели и таблицы (кастомные)
| Модель | Таблица | Ключевые поля/касты | Связи |
|---|---|---|---|
| `Post` | `posts` | `title`, `slug` (unique), `body`, `published_at` (cast datetime) | — |
| `Page` | `pages` | `slug` unique, `title`, `type`, `status` (draft/published), `blocks` jsonb (LayoutsCast; хранит элементы как `{name,key,values}`), SEO-поля, `published_at`; accessor `blocks_array` | — |
| `Article` | `articles` | `slug` unique, `title`, `type`, `excerpt`, `body`, `featured_image`, `status`, SEO, `published_at` (cast datetime) | `categories` many-to-many `ArticleCategory` |
| `ArticleCategory` | `article_categories` | `slug` unique, `name`, `group`, `parent_id` self-FK | `articles` m2m, `parent`/`children` |
| `Game` | `games` | `slug` unique, `title`, `genre`, `target_age`, `game_type`, `excerpt`, `body`, `hero_image`, `video_url`, `is_indexable` bool, SEO | `categories` m2m `GameCategory`, `products` m2m |
| `GameCategory` | `game_categories` | `slug` unique, `name`, `description` | `games` m2m |
| `Product` | `products` | `slug` unique, `name`, `subtitle`, `excerpt`, `description`, `hero_image`, `product_type`, `default_cta_label`, SEO | `variants` hasMany, `industries` m2m |
| `ProductVariant` | `product_variants` | FK `product_id`, `name`, `sku`, `price` decimal(12,2), `label`, `specs` jsonb (cast array), `position` | `product` belongsTo |
| `Industry` | `industries` | `slug` unique, `name`, `group` | `products` m2m |
| `StoreProduct` | `store_products` | `slug` unique, `name`, `excerpt`, `description`, `image`, `price`, `is_available` bool, `specs` jsonb, SEO | `categories` m2m `StoreCategory` |
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
  - **Продукты:** `ProductResource` (industries m2m, SEO), `ProductVariantResource` (price/sku/specs JSON, сортировка `position`; specs выводятся как таблица key→value), `IndustryResource` (группы government/healthcare/public/other).
  - **Магазин:** `StoreProductResource` (availability switcher, price, categories m2m), `StoreCategoryResource` (self-parent).
  - **Формы и лиды:** `FormResource` (JSON-конфиг форм: submit_label, success_message, поля с типами text/email/phone/textarea/select/checkbox), `LeadResource` (payload, utm JSON; деталь выводит payload/utm таблицей key→value плюс source_url).
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
- Публичные страницы, новости, кейсы, игры и каталог читаются с Laravel API (pages/articles/games/products/store_products) через Next.js `fetch`/`renderBlocks`; посты оставлены как демо.
- Структурированные контент-блоки страниц (`pages.blocks`) сохраняются в формате MoonShine Layouts (`{ name, key, values }`, каст LayoutsCast). API отдаёт этот же формат; фронт при рендере мапит `name` → компонент, `values` → пропсы. Поддерживаются hero, features_grid, games_list, quote_form, icon_bullets, stats, logos, comparison_table, games_gallery, use_cases, faq, reviews_feed, product_cards, news_list.
- Формы: структура хранится в `forms.config`, отправленные данные валидируются на бэкенде, сохраняются в `leads.payload`/`utm`; связь по `form_code`. Конфиг формы фронт получает на сервере Next через `GET /api/forms/{code}` (не виден в DevTools пользователя) и передает поля в клиентскую часть; в браузере выполняется только `POST /api/forms/{code}`. В админке MoonShine payload/utm показываются как таблицы key→value на детальной странице лида.
- API форм: `GET /api/forms/{code}` отдает `{ code, title, fields[] }` (fields: name/label/type/required/options), `POST /api/forms/{code}` принимает значения полей, `source_url`, `utm` JSON; дефолтные поля email/name/message отдаются, если конфиг пуст.

## Работа и дальнейшее расширение
- Для локального запуска соблюдайте контракт: проверяйте `./docker/compose.sh development ps`, далее `./docker/compose.sh development up --build` при необходимости.
- Новые схемы добавляйте миграциями; новые админские CRUD — через MoonShine resources (при генерации прописывать в `MoonShineServiceProvider` и меню `MoonShineLayout`).
- Ключевые точки расширения фронтенда: подключение новых API (pages, articles, products), использование `NEXT_PUBLIC_API_URL` для прокси через Nginx.
