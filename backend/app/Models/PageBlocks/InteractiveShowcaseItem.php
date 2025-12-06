<?php

namespace App\Models\PageBlocks;

use App\Models\Page;
use Illuminate\Database\Eloquent\Model;

class InteractiveShowcaseItem extends Model
{
    public const BLOCK_KEY = 'interactive_header';

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

    public function features()
    {
        return $this->hasMany(InteractiveShowcaseFeature::class)->orderBy('position')->orderBy('id');
    }

    public function gallery()
    {
        return $this->hasMany(InteractiveShowcaseGalleryItem::class)->orderBy('position')->orderBy('id');
    }
}
