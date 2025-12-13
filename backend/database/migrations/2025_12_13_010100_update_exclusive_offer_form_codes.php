<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Arr;
use Carbon\Carbon;

return new class extends Migration
{
    public function up(): void
    {
        $page = DB::table('pages')->where('slug', 'special-needs')->first();
        if (! $page) {
            return;
        }

        $blocks = json_decode($page->blocks ?? '[]', true) ?? [];
        $updated = false;

        foreach ($blocks as &$block) {
            if (Arr::get($block, 'name') !== 'exclusive_offer') {
                continue;
            }

            $values = Arr::get($block, 'values', []);
            $items = Arr::get($values, 'items', []);

            $items = collect($items)->map(function ($item) {
                $item['formCode'] = $item['formCode'] ?? 'live_demo';
                $item['formTitle'] = $item['formTitle'] ?? 'Consultation';
                unset($item['ctaHref']);
                return $item;
            })->all();

            $values['items'] = $items;
            $values['defaultFormCode'] = $values['defaultFormCode'] ?? 'live_demo';
            unset($values['ctaHref']);

            $block['values'] = $values;
            $updated = true;
        }
        unset($block);

        if (! $updated) {
            return;
        }

        DB::table('pages')
            ->where('slug', 'special-needs')
            ->update([
                'blocks' => json_encode($blocks, JSON_UNESCAPED_UNICODE),
                'updated_at' => Carbon::now(),
            ]);
    }

    public function down(): void
    {
        // no-op rollback
    }
};
