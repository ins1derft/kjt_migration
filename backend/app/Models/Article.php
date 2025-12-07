<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $guarded = [];

    protected static function booted(): void
    {
        static::saving(function (Article $article): void {
            if ($article->status === 'published' && blank($article->published_at)) {
                $article->published_at = now();
            }
        });
    }

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }

    public function categories()
    {
        return $this->belongsToMany(ArticleCategory::class)
            ->orderBy('position');
    }
}
