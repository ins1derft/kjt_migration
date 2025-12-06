<?php

namespace App\Models\PageBlocks;

use App\Models\Page;
use Illuminate\Database\Eloquent\Model;

class ProductHeroBadge extends Model
{
    public const BLOCK_KEY = 'product_hero';

    protected $guarded = [];

    protected $casts = [
        'position' => 'integer',
        'block_index' => 'integer',
    ];

    protected $attributes = [
        'block_key' => self::BLOCK_KEY,
        'block_index' => 0,
    ];

    public function page()
    {
        return $this->belongsTo(Page::class);
    }
}
