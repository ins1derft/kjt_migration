<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreProduct extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'specs' => 'array',
        ];
    }

    public function categories()
    {
        return $this->belongsToMany(StoreCategory::class);
    }
}
