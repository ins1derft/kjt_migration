<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreProduct extends Model
{
    protected $guarded = [];

    public function categories()
    {
        return $this->belongsToMany(StoreCategory::class);
    }
}
