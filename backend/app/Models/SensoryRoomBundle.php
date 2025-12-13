<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SensoryRoomBundle extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'gallery' => 'array',
            'specs' => 'array',
            'block_a_items' => 'array',
            'position' => 'integer',
        ];
    }

    public function products()
    {
        return $this->belongsToMany(Product::class);
    }
}
