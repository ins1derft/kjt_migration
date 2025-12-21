<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Models\Game;
use App\Models\GameCategory;
use App\Models\Product;
use App\Models\Article;
use App\Models\ArticleCategory;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('games:import-legacy {--path= : Path to legacy-games.json} {--slug= : Import only one game slug} {--dry-run : Validate only, do not write to DB}', function () {
    $path = $this->option('path') ?: base_path('scripts/legacy-games.json');
    if (! file_exists($path)) {
        $this->error("File not found: {$path}");
        return 1;
    }

    $payload = json_decode(file_get_contents($path), true);
    if (! is_array($payload)) {
        $this->error('Invalid JSON payload.');
        return 1;
    }

    $categories = Arr::get($payload, 'categories', []);
    $games = Arr::get($payload, 'games', []);
    $onlySlug = $this->option('slug');

    $legacyProductSlugMap = [
        'alive-drawings' => 'alive-sketch',
        'interactive-sandbox' => 'interactive-ar-sandbox',
        'interactive-throw-wall' => 'interactive-wall',
        'mobile-interactive-floor' => 'interactive-mobile-floor',
        'mobile-interactive-wall' => 'interactive-mobile-wall',
        'multitouch-tables' => 'multi-touch-tables',
        'shooting-range' => 'interactive-shooting',
    ];

    $assertLocalMediaPath = function (?string $value, string $field, string $slug): void {
        if (! is_string($value) || trim($value) === '') {
            return;
        }

        if (Str::startsWith($value, ['http://', 'https://', '//'])) {
            throw new RuntimeException("Remote media URL is not allowed for {$field} ({$slug}): {$value}");
        }
    };

    $buildExcerpt = function (?string $excerptHtml, ?string $bodyHtml): ?string {
        $trimmed = trim((string) $excerptHtml);
        if ($trimmed !== '') {
            return $trimmed;
        }

        $text = trim(strip_tags((string) $bodyHtml));
        if ($text === '') {
            return null;
        }

        return '<p>' . e(Str::limit($text, 180, '…')) . '</p>';
    };

    $this->info('Legacy payload loaded.');
    $this->line('Categories: ' . count($categories));
    $this->line('Games: ' . count($games));

    if ($this->option('dry-run')) {
        $this->comment('Dry run: no changes written.');
        return 0;
    }

    foreach ($categories as $category) {
        GameCategory::updateOrCreate(
            ['slug' => $category['slug']],
            [
                'name' => $category['name'],
                'description' => $category['description'] ?? null,
            ]
        );
    }

    $categoryMap = GameCategory::query()->pluck('id', 'slug');
    $productMap = Product::query()->pluck('id', 'slug');
    $productLandingPageMap = Product::query()
        ->with('landingPage:id,slug,product_id')
        ->get(['id'])
        ->mapWithKeys(fn (Product $product) => $product->landingPage?->slug ? [$product->landingPage->slug => $product->id] : [])
        ->all();

    $missingProductSlugs = [];

    foreach ($games as $game) {
        if ($onlySlug && ($game['slug'] ?? null) !== $onlySlug) {
            continue;
        }

        $slug = (string) ($game['slug'] ?? '');
        $excerpt = $buildExcerpt($game['excerpt_html'] ?? null, $game['body_html'] ?? null);
        $heroImagePath = $game['hero_image'] ?? null;
        $seoOgImagePath = Arr::get($game, 'seo.og_image');

        $assertLocalMediaPath($heroImagePath, 'hero_image', $slug);
        $assertLocalMediaPath(is_string($seoOgImagePath) ? $seoOgImagePath : null, 'seo.og_image', $slug);

        $record = Game::updateOrCreate(
            ['slug' => $slug],
            [
                'title' => $game['title'],
                'genre' => $game['genre'] ?? null,
                'target_age' => $game['target_age'] ?? null,
                'game_type' => $game['game_type'] ?? null,
                'excerpt' => $excerpt,
                'body' => $game['body_html'] ?? null,
                'hero_image' => $heroImagePath,
                'video_id' => $game['video_id'] ?? null,
                'video_url' => $game['video_url'] ?? null,
                'is_indexable' => true,
                'seo_title' => Arr::get($game, 'seo.title'),
                'seo_description' => Arr::get($game, 'seo.description'),
                'seo_canonical' => Arr::get($game, 'seo.canonical'),
                'seo_og_image' => $seoOgImagePath,
            ]
        );

        $categoryIds = collect($game['categories'] ?? [])
            ->pluck('slug')
            ->map(fn ($slug) => $categoryMap[$slug] ?? null)
            ->filter()
            ->values()
            ->all();

        $productSlugs = collect($game['products_used'] ?? [])
            ->pluck('slug')
            ->filter()
            ->map(fn ($slug) => $legacyProductSlugMap[$slug] ?? $slug)
            ->values();

        $productIds = $productSlugs
            ->map(fn ($slug) => $productMap[$slug] ?? ($productLandingPageMap[$slug] ?? null))
            ->filter()
            ->values()
            ->all();

        foreach ($productSlugs as $slug) {
            if (! isset($productMap[$slug]) && ! isset($productLandingPageMap[$slug])) {
                $missingProductSlugs[$slug] = true;
            }
        }

        $record->categories()->sync($categoryIds);
        $record->products()->sync($productIds);
    }

    if (count($missingProductSlugs) > 0) {
        $this->warn('Unmatched legacy product slugs (not found by Product.slug or landingPage.slug):');
        foreach (array_keys($missingProductSlugs) as $slug) {
            $this->line("- {$slug}");
        }
    }

    $this->info('Import complete.');
})->purpose('Import legacy games and categories from JSON payload');

Artisan::command('articles:import-legacy {--path= : Path to legacy-articles.json} {--slug= : Import only one article slug} {--wipe : Delete existing Articles/ArticleCategories first} {--dry-run : Validate only, do not write to DB}', function () {
    $path = $this->option('path') ?: base_path('scripts/legacy-articles.json');
    if (! file_exists($path)) {
        $this->error("File not found: {$path}");
        return 1;
    }

    $payload = json_decode(file_get_contents($path), true);
    if (! is_array($payload)) {
        $this->error('Invalid JSON payload.');
        return 1;
    }

    $categories = Arr::get($payload, 'categories', []);
    $articles = Arr::get($payload, 'articles', []);
    $onlySlug = $this->option('slug');

    $this->info('Legacy payload loaded.');
    $this->line('Categories: ' . count($categories));
    $this->line('Articles: ' . count($articles));

    $assertLocalMediaPath = function (?string $value, string $field, string $slug): void {
        if (! is_string($value) || trim($value) === '') {
            return;
        }

        if (Str::startsWith($value, ['http://', 'https://', '//'])) {
            throw new RuntimeException("Remote media URL is not allowed for {$field} ({$slug}): {$value}");
        }
    };

    $assertNoRemoteImagesInBody = function (?string $bodyHtml, string $slug): void {
        if (! is_string($bodyHtml) || trim($bodyHtml) === '') {
            return;
        }

        if (preg_match('/<img[^>]+src=[\"\\\'](?:https?:)?\\/\\//i', $bodyHtml)) {
            throw new RuntimeException("Remote <img> src is not allowed in body_html ({$slug}).");
        }
    };

    if ($this->option('dry-run')) {
        $this->comment('Dry run: no changes written.');
        return 0;
    }

    if ($this->option('wipe')) {
        $this->warn('Wiping existing articles and article categories...');
        DB::statement('TRUNCATE TABLE article_article_category RESTART IDENTITY CASCADE');
        DB::statement('TRUNCATE TABLE articles RESTART IDENTITY CASCADE');
        DB::statement('TRUNCATE TABLE article_categories RESTART IDENTITY CASCADE');
        $this->info('Wipe complete.');
    }

    foreach ($categories as $index => $category) {
        ArticleCategory::updateOrCreate(
            ['slug' => $category['slug']],
            [
                'name' => $category['name'],
                'position' => $index,
            ]
        );
    }

    $categoryMap = ArticleCategory::query()->pluck('id', 'slug');

    foreach ($articles as $article) {
        if ($onlySlug && ($article['slug'] ?? null) !== $onlySlug) {
            continue;
        }

        $slug = (string) ($article['slug'] ?? '');
        $featuredImagePath = $article['featured_image'] ?? null;
        $seoOgImagePath = Arr::get($article, 'seo.og_image');
        $bodyHtml = $article['body_html'] ?? '';

        $assertLocalMediaPath(is_string($featuredImagePath) ? $featuredImagePath : null, 'featured_image', $slug);
        $assertLocalMediaPath(is_string($seoOgImagePath) ? $seoOgImagePath : null, 'seo.og_image', $slug);
        $assertNoRemoteImagesInBody(is_string($bodyHtml) ? $bodyHtml : null, $slug);

        $record = Article::updateOrCreate(
            ['slug' => $slug],
            [
                'title' => $article['title'],
                'excerpt' => $article['excerpt_html'] ?? null,
                'body' => is_string($bodyHtml) ? $bodyHtml : '',
                'featured_image' => $featuredImagePath,
                'video_id' => $article['video_id'] ?? null,
                'status' => 'published',
                'published_at' => Arr::get($article, 'published_at'),
                'seo_title' => Arr::get($article, 'seo.title'),
                'seo_description' => Arr::get($article, 'seo.description'),
                'seo_canonical' => Arr::get($article, 'seo.canonical'),
                'seo_og_image' => $seoOgImagePath,
            ]
        );

        $categoryIds = collect($article['categories'] ?? [])
            ->pluck('slug')
            ->map(fn ($slug) => $categoryMap[$slug] ?? null)
            ->filter()
            ->values()
            ->all();

        $record->categories()->sync($categoryIds);
    }

    $this->info('Import complete.');
})->purpose('Import legacy news articles and categories from JSON payload');
