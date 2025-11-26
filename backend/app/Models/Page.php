<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use MoonShine\Layouts\Casts\LayoutsCast;

class Page extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'blocks' => LayoutsCast::class,
            'published_at' => 'datetime',
        ];
    }

    protected $appends = [
        'blocks_array',
    ];

    public function getBlocksArrayAttribute(): mixed
    {
        $blocks = $this->blocks;

        if (is_object($blocks) && method_exists($blocks, 'toArray')) {
            $blocks = $blocks->toArray();
        }

        if (is_array($blocks)) {
            return collect($blocks)->map(function ($item) {
                if (is_object($item) && method_exists($item, 'toArray')) {
                    $item = $item->toArray();
                }
                if ($item instanceof \JsonSerializable) {
                    $item = $item->jsonSerialize();
                }
                return $item;
            })->toArray();
        }

        return $blocks;
    }
}
