<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $guarded = [];

    protected $casts = [
        'badges' => 'array',
        'compare_models_attribute_codes' => 'array',
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

    public function sensoryRoomBundles()
    {
        return $this->belongsToMany(SensoryRoomBundle::class);
    }

    public function landingPage()
    {
        return $this->hasOne(Page::class)
            ->where('type', 'product_landing')
            ->where('status', 'published')
            ->orderBy('id');
    }
}
