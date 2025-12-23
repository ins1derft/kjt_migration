<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $pages = DB::table('pages')
            ->select(['id', 'blocks'])
            ->where('type', 'product_landing')
            ->whereNotNull('blocks')
            ->orderBy('id')
            ->get();

        foreach ($pages as $page) {
            $blocks = $page->blocks;

            if (is_string($blocks)) {
                $blocks = json_decode($blocks, true);
            }

            if (! is_array($blocks) || $blocks === []) {
                continue;
            }

            $heroBlocks = [];
            $otherBlocks = [];

            foreach ($blocks as $block) {
                $name = is_array($block) ? ($block['name'] ?? null) : null;

                if ($name === 'hero') {
                    $heroBlocks[] = $block;
                    continue;
                }

                $otherBlocks[] = $block;
            }

            if ($heroBlocks === []) {
                continue;
            }

            $productHeroIndex = null;
            foreach ($otherBlocks as $index => $block) {
                if (! is_array($block)) {
                    continue;
                }

                if (($block['name'] ?? null) === 'product_hero') {
                    $productHeroIndex = $index;
                    break;
                }
            }

            $insertAt = $productHeroIndex === null ? 0 : $productHeroIndex + 1;
            $reordered = [
                ...array_slice($otherBlocks, 0, $insertAt),
                ...$heroBlocks,
                ...array_slice($otherBlocks, $insertAt),
            ];

            if ($reordered == $blocks) {
                continue;
            }

            DB::table('pages')
                ->where('id', $page->id)
                ->update([
                    'blocks' => json_encode($reordered, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                    'updated_at' => now(),
                ]);
        }
    }

    public function down(): void
    {
        // No-op.
    }
};

