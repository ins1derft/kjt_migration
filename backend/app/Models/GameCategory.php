<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GameCategory extends Model
{
    protected $guarded = [];

    public function games()
    {
        return $this->belongsToMany(Game::class);
    }
}
