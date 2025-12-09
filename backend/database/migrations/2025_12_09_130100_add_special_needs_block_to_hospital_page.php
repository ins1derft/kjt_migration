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
        $hasBlock = collect($blocks)->contains(fn ($block) => Arr::get($block, 'name') === 'special_needs');

        if ($hasBlock) {
            return;
        }

        $specialBlock = [
            'name' => 'special_needs',
            'values' => [
                'title' => 'Special Needs',
                'description' => 'Our products offer unique benefits for special needs education, providing sensory-friendly learning environments and adaptable challenges that cater to a wide range of abilities. From the tactile response of the Interactive Sandbox to the customizable difficulty levels of the Interactive Climbing Wall, every student can enjoy an inclusive learning experience.',
                'videos' => [
                    [
                        'videoId' => 'aqz-KE-bpKQ', // Big Buck Bunny (public demo)
                        'alt' => 'Child smiling in an interactive space',
                    ],
                    [
                        'videoId' => 'aqz-KE-bpKQ',
                        'alt' => 'Child enjoying interactive learning',
                    ],
                ],
            ],
        ];

        $updated = [];
        $inserted = false;

        foreach ($blocks as $block) {
            $updated[] = $block;

            if (! $inserted && Arr::get($block, 'name') === 'discount_banner') {
                $updated[] = $specialBlock;
                $inserted = true;
            }
        }

        if (! $inserted) {
            $updated[] = $specialBlock;
        }

        DB::table('pages')
            ->where('slug', $slug)
            ->update([
                'blocks' => json_encode($updated, JSON_UNESCAPED_UNICODE),
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
        $filtered = array_values(array_filter(
            $blocks,
            fn ($block) => Arr::get($block, 'name') !== 'special_needs'
        ));

        DB::table('pages')
            ->where('slug', $slug)
            ->update([
                'blocks' => json_encode($filtered, JSON_UNESCAPED_UNICODE),
                'updated_at' => Carbon::now(),
            ]);
    }
};
