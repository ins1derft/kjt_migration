<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class ArticleCategory extends Model
{
    protected $guarded = [];

    public function articles()
    {
        return $this->belongsToMany(Article::class);
    }

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(self::class, 'parent_id')
            ->orderBy('position');
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('position');
    }

    protected static function booted(): void
    {
        static::creating(function (self $category): void {
            if (! is_null($category->position)) {
                return;
            }

            $query = static::query();

            $category->parent_id
                ? $query->where('parent_id', $category->parent_id)
                : $query->whereNull('parent_id');

            $category->position = ((int) $query->max('position')) + 1;
        });
    }
}
