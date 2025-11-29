<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'is_indexable' => 'boolean',
        ];
    }

    public function categories()
    {
        return $this->belongsToMany(GameCategory::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class);
    }
}
