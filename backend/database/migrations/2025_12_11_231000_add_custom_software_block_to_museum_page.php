<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Arr;
use Carbon\Carbon;

return new class extends Migration
{
    public function up(): void
    {
        $slug = 'museum-equipment';
        $page = DB::table('pages')->where('slug', $slug)->first();
        if (! $page) {
            return;
        }

        $blocks = json_decode($page->blocks ?? '[]', true) ?? [];
        $hasCustom = collect($blocks)->contains(fn ($block) => Arr::get($block, 'name') === 'custom_software');
        if ($hasCustom) {
            return;
        }

        $maxKey = collect($blocks)
            ->pluck('key')
            ->filter(fn ($key) => is_numeric($key))
            ->max() ?? 0;

        $blocks[] = [
            'key' => $maxKey + 1,
            'name' => 'custom_software',
            'values' => [
                'title' => 'Custom Software Development',
                'description' => 'In a rapidly evolving world, the importance of custom software development cannot be overstated. We understand that off-the-shelf solutions can’t capture the unique essence of each exhibition or display. Museums thrive on their distinctiveness, where each theme requires a tailored approach to engage and educate visitors.',
                'gridTitle' => 'We are eager to develop software that:',
                'items' => [
                    ['text' => 'Highlights your uniqueness'],
                    ['text' => 'Matches the narrative and aesthetics of each collection'],
                    ['text' => 'Enhances visitor engagement, turning every museum visit into an unforgettable, thrilling adventure'],
                ],
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
        $slug = 'museum-equipment';
        $page = DB::table('pages')->where('slug', $slug)->first();
        if (! $page) {
            return;
        }

        $blocks = json_decode($page->blocks ?? '[]', true) ?? [];
        $filtered = array_values(array_filter($blocks, fn ($block) => Arr::get($block, 'name') !== 'custom_software'));

        DB::table('pages')
            ->where('slug', $slug)
            ->update([
                'blocks' => json_encode($filtered, JSON_UNESCAPED_UNICODE),
                'updated_at' => Carbon::now(),
            ]);
    }
};
