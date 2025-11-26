<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'config' => 'array',
        ];
    }

    public function leads()
    {
        return $this->hasMany(Lead::class, 'form_code', 'code');
    }
}
