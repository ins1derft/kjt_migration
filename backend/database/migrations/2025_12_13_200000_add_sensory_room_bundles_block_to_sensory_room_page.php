<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $page = DB::table('pages')
            ->select(['id', 'blocks'])
            ->where('slug', 'sensory-room')
            ->first();

        if (!$page) {
            return;
        }

        $blocks = $page->blocks;

        if (is_string($blocks)) {
            $decoded = json_decode($blocks, true);
            $blocks = is_array($decoded) ? $decoded : [];
        }

        if (!is_array($blocks)) {
            $blocks = [];
        }

        $alreadyExists = collect($blocks)->contains(function ($block) {
            return is_array($block) && ($block['name'] ?? null) === 'sensory_room_bundles';
        });

        if ($alreadyExists) {
            return;
        }

        $insertAt = null;
        for ($i = 0; $i < count($blocks) - 1; $i++) {
            $current = $blocks[$i] ?? null;
            $next = $blocks[$i + 1] ?? null;
            if (!is_array($current) || !is_array($next)) {
                continue;
            }
            if (($current['name'] ?? null) === 'cta_section' && ($next['name'] ?? null) === 'cta_section') {
                $insertAt = $i + 1;
                break;
            }
        }

        if ($insertAt === null) {
            foreach ($blocks as $i => $block) {
                if (is_array($block) && ($block['name'] ?? null) === 'cta_section') {
                    $insertAt = $i + 1;
                    break;
                }
            }
        }

        if ($insertAt === null) {
            $insertAt = count($blocks);
        }

        $maxKey = collect($blocks)
            ->map(fn ($block) => is_array($block) ? ($block['key'] ?? null) : null)
            ->filter(fn ($key) => is_numeric($key))
            ->map(fn ($key) => (int) $key)
            ->max();

        $newKey = ($maxKey ?? 0) + 1;

        $newBlock = [
            'name' => 'sensory_room_bundles',
            'key' => $newKey,
            'values' => [
                'title' => 'Our Catalog of Sensory Room Bundles',
                'description' => "Below are several sets of interactive equipment recommended by therapists we collaborate with. Choose one of our ready-made bundles or create your own custom sensory room setup that perfectly fits your space, whether it’s for educational or personalized use.",
                'padding' => null,
                'backgroundColor' => null,
            ],
        ];

        array_splice($blocks, $insertAt, 0, [$newBlock]);

        DB::table('pages')
            ->where('id', $page->id)
            ->update([
                'blocks' => json_encode($blocks, JSON_UNESCAPED_UNICODE),
            ]);
    }

    public function down(): void
    {
        $page = DB::table('pages')
            ->select(['id', 'blocks'])
            ->where('slug', 'sensory-room')
            ->first();

        if (!$page) {
            return;
        }

        $blocks = $page->blocks;

        if (is_string($blocks)) {
            $decoded = json_decode($blocks, true);
            $blocks = is_array($decoded) ? $decoded : [];
        }

        if (!is_array($blocks)) {
            $blocks = [];
        }

        $blocks = collect($blocks)
            ->filter(function ($block) {
                return !(is_array($block) && ($block['name'] ?? null) === 'sensory_room_bundles');
            })
            ->values()
            ->all();

        DB::table('pages')
            ->where('id', $page->id)
            ->update([
                'blocks' => json_encode($blocks, JSON_UNESCAPED_UNICODE),
            ]);
    }
};

