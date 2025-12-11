<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

return new class extends Migration
{
    public function up(): void
    {
        $slug = 'school-equipment';

        $page = DB::table('pages')->where('slug', $slug)->first();
        if (! $page) {
            return;
        }

        $blocks = json_decode($page->blocks ?? '[]', true) ?? [];

        $exists = collect($blocks)->contains(fn ($block) => Arr::get($block, 'name') === 'appreciation_letters');
        if ($exists) {
            return;
        }

        $newBlock = [
            'name' => 'appreciation_letters',
            'values' => [
                'title' => 'Letters of Appreciation',
                'query' => [
                    'limit' => 3,
                ],
                'tabs' => [
                    [
                        'key' => 'all',
                        'label' => 'All',
                        'limit' => 3,
                        'filters' => [],
                    ],
                    [
                        'key' => 'schools',
                        'label' => 'Schools',
                        'limit' => 3,
                        'filters' => [
                            [
                                'key' => 'category',
                                'value' => 'schools',
                            ],
                        ],
                    ],
                ],
            ],
        ];

        $updated = [];
        $inserted = false;

        foreach ($blocks as $block) {
            if (! $inserted && Arr::get($block, 'name') === 'cta_section') {
                $updated[] = $newBlock;
                $inserted = true;
            }

            $updated[] = $block;
        }

        if (! $inserted) {
            $updated[] = $newBlock;
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
        $slug = 'school-equipment';

        $page = DB::table('pages')->where('slug', $slug)->first();
        if (! $page) {
            return;
        }

        $blocks = json_decode($page->blocks ?? '[]', true) ?? [];
        $filtered = array_values(array_filter(
            $blocks,
            fn ($block) => Arr::get($block, 'name') !== 'appreciation_letters'
        ));

        DB::table('pages')
            ->where('slug', $slug)
            ->update([
                'blocks' => json_encode($filtered, JSON_UNESCAPED_UNICODE),
                'updated_at' => Carbon::now(),
            ]);
    }
};
