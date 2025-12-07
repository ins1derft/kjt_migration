<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Arr;
use Carbon\Carbon;

return new class extends Migration
{
    public function up(): void
    {
        $slug = 'hospital-equipment';

        $page = DB::table('pages')->where('slug', $slug)->first();
        if (! $page) {
            return;
        }

        $blocks = json_decode($page->blocks ?? '[]', true) ?? [];

        $updated = collect($blocks)->map(function ($block) {
            if (Arr::get($block, 'name') !== 'hospital_equipment') {
                return $block;
            }

            $values = Arr::get($block, 'values', []);
            // Remove seeded fallback media
            Arr::forget($values, ['ctaBackground', 'footerIcon']);

            $features = collect(Arr::get($values, 'features', []))
                ->map(function ($item) {
                    Arr::forget($item, ['icon']);
                    return $item;
                })
                ->values()
                ->all();

            Arr::set($values, 'features', $features);

            return [
                ...$block,
                'values' => $values,
            ];
        })->values()->all();

        DB::table('pages')
            ->where('slug', $slug)
            ->update([
                'blocks' => json_encode($updated, JSON_UNESCAPED_UNICODE),
                'updated_at' => Carbon::now(),
            ]);
    }

    public function down(): void
    {
        // noop (we intentionally remove fallbacks)
    }
};
