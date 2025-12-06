<?php

namespace App\Models\PageBlocks;

use Illuminate\Database\Eloquent\Model;

class InteractiveShowcaseFeature extends Model
{
    protected $guarded = [];

    protected $casts = [
        'position' => 'integer',
    ];

    public function item()
    {
        return $this->belongsTo(InteractiveShowcaseItem::class, 'interactive_showcase_item_id');
    }
}
