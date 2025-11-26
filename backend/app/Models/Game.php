<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    protected $guarded = [];

    public function categories()
    {
        return $this->belongsToMany(GameCategory::class);
    }
}
