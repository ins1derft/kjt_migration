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
        $hasBanner = collect($blocks)->contains(fn ($block) => Arr::get($block, 'name') === 'discount_banner');

        if ($hasBanner) {
            return;
        }

        $blocks[] = [
            'name' => 'discount_banner',
            'values' => [
                'title' => '10% discount when you purchase 3 or more interactive devices!',
                'ctaLabel' => 'Live Demo',
                'ctaHref' => 'mailto:info@kidsjumptech.com?subject=Live%20Demo',
                'icon' => '/icons/discount-banner/fire.png',
            ],
        ];

        DB::table('pages')
            ->where('slug', $slug)
            ->update([
                'blocks' => json_encode($blocks, JSON_UNESCAPED_UNICODE),
                'updated_at' => Carbon::now(),
            ]);
    }

    public function down(): void
    {
        $slug = 'hospital-equipment';
        $page = DB::table('pages')->where('slug', $slug)->first();
        if (! $page) {
            return;
        }

        $blocks = json_decode($page->blocks ?? '[]', true) ?? [];
        $filtered = array_values(array_filter($blocks, fn ($block) => Arr::get($block, 'name') !== 'discount_banner'));

        DB::table('pages')
            ->where('slug', $slug)
            ->update([
                'blocks' => json_encode($filtered, JSON_UNESCAPED_UNICODE),
                'updated_at' => Carbon::now(),
            ]);
    }
};
