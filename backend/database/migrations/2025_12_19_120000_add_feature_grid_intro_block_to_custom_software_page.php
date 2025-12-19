<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $page = DB::table('pages')
            ->select(['id', 'blocks'])
            ->where('slug', 'custom-software-development')
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
            return is_array($block) && ($block['name'] ?? null) === 'feature_grid_intro';
        });

        if ($alreadyExists) {
            return;
        }

        $insertAt = null;
        foreach ($blocks as $i => $block) {
            if (is_array($block) && ($block['name'] ?? null) === 'product_description') {
                $insertAt = $i + 1;
                break;
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
            'name' => 'feature_grid_intro',
            'key' => $newKey,
            'values' => [
                'title' => 'Custom Software Development',
                'description' => 'At Kids Jump Tech, we\'re not just creating interactive educational experiences; we\'re shaping the future of learning. Our dedicated team of more than 50 developers work hand-in-hand with educators to develop software for custom experiences and games that are not just fun but are also deeply educational. Our mission? To transform the way children learn, one game at a time.',
                'gridTitle' => 'Pioneering Educational Adventures',
                'items' => [
                    [
                        'title' => 'Tailored Learning Solutions',
                        'description' => 'Every child\'s learning journey is unique. That\'s why our custom software development focuses on creating educational games that cater to a wide array of learning styles and subjects. From math and science to history and language arts, our games make learning engaging and accessible for all.',
                        'icon' => '/images/custom-software-development/icon-left.svg',
                        'iconAlt' => 'Game controller icon',
                    ],
                    [
                        'title' => 'Expert Collaboration',
                        'description' => 'Our development process is a collaborative effort between tech experts and educators. This synergy ensures that each game is not just technically sound but also pedagogically effective, fostering an environment where education and entertainment coalesce seamlessly.',
                        'icon' => '/images/custom-software-development/icon-right.svg',
                        'iconAlt' => 'Laptop collaboration icon',
                    ],
                ],
                'secondaryDescription' => null,
                'secondaryItems' => [],
                'footerText' => null,
                'padding' => null,
                'backgroundColor' => null,
                'backgroundClass' => null,
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
            ->where('slug', 'custom-software-development')
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
                return !(is_array($block) && ($block['name'] ?? null) === 'feature_grid_intro');
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
