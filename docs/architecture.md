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
  - `(marketing)/[slug]` — либо продуктовые лендинги (`type=product_landing`), либо статические страницы (`type=static`), данные с `/api/pages/{slug}`, блоковый рендер через реестр. Для `product_landing` дополнительно прилетает `product`, `variants`; блоки могут автозаполняться из этих данных (герой — название/подзаголовок/hero_image, comparison_table — variants). Games блоки берут игры из сущности `Game` (авто — все/limit, ручной — выбранные slug’и из выпадающего списка).
  - `/news` и `/news/[...slug]` — список статей `type=news` и детальная статья по slug последнего сегмента.
  - `/case-studies` — список `type=case_study`, карточки ведут на `/news/{slug}`.
  - `/games` и `/games/[slug]` — каталог игр и детали.
- `/store` и `/store/[slug]` — каталог и карточка StoreProduct.
- `/case-studies` — список кейсов (articles type=case_study) на Tailwind/shadcn `Card`.
- Конфиг: `next.config.mjs` (`output: "standalone"`). В dev переписывает `/api/*` на `http://nginx/api/*` или `NEXT_API_PROXY`; в прод переписываний нет.
- Глобальный каркас `app/layout.tsx` выводит шапку/футер (`src/components/layout/SiteHeader|SiteFooter`) и на сервере поднимает меню `header`/`footer` из `/api/menus` (helpers `src/lib/menus.ts`, revalidate 300s). Slot-ы пунктов: `top_primary`/`top_secondary` для верхнего бара, `primary` для основного меню и колонок, `social` для иконок. Если меню/слот пустой, соответствующий блок просто не выводится; контакты/CTA остаются статичными. Стили и палитра бренда/контейнер `container`/sticky nav вынесены в `app/globals.css`.
- Метаданные по умолчанию: title `Kids Jump Tech | Interactive Equipment for Kids`, description обновлён под витрину; шрифты Geist/Geist Mono. Стили — Tailwind-предустановки + дизайн-токены (HSL) в `app/globals.css`, Tailwind config `tailwind.config.js`, postcss конфиг `postcss.config.js`.
- Переменные окружения, доступные клиенту: `NEXT_PUBLIC_API_URL` (по умолчанию `http://localhost:8080/api`).
- Блоковый рендерер: типы `src/lib/blocks/types.ts`, реестр `src/lib/blocks/registry.tsx`; готовые блоки Hero, FeaturesGrid, GamesList, QuoteForm, IconBullets, Stats, LogosStrip, ComparisonTable, GamesGallery, UseCases, FAQ, ReviewsFeed, ProductCards, NewsList в `src/components/blocks/*` (все на Tailwind/shadcn). GamesList/GamesGallery поддерживают флаг `auto_fill` для автоподбора игр из связанного продукта; ComparisonTable всегда берёт варианты из связанного продукта (ручной ввод отключён); QuoteForm берёт список доступных форм из таблицы `forms` (select в админке подгружает `code:title` из БД), серверная обертка запрашивает конфиг по выбранному коду, клиентская часть отправляет данные; Маркетинговые страницы используют `renderBlocks`.
- Динамическое SEO: `generateMetadata` на маркетинговых, новостных, игровых и store‑страницах читает SEO-поля из API-ответов.

## Бэкенд Laravel (директория `backend/`)
- Вход: `public/index.php`; API и админка обслуживаются через Nginx.
- Основные маршруты (`routes/api.php`):
  - `GET /api/health` → `{ ok: true }`
  - `GET /api/menus?location=header|footer` — активные меню с вложенными пунктами (`label`, `url`, `slot`, `icon`, `opens_in_new_tab`, `children`).
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
| `Page` | `pages` | `slug` unique, `title`, `type` (`product_landing` \| `static`), `product_id` nullable FK → `products`, `status` (draft/published), `blocks` jsonb (LayoutsCast; хранит элементы как `{name,key,values}`), SEO-поля, `published_at`; accessor `blocks_array` | `product` belongsTo |
| `Article` | `articles` | `slug` unique, `title`, `type`, `excerpt`, `body`, `featured_image`, `status`, SEO, `published_at` (cast datetime) | `categories` many-to-many `ArticleCategory` |
| `ArticleCategory` | `article_categories` | `slug` unique, `name`, `group`, `parent_id` self-FK | `articles` m2m, `parent`/`children` |
| `Game` | `games` | `slug` unique, `title`, `genre`, `target_age`, `game_type`, `excerpt`, `body`, `hero_image`, `video_url`, `is_indexable` bool, SEO | `categories` m2m `GameCategory`, `products` m2m |
| `GameCategory` | `game_categories` | `slug` unique, `name`, `description` | `games` m2m |
| `Product` | `products` | `slug` unique, `name`, `subtitle`, `excerpt`, `description`, `hero_image`, `product_type`, `default_cta_label` | `variants` hasMany (ordered by `position`), `industries` m2m, `games` m2m |
| `ProductVariant` | `product_variants` | FK `product_id`, `name`, `sku`, `price` decimal(12,2), `label`, `specs` jsonb (cast array), `position` | `product` belongsTo |
| `Industry` | `industries` | `slug` unique, `name`, `group` | `products` m2m |
| `StoreProduct` | `store_products` | `slug` unique, `name`, `excerpt`, `description`, `image`, `price`, `is_available` bool, `specs` jsonb, SEO | `categories` m2m `StoreCategory` |
| `StoreCategory` | `store_categories` | `slug` unique, `name`, `parent_id` self-FK | `products` m2m, `parent`/`children` |
| `Form` | `forms` | `code` unique, `title`, `config` jsonb (cast array) | `leads` hasMany via `form_code` |
| `Lead` | `leads` | `form_code`, `payload` jsonb, `source_url`, `utm` jsonb (casts array) | — |
| `Menu` | `menus` | `name`, `slug` unique, `location` (`header`/`footer`), `is_active` bool | `items` hasMany (`MenuItem`) |
| `MenuItem` | `menu_items` | `menu_id` FK, `parent_id` self-FK, `label`, `url`, `slot` (primary/top_primary/top_secondary/social/footer), `icon` nullable, `opens_in_new_tab` bool, `is_active` bool, `position` int | `menu` belongsTo; self `parent`/`children` |
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
  - **Контент:** `PageResource` (конструктор блоков: hero, features_grid, games_list, news_list, quote_form), `ArticleResource` (типы: news/case_study/blog/in_press, категории m2m), `ArticleCategoryResource` (иерархия категорий).
  - **Игры:** `GameResource` (genre/target_age, hero_image, m2m категории), `GameCategoryResource`.
- **Продукты:** `ProductResource` (industries m2m; без SEO-полей), `ProductVariantResource` (price/sku/specs JSON, сортировка `position`; specs выводятся как таблица key→value), `IndustryResource` (группы government/healthcare/public/other).
  - **Продукты:** `ProductResource` (industries m2m; без SEO-полей), `ProductVariantResource` (price/sku/specs JSON, сортировка `position`; specs редактируются в табличном JSON-поле `specs_table`: строки key/value/type(string|number|boolean|json), которые при сохранении собираются обратно в ассоциативный массив `specs`).
  - **Магазин:** `StoreProductResource` (availability switcher, price, categories m2m), `StoreCategoryResource` (self-parent).
  - **Формы и лиды:** `FormResource` (JSON-конфиг форм: submit_label, success_message, поля с типами text/email/phone/textarea/select/checkbox), `LeadResource` (payload, utm JSON; деталь выводит payload/utm таблицей key→value плюс source_url).
  - **Навигация:** `MenuResource` (создание/активация меню с локацией header/footer) и `MenuItemResource` (пункты со слотами, иконками, таргетами, вложенностью и позицией).
  - **Системные:** `MoonShineUserResource`, `MoonShineUserRoleResource` (стандартные ресурсы пакета).
- Все CRUD-страницы используют валидации уникальности slug/code и базовые required-правила; загрузки файлов ведутся на диск `public` в подкаталоги `seo/`, `pages/hero`, `articles`, `games`, `products`, `store`.

## Инфраструктура
- **Оркестрация:** `docker/compose.sh <environment> …` (обязательное использование). Композ-файлы: `docker/development.compose.yml`, `docker/production.compose.yml`. Env-файлы: `.env.development`, `.env.production`.
- **Сервисы (dev):**
  - `frontend`: Next dev server на 3000, код смонтирован.
  - `backend-php`: PHP-FPM 8.3, Laravel код смонтирован; общий volume `storage` монтируется в `/var/www/backend/storage` для пользовательских файлов.
  - `nginx`: слушает :8080, подхватывает `nginx/nginx.dev.conf`, маунты `backend/public` и общий volume `storage` (RO) для раздачи `/storage`.
  - `postgres`: `postgres:18-alpine`, volume `postgres-data`.
- **Сервисы (prod):** сборка prod-образов Next/Laravel/Nginx, порт :80; `APP_DEBUG=false`.
  - `backend-php` и `nginx` разделяют volume `storage`, чтобы загруженные через Laravel файлы (`storage/app/public`) сразу раздавались по `/storage/*`.
  - В `nginx.prod.conf` `/storage/` настроен через `alias` на `storage/app/public` (без проксирования в PHP) с CORS `Access-Control-Allow-Origin: *`.
- **Nginx:** `nginx/nginx.*.conf` — роутинг `/admin` и `/api` в php-fpm, статические Laravel ассеты (`/build`,`/storage`,`/vendor`) обслуживаются напрямую; `/storage/*` отдаётся напрямую из volume `storage/app/public` (без `try_files` и php-fpm, с CORS `*` и кешом 7d), остальное проксируется в Next (в prod кэширование выключено через `proxy_cache_bypass`).
- **База данных:** host `postgres`, port `5432`; миграции покрывают все сущности, дополнительные изменения в схеме допускаются только через миграции.

## Взаимодействие данных
- Публичные страницы, новости, кейсы, игры и каталог читаются с Laravel API (pages/articles/games/products/store_products) через Next.js `fetch`/`renderBlocks`; хедер/футер подтягивают меню `header`/`footer` с `/api/menus` (fallback на статические пресеты при пустом ответе).
- API нормализует медиа-пути через `Storage::disk('public')->url`, поэтому `hero_image`/`featured_image`/`og_image`/`image` уже приходят как `/storage/...` или абсолютный URL и могут использоваться фронтом напрямую.
- Структурированные контент-блоки страниц (`pages.blocks`) сохраняются в формате MoonShine Layouts (`{ name, key, values }`, каст LayoutsCast). API отдаёт этот же формат; фронт при рендере мапит `name` → компонент, `values` → пропсы. Поддерживаются hero, features_grid, games_list, quote_form, icon_bullets, stats, logos, comparison_table, games_gallery, use_cases, faq, reviews_feed, product_cards, news_list. Для `type=product_landing` API дополнительно кладёт `product`, `variants` и `games`; компоненты умеют брать дефолтные данные: hero — fallback на `product.name/subtitle/hero_image`, comparison_table — если `variants` в блоке пусты, берёт product variants; games_list/gallery — если нет `game_slugs`, берёт связанные с продуктом игры.
- Формы: структура хранится в `forms.config`, отправленные данные валидируются на бэкенде, сохраняются в `leads.payload`/`utm`; связь по `form_code`. Конфиг формы фронт получает на сервере Next через `GET /api/forms/{code}` (не виден в DevTools пользователя) и передает поля в клиентскую часть; в браузере выполняется только `POST /api/forms/{code}`. В админке MoonShine payload/utm показываются как таблицы key→value на детальной странице лида.
- API форм: `GET /api/forms/{code}` отдает `{ code, title, fields[] }` (fields: name/label/type/required/options), `POST /api/forms/{code}` принимает значения полей, `source_url`, `utm` JSON; дефолтные поля email/name/message отдаются, если конфиг пуст.

## Работа и дальнейшее расширение
- Для локального запуска соблюдайте контракт: проверяйте `./docker/compose.sh development ps`, далее `./docker/compose.sh development up --build` при необходимости.
- Новые схемы добавляйте миграциями; новые админские CRUD — через MoonShine resources (при генерации прописывать в `MoonShineServiceProvider` и меню `MoonShineLayout`).
- Ключевые точки расширения фронтенда: подключение новых API (pages, articles, products), использование `NEXT_PUBLIC_API_URL` для прокси через Nginx.
