<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $guarded = [];

    protected $casts = [
        'badges' => 'array',
    ];

    public function variants()
    {
        return $this->hasMany(ProductVariant::class)->orderBy('position');
    }

    public function games()
    {
        return $this->belongsToMany(Game::class);
    }

    public function form()
    {
        return $this->belongsTo(Form::class);
    }
}
