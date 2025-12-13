<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('sensory_room_bundles') || !Schema::hasColumn('sensory_room_bundles', 'block_a_items')) {
            return;
        }

        DB::table('sensory_room_bundles')
            ->select(['id', 'block_a_items'])
            ->orderBy('id')
            ->chunkById(100, function ($rows): void {
                foreach ($rows as $row) {
                    $raw = $row->block_a_items;
                    $items = is_string($raw) ? json_decode($raw, true) : $raw;

                    if (!is_array($items)) {
                        continue;
                    }

                    $changed = false;
                    $next = [];

                    foreach ($items as $item) {
                        if (!is_array($item)) {
                            $next[] = $item;
                            continue;
                        }

                        $title = isset($item['title']) && is_string($item['title'])
                            ? trim($item['title'])
                            : '';

                        $text = isset($item['text']) && is_string($item['text'])
                            ? $item['text']
                            : '';

                        if ($title !== '') {
                            $escapedTitle = htmlspecialchars($title, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
                            $prefix = '<p><strong>' . $escapedTitle . '</strong></p>';
                            $item['text'] = $prefix . $text;
                            $changed = true;
                        }

                        if (array_key_exists('title', $item)) {
                            unset($item['title']);
                            $changed = true;
                        }

                        $next[] = $item;
                    }

                    if (!$changed) {
                        continue;
                    }

                    DB::table('sensory_room_bundles')
                        ->where('id', $row->id)
                        ->update(['block_a_items' => json_encode($next, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)]);
                }
            });
    }

    public function down(): void
    {
        // Non-reversible data migration.
    }
};

