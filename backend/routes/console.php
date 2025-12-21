<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Arr;
use App\Models\Game;
use App\Models\GameCategory;
use App\Models\Product;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('games:import-legacy {--path= : Path to legacy-games.json} {--dry-run : Validate only, do not write to DB}', function () {
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

    foreach ($games as $game) {
        $record = Game::updateOrCreate(
            ['slug' => $game['slug']],
            [
                'title' => $game['title'],
                'genre' => $game['genre'] ?? null,
                'target_age' => $game['target_age'] ?? null,
                'game_type' => $game['game_type'] ?? null,
                'excerpt' => $game['excerpt_html'] ?? null,
                'body' => $game['body_html'] ?? null,
                'hero_image' => $game['hero_image'] ?? null,
                'video_id' => $game['video_id'] ?? null,
                'video_url' => $game['video_url'] ?? null,
                'is_indexable' => true,
                'seo_title' => Arr::get($game, 'seo.title'),
                'seo_description' => Arr::get($game, 'seo.description'),
                'seo_canonical' => Arr::get($game, 'seo.canonical'),
                'seo_og_image' => Arr::get($game, 'seo.og_image'),
            ]
        );

        $categoryIds = collect($game['categories'] ?? [])
            ->pluck('slug')
            ->map(fn ($slug) => $categoryMap[$slug] ?? null)
            ->filter()
            ->values()
            ->all();

        $productIds = collect($game['products_used'] ?? [])
            ->pluck('slug')
            ->map(fn ($slug) => $productMap[$slug] ?? null)
            ->filter()
            ->values()
            ->all();

        $record->categories()->sync($categoryIds);
        $record->products()->sync($productIds);
    }

    $this->info('Import complete.');
})->purpose('Import legacy games and categories from JSON payload');
