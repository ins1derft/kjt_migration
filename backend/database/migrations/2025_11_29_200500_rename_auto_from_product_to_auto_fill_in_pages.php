<?php

use App\Models\Page;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    public function up(): void
    {
        Page::query()
            ->lazyById()
            ->each(function (Page $page) {
                $blocks = $page->blocks ?? [];
                if (!is_array($blocks)) {
                    return;
                }

                $changed = false;

                foreach ($blocks as &$block) {
                    if (!is_array($block) || !isset($block['name'], $block['values'])) {
                        continue;
                    }

                    if (in_array($block['name'], ['games_list', 'games_gallery'], true)) {
                        if (isset($block['values']['auto_from_product'])) {
                            $block['values']['auto_fill'] = (bool) $block['values']['auto_from_product'];
                            unset($block['values']['auto_from_product']);
                            $changed = true;
                        }

                        if (!isset($block['values']['auto_fill'])) {
                            $block['values']['auto_fill'] = true;
                            $changed = true;
                        }
                        continue;
                    }

                    if ($block['name'] === 'comparison_table') {
                        // Force comparison table to use product variants only
                        $block['values']['auto_fill'] = true;
                        if (isset($block['values']['variants'])) {
                            unset($block['values']['variants']);
                        }
                        $changed = true;
                    }
                }
                unset($block);

                if ($changed) {
                    $page->blocks = $blocks;
                    $page->save();
                }
            });
    }

    public function down(): void
    {
        Page::query()
            ->lazyById()
            ->each(function (Page $page) {
                $blocks = $page->blocks ?? [];
                if (!is_array($blocks)) {
                    return;
                }

                $changed = false;

                foreach ($blocks as &$block) {
                    if (!is_array($block) || !isset($block['name'], $block['values'])) {
                        continue;
                    }

                    if (in_array($block['name'], ['games_list', 'games_gallery'], true)) {
                        if (isset($block['values']['auto_fill'])) {
                            $block['values']['auto_from_product'] = (bool) $block['values']['auto_fill'];
                            unset($block['values']['auto_fill']);
                            $changed = true;
                        }
                        continue;
                    }

                    if ($block['name'] === 'comparison_table') {
                        if (isset($block['values']['auto_fill'])) {
                            $block['values']['auto_from_product'] = (bool) $block['values']['auto_fill'];
                            unset($block['values']['auto_fill']);
                            $changed = true;
                        }
                    }
                }
                unset($block);

                if ($changed) {
                    $page->blocks = $blocks;
                    $page->save();
                }
            });
    }
};
