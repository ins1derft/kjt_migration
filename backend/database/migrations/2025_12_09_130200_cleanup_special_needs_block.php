<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Arr;
use Carbon\Carbon;

return new class extends Migration
{
    public function up(): void
    {
        $page = DB::table('pages')->where('slug', 'hospital-equipment')->first();
        if (! $page) {
            return;
        }

        $blocks = json_decode($page->blocks ?? '[]', true) ?? [];

        $updated = array_map(function ($block) {
            if (Arr::get($block, 'name') !== 'special_needs') {
                return $block;
            }

            $videos = collect(Arr::get($block, 'values.videos', []))
                ->map(function ($video) {
                    return [
                        'videoId' => Arr::get($video, 'videoId'),
                        'alt' => Arr::get($video, 'alt'),
                    ];
                })
                ->filter(fn ($video) => !empty($video['videoId']))
                ->values()
                ->all();

            data_set($block, 'values.videos', $videos);
            data_forget($block, 'values.videoUrl');
            data_forget($block, 'values.image');

            return $block;
        }, $blocks);

        DB::table('pages')
            ->where('slug', 'hospital-equipment')
            ->update([
                'blocks' => json_encode($updated, JSON_UNESCAPED_UNICODE),
                'updated_at' => Carbon::now(),
            ]);
    }

    public function down(): void
    {
        // no-op; legacy fields intentionally removed
    }
};
