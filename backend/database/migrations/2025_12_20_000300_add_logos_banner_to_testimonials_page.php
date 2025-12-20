<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Arr;
use Carbon\Carbon;

return new class extends Migration
{
    public function up(): void
    {
        $slug = 'testimonials';

        $page = DB::table('pages')->where('slug', $slug)->first();
        if (! $page) {
            return;
        }

        $blocks = json_decode($page->blocks ?? '[]', true) ?? [];
        $hasBlock = collect($blocks)->contains(
            fn ($block) => Arr::get($block, 'name') === 'logos_banner'
        );

        if ($hasBlock) {
            return;
        }

        $newBlock = [
            'name' => 'logos_banner',
            'values' => [
                'image' => '/images/testimonials/logos-banner.png',
                'alt' => 'Client logos',
            ],
        ];

        $insertIndex = collect($blocks)->search(
            fn ($block) => Arr::get($block, 'name') === 'video_rows'
        );

        if ($insertIndex === false) {
            $blocks[] = $newBlock;
        } else {
            array_splice($blocks, $insertIndex + 1, 0, [$newBlock]);
        }

        DB::table('pages')
            ->where('slug', $slug)
            ->update([
                'blocks' => json_encode($blocks, JSON_UNESCAPED_UNICODE),
                'updated_at' => Carbon::now(),
            ]);
    }

    public function down(): void
    {
        $slug = 'testimonials';

        $page = DB::table('pages')->where('slug', $slug)->first();
        if (! $page) {
            return;
        }

        $blocks = json_decode($page->blocks ?? '[]', true) ?? [];
        $filtered = array_values(array_filter(
            $blocks,
            fn ($block) => Arr::get($block, 'name') !== 'logos_banner'
        ));

        DB::table('pages')
            ->where('slug', $slug)
            ->update([
                'blocks' => json_encode($filtered, JSON_UNESCAPED_UNICODE),
                'updated_at' => Carbon::now(),
            ]);
    }
};
