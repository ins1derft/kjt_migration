<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MenuItem extends Model
{
    protected $guarded = [];

    protected $casts = [
        'is_active' => 'boolean',
        'opens_in_new_tab' => 'boolean',
    ];

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')
            ->where('is_active', true)
            ->orderBy('position');
    }

    public function childrenRecursive(): HasMany
    {
        return $this->children()->with('childrenRecursive');
    }

    protected static function booted(): void
    {
        static::creating(function (self $item): void {
            if (! is_null($item->position)) {
                return;
            }

            $query = static::query()->where('menu_id', $item->menu_id);

            $item->parent_id
                ? $query->where('parent_id', $item->parent_id)
                : $query->whereNull('parent_id');

            $item->position = ((int) $query->max('position')) + 1;
        });
    }
}
