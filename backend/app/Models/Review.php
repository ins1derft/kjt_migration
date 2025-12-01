<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'name',
        'review_date',
        'rating',
        'text',
        'avatar',
        'source_url',
        'position',
        'is_active',
    ];

    protected $casts = [
        'review_date' => 'date',
        'rating' => 'integer',
        'position' => 'integer',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query
            ->orderBy('position')
            ->orderByDesc('review_date')
            ->orderBy('id');
    }
}
