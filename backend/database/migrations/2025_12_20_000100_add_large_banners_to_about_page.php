<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Arr;
use Carbon\Carbon;

return new class extends Migration
{
    public function up(): void
    {
        $slug = 'about';

        $page = DB::table('pages')->where('slug', $slug)->first();
        if (! $page) {
            return;
        }

        $blocks = json_decode($page->blocks ?? '[]', true) ?? [];
        $hasBanner = collect($blocks)->contains(fn ($block) => Arr::get($block, 'name') === 'large_banners');

        if ($hasBanner) {
            return;
        }

        $newBlock = [
            'name' => 'large_banners',
            'values' => [
                'title' => 'We Are Kids Jump Tech',
                'backgroundImage' => '/images/large-banners/about-background.jpg',
                'arrowHref' => '#description',
            ],
        ];

        $insertIndex = collect($blocks)->search(fn ($block) => Arr::get($block, 'name') === 'product_description');
        if ($insertIndex === false) {
            $insertIndex = 0;
        }

        array_splice($blocks, $insertIndex, 0, [$newBlock]);

        DB::table('pages')
            ->where('slug', $slug)
            ->update([
                'blocks' => json_encode($blocks, JSON_UNESCAPED_UNICODE),
                'updated_at' => Carbon::now(),
            ]);
    }

    public function down(): void
    {
        $slug = 'about';

        $page = DB::table('pages')->where('slug', $slug)->first();
        if (! $page) {
            return;
        }

        $blocks = json_decode($page->blocks ?? '[]', true) ?? [];
        $filtered = array_values(array_filter(
            $blocks,
            fn ($block) => Arr::get($block, 'name') !== 'large_banners'
        ));

        DB::table('pages')
            ->where('slug', $slug)
            ->update([
                'blocks' => json_encode($filtered, JSON_UNESCAPED_UNICODE),
                'updated_at' => Carbon::now(),
            ]);
    }
};
