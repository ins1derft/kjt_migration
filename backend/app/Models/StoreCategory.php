<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreCategory extends Model
{
    protected $guarded = [];

    public function products()
    {
        return $this->belongsToMany(StoreProduct::class);
    }

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(self::class, 'parent_id');
    }
}
