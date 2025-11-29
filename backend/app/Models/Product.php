<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $guarded = [];

    public function variants()
    {
        return $this->hasMany(ProductVariant::class)->orderBy('position');
    }

    public function industries()
    {
        return $this->belongsToMany(Industry::class);
    }

    public function games()
    {
        return $this->belongsToMany(Game::class);
    }
}
